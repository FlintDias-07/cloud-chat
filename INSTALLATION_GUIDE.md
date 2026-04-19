# INSTALLATION_GUIDE.md - Step-by-Step Setup

## Installation Status Summary

| Component | Status | Version | Notes |
|-----------|--------|---------|-------|
| Node.js | ✅ Installed | v22.14.0 | Ready to use |
| npm | ✅ Installed | 11.6.1 | Ready to use |
| Backend Dependencies | ✅ Installed | - | 435 packages installed |
| .env Configuration | ✅ Created | - | Ready for customization |
| Terraform | ⚠️ Not Installed | - | Optional, needed for AWS |
| AWS CLI | ⚠️ Not Installed | - | Optional, needed for AWS |
| Git | ⏳ Check status | - | Recommended |

---

## Completed: Core Installation ✅

### What Was Installed
1. **Backend Dependencies** (435 npm packages)
   - Express.js web framework
   - Socket.io real-time communication
   - MySQL driver for database
   - JWT authentication
   - AWS SDK integration
   - All other required packages

2. **Configuration File (.env)**
   - Created with example values
   - Ready for customization
   - Location: `backend/.env`

### Verification
```bash
cd backend
npm ls --depth=0
```

### What This Means
✅ You can now:
- Run the backend server
- Use Socket.io for real-time messaging
- Connect to databases
- Test the chat application locally

---

## Step 1: Backend Configuration (REQUIRED for testing)

### 1.1 Update Environment Variables

Edit `backend/.env`:

```bash
# For LOCAL TESTING (no database needed yet)
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=password
DB_NAME=chat_db
FRONTEND_URL=http://localhost:8000
JWT_SECRET=your-dev-secret-key-change-me
```

**For AWS Deployment:**
```bash
# Your AWS credentials here
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=chat-app-media-xxxxx
```

---

## Step 2: Verify Backend Installation ✅

### 2.1 Check npm Packages

```bash
cd backend
npm ls --depth=0
```

Expected output:
```
cloud-chat-backend@1.0.0
├── aws-sdk@2.1400.0
├── bcryptjs@2.4.3
├── cors@2.8.5
├── dotenv@16.0.3
├── express@4.18.2
├── jsonwebtoken@9.0.0
├── mysql2@3.6.0
└── socket.io@4.5.4
```

### 2.2 Test Server Startup

```bash
cd backend
npm run dev
```

Expected output:
```
> cloud-chat-backend@1.0.0 dev
> nodemon src/server.js

[nodemon] 3.0.1
[nodemon] to restart at any time, type `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,json
🚀 Server running on port 3000
✅ Database connected successfully
```

**Note**: Database connection error is expected without MySQL setup (continue to next step)

---

## Step 3: Optional - Install Additional Tools

### 3.1 Git (Recommended)

**Status**: Check with `git --version`

#### Windows
```powershell
# Option 1: Download installer
# https://git-scm.com/download/win

# Option 2: Chocolatey
choco install git
```

#### macOS
```bash
brew install git
```

#### Linux
```bash
sudo apt-get install git
```

### 3.2 Docker (Optional - for local MySQL)

**Purpose**: Run MySQL database locally without manual setup

#### Windows
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Install and run Docker
3. Verify: `docker --version`

#### Start Local MySQL with Docker
```bash
# Pull MySQL image
docker pull mysql:8.0

# Run MySQL container
docker run --name chat-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=chat_db \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=password \
  -p 3306:3306 \
  -d mysql:8.0

# Test connection
docker exec chat-mysql mysql -u admin -ppassword -e "SELECT 1"
```

---

## Step 4: Cloud Deployment Setup (Optional)

### 4.1 Install Terraform

**For AWS Infrastructure Deployment**

#### Windows (PowerShell)
```powershell
# Option 1: Direct download
# 1. Go to https://www.terraform.io/downloads
# 2. Download terraform_*_windows_amd64.zip
# 3. Extract to C:\terraform\
# 4. Add to PATH
setx PATH "$env:PATH;C:\terraform"

# Option 2: Chocolatey
choco install terraform

# Verify
terraform --version
```

#### macOS
```bash
# Homebrew
brew install terraform

# Verify
terraform --version
```

#### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform

# Verify
terraform --version
```

### 4.2 Install AWS CLI v2

**For AWS Account Management**

#### Windows (PowerShell)
```powershell
# Option 1: MSI Installer
# 1. Download: https://awscli.amazonaws.com/AWSCLIV2.msi
# 2. Run installer
# 3. Restart terminal

# Option 2: Chocolatey
choco install awscli

# Verify
aws --version
```

#### macOS
```bash
# Via curl
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Or Homebrew
brew install awscli

# Verify
aws --version
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install awscli

# Or manual
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify
aws --version
```

### 4.3 Configure AWS Credentials

```bash
# Interactive setup
aws configure

# You'll be prompted for:
# AWS Access Key ID: [your-key]
# AWS Secret Access Key: [your-secret]
# Default region: us-east-1
# Default output format: json

# Verify configuration
aws sts get-caller-identity
```

**Expected output:**
```json
{
    "UserId": "AIDAI...",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

---

## Step 5: Ready to Run! 🚀

### 5.1 Start Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3000`

### 5.2 Open Frontend

Option 1: Direct file
```bash
# Simply open in browser:
file:///path/to/Cloud_project/frontend/index.html
```

Option 2: Local HTTP server
```bash
cd frontend
python -m http.server 8000
# Open: http://localhost:8000
```

### 5.3 Test Chat Application

1. Open `http://localhost:8000` in browser
2. Enter username
3. Click "Join Chat"
4. Send message
5. Open another tab and repeat (different browser tab = different user)
6. Verify messages appear in real-time

---

## Step 6: Deploy to AWS (Optional)

### 6.1 Initialize Terraform

```bash
cd cloud-infrastructure/terraform

# Download provider plugins
terraform init

# View what will be created
terraform plan

# Create infrastructure
terraform apply

# View outputs (including ALB DNS)
terraform output
```

### 6.2 Get Application URL

After deployment:
```bash
# Get load balancer DNS
terraform output app_url

# Example output:
# app_url = "http://chat-alb-123456789.us-east-1.elb.amazonaws.com"
```

---

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 3000 is available
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# If occupied, either:
# 1. Kill the process
# 2. Change PORT in .env file
```

### npm Install Fails
```bash
# Clear cache and retry
npm cache clean --force
cd backend
npm install --legacy-peer-deps
```

### Terraform Not Found
```bash
# Add to PATH
echo $PATH  # Check current PATH

# Verify installation
terraform --version

# If still not found:
# 1. Ensure installed to correct location
# 2. Restart terminal
# 3. Check PATH environment variable
```

### AWS Credentials Not Working
```bash
# Verify credentials are set
aws sts get-caller-identity

# Reconfigure if needed
aws configure

# Check credentials file
cat ~/.aws/credentials  # macOS/Linux
type %USERPROFILE%\.aws\credentials  # Windows
```

---

## Installation Summary

### ✅ COMPLETED
- [x] Node.js v22.14.0
- [x] npm 11.6.1
- [x] Backend dependencies (435 packages)
- [x] .env configuration file
- [x] Project structure validated

### 🔄 NEXT STEPS
1. [ ] Start backend: `npm run dev`
2. [ ] Open frontend: `http://localhost:8000`
3. [ ] Test chat application
4. [ ] (Optional) Install Terraform & AWS CLI
5. [ ] (Optional) Deploy to AWS with Terraform

### 📚 Documentation
- See `docs/QUICK_REFERENCE.md` for common commands
- See `docs/PROJECT_REPORT.md` for architecture details
- See `REQUIREMENTS.md` for dependency information

---

## Support

**If you encounter issues:**
1. Check REQUIREMENTS.md for system requirements
2. Run setup verification: `.\setup.ps1` (Windows) or `./setup.sh` (Mac/Linux)
3. Review troubleshooting section above
4. Check project documentation in `/docs`

**Common Commands:**
```bash
# Backend
cd backend
npm run dev          # Start development server
npm test             # Run tests
npm start            # Production server
npm run dev          # With auto-reload (nodemon)

# Frontend
cd frontend
python -m http.server 8000  # Serve on localhost:8000

# Terraform (AWS deployment)
cd cloud-infrastructure/terraform
terraform init       # Initialize
terraform plan       # Preview changes
terraform apply      # Deploy
terraform destroy    # Clean up
```

---

**Installation Date**: April 16, 2026
**Status**: ✅ Ready for Development
**Next Action**: Start backend server and test chat application
