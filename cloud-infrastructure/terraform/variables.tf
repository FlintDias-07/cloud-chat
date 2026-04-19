# Variables for Terraform Configuration

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "min_instances" {
  description = "Minimum instances in ASG"
  type        = number
  default     = 2
}

variable "max_instances" {
  description = "Maximum instances in ASG"
  type        = number
  default     = 6
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t2.micro"
}

variable "app_port" {
  description = "Application port"
  type        = number
  default     = 3000
}
