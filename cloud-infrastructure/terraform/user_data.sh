#!/bin/bash
# User data script for EC2 instances

set -e

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install -y git

# Create application directory
sudo mkdir -p /var/www/chat-app
cd /var/www/chat-app

# Clone application code (adjust repository URL)
# sudo git clone https://your-repo-url.git .

# For now, create basic structure
sudo npm install

# Create systemd service file
sudo tee /etc/systemd/system/chat-app.service > /dev/null <<EOF
[Unit]
Description=Cloud Chat Application
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/chat-app
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=10
StandardOutput=append:/var/log/chat-app/output.log
StandardError=append:/var/log/chat-app/error.log

[Install]
WantedBy=multi-user.target
EOF

# Create log directory
sudo mkdir -p /var/log/chat-app
sudo chown ubuntu:ubuntu /var/log/chat-app

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable chat-app
sudo systemctl start chat-app

# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

echo "✅ User data script completed successfully"
