#!/bin/bash
# Installation script for Cloud Chat Project Requirements (Linux/Mac)

set -e

echo "========================================"
echo "Cloud Chat Project - Setup Script"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${YELLOW}[1/6] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"
else
    echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org${NC}"
    exit 1
fi

# Check npm
echo -e "${YELLOW}[2/6] Checking npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm ${NPM_VERSION} found${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "${YELLOW}[3/6] Installing backend dependencies...${NC}"
BACKEND_PATH="$(dirname "$0")/backend"

if [ -d "$BACKEND_PATH/node_modules" ]; then
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
else
    cd "$BACKEND_PATH"
    echo -e "${CYAN}Installing npm packages...${NC}"
    npm install --legacy-peer-deps
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    else
        echo -e "${RED}✗ Failed to install dependencies${NC}"
        exit 1
    fi
    cd - > /dev/null
fi

# Check .env file
echo -e "${YELLOW}[4/6] Checking configuration files...${NC}"
if [ -f "$BACKEND_PATH/.env" ]; then
    echo -e "${GREEN}✓ .env file found${NC}"
else
    echo -e "${YELLOW}⚠ .env file not found${NC}"
fi

# Check Git
echo -e "${YELLOW}[5/6] Checking Git...${NC}"
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓ ${GIT_VERSION} found${NC}"
else
    echo -e "${YELLOW}⚠ Git not found (optional)${NC}"
fi

# Check optional tools
echo -e "${YELLOW}[6/6] Checking optional tools...${NC}"

if command -v terraform &> /dev/null; then
    TF_VERSION=$(terraform version -json | grep -o '"terraform_version":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✓ Terraform found${NC}"
else
    echo -e "${YELLOW}⚠ Terraform not installed (needed for cloud deployment)${NC}"
    echo -e "${CYAN}  Download: https://www.terraform.io/downloads${NC}"
fi

if command -v aws &> /dev/null; then
    AWS_VERSION=$(aws --version)
    echo -e "${GREEN}✓ AWS CLI found${NC}"
else
    echo -e "${YELLOW}⚠ AWS CLI not installed (needed for AWS deployment)${NC}"
    echo -e "${CYAN}  Download: https://aws.amazon.com/cli/${NC}"
fi

# Final summary
echo ""
echo "========================================"
echo -e "${GREEN}✓ Core installation complete!${NC}"
echo "========================================"
echo ""

echo -e "${YELLOW}NEXT STEPS:${NC}"
echo ""
echo -e "${CYAN}1. Configure Backend:${NC}"
echo "   - Edit: backend/.env"
echo "   - Set DB_HOST, DB_USER, DB_PASSWORD"
echo ""

echo -e "${CYAN}2. Start Backend Server:${NC}"
echo "   - cd backend"
echo "   - npm run dev"
echo ""

echo -e "${CYAN}3. Open Frontend:${NC}"
echo "   - Open: frontend/index.html in your browser"
echo ""

echo -e "${CYAN}4. For Cloud Deployment (Optional):${NC}"
echo "   - Install Terraform: https://www.terraform.io/downloads"
echo "   - Install AWS CLI: https://aws.amazon.com/cli/"
echo "   - Configure AWS: aws configure"
echo "   - Deploy: cd cloud-infrastructure/terraform && terraform apply"
echo ""

echo -e "${CYAN}Documentation:${NC}"
echo "   - docs/QUICK_REFERENCE.md"
echo "   - docs/PROJECT_REPORT.md"
echo ""
