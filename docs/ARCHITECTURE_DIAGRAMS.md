# Architecture Diagrams & Visualizations

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USERS / BROWSERS                                  │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │ HTTPS
                             │
        ┌────────────────────▼────────────────────┐
        │  AWS CloudFront (CDN)                   │
        │  - Static asset caching                 │
        │  - SSL/TLS termination                  │
        └────────────────────┬────────────────────┘
                             │
        ┌────────────────────▼────────────────────────────────────────────┐
        │           AWS Elastic Load Balancer (ALB)                       │
        │  - Port 80 (HTTP) / 443 (HTTPS)                                 │
        │  - Health checks every 30 seconds                              │
        │  - Path-based routing                                          │
        │  - Sticky sessions disabled                                    │
        └────────────────────┬────────────────────────────────────────────┘
                             │
        ┌────────────────────▼────────────────────────────────────────────┐
        │         AWS Auto Scaling Group (ASG)                            │
        │  Min: 2 | Desired: 2 | Max: 6 instances                        │
        │                                                                 │
        │  ┌─────────────────────┐    ┌─────────────────────┐            │
        │  │ EC2 Instance - AZ1  │    │ EC2 Instance - AZ2  │            │
        │  ├─────────────────────┤    ├─────────────────────┤            │
        │  │ Ubuntu 22.04 LTS    │    │ Ubuntu 22.04 LTS    │            │
        │  │ Node.js 18.x        │    │ Node.js 18.x        │            │
        │  │ Express Server      │    │ Express Server      │            │
        │  │ Socket.io WebSocket │    │ Socket.io WebSocket │            │
        │  │ Port: 3000          │    │ Port: 3000          │            │
        │  │ Logs → CloudWatch   │    │ Logs → CloudWatch   │            │
        │  └─────────────────────┘    └─────────────────────┘            │
        │                                                                 │
        │  ┌─────────────────────────────────────────────────────────┐   │
        │  │ Scaling Policies                                        │   │
        │  │ • Scale UP:   CPU > 70% + Disk > 80% → +1 instance     │   │
        │  │ • Scale DOWN: CPU < 30% + Stability 5 min → -1 inst    │   │
        │  │ • Cooldown: 300 seconds between scaling actions        │   │
        │  └─────────────────────────────────────────────────────────┘   │
        └────────────────────┬────────────────────────────────────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│   AWS RDS MySQL          │         │   AWS S3 Bucket          │
│   (Primary in AZ1)       │         │   (Media Storage)        │
├──────────────────────────┤         ├──────────────────────────┤
│ Multi-AZ Deployment      │         │ Versioning: Enabled      │
│ Primary: AZ1             │         │ Replication: Enabled     │
│ Standby: AZ2             │         │ Encryption: AES-256      │
├──────────────────────────┤         ├──────────────────────────┤
│ Engine: MySQL 8.0.35     │         │ Lifecycle Rules:         │
│ Instance: db.t3.micro    │         │ - 30d → Glacier          │
│ Storage: 20GB gp3        │         │ - 90d → Deep Archive     │
│ Backup: 7 days retention │         └──────────────────────────┘
│ Enhanced Monitoring      │
│ Logs → CloudWatch        │
└──────────────────────────┘
        ▲
        │
┌───────┴──────────────────────────────────────────────────────────┐
│          AWS Monitoring & Observability                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────┐  ┌──────────────────────────┐    │
│  │ CloudWatch Dashboards   │  │ CloudWatch Alarms        │    │
│  ├─────────────────────────┤  ├──────────────────────────┤    │
│  │ • System Performance    │  │ • CPU Utilization        │    │
│  │ • Application Metrics   │  │ • Memory Usage           │    │
│  │ • Database Health       │  │ • Network Throughput    │    │
│  │ • Logging Insights      │  │ • RDS Connection Count  │    │
│  │ • Real-time Visualizer  │  │ • ALB Target Health     │    │
│  └─────────────────────────┘  └──────────────────────────┘    │
│                                                                │
│  ┌──────────────────────┐  ┌──────────────────────┐           │
│  │ CloudWatch Logs      │  │ CloudTrail Audit     │           │
│  ├──────────────────────┤  ├──────────────────────┤           │
│  │ • App Logs           │  │ • API Calls          │           │
│  │ • DB Slow Queries    │  │ • User Actions       │           │
│  │ • ALB Access Logs    │  │ • Resource Changes   │           │
│  │ • VPC Flow Logs      │  │ • Compliance Report  │           │
│  └──────────────────────┘  └──────────────────────┘           │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ SNS Notifications (Email / SMS / Slack)                 │  │
│  │ • Auto-Scaling Events                                   │  │
│  │ • Alarm Triggers                                        │  │
│  │ • Error Notifications                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## Application Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   USER INTERACTIONS                          │
└─────────────────────────┬──────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌─────────────────────┐          ┌──────────────────────┐
│ 1. LOGIN            │          │ 2. JOIN ROOM         │
├─────────────────────┤          ├──────────────────────┤
│ • Credentials sent  │          │ • WebSocket connect  │
│ • JWT token issued  │          │ • User joins room    │
│ • Stored in browser │          │ • Notification sent  │
└─────────────────────┘          └──────────────────────┘
        │                                   │
        └─────────────────┬─────────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │ 3. SEND MESSAGE      │
                ├──────────────────────┤
                │ • Socket emit event  │
                │ • Message validation │
                │ • Save to database   │
                │ • Broadcast to room  │
                │ • Update UI          │
                └──────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌─────────────────────┐          ┌──────────────────────┐
│ MESSAGE PERSISTENCE │          │ BROADCAST TO CLIENTS │
├─────────────────────┤          ├──────────────────────┤
│ • Insert to DB      │          │ • All room members   │
│ • Timestamp added   │          │ • Real-time delivery │
│ • Indexed by room   │          │ • Socket emission    │
│ • Backup by RDS     │          │ • DOM update         │
└─────────────────────┘          └──────────────────────┘
```

---

## Network Topology

```
INTERNET (0.0.0.0/0)
    │
    │ (Traffic on port 80/443)
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ AWS VPC (10.0.0.0/16)                                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ PUBLIC SUBNETS (For ALB)                                │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ • AZ1: 10.0.1.0/24 (Public SN 1)                        │ │
│ │ • AZ2: 10.0.2.0/24 (Public SN 2)                        │ │
│ │ • Internet Gateway Route                                │ │
│ │ • ALB runs here                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ PRIVATE SUBNETS (For EC2 & RDS)                         │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ • AZ1: 10.0.10.0/24 (Private SN 1)                      │ │
│ │   └─ EC2 Instances running App                          │ │
│ │   └─ RDS Primary (MySQL Master)                         │ │
│ │                                                          │ │
│ │ • AZ2: 10.0.11.0/24 (Private SN 2)                      │ │
│ │   └─ EC2 Instances running App                          │ │
│ │   └─ RDS Standby (MySQL Replica)                        │ │
│ │                                                          │ │
│ │ • NAT Gateway (in Public SN) for outbound traffic       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘

SECURITY GROUPS (Virtual Firewall):
┌────────────────────────────────────────────────────────────┐
│ ALB Security Group                                         │
│ ├─ Inbound: 80/TCP, 443/TCP from 0.0.0.0/0               │
│ └─ Outbound: 3000/TCP to EC2 SG                           │
│                                                            │
│ EC2 Security Group                                         │
│ ├─ Inbound: 3000/TCP from ALB SG                          │
│ ├─ Inbound: 22/TCP from admin IP (SSH)                    │
│ └─ Outbound: 3306/TCP to RDS SG, All to 0.0.0.0/0        │
│                                                            │
│ RDS Security Group                                         │
│ ├─ Inbound: 3306/TCP from EC2 SG                          │
│ └─ Outbound: All (usually none needed)                    │
└────────────────────────────────────────────────────────────┘
```

---

## Message Flow Diagram

```
CLIENT BROWSER                                   SERVER
     │                                               │
     │─── 1. User enters message ────────────────>  │
     │                                               │
     │                                          2. Validate input
     │                                          3. Check auth (JWT)
     │                                          4. Insert to DB
     │<─── Emit 'receive_message' (own) ──────────  │
     │                                           5. Query room members
     │     Add to message list                   6. Socket.io emit
     │     Show in UI                               │
     │                                               │──> SOCKET.IO BROADCAST
     │                                               │
     │<──────────────────────────────────────────────┤
     │    7. Broadcast to all room members
     │    emit('receive_message', {...})
     │
     │ 8. Update message list in all connected clients
     │    Display message with timestamp
     │    Show sender name and avatar
     │
     └─ Message persisted in RDS MySQL
       └─ Backup by automated RDS snapshots
```

---

## Scaling Trigger Diagram

```
┌─────────────────────────────────────────────────────────────┐
│         CLOUDWATCH MONITORING CPU METRICS                   │
└─────────────────────────────────────────────────────────────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
            ▼             ▼             ▼
      CPU < 30%    30% ≤ CPU ≤ 70%    CPU > 70%
            │             │             │
            │      (NORMAL RANGE)       │
            │        No Action          │
            │             │             │
            ▼             ▼             ▼
     SCALE DOWN      MAINTAIN        SCALE UP
            │             │             │
            ▼             ▼             ▼
    Wait 5 min    Continue running   Wait 5 min
  (Cooldown 300s) (monitor metrics)  (Cooldown 300s)
            │             │             │
            ▼             ▼             ▼
  Remove 1 instance  No change      Add 1 instance
  (if > min 2)                       (if < max 6)
            │             │             │
            └─────────────┼─────────────┘
                          │
                    Verify ASG
                   Desired ≥ Min
                   Desired ≤ Max
```

---

## Disaster Recovery Flow

```
┌─────────────────────────────────────────────────────────────┐
│              DATABASE FAILOVER (RDS Multi-AZ)               │
└─────────────────────────────────────────────────────────────┘

NORMAL OPERATION:
┌──────────────  ┐           ┌──────────────────┐
│ RDS Primary    │  Replicate │ RDS Standby      │
│ (AZ1)          │  Sync      │ (AZ2)            │
│ Writers/Readers◆────────────►Read-only         │
└──────────────  ┘           └──────────────────┘

FAILURE DETECTED (Primary AZ1 fails):
EC2 Instances (AZ2) lose connection to Primary
                    │
                    ▼
           CloudWatch Alarm
        (RDS Connection Failed)
                    │
                    ▼
        RDS Initiates Failover
        (Automatic - ~60 seconds)
                    │
                    ▼
      Standby (AZ2) Promoted to Primary
      DNS endpoint unchanged
                    │
                    ▼
      EC2 instances reconnect to new Primary
      Application continues with no code changes
                    │
                    ▼
      New Standby provisioned in AZ1
      Replication resumes
                    │
                    ▼
      System restored to full redundancy
```

---

## File Upload & Media Management

```
┌──────────────────────────────────────────────────────────────┐
│           FILE UPLOAD FLOW (Media to S3)                     │
└──────────────────────────────────────────────────────────────┘

1. USER SELECTS FILE
        │
        ▼
2. UPLOAD TO BACKEND
   POST /upload
        │
        ▼
3. BACKEND VALIDATES
   • File size < 100MB
   • File type whitelist
   • Virus scan (optional)
        │
        ▼
4. UPLOAD TO S3
   • S3 Key: messages/{room_id}/{timestamp}-{filename}
   • Tags: room_id, user_id, date
   • Server-side encryption
        │
        ▼
5. SAVE METADATA TO RDS
   • INSERT attachment record
   • Link to message
   • Store S3 key
        │
        ▼
6. RETURN S3 URL
   • Signed URL (15 min expiry)
   • CloudFront CDN cache
        │
        ▼
7. BROADCAST TO ROOM
   • Socket.io emit with file info
   • Show download link to all members
        │
        ▼
8. LIFECYCLE MANAGEMENT
   ├─ 30 days: Standard storage
   ├─ Transition to Glacier
   └─ Delete after 365 days
```

---

## Cost Estimation Timeline

```
development (Days 1-4):
├─ Low usage
├─ ~2-4 EC2 instances
└─ Estimated: $30-50

Testing Phase (Days 5-8):
├─ Load testing active
├─ Multiple instances running
└─ Estimated: $50-100

Production (Days 9+):
├─ Stable workload
├─ 2-6 instances with scaling
├─ RDS Multi-AZ
├─ CDN & monitoring
└─ Estimated: $150-300/month
```

---

## Monitoring Dashboards

### Dashboard 1: System Health
```
┌─ CPU Utilization ────────────────────────┐
│ Current: 45% | Max 24h: 78% | Avg: 52%  │
├──────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐ │
│ │ ▄▅▆▇█▇▆▅▄▄▅▆▇█▄▅▆▇█░░░░░░░░░░░░░░ │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘

┌─ Network Throughput ─────────────────────┐
│ In: 2.5 MB/s | Out: 8.2 MB/s             │
├──────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐ │
│ │ ▄▅▆▇█▇▆▅▄▄▅▆█░░░░░░░░░░░░░░░░░░░░ │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘

┌─ Active EC2 Instances ───────────────────┐
│ Current: 3 | Min: 2 | Max: 6             │
├──────────────────────────────────────────┤
│ ● AZ1: 2 instances: RUNNING              │
│ ● AZ2: 1 instance: RUNNING               │
└──────────────────────────────────────────┘
```

---
