# 🚀 Quick Start

## ✅ Current Status
- ✅ Backend agent is running and connected to LiveKit Cloud!
- ⏳ Need to start token server
- ⏳ Need to start frontend

## Run These Commands:

### Terminal 1 (Already Running ✅)
```bash
cd backend
uv run python agent.py dev
```
**Status:** Connected to wss://profai-q7jis5n7.livekit.cloud

---

### Terminal 2: Start Token Server
```bash
cd backend
uv run python token_server.py
```
This will run on http://localhost:7860

---

### Terminal 3: Start Frontend
```bash
cd zoom-clone
npm run dev
```
Open browser to http://localhost:5173

---

## 🎯 How to Use

1. Open http://localhost:5173 in your browser
2. **Toggle ON** the switch in the ProfAI panel (right side)
3. The video audio will be sent to the agent
4. Agent transcribes and echoes it back
5. Watch transcript appear in real-time!

## 🔧 Your LiveKit Setup
- Using: **LiveKit Cloud**
- URL: `wss://profai-q7jis5n7.livekit.cloud`
- Region: US Central

That's it! 🎉


