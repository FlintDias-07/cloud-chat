# REQUIREMENTS.md - Dependencies & System Requirements

## System Requirements

| Component | Minimum | Recommended | Notes |
|-----------|---------|-------------|-------|
| **OS** | Windows 10 / macOS 10.14 / Ubuntu 20.04 | Windows 11 / macOS 12+ / Ubuntu 22.04 | Any 64-bit OS |
| **RAM** | 4 GB | 8 GB | For development with Docker |
| **CPU** | 2 cores | 4 cores | For load testing |
| **Disk** | 10 GB | 25 GB | Includes AWS tools and databases |
| **Internet** | Required | 10+ Mbps | For AWS deployment |

---

## Core Prerequisites (REQUIRED)

### 1. Node.js & npm
- **Purpose**: Backend runtime, package management
- **Required Version**: 16.x, 18.x, 20.x
- **Current Version in Project**: v22.14.0 ✓ (Already installed)
- **Includes**: npm, npx

**Status**: ✅ **INSTALLED**
```bash
node --version  # v22.14.0
npm --version   # 11.6.1
```

### 2. Git (Recommended but Optional)
- **Purpose**: Version control
- **Required Version**: 2.20+
- **Installation**:
  - **Windows**: https://git-scm.com/download/win
  - **macOS**: `brew install git`
  - **Linux**: `sudo apt-get install git`

---

## Backend Dependencies

All backend npm packages are defined in `backend/package.json`:

```
express@4.18.2            - Web framework
socket.io@4.5.4          - Real-time communication
mysql2@3.6.0             - MySQL database driver
dotenv@16.0.3            - Environment variables
cors@2.8.5               - CORS middleware
bcryptjs@2.4.3           - Password hashing
jsonwebtoken@9.0.0       - JWT authentication
aws-sdk@2.1400.0         - AWS service integration
```

**Status**: ✅ **INSTALLED**
```bash
cd backend
npm install  # Already completed (435 packages installed)
```

### Install Command
```bash
cd backend
npm install --legacy-peer-deps
```

### Verify Installation
```bash
npm ls --depth=0
```

---

## Cloud Deployment Tools (OPTIONAL - for AWS deployment)

### 1. Terraform
- **Purpose**: Infrastructure as Code, AWS resource provisioning
- **Required Version**: 1.0+
- **Installation**:

#### Windows - Method 1: Direct Download
1. Download from: https://www.terraform.io/downloads
2. Extract to: `C:\terraform\`
3. Add to PATH:
   ```powershell
   setx PATH "%PATH%;C:\terraform"
   ```
4. Restart terminal and verify:
   ```bash
   terraform --version
   ```

#### Windows - Method 2: Chocolatey
```powershell
choco install terraform
# Verify
terraform --version
```

#### macOS
```bash
brew install terraform
# Verify
terraform --version
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform
# Verify
terraform --version
```

**Status**: ⚠️ **NOT INSTALLED** (Optional for AWS deployment)

---

### 2. AWS CLI v2
- **Purpose**: AWS account management, resource provisioning, authentication
- **Required Version**: 2.0+
- **Installation**:

#### Windows - Method 1: MSI Installer
1. Download: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Run installer
3. Verify:
   ```powershell
   aws --version
   ```

#### Windows - Method 2: Chocolatey
```powershell
choco install awscli
# Verify
aws --version
```

#### macOS
```bash
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
# Verify
aws --version
```

#### Linux (Ubuntu/Debian)
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
# Verify
aws --version
```

**Status**: ⚠️ **NOT INSTALLED** (Optional for AWS deployment)

---

### 3. AWS Account & Credentials
- **Purpose**: Authorization for AWS resource creation
- **Required**: AWS Account with active payment method
- **Configuration**:
  ```bash
  aws configure
  # Enter:
  # - AWS Access Key ID
  # - AWS Secret Access Key
  # - Default region (us-east-1)
  # - Default output format (json)
  ```

**Status**: ⚠️ **NOT CONFIGURED**

---

## Database Tools (Optional - for local development)

### MySQL Client (Local Development)
- **Purpose**: Connect to local MySQL database
- **Installation**:

#### Windows
1. Download MySQL Community Server: https://dev.mysql.com/downloads/mysql/
2. Or use: `choco install mysql`

#### macOS
```bash
brew install mysql-client
```

#### Linux
```bash
sudo apt-get install mysql-client
```

**Status**: Not required for initial development

---

## Optional Development Tools

### 1. Postman / Insomnia
- **Purpose**: API testing
- **Download**: https://www.postman.com/ or https://insomnia.rest/

### 2. Docker & Docker Compose
- **Purpose**: Containerization and local database
- **Download**: https://www.docker.com/products/docker-desktop
- **Use Case**: Run MySQL locally without manual installation

### 3. VS Code Extensions (Recommended)
- REST Client
- Terraform
- AWS Toolkit
- Thunder Client
- Live Server

---

## Development Environment Setup

### 1. Backend Environment Variables
Create `backend/.env`:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=chat_db
FRONTEND_URL=http://localhost:8000
AWS_REGION=us-east-1
JWT_SECRET=your-secret-key
```

**Status**: ✅ **CREATED**

### 2. Project Structure Verification
```
Cloud_project/
├── backend/
│   ├── src/
│   │   └── server.js
│   ├── node_modules/          ✓ Installed
│   ├── package.json
│   ├── package-lock.json
│   └── .env                   ✓ Created
├── frontend/
│   ├── index.html
│   └── assets/
├── cloud-infrastructure/
│   └── terraform/
├── database/
│   └── schema.sql
└── docs/
```

---

## Installation Checklist

### Phase 1: Core Setup (Required) ✅
- [x] Node.js 18+ installed
- [x] npm 8+ installed
- [x] Backend dependencies installed (npm install)
- [x] .env file created

### Phase 2: Development (Optional but Recommended)
- [ ] Git installed and configured
- [ ] MySQL client installed (for database testing)
- [ ] Postman/Insomnia installed (for API testing)
- [ ] VS Code extensions installed

### Phase 3: Cloud Deployment (Optional)
- [ ] Terraform installed
- [ ] AWS CLI v2 installed
- [ ] AWS account created
- [ ] AWS credentials configured
- [ ] Terraform state bucket created

---

## Troubleshooting

### Issue: npm install fails
**Solution**:
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

### Issue: Port 3000 already in use
**Solution**:
```bash
# Find process using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # macOS/Linux

# Or change PORT in .env
```

### Issue: Cannot find terraform command
**Solution**:
1. Download from terraform.io/downloads
2. Add to PATH environment variable
3. Restart terminal

### Issue: AWS CLI not found
**Solution**:
1. Download AWS CLI v2 installer
2. Run installer and restart terminal
3. Configure: `aws configure`

---

## Quick Verification

Run the setup script:

**Windows (PowerShell)**:
```powershell
.\setup.ps1
```

**Windows (Batch)**:
```cmd
setup.bat
```

**macOS/Linux**:
```bash
chmod +x setup.sh
./setup.sh
```

---

## Next Steps

1. ✅ **Core Setup Complete** - You have Node.js, npm, and all backend dependencies
2. 🚀 **Run Backend**: `cd backend && npm run dev`
3. 🌐 **Open Frontend**: Open `frontend/index.html` in browser
4. ☁️ **For AWS Deployment**: Install Terraform and AWS CLI (optional)

---

## Support Resources

- Node.js Docs: https://nodejs.org/docs/
- Express.js Docs: https://expressjs.com/
- Socket.io Docs: https://socket.io/docs/
- Terraform Docs: https://www.terraform.io/docs/
- AWS Docs: https://docs.aws.amazon.com/

---

**Last Updated**: April 2026
**Project Status**: Ready for development ✅
