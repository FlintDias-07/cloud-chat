@echo off
REM Installation script for Cloud Chat Project Requirements

setlocal enabledelayedexpansion

echo ========================================
echo Cloud Chat Project - Setup Script
echo ========================================
echo.

REM Check Node.js
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do echo ✓ Node.js %%i found
) else (
    echo ✗ Node.js not found. Please install from https://nodejs.org
    exit /b 1
)
echo.

REM Check npm
echo [2/5] Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do echo ✓ npm %%i found
) else (
    echo ✗ npm not found
    exit /b 1
)
echo.

REM Check and install backend dependencies
echo [3/5] Installing backend dependencies...
cd /d "%~dp0\backend" 
if exist node_modules (
    echo ✓ Backend dependencies already installed
) else (
    echo Installing npm packages...
    npm install --legacy-peer-deps
    if %errorlevel% equ 0 (
        echo ✓ Backend dependencies installed
    ) else (
        echo ✗ Failed to install backend dependencies
        exit /b 1
    )
)
echo.

REM Check Git
echo [4/5] Checking Git...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('git --version') do echo ✓ %%i found
) else (
    echo ⚠ Git not found (optional). Please install from https://git-scm.com
)
echo.

REM Check Terraform
echo [5/5] Checking Terraform...
terraform --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('terraform --version') do echo ✓ %%i found
) else (
    echo ⚠ Terraform not found. Installation instructions:
    echo    1. Download: https://www.terraform.io/downloads
    echo    2. Extract to: C:\terraform\
    echo    3. Add to PATH: setx PATH "%%PATH%%;C:\terraform"
    echo    4. Restart terminal and run: terraform -version
)
echo.

REM Check AWS CLI
aws --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('aws --version') do echo ✓ %%i found
) else (
    echo ⚠ AWS CLI not found. Installation instructions:
    echo    Download and install: https://aws.amazon.com/cli/
)
echo.

echo ========================================
echo ✓ Core dependencies installed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Update backend\.env with your database credentials
echo 2. Install Terraform (if planning to deploy to AWS)
echo 3. Install AWS CLI and configure credentials
echo 4. Run: npm run dev (in backend folder)
echo 5. Open frontend\index.html in a browser
echo.
pause
