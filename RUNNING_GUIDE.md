# Running Guide: Dual-Mode AI Assistant

Your app now has **TWO modes**:

## 🎥 Mode 1: Video Audio Transcription (Default)
- Video plays automatically
- `agent.py` listens to video audio
- Agent echoes back what it hears from the video

## 🦆 Mode 2: Voice Assistant (Duck Clicked)
- Video pauses
- `rubberDuck.py` listens to YOUR microphone
- Duck responds intelligently as an OCAML programming assistant

---

## Setup Instructions

### 1. Create `.env` file in `backend/` directory:

```bash
# LiveKit Cloud
LIVEKIT_URL=wss://profai-q7jis5n7.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# OpenAI (for GPT-4.1-mini LLM and Whisper STT)
OPENAI_API_KEY=your_openai_api_key

# Cartesia (for TTS)
CARTESIA_API_KEY=your_cartesia_api_key
```

### 2. Get API Keys:
- **LiveKit**: https://cloud.livekit.io/projects/profai-q7jis5n7/settings/keys
- **OpenAI**: https://platform.openai.com/api-keys (used for both LLM and Whisper STT)
- **Cartesia**: https://play.cartesia.ai/

---

## Running the App

### Option A: Test Video Transcription Mode

**Terminal 1** - Token Server:
```bash
cd backend
uv run python token_server.py
```

**Terminal 2** - Video Agent:
```bash
cd backend
uv run python agent.py dev
```

**Terminal 3** - Frontend:
```bash
cd zoom-clone
npm run dev
```

**Test**: Open http://localhost:5173 and the agent will echo what it hears from the video.

---

### Option B: Test Voice Assistant Mode (Talk to Duck)

**Terminal 1** - Token Server:
```bash
cd backend
uv run python token_server.py
```

**Terminal 2** - RubberDuck Agent:
```bash
cd backend
uv run python rubberDuck.py dev
```

**Terminal 3** - Frontend:
```bash
cd zoom-clone
npm run dev
```

**Test**: 
1. Open http://localhost:5173
2. Click the duck 🦆
3. Video pauses and duck says "I'm listening! Ask me anything..."
4. Allow microphone access
5. Talk to the duck and it will respond!

---

## How It Works

### Video Mode (Duck OFF):
```
Video Audio → LiveKit Room "video-transcription" → agent.py → Echoes back
```

### Voice Mode (Duck ON):
```
Your Microphone → LiveKit Room "voice-assistant" → rubberDuck.py → Intelligent Response
```

The frontend automatically:
- Connects to `"video-transcription"` room when duck is OFF
- Connects to `"voice-assistant"` room when duck is ON
- Pauses/plays video accordingly
- Switches between video audio capture and microphone capture

---

## Troubleshooting

### "No module named 'livekit'"
Run: `cd backend && uv sync`

### "Failed to connect to LiveKit"
1. Check token server is running on port 7860
2. Verify your `.env` file has correct LiveKit credentials

### "Agent not responding"
Make sure you're running the RIGHT agent for the mode:
- Video mode needs `agent.py`
- Duck mode needs `rubberDuck.py`

### "Microphone not working"
1. Click the duck to activate microphone mode
2. Browser will ask for microphone permission - click Allow
3. Check browser console for errors

### Both modes at once?
If you want BOTH modes to work without switching agents:
1. Run BOTH `agent.py` and `rubberDuck.py` in separate terminals
2. They will automatically join their respective rooms when the frontend connects

---

## What Each File Does

| File | Purpose |
|------|---------|
| `backend/agent.py` | Video audio transcription agent (echoes back) |
| `backend/rubberDuck.py` | Voice assistant agent (intelligent OCAML tutor) |
| `backend/token_server.py` | Generates LiveKit auth tokens |
| `zoom-clone/src/LiveKitIntegration.jsx` | Handles audio capture and LiveKit connection |
| `zoom-clone/src/App.jsx` | Main UI with duck button |

---

## Next Steps

1. Make rubberDuck smarter with custom prompts
2. Display transcriptions in the UI
3. Add conversation history
4. Show agent responses in speech bubble
5. Add voice activity detection indicators


