# QUICK_START.md - Get Running in 5 Minutes ⚡

## 🟢 READY TO START! ✅

Your project is **fully configured and ready to run**.

---

## ⚡ Quick Start (Backend + Frontend)

### Step 1: Start Backend Server (Terminal 1)

```bash
cd backend
npm run dev
```

**Expected Output:**
```
> cloud-chat-backend@1.0.0 dev
> nodemon src/server.js

[nodemon] 3.0.1
🚀 Server running on port 3000
```

✅ Server is now running at `http://localhost:3000`

### Step 2: Serve Frontend (Terminal 2)

```bash
cd frontend
python -m http.server 8000
```

**Expected Output:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

✅ Frontend is now available at `http://localhost:8000`

### Step 3: Open in Browser

Open your browser and go to:
```
http://localhost:8000
```

### Step 4: Test Chat Application

1. **First Tab**:
   - Enter username: "User1"
   - Click "Join Chat"
   - Type a message and send

2. **Second Tab** (same browser):
   - Enter username: "User2"
   - Click "Join Chat"
   - See "User1"'s message appear
   - Type a response

✅ **Real-time chat is working!**

---

## 📋 Common Commands

### Backend Development
```bash
cd backend

# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Run tests
npm test

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Frontend
```bash
cd frontend

# Simple HTTP server
python -m http.server 8000

# Or with Node.js (if no Python)
npx http-server -p 8000
```

### Database (optional - with Docker)
```bash
# Start local MySQL
docker run --name chat-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=chat_db \
  -p 3306:3306 \
  -d mysql:8.0

# Connect from backend (update .env with credentials above)
```

---

## 🔧 Configuration

### Backend Environment Variables
File: `backend/.env`

**For Local Testing (default):**
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=password
DB_NAME=chat_db
FRONTEND_URL=http://localhost:8000
JWT_SECRET=dev-secret-key
```

**Change any settings in the .env file and restart the server.**

---

## ✅ Health Check

Verify all installations are working:

**Windows (PowerShell):**
```powershell
.\health-check.ps1
```

**macOS/Linux (Bash):**
```bash
chmod +x health-check.sh
./health-check.sh
```

**Expected Output:**
```
✓ Node.js v22.14.0
✓ npm 11.6.1
✓ Backend Packages (435 packages installed)
✓ .env File found
✓ Project Structure complete
```

---

## 🌐 Access Points

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | http://localhost:8000 | Chat UI |
| Backend API | http://localhost:3000 | WebSocket & REST API |
| Health Check | http://localhost:3000/health | Check server status |

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Or simply change PORT in backend/.env and restart
```

### npm Install Issues
```bash
cd backend
npm cache clean --force
npm install --legacy-peer-deps
```

### Backend Won't Connect
- Check .env file has correct values
- Ensure frontend URL matches in .env
- Check browser console for errors (F12)

### Messages Not Appearing
- Refresh browser page
- Check backend console for errors
- Verify ports 3000 and 8000 are accessible

---

## 📚 Full Documentation

For complete setup and deployment instructions, see:

| File | Purpose |
|------|---------|
| `INSTALLATION_GUIDE.md` | Complete step-by-step setup |
| `REQUIREMENTS.md` | System requirements and dependencies |
| `docs/QUICK_REFERENCE.md` | Commands and AWS endpoints |
| `docs/PROJECT_REPORT.md` | Complete project architecture |
| `docs/IMPLEMENTATION_PLAN.md` | Development timeline (12 days) |

---

## 🚀 Next Steps

### For Continued Development
1. Modify `frontend/assets/app.js` for UI changes
2. Modify `backend/src/server.js` for backend logic
3. Update database schema in `database/schema.sql`
4. Test with `npm test` in backend folder

### For AWS Deployment (Optional)
1. Install Terraform: See `REQUIREMENTS.md`
2. Install AWS CLI: See `REQUIREMENTS.md`
3. Run: `cd cloud-infrastructure/terraform && terraform apply`
4. See `docs/QUICK_REFERENCE.md` for AWS commands

### For Learning
- Backend: Socket.io documentation at socket.io/docs
- Frontend: HTML/CSS/JavaScript tutorials
- Cloud: AWS tutorials and Terraform docs
- Database: MySQL documentation

---

## 📊 Project Status

✅ **Installation Status**: COMPLETE
- Node.js: Installed
- npm: Installed
- Backend Dependencies: 435 packages installed
- Configuration: Ready
- Frontend: Ready
- Database Schema: Ready (SQL provided)

🔄 **Next Phase**: Start development!

---

## 💡 Pro Tips

1. **Use two terminals** - One for backend, one for frontend
2. **Keep browser DevTools open** - Press F12 to see console messages
3. **Check .env before each feature** - Different environments need different configs
4. **Watch backend console** - Errors appear in backend terminal
5. **Use browser DevTools** - Network tab shows WebSocket connections

---

## ❓ Need Help?

1. **Check logs**: Look at backend console for error messages
2. **Health Check**: Run `.\health-check.ps1` to verify installations
3. **Read REQUIREMENTS.md**: Detailed dependency information
4. **Check documentation**: All docs in `/docs` folder

---

## 🎉 You're All Set!

Your cloud chat application is ready to run. Just:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && python -m http.server 8000

# Browser
Open http://localhost:8000
```

**Happy coding!** 🚀

---

**Created**: April 16, 2026
**Status**: ✅ Ready to Run
**Time to First Message**: ~2 minutes
