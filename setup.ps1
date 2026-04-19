# Installation script for Cloud Chat Project Requirements (PowerShell)

Write-Host "========================================"
Write-Host "Cloud Chat Project - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "[1/6] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "[2/6] Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm $npmVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "[3/6] Installing backend dependencies..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
if (Test-Path "$backendPath\node_modules") {
    Write-Host "✓ Backend dependencies already installed" -ForegroundColor Green
} else {
    Set-Location $backendPath
    Write-Host "Installing npm packages..." -ForegroundColor Cyan
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
}

# Create .env if not exists
Write-Host "[4/6] Checking configuration files..." -ForegroundColor Yellow
$envFile = Join-Path $backendPath ".env"
if (Test-Path $envFile) {
    Write-Host "✓ .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠ .env file not found" -ForegroundColor Yellow
}

# Check Git
Write-Host "[5/6] Checking Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ $gitVersion found" -ForegroundColor Green
} catch {
    Write-Host "⚠ Git not found (optional)" -ForegroundColor Yellow
}

# Check additional tools
Write-Host "[6/6] Checking optional tools..." -ForegroundColor Yellow

# Terraform
try {
    $tfVersion = terraform --version 2>$null | Select-Object -First 1
    Write-Host "✓ Terraform found" -ForegroundColor Green
} catch {
    Write-Host "⚠ Terraform not installed (needed for cloud deployment)" -ForegroundColor Yellow
    Write-Host "  Download: https://www.terraform.io/downloads" -ForegroundColor Gray
}

# AWS CLI
try {
    $awsVersion = aws --version 2>$null
    Write-Host "✓ AWS CLI found" -ForegroundColor Green
} catch {
    Write-Host "⚠ AWS CLI not installed (needed for AWS deployment)" -ForegroundColor Yellow
    Write-Host "  Download: https://aws.amazon.com/cli/" -ForegroundColor Gray
}

# Final summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Core installation complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure Backend:" -ForegroundColor Cyan
Write-Host "   - Edit: backend\.env" -ForegroundColor Gray
Write-Host "   - Set DB_HOST, DB_USER, DB_PASSWORD" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Start Backend Server:" -ForegroundColor Cyan
Write-Host "   - cd backend" -ForegroundColor Gray
Write-Host "   - npm run dev" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Open Frontend:" -ForegroundColor Cyan
Write-Host "   - Open: frontend\index.html in your browser" -ForegroundColor Gray
Write-Host ""

Write-Host "4. For Cloud Deployment (Optional):" -ForegroundColor Cyan
Write-Host "   - Install Terraform: https://www.terraform.io/downloads" -ForegroundColor Gray
Write-Host "   - Install AWS CLI: https://aws.amazon.com/cli/" -ForegroundColor Gray
Write-Host "   - Configure AWS: aws configure" -ForegroundColor Gray
Write-Host "   - Deploy: cd cloud-infrastructure\terraform && terraform apply" -ForegroundColor Gray
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "   - docs\QUICK_REFERENCE.md" -ForegroundColor Gray
Write-Host "   - docs\PROJECT_REPORT.md" -ForegroundColor Gray
Write-Host ""
