# Terraform main configuration for Chat App

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "chat-app-terraform-state-595260679716"
    key            = "prod/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      ManagedBy   = "Terraform"
      Project     = "CloudChatApp"
    }
  }
}

# Data source for most recent Ubuntu AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }
}

# VPC
resource "aws_vpc" "chat_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "chat-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.chat_vpc.id

  tags = {
    Name = "chat-igw"
  }
}

# Public Subnets (for ALB)
resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.chat_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-1"
  }
}

resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.chat_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-2"
  }
}

# Private Subnets (for EC2 & RDS)
resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.chat_vpc.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "private-subnet-1"
  }
}

resource "aws_subnet" "private_2" {
  vpc_id            = aws_vpc.chat_vpc.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "private-subnet-2"
  }
}

# Route Table for Public Subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.chat_vpc.id

  route {
    cidr_block      = "0.0.0.0/0"
    gateway_id      = aws_internet_gateway.main.id
  }

  tags = {
    Name = "public-rt"
  }
}

resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}

# Security Groups
resource "aws_security_group" "alb" {
  name        = "chat-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.chat_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "alb-sg"
  }
}

resource "aws_security_group" "app" {
  name        = "chat-app-sg"
  description = "Security group for app servers"
  vpc_id      = aws_vpc.chat_vpc.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app-sg"
  }
}

resource "aws_security_group" "rds" {
  name        = "chat-rds-sg"
  description = "Security group for RDS"
  vpc_id      = aws_vpc.chat_vpc.id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "rds-sg"
  }
}

# S3 Bucket for Media
resource "aws_s3_bucket" "media" {
  bucket = "chat-app-media-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name = "chat-media"
  }
}

resource "aws_s3_bucket_versioning" "media" {
  bucket = aws_s3_bucket.media.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "chat-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  tags = {
    Name = "chat-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "app" {
  name        = "chat-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.chat_vpc.id
  target_type = "instance"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
  }

  tags = {
    Name = "app-tg"
  }
}

# ALB Listener
resource "aws_lb_listener" "app" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# Launch Template for Auto Scaling
resource "aws_launch_template" "app" {
  name_prefix   = "chat-app-"
  image_id      = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  iam_instance_profile {
    name = aws_iam_instance_profile.app.name
  }

  user_data = base64encode(file("${path.module}/user_data.sh"))

  vpc_security_group_ids = [aws_security_group.app.id]

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "chat-app-instance"
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Auto Scaling Group
resource "aws_autoscaling_group" "app" {
  name                = "chat-asg"
  vpc_zone_identifier = [aws_subnet.private_1.id, aws_subnet.private_2.id]
  target_group_arns   = [aws_lb_target_group.app.arn]
  health_check_type   = "ELB"

  min_size         = var.min_instances
  max_size         = var.max_instances
  desired_capacity = var.min_instances

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "chat-app-asg"
    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Scaling Policies
resource "aws_autoscaling_policy" "scale_up" {
  name                   = "chat-scale-up"
  scaling_adjustment     = 1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.app.name
}

resource "aws_autoscaling_policy" "scale_down" {
  name                   = "chat-scale-down"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.app.name
}

# Data source for current AWS account
data "aws_caller_identity" "current" {}

# IAM Role and Instance Profile
resource "aws_iam_role" "app" {
  name = "chat-app-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_instance_profile" "app" {
  name = "chat-app-profile"
  role = aws_iam_role.app.name
}

resource "aws_iam_role_policy" "app_s3" {
  name   = "app-s3-policy"
  role   = aws_iam_role.app.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ]
      Effect   = "Allow"
      Resource = "${aws_s3_bucket.media.arn}/*"
    }]
  })
}

resource "aws_iam_role_policy" "app_cloudwatch" {
  name   = "app-cloudwatch-policy"
  role   = aws_iam_role.app.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "cloudwatch:PutMetricData",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
      Effect   = "Allow"
      Resource = "*"
    }]
  })
}

# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "chat-db-subnet-group"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  tags = {
    Name = "chat-db-subnet-group"
  }
}

# RDS MySQL Instance
resource "aws_db_instance" "chat_db" {
  identifier            = "chat-app-db"
  engine                = "mysql"
  engine_version        = "8.0.35"
  instance_class        = var.db_instance_class
  allocated_storage     = 20
  storage_type          = "gp2"
  db_name               = "chat_db"
  username              = "admin"
  password              = random_password.db_password.result
  parameter_group_name  = "default.mysql8.0"
  db_subnet_group_name  = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  multi_az               = false
  publicly_accessible    = false
  skip_final_snapshot    = true
  final_snapshot_identifier = "chat-db-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  backup_retention_period = 0
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  enabled_cloudwatch_logs_exports = []

  tags = {
    Name = "chat-app-db"
  }
}

resource "random_password" "db_password" {
  length  = 16
  special = true
}
