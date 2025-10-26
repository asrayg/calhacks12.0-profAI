# 🦆 Voice Tutor Feature - Setup & Testing Guide

## ✨ Feature Overview

You now have a **conversational AI tutor** that you can activate by clicking the duck! When activated:
- 🎬 **Video pauses automatically**
- 🎤 **Your microphone activates**
- 🦆 **AI tutor listens to your questions**
- 💬 **You get intelligent, spoken responses**
- ✅ **Click again to resume the lecture**

---

## 🚀 Quick Start (Step-by-Step)

### 1️⃣ Install Dependencies

**Frontend:**
```bash
cd zoom-clone
npm install
```
This will install the new `livekit-client` package.

**Backend:**
```bash
cd backend
uv sync
```

---

### 2️⃣ Set Up Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# LiveKit Cloud
LIVEKIT_URL=wss://profai-q7jis5n7.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# OpenAI (for GPT-4.1-mini LLM and Whisper STT)
OPENAI_API_KEY=your_openai_api_key

# Cartesia (for TTS - natural voice)
CARTESIA_API_KEY=your_cartesia_api_key
```

**Get your API keys:**
- **LiveKit**: https://cloud.livekit.io/projects/profai-q7jis5n7/settings/keys
- **OpenAI**: https://platform.openai.com/api-keys (used for both LLM and STT)
- **Cartesia**: https://play.cartesia.ai/

---

### 3️⃣ Start All Services

You need **3 terminals** running simultaneously:

#### Terminal 1: Token Server
```bash
cd backend
uv run python token_server.py
```
✅ Should show: `🚀 Starting LiveKit Token Server on http://localhost:7860`

#### Terminal 2: AI Tutor Agent
```bash
cd backend
uv run python rubberDuck.py dev
```
✅ Should show: `🚀 Starting Personalized Tutor Agent worker...`

#### Terminal 3: Frontend
```bash
cd zoom-clone
npm run dev
```
✅ Should show: `Local: http://localhost:5173`

---

## 🎯 Testing the Feature

### Step 1: Open the App
Navigate to: **http://localhost:5173**

You should see:
- ✅ Video playing automatically
- ✅ ProfAI panel on the right
- ✅ Duck icon in the bottom left area

### Step 2: Activate Voice Tutor
**Click the duck icon** 🦆

You should observe:
- ✅ Video **pauses**
- ✅ Duck glows **green** with a border
- ✅ "ACTIVE" indicator appears below the duck
- ✅ Speech bubble shows "🎤 Listening... Ask me anything!"
- ✅ Browser asks for **microphone permission** → Click "Allow"

### Step 3: Ask a Question
Speak clearly into your microphone:
- "Can you explain what functional programming is?"
- "What does the gamma type environment mean?"
- "Help me understand recursion"

### Step 4: Listen to Response
- ✅ AI tutor will **speak** the answer back to you
- ✅ Check browser console for logs like `🦆 RubberDuck is speaking!`

### Step 5: Deactivate
**Click the duck again** to resume the lecture:
- ✅ Video **resumes playing**
- ✅ Duck returns to normal state
- ✅ Microphone disconnects
- ✅ Speech bubble disappears

---

## 🔍 Troubleshooting

### Issue: "Failed to connect to RubberDuck"
**Solution:** Check that:
1. Token server is running on port 7860
2. `rubberDuck.py` agent is running
3. Your `.env` file has correct credentials

**Debug:** Check browser console (F12) for detailed error messages

---

### Issue: "Microphone not working"
**Solution:**
1. Make sure you clicked **Allow** when browser asked for mic permission
2. Check browser settings → Site permissions → Microphone
3. Verify your default microphone is working in system settings

**Test mic:** Visit https://webcammictest.com/check-mic.html

---

### Issue: "Agent not responding to my voice"
**Solution:**
1. Speak clearly and at normal volume
2. Wait 1-2 seconds after speaking (STT needs time to process)
3. Check Terminal 2 for logs like:
   ```
   🦆 Heard: [your question here]
   ```
4. Verify OpenAI API key is valid and has credits

---

### Issue: "No audio response from agent"
**Solution:**
1. Check browser console for errors
2. Verify Cartesia API key is valid
3. Check Terminal 2 for TTS-related errors
4. Make sure browser volume is not muted

---

### Issue: "Video doesn't pause"
**Solution:**
1. Check browser console for errors
2. Verify the video element loaded properly
3. Try refreshing the page

---

## 🧪 Verify System is Working

### Backend Checks:

**Terminal 1 (Token Server):**
When you click the duck, you should see:
```
🚀 Dispatching agent [unique-id] to room voice-assistant
✅ Granting token to web-user for room voice-assistant
```

**Terminal 2 (Tutor Agent):**
When you click the duck, you should see:
```
🦆 Personalized Tutor agent started! Room: voice-assistant
🦆 Starting tutor session...
🦆 Agent session started. Generating welcome greeting...
🦆 Tutor ready! Waiting for student questions...
```

When you speak, you should see:
```
🦆 Heard: [your transcribed question]
```

### Frontend Checks:

Open browser console (F12) and look for:
```
🦆 Duck activated! Connecting to voice assistant...
✅ Connected to RubberDuck agent in voice-assistant room
🎤 Starting microphone capture...
✅ Microphone audio streaming to RubberDuck!
🦆 RubberDuck is speaking!
```

---

## 💡 Usage Tips

1. **Pause at natural points**: Activate the duck during natural pauses in the lecture
2. **Be specific**: Ask clear, specific questions for best results
3. **Wait for response**: Give the AI a moment to process and respond
4. **Check your mic**: Make sure you're close enough to your microphone
5. **Internet required**: All services (STT, LLM, TTS) require internet connection

---

## 🎨 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     USER CLICKS DUCK                        │
└────────────────────────────┬────────────────────────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        ▼                                         ▼
┌───────────────┐                      ┌──────────────────┐
│  Video Pauses │                      │  duckMode: true  │
└───────────────┘                      └────────┬─────────┘
                                                │
                             ┌──────────────────┴──────────────────┐
                             ▼                                     ▼
                    ┌─────────────────┐                  ┌──────────────────┐
                    │ Request Token   │                  │  Update UI       │
                    │ from Server     │                  │  (glow, border)  │
                    └────────┬────────┘                  └──────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Connect to      │
                    │ LiveKit Room    │
                    │ "voice-assistant"│
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        ▼                                         ▼
┌──────────────────┐                    ┌───────────────────┐
│ Capture Mic      │───────────────────▶│  Agent Receives   │
│ Audio            │                    │  Audio            │
└──────────────────┘                    └─────────┬─────────┘
                                                  │
                                        ┌─────────▼─────────┐
                                        │ OpenAI Whisper    │
                                        │ Transcribes       │
                                        └─────────┬─────────┘
                                                  │
                                        ┌─────────▼─────────┐
                                        │ GPT-4.1-mini      │
                                        │ Generates Answer  │
                                        └─────────┬─────────┘
                                                  │
                                        ┌─────────▼─────────┐
                                        │ Cartesia TTS      │
                                        │ Speaks Answer     │
                                        └─────────┬─────────┘
                                                  │
┌──────────────────┐                    ┌─────────▼─────────┐
│ Browser Plays    │◀───────────────────│ Audio Sent to     │
│ Agent Audio      │                    │ Browser           │
└──────────────────┘                    └───────────────────┘
```

---

## 📁 Modified Files

| File | Changes Made |
|------|--------------|
| `zoom-clone/src/App.jsx` | ✅ Added duckMode state<br>✅ Added video pause/play logic<br>✅ Integrated LiveKitIntegration component<br>✅ Enhanced duck button UI |
| `backend/rubberDuck.py` | ✅ Updated to be a general lecture tutor<br>✅ Changed from OCaml expert to personalized assistant |
| `zoom-clone/package.json` | ✅ Added livekit-client dependency |
| `backend/token_server.py` | ✅ Already supports voice-assistant room (no changes needed) |

---

## 🎓 Next Steps

Want to enhance the feature? Consider:
1. **Display transcript in UI**: Show what the agent heard
2. **Show agent responses as text**: Display answers in the speech bubble
3. **Conversation history**: Keep track of questions asked
4. **Subject detection**: Auto-detect lecture topic and specialize tutor
5. **Lecture context**: Feed lecture transcript to tutor for better answers

---

## 🎉 You're All Set!

Click the duck, ask your question, and get instant help during your lectures!

**Need help?** Check the troubleshooting section or console logs.

