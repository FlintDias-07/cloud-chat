# AWS Infrastructure Setup using Terraform
This folder contains Infrastructure as Code (IaC) for deploying the chat application on AWS.

## Prerequisites
- Terraform >= 1.0
- AWS CLI configured with credentials
- AWS account with appropriate permissions

## Important Files
- `main.tf` - Main infrastructure configuration
- `variables.tf` - Variable definitions
- `outputs.tf` - Output values
- `autoscaling.tf` - Auto-scaling configuration
- `monitoring.tf` - CloudWatch monitoring setup

## Deployment Steps

### 1. Initialize Terraform
```bash
terraform init
```

### 2. Plan Infrastructure
```bash
terraform plan -out=tfplan
```

### 3. Apply Configuration
```bash
terraform apply tfplan
```

### 4. Destroy Resources (when done)
```bash
terraform destroy
```

## Infrastructure Components Created
- VPC with 2 Availability Zones
- Public subnets for ALB
- Private subnets for EC2 instances
- Application Load Balancer
- Auto Scaling Group (Min: 2, Max: 6 instances)
- RDS MySQL instance (Multi-AZ)
- S3 bucket for media storage
- CloudWatch dashboards and alarms
- Security groups for networking
- IAM roles for EC2 instances

## Configuration Variables
Edit `terraform.tfvars` to customize:
- `instance_type` - EC2 instance type
- `min_instances` - Minimum auto-scaling instances
- `max_instances` - Maximum auto-scaling instances
- `db_instance_class` - RDS instance type
- `environment` - Deployment environment (staging/production)

## Monitoring
CloudWatch dashboards automatically created at:
- Dashboard: `chat-app-dashboard`
- Alarms created for:
  - CPU utilization > 70%
  - Memory usage > 80%
  - Database connections > 80
  - ALB target health status
