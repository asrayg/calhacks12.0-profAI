from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from livekit import api
import os
from dotenv import load_dotenv
import uuid # NEW: To create unique agent identities

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/token")
async def create_token(request: Request):
    """
    Generate a LiveKit access token AND dispatch the agent.
    """
    livekit_service = None  # NEW: Define service object outside try
    try:
        body = await request.json()
        room_name = body.get("roomName", "default-room")
        participant_name = body.get("participantName", "user")
        
        # Get LiveKit credentials from environment
        api_key = os.getenv("LIVEKIT_API_KEY")
        api_secret = os.getenv("LIVEKIT_API_SECRET")
        livekit_url = os.getenv("LIVEKIT_URL", "ws://localhost:7880")
        
        if not api_key or not api_secret:
            return {
                "error": "LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set in .env file"
            }, 500
        
        # --- NEW: Dispatch Agent Logic ---
        
        # FIX: The Server SDK (LiveKitService) needs an HTTP URL,
        # not a WebSocket (ws://) URL.
        http_url = livekit_url.replace("ws://", "http://").replace("wss://", "httpss://")
        
        # NEW: Create the LiveKit service client
        livekit_service = api.LiveKitService(http_url, api_key, api_secret)
        
        # NEW: This is the missing piece.
        # This tells LiveKit to find a free agent (like your rubberDuck.py)
        # and send it to the user's room.
        agent_identity = f"ocaml-expert-{uuid.uuid4()}" # Must be unique
        print(f"🚀 Dispatching agent {agent_identity} to room {room_name}")
        await livekit_service.dispatch_agent(
            room=room_name,
            participant_identity=agent_identity,
            # participant_name="OCaml Expert" # You can optionally give it a display name
        )
        # --- End of New Logic ---

        
        # --- Existing Token Logic (For User) ---
        token = api.AccessToken(api_key, api_secret)
        token.with_identity(participant_name).with_name(participant_name).with_grants(
            api.VideoGrants(
                room_join=True,
                room=room_name,
            )
        )
        jwt_token = token.to_jwt()
        
        print(f"✅ Granting token to {participant_name} for room {room_name}")
        return {
            "token": jwt_token,
            "url": livekit_url  # React client still uses the 'ws' URL
        }
        
    except Exception as e:
        return {
            "error": f"Failed to generate token or dispatch agent: {str(e)}"
        }, 500
    finally:
        # NEW: Always close the service client to release resources
        if livekit_service:
            print("🔌 Closing LiveKit service connection")
            await livekit_service.close()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "LiveKit Token Server (with Agent Dispatch) is running"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting LiveKit Token Server on http://localhost:7860")
    print("✨ This server will now ALSO dispatch your agent.")
    print("📝 Make sure your .env file has LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and LIVEKIT_URL set")
    uvicorn.run(app, host="0.0.0.0", port=7860)


