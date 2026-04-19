# Output values from Terraform

output "alb_dns_name" {
  description = "DNSname of the load balancer"
  value       = aws_lb.main.dns_name
}

output "alb_arn" {
  description = "ARN of the load balancer"
  value       = aws_lb.main.arn
}

output "rds_endpoint" {
  description = "RDS database endpoint"
  value       = aws_db_instance.chat_db.endpoint
}

output "rds_address" {
  description = "RDS database address"
  value       = aws_db_instance.chat_db.address
}

output "db_password_secret" {
  description = "Database password (store securely)"
  value       = random_password.db_password.result
  sensitive   = true
}

output "asg_name" {
  description = "Auto Scaling Group name"
  value       = aws_autoscaling_group.app.name
}

output "s3_bucket_name" {
  description = "S3 bucket for media uploads"
  value       = aws_s3_bucket.media.id
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.chat_vpc.id
}

output "app_url" {
  description = "Application URL"
  value       = "http://${aws_lb.main.dns_name}"
}
