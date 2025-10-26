"""
Helper script to run the rubberDuck agent with proper environment loading.
This ensures LIVEKIT_URL is set correctly even in dev mode.
"""
import os
from dotenv import load_dotenv

# Force load .env before anything else
load_dotenv()

# Set LIVEKIT_URL from .env if not already set
if not os.getenv("LIVEKIT_URL"):
    print("⚠️  WARNING: LIVEKIT_URL not found in environment!")
    print("Please add it to your .env file:")
    print("LIVEKIT_URL=wss://profai-q7jis5n7.livekit.cloud")
else:
    print(f"✅ LIVEKIT_URL loaded: {os.getenv('LIVEKIT_URL')}")

# Now import and run the agent
from livekit import agents
from rubberDuck import entrypoint

if __name__ == "__main__":
    print("🚀 Starting Personalized Tutor Agent worker...")
    print("👂 Waiting for students to connect...")
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))

