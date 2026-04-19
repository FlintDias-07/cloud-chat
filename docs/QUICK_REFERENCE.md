# Quick Reference Guide

## Project: Cloud-Based Real-Time Chat Application

### Directory Structure
```
Cloud_project/
├── README.md                          # Project overview
├── backend/                           # Node.js backend
│   ├── src/
│   │   └── server.js                 # Express + Socket.io server
│   ├── config/
│   ├── package.json                  # Dependencies
│   └── .env.example                  # Environment variables template
├── frontend/                          # Web UI
│   ├── index.html                    # Main page
│   ├── pages/                        # Additional pages
│   └── assets/
│       ├── style.css                 # Styling
│       └── app.js                    # Client logic
├── cloud-infrastructure/              # Infrastructure as Code
│   └── terraform/
│       ├── main.tf                   # Main infrastructure
│       ├── variables.tf              # Variables
│       ├── outputs.tf                # Outputs
│       ├── user_data.sh              # EC2 setup script
│       └── README.md                 # Terraform guide
├── database/                          # Database setup
│   └── schema.sql                    # MySQL schema
└── docs/                              # Documentation
    ├── PROJECT_REPORT.md            # Detailed project report
    └── IMPLEMENTATION_PLAN.md       # Development roadmap
```

---

## Quick Start Commands

### AWS Setup
```bash
# Configure AWS CLI
aws configure

# Test AWS credentials
aws sts get-caller-identity
```

### Backend Setup
```bash
# Install dependencies
cd backend
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your AWS and database details

# Run development server
npm run dev

# Run production server
npm start
```

### Frontend
Simply open `frontend/index.html` in a browser
Or serve with a local HTTP server:
```bash
cd frontend
python -m http.server 8000
```

### Terraform Deployment
```bash
cd cloud-infrastructure/terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -out=tfplan

# Apply changes
terraform apply tfplan

# View outputs
terraform output

# Destroy (when done with project)
terraform destroy
```

---

## Important AWS Endpoints After Deployment

After running `terraform apply`, you'll get:

| Resource | Output Variable | Usage |
|----------|-----------------|-------|
| Load Balancer | `alb_dns_name` | Access app at: `http://<alb_dns_name>` |
| RDS Endpoint | `rds_endpoint` | Database connection string |
| S3 Bucket | `s3_bucket_name` | Upload media files |
| Application URL | `app_url` | Complete URL to access app |

---

## Database Connection Details

Located in RDS outputs after Terraform deployment:
- **Host**: `<rds_address>` (from terraform output)
- **Port**: 3306
- **Database**: chat_db
- **Username**: admin
- **Password**: Check `terraform output db_password_secret` (sensitive)

---

## Environment Variables (.env)

Required environment variables for the backend:

```env
PORT=3000
NODE_ENV=production
DB_HOST=your-rds-endpoint.aws.com
DB_USER=admin
DB_PASSWORD=your-secure-password
DB_NAME=chat_db
FRONTEND_URL=http://your-alb-dns.amazonaws.com
AWS_REGION=us-east-1
S3_BUCKET_NAME=chat-app-media-xxxxxxxx
JWT_SECRET=your-secret-key
```

---

## Monitoring & Alerting

### Access CloudWatch Dashboards
1. Go to AWS Console → CloudWatch
2. Choose Dashboards → `chat-app-dashboard`
3. Monitor:
   - CPU utilization
   - Memory usage
   - Network throughput
   - Active connections
   - Error rates

### Active Alarms
- **High CPU** (>70%) → Scale up
- **Low CPU** (<30%) → Scale down
- **RDS Connection Status** → Check database health
- **ALB Target Health** → Check instance health

---

## Scaling Configuration

### Auto Scaling Group Details
- **Min Instances**: 2
- **Max Instances**: 6
- **Scale Up**: When CPU > 70% for 300 seconds
- **Scale Down**: When CPU < 30% for 300 seconds
- **Cooldown**: 300 seconds between scaling actions

### Manual Scaling
```bash
# Set desired capacity
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name chat-asg \
  --desired-capacity 4 \
  --region us-east-1
```

---

## Troubleshooting

### Application Not Running
1. Check EC2 instances in ASG
2. Verify security groups allow port 3000
3. Check ALB target group health
4. Review CloudWatch Logs

### Database Connection Failed
1. Verify RDS endpoint and credentials
2. Check security group allows MySQL (3306)
3. Verify .env variables
4. Check RDS instance status

### High Costs Detected
1. Review CloudWatch metrics for resource usage
2. Check for running instances outside ASG
3. Review S3 storage usage
4. Consider Reserved Instances for stable workloads

---

## Key Files to Modify

| File | Purpose | When to Edit |
|------|---------|-------------|
| `backend/.env` | Backend configuration | Before first deployment |
| `cloud-infrastructure/terraform/terraform.tfvars` | Infrastructure variables | To change EC2 type, scaling limits |
| `cloud-infrastructure/terraform/variables.tf` | Default values | For environment-specific settings |
| `database/schema.sql` | Database schema | To add new tables or columns |
| `frontend/index.html` | Chat UI | To customize interface |

---

## Common AWS CLI Commands

```bash
# View running EC2 instances
aws ec2 describe-instances --region us-east-1

# Check Auto Scaling Group
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names chat-asg

# View RDS instance
aws rds describe-db-instances --db-instance-identifier chat-app-db

# Monitor CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=AutoScalingGroupName,Value=chat-asg \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 300 \
  --statistics Average
```

---

## Support & Help

### For Issues:
1. Check CloudWatch Logs
2. Review security groups
3. Verify environment variables
4. Check project documentation in `/docs`

### Documentation Files:
- `PROJECT_REPORT.md` - Complete project details
- `IMPLEMENTATION_PLAN.md` - Development timeline
- `README.md` - Project overview

---

**Last Updated**: April 2026
**Version**: 1.0
