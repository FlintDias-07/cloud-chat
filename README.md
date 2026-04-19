# Cloud-Based Real-Time Chat Application with Auto-Scaling and Monitoring

## Project Overview
A scalable, real-time chat web application deployed on AWS cloud infrastructure with auto-scaling capabilities, database persistence, and comprehensive monitoring and alerting.

## Key Features
- ✅ Real-time messaging using WebSockets
- ✅ User authentication and authorization
- ✅ Auto-scaling based on traffic
- ✅ Load balancing across multiple instances
- ✅ Cloud-based database (AWS RDS)
- ✅ Object storage for media/attachments (AWS S3)
- ✅ Real-time monitoring dashboard (CloudWatch)
- ✅ Health checks and auto-recovery

## Architecture Components
1. **Compute**: EC2 instances with Node.js backend
2. **Database**: AWS RDS (MySQL/PostgreSQL)
3. **Storage**: AWS S3 for file uploads
4. **Networking**: Load Balancer (ALB) + Auto Scaling Group
5. **Monitoring**: CloudWatch + CloudWatch Alarms
6. **Frontend**: HTML5, CSS3, JavaScript with Socket.io

## Tech Stack
- **Backend**: Node.js, Express.js, Socket.io
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: MySQL 8.0+ on RDS
- **Cloud**: AWS (EC2, RDS, S3, ALB, CloudWatch)
- **Infrastructure as Code**: Terraform/CloudFormation

## Deployment Strategy
- Multi-tier deployment across AZs
- Automated scaling policies
- Health monitoring and alerting
- Zero-downtime deployments

---
For detailed documentation, see `/docs` folder.
