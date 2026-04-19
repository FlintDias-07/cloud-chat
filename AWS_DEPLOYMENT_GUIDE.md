Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

Try the new cross-platform PowerShell https://aka.ms/pscore6

PS C:\Users\Admin> aws --version
aws-cli/2.34.32 Python/3.14.4 Windows/10 exe/AMD64
PS C:\Users\Admin> aws sts get-caller-identity

aws: [ERROR]: An error occurred (NoCredentials): Unable to locate credentials. You can configure credentials by running "aws login".
PS C:\Users\Admin> aws configure

Tip: You can deliver temporary credentials to the AWS CLI using your AWS Console session by running the command 'aws login'.

AWS Access Key ID [None]: AKIAYVGCNEYSEJA7ZX5S
AWS Secret Access Key [None]: lZ4j6rlg3Wx/3RQ422kG9JTzuOO9CJaCzOJRGhuO
Default region name [None]: ap-south-1
Default output format [None]: json
PS C:\Users\Admin> aws sts get-caller-identity
{
    "UserId": "AIDAYVGCNEYSJKKO4XY4M",
    "Account": "595260679716",
    "Arn": "arn:aws:iam::595260679716:user/terraform-admin"
}

PS C:\Users\Admin> $AWS_ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
>> $BUCKET_NAME = "chat-app-terraform-state-$AWS_ACCOUNT_ID"
>>
>> aws s3 mb s3://$BUCKET_NAME --region ap-south-1
make_bucket: chat-app-terraform-state-595260679716
PS C:\Users\Admin> aws s3api put-bucket-versioning `
>>   --bucket $BUCKET_NAME `
>>   --versioning-configuration Status=Enabled
PS C:\Users\Admin> aws dynamodb create-table `
>>   --table-name terraform-locks `
>>   --attribute-definitions AttributeName=LockID,AttributeType=S `
>>   --key-schema AttributeName=LockID,KeyType=HASH `
>>   --billing-mode PAY_PER_REQUEST `
>>   --region ap-south-1
{
    "TableDescription": {
        "AttributeDefinitions": [
            {
                "AttributeName": "LockID",
                "AttributeType": "S"
            }
        ],
        "TableName": "terraform-locks",
        "KeySchema": [
            {
                "AttributeName": "LockID",
                "KeyType": "HASH"
            }
        ],
        "TableStatus": "CREATING",
        "CreationDateTime": "2026-04-19T16:13:11.095000+05:30",
        "ProvisionedThroughput": {
            "NumberOfDecreasesToday": 0,
            "ReadCapacityUnits": 0,
            "WriteCapacityUnits": 0
        },
        "TableSizeBytes": 0,
        "ItemCount": 0,
        "TableArn": "arn:aws:dynamodb:ap-south-1:595260679716:table/terraform-locks",
        "TableId": "d94d6f81-0122-4326-af32-05cbc4ddc80c",
        "BillingModeSummary": {
            "BillingMode": "PAY_PER_REQUEST"
        },
        "DeletionProtectionEnabled": false
    }
}

PS C:\Users\Admin> aws s3 ls | grep $BUCKET_NAME
>> aws dynamodb describe-table --table-name terraform-locks --region ap-south-1
grep : The term 'grep' is not recognized as the name of a cmdlet, function, script file, or operable program. Check
the spelling of the name, or if a path was included, verify that the path is correct and try again.
At line:1 char:13
+ aws s3 ls | grep $BUCKET_NAME
+             ~~~~
    + CategoryInfo          : ObjectNotFound: (grep:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException

{
    "Table": {
        "AttributeDefinitions": [
            {
                "AttributeName": "LockID",
                "AttributeType": "S"
            }
        ],
        "TableName": "terraform-locks",
        "KeySchema": [
            {
                "AttributeName": "LockID",
                "KeyType": "HASH"
            }
        ],
        "TableStatus": "ACTIVE",
        "CreationDateTime": "2026-04-19T16:13:11.095000+05:30",
        "ProvisionedThroughput": {
            "NumberOfDecreasesToday": 0,
            "ReadCapacityUnits": 0,
            "WriteCapacityUnits": 0
        },
        "TableSizeBytes": 0,
        "ItemCount": 0,
        "TableArn": "arn:aws:dynamodb:ap-south-1:595260679716:table/terraform-locks",
        "TableId": "d94d6f81-0122-4326-af32-05cbc4ddc80c",
        "BillingModeSummary": {
            "BillingMode": "PAY_PER_REQUEST",
            "LastUpdateToPayPerRequestDateTime": "2026-04-19T16:13:11.095000+05:30"
        },
        "DeletionProtectionEnabled": false,
        "WarmThroughput": {
            "ReadUnitsPerSecond": 12000,
            "WriteUnitsPerSecond": 4000,
            "Status": "ACTIVE"
        }
    }
}

PS C:\Users\Admin> aws s3 ls | grep $BUCKET_NAME
>> aws dynamodb describe-table --table-name terraform-locks --region ap-south-1
grep : The term 'grep' is not recognized as the name of a cmdlet, function, script file, or operable program. Check
the spelling of the name, or if a path was included, verify that the path is correct and try again.
At line:1 char:13
+ aws s3 ls | grep $BUCKET_NAME
+             ~~~~
    + CategoryInfo          : ObjectNotFound: (grep:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException

{
    "Table": {
        "AttributeDefinitions": [
            {
                "AttributeName": "LockID",
                "AttributeType": "S"
            }
        ],
        "TableName": "terraform-locks",
        "KeySchema": [
            {
                "AttributeName": "LockID",
                "KeyType": "HASH"
            }
        ],
        "TableStatus": "ACTIVE",
        "CreationDateTime": "2026-04-19T16:13:11.095000+05:30",
        "ProvisionedThroughput": {
            "NumberOfDecreasesToday": 0,
            "ReadCapacityUnits": 0,
            "WriteCapacityUnits": 0
        },
        "TableSizeBytes": 0,
        "ItemCount": 0,
        "TableArn": "arn:aws:dynamodb:ap-south-1:595260679716:table/terraform-locks",
        "TableId": "d94d6f81-0122-4326-af32-05cbc4ddc80c",
        "BillingModeSummary": {
            "BillingMode": "PAY_PER_REQUEST",
            "LastUpdateToPayPerRequestDateTime": "2026-04-19T16:13:11.095000+05:30"
        },
        "DeletionProtectionEnabled": false,
        "WarmThroughput": {
            "ReadUnitsPerSecond": 12000,
            "WriteUnitsPerSecond": 4000,
            "Status": "ACTIVE"
        }
    }
}

PS C:\Users\Admin># AWS Deployment Guide - Cloud Chat Application

Complete step-by-step guide to deploy your chat app on AWS with auto-scaling, load balancing, and monitoring.

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Phase 1: AWS Account Setup](#phase-1-aws-account-setup)
3. [Phase 2: Install Tools](#phase-2-install-tools)
4. [Phase 3: Configure AWS Credentials](#phase-3-configure-aws-credentials)
5. [Phase 4: Prepare Terraform](#phase-4-prepare-terraform)
6. [Phase 5: Deploy Infrastructure](#phase-5-deploy-infrastructure)
7. [Phase 6: Configure Application](#phase-6-configure-application)
8. [Phase 7: Deploy Application](#phase-7-deploy-application)
9. [Phase 8: Monitoring & Validation](#phase-8-monitoring--validation)

---

## PREREQUISITES

### System Requirements

- Windows 10/11 (you're on Windows ✅)
- Administrator access
- ~10GB free disk space
- Internet connection

### AWS Requirements

- AWS Account (free tier eligible)
- Valid payment method
- Email for notifications

---

## PHASE 1: AWS Account Setup

### Step 1.1: Create AWS Account (if you don't have one)

```
1. Go to: https://aws.amazon.com/free/
2. Click "Create a free account"
3. Enter your email and password
4. Enter account name: "CloudChatApp"
5. Enter contact information
6. Enter payment method
7. Verify with confirmation email
8. Complete phone verification
9. Choose "Basic support" plan (free)
```

✅ **Result**: Active AWS account with free tier eligibility

---

### Step 1.2: Set Up Billing Alerts (IMPORTANT!)

```
1. Go to: AWS Management Console → Billing
2. Click "Billing Preferences"
3. ✅ Enable "Receive PDF Invoice by Email"
4. ✅ Enable "Receive Billing Alerts"
5. Click "Save preferences"
6. Go to CloudWatch → Alarms
7. Create alarm:
   - Metric: Billing (Total Estimated Charge)
   - Threshold: $5 (free tier limit)
   - Alert method: Email
8. Confirm SNS email
```

✅ **Result**: You'll get alerts if costs exceed threshold

---

## PHASE 2: Install Tools on Windows

### Step 2.1: Install AWS CLI

```powershell
# Open PowerShell as Administrator

# Install using winget (recommended)
winget install Amazon.AWSCLI

# Verify installation
aws --version

# Expected output: aws-cli/2.x.x
```

If `winget` doesn't work, download from:
https://awscli.amazonaws.com/AWSCLIV2.msi

### Step 2.2: Install Terraform

```powershell
# Install using winget
winget install HashiCorp.Terraform

# Verify installation
terraform --version

# Expected output: Terraform v1.x.x
```

If `winget` doesn't work, download from:
https://www.terraform.io/downloads.html

### Step 2.3: Verify Both Tools

```powershell
aws --version
terraform --version

# Both should show version numbers
```

✅ **Result**: AWS CLI and Terraform installed

---

## PHASE 3: Configure AWS Credentials

### Step 3.1: Create IAM User with Programmatic Access

```
1. Go to: AWS Management Console
2. Search for "IAM"
3. Click "Users" → "Create user"
4. User name: "terraform-admin"
5. Click Next
6. Attach policies directly:
   ☑ AdministratorAccess (for testing)
7. Click Next → Create user
```

### Step 3.2: Generate Access Keys

```
1. Click on user "terraform-admin"
2. Go to "Security credentials" tab
3. Click "Create access key"
4. Choose "Command Line Interface (CLI)"
5. Accept the warning
6. Click "Create access key"
7. ⚠️ SAVE THESE IMMEDIATELY:
   - Access Key ID
   - Secret Access Key
8. Download .csv file (backup)
```

### Step 3.3: Configure AWS CLI on Windows

```powershell
# Open PowerShell and run:
aws configure

# Answer prompts:
# AWS Access Key ID: [paste your Access Key ID]
# AWS Secret Access Key: [paste your Secret Access Key]
# Default region name: us-east-1
# Default output format: json
```

### Step 3.4: Verify Configuration

```powershell
# Test credentials
aws sts get-caller-identity

# Expected output:
# {
#     "UserId": "AIDAI...",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/terraform-admin"
# }
```

✅ **Result**: AWS credentials configured and verified

---

## PHASE 4: Prepare Terraform

### Step 4.1: Create S3 Bucket for Terraform State

```powershell
# Navigate to your project
cd C:\Users\Admin\Desktop\Cloud_project

# Create unique bucket name (S3 bucket names are globally unique)
# Format: chat-app-terraform-state-YOUR_ACCOUNT_ID

$AWS_ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
$BUCKET_NAME = "chat-app-terraform-state-$AWS_ACCOUNT_ID"

# Create the bucket
aws s3 mb s3://$BUCKET_NAME --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning `
  --bucket $BUCKET_NAME `
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption `
  --bucket $BUCKET_NAME `
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Verify
aws s3 ls | grep $BUCKET_NAME
```

### Step 4.2: Create DynamoDB Table for Terraform Locks

```powershell
aws dynamodb create-table `
  --table-name terraform-locks `
  --attribute-definitions AttributeName=LockID,AttributeType=S `
  --key-schema AttributeName=LockID,KeyType=HASH `
  --billing-mode PAY_PER_REQUEST `
  --region us-east-1

# Verify
aws dynamodb describe-table --table-name terraform-locks --region us-east-1
```

### Step 4.3: Update Terraform Backend Configuration

```powershell
# Edit the Terraform main.tf file
# Update the S3 bucket name with your actual bucket:

# File: cloud-infrastructure\terraform\main.tf
# Change this line:
#   bucket         = "chat-app-terraform-state-YOUR_ACCOUNT_ID"
```

```hcl
# In cloud-infrastructure/terraform/main.tf, update:
backend "s3" {
  bucket         = "chat-app-terraform-state-123456789012"  # ← USE YOUR ACCOUNT ID
  key            = "prod/terraform.tfstate"
  region         = "us-east-1"
  encrypt        = true
  dynamodb_table = "terraform-locks"
}
```

✅ **Result**: Terraform remote state backend ready

---

## PHASE 5: Deploy Infrastructure

### Step 5.1: Initialize Terraform

```powershell
# Navigate to terraform directory
cd C:\Users\Admin\Desktop\Cloud_project\cloud-infrastructure\terraform

# Initialize Terraform (downloads AWS provider)
terraform init

# Expected output:
# Terraform has been successfully configured!
```

### Step 5.2: Review Terraform Plan

```powershell
# See what will be created
terraform plan -out=tfplan

# This will show:
# - VPC with subnets
# - Security groups
# - Load balancer
# - Auto-scaling group
# - RDS database
# - S3 bucket
# - IAM roles

# Carefully review the output
```

### Step 5.3: Apply Terraform Configuration

```powershell
# Deploy infrastructure to AWS
terraform apply tfplan

# This will take ~15-20 minutes

# When prompted: type "yes"

# Wait for completion...
```

### Step 5.4: Save Terraform Outputs

```powershell
# Get the outputs
terraform output

# Save these values:
# - load_balancer_dns
# - rds_endpoint
# - s3_bucket_name
# - auto_scaling_group_name
# - security_group_ids

# Or save to file:
terraform output -json > terraform_outputs.json
```

✅ **Result**: AWS infrastructure deployed!

**Created Resources:**

- ✅ VPC (10.0.0.0/16)
- ✅ 4 Subnets (2 public, 2 private)
- ✅ Internet Gateway & Route Tables
- ✅ Load Balancer (ALB)
- ✅ Auto-Scaling Group (2 EC2 instances)
- ✅ RDS MySQL Database
- ✅ S3 Bucket for media
- ✅ Security Groups

---

## PHASE 6: Configure Application

### Step 6.1: Update Backend .env File

```
File: backend\.env

Update these values with your Terraform outputs:

# Get from terraform output
DB_HOST=<RDS endpoint from terraform output>
DB_PORT=3306
DB_NAME=chat_app
DB_USER=admin
DB_PASSWORD=<Your secure password>
DB_USE_DATABASE=true

# AWS Configuration
AWS_REGION=us-east-1
AWS_S3_BUCKET=<S3 bucket name from terraform output>

# Server
NODE_ENV=production
PORT=3000
```

### Step 6.2: Build Application

```powershell
# Build the backend
cd C:\Users\Admin\Desktop\Cloud_project\backend

npm install
npm run build

# This creates a production-ready version
```

### Step 6.3: Create Deployment Package

```powershell
# Create zip file for EC2 deployment
cd C:\Users\Admin\Desktop\Cloud_project

# PowerShell command to zip
$compress = @{
  Path = "backend", "frontend", ".env", "package.json"
  CompressionLevel = "Fastest"
  DestinationPath = "app-deploy.zip"
}
Compress-Archive @compress

# Verify
ls -la app-deploy.zip
```

✅ **Result**: Application ready for deployment

---

## PHASE 7: Deploy Application to EC2

### Step 7.1: Get EC2 Instance Information

```powershell
# Get Auto Scaling Group details
$ASG_NAME = aws autoscaling describe-auto-scaling-groups `
  --query 'AutoScalingGroups[0].AutoScalingGroupName' `
  --output text

# Get instance IDs
$INSTANCES = aws autoscaling describe-auto-scaling-groups `
  --auto-scaling-group-name $ASG_NAME `
  --query 'AutoScalingGroups[0].Instances[*].InstanceId' `
  --output text

echo "Instances: $INSTANCES"
```

### Step 7.2: Copy Application to EC2 Instances

```powershell
# Get public IP of first instance
$INSTANCE_ID = ($INSTANCES -split ' ')[0]

$INSTANCE_IP = aws ec2 describe-instances `
  --instance-ids $INSTANCE_ID `
  --query 'Reservations[0].Instances[0].PublicIpAddress' `
  --output text

echo "Instance IP: $INSTANCE_IP"

# Upload application (using SCP through bastion or direct access)
# This depends on your security setup
```

### Step 7.3: Alternative - Use EC2 Instance Connect

```powershell
# Connect directly to EC2 and deploy
aws ec2-instance-connect send-ssh-public-key `
  --instance-id $INSTANCE_ID `
  --os-user ec2-user `
  --ssh-public-key file://your-key.pub `
  --availability-zone us-east-1a

# Then SSH and deploy:
# ssh ec2-user@$INSTANCE_IP
# cd /opt/app
# npm install && npm start
```

✅ **Result**: Application deployed on EC2 instances

---

## PHASE 8: Monitoring & Validation

### Step 8.1: Access Application

```
Get Load Balancer DNS:

$ALB_DNS = aws elbv2 describe-load-balancers `
  --query 'LoadBalancers[0].DNSName' `
  --output text

echo "Access your app at: http://$ALB_DNS"
```

### Step 8.2: Check Application Health

```powershell
# Check target health
aws elbv2 describe-target-health `
  --target-group-arn <from terraform output>

# Should show targets: Healthy
```

### Step 8.3: View CloudWatch Logs

```powershell
# Check application logs
aws logs describe-log-groups --query 'logGroups[*].logGroupName' --output text

# View recent logs
aws logs tail /aws/ec2/chat-app --follow
```

### Step 8.4: Monitor Auto-Scaling

```powershell
# Check ASG metrics
aws autoscaling describe-auto-scaling-groups `
  --auto-scaling-group-name $ASG_NAME

# View desired vs actual capacity
# Should show: Desired: 2, Current: 2, Min: 2, Max: 6
```

### Step 8.5: Database Connection Test

```powershell
# From one of the EC2 instances:
mysql -h <RDS_ENDPOINT> -u admin -p

# Password: <your password>

# Test query:
USE chat_app;
SHOW TABLES;
```

✅ **Result**: Application running on AWS!

---

## PHASE 9: Post-Deployment Checklist

### Health Checks

- [ ] Load Balancer DNS responding (curl it)
- [ ] Both EC2 instances showing "Healthy"
- [ ] RDS database accessible
- [ ] Auto-scaling group at desired capacity
- [ ] CloudWatch logs appearing
- [ ] Users can login and chat
- [ ] Messages persist in database
- [ ] S3 bucket accessible

### Monitoring Setup

- [ ] CloudWatch alarms configured
- [ ] SNS topics set up for notifications
- [ ] Dashboards created
- [ ] Log groups created

### Security Verification

- [ ] No public access to RDS
- [ ] No public access to private subnets
- [ ] Security groups properly configured
- [ ] IAM roles follow least privilege

---

## 📊 SCALING POLICIES

Your Auto-Scaling Group will:

- **Scale UP** when: CPU > 70% + Disk > 80%
- **Scale DOWN** when: CPU < 30% (after 5 min stability)
- **Min instances**: 2
- **Max instances**: 6
- **Cooldown**: 300 seconds between actions

---

## 💰 COST ESTIMATION (Monthly)

| Service       | Instance Type | Cost           |
| ------------- | ------------- | -------------- |
| EC2           | t3.medium × 2 | ~$30           |
| RDS           | db.t3.micro   | ~$30           |
| Load Balancer | ALB           | ~$16           |
| Data Transfer | ~10GB         | ~$5            |
| S3 Storage    | ~5GB          | ~$0.50         |
| **TOTAL**     |               | **~$80/month** |

_Within free tier: ~$0 for first 12 months_

---

## 🆘 TROUBLESHOOTING

### Terraform Apply Fails

```powershell
# Clear local state and retry
rm -r .terraform
terraform init
terraform plan
terraform apply
```

### EC2 Instances Not Starting

```powershell
# Check security group rules
aws ec2 describe-security-groups --group-ids <sg-id>

# Check user data script logs
aws ssm start-session --target <instance-id>
cat /var/log/cloud-init-output.log
```

### RDS Connection Failed

```powershell
# Verify security group
aws ec2 describe-security-groups --group-ids <rds-sg-id>

# Verify subnet
aws rds describe-db-instances --db-instance-identifier <db-name>
```

### Application Not Responding

```powershell
# Check logs
aws logs tail /aws/ec2/chat-app --follow

# Check instance health
aws elbv2 describe-target-health --target-group-arn <tg-arn>
```

---

## 🎯 NEXT STEPS

1. **Enable HTTPS**: Add ACM certificate to ALB
2. **Custom Domain**: Point Route53 to ALB
3. **CI/CD Pipeline**: Set up GitHub Actions for auto-deployment
4. **Database Backups**: Configure automated backups
5. **Performance**: Add CloudFront CDN
6. **Notifications**: Set up SNS for alerts

---

## ✅ COMPLETION CHECKLIST

- [ ] AWS Account created
- [ ] Billing alerts configured
- [ ] AWS CLI installed & configured
- [ ] Terraform installed
- [ ] IAM user created
- [ ] S3 bucket for state created
- [ ] DynamoDB table created
- [ ] Terraform infrastructure deployed
- [ ] Application built
- [ ] Application deployed to EC2
- [ ] Load balancer responding
- [ ] RDS database connected
- [ ] CloudWatch monitoring active
- [ ] Application accessible via ALB DNS
- [ ] Scaling policies verified

**🎉 When all checked: Your app is live on AWS!**

---

**Support**: Check AWS CloudWatch logs and CloudFormation events for any errors.

**Last Updated**: April 19, 2026
