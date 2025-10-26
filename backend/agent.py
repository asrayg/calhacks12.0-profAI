import logging
import asyncio
from dotenv import load_dotenv
from livekit import rtc
from livekit.rtc import Track
from livekit.agents import (
    JobContext,
    WorkerOptions,
    cli,
    AutoSubscribe,
    # inference # No longer needed for STT
)
# IMPORT CHANGE: Added openai
from livekit.plugins import cartesia, openai 
from livekit.agents.stt import SpeechEvent, SpeechEventType

logger = logging.getLogger("agent")

# Ensure .env is loaded (if using solution 1)
# Or keep load_dotenv(".env.local") if using solution 2 and it's inside main block
load_dotenv() 


async def entrypoint(ctx: JobContext):
    # Connect to the room
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    logger.info("Agent connected to room")

    # Wait for the first participant to join
    participant = await ctx.wait_for_participant()
    logger.info(f"Participant connected: {participant.identity}")
    
    track = None
    
    # Check if the track is already subscribed
    for pub in participant.track_publications.values():
        if pub.kind == rtc.TrackKind.KIND_AUDIO and pub.track:
            track = pub.track
            logger.info("Audio track already subscribed")
            break
    
    # If not, wait for it to be subscribed
    if not track:
        logger.info("Waiting for participant to publish and subscribe to an audio track...")
        
        track_subscribed_event = asyncio.Event()
        
        def on_track_subscribed(subscribed_track: rtc.Track, 
                                publication: rtc.RemoteTrackPublication, 
                                subscribed_participant: rtc.RemoteParticipant):
            nonlocal track
            if subscribed_participant.sid == participant.sid:
                if publication.kind == rtc.TrackKind.KIND_AUDIO:
                    logger.info("Audio track subscribed")
                    track = subscribed_track
                    track_subscribed_event.set()

        ctx.room.on("track_subscribed", on_track_subscribed)
        await track_subscribed_event.wait() 
        
    audio_stream = rtc.AudioStream(track)
    
    # STT SETUP CHANGE: Use the openai plugin
    stt = openai.STT() # Default OpenAI STT (Whisper)
    stt_stream = stt.stream()

    # TTS Setup (unchanged)
    tts = cartesia.TTS(
        model="sonic-2" # Using default voice
    )
    # Corrected variable name from 'ts' to 'tts'
    tts_stream = tts.stream() 

    # Output audio track setup (unchanged)
    # Make sure sample rate matches TTS output if necessary
    # Cartesia sonic-2 defaults to 24000, 1 channel which matches below
    audio_source = rtc.AudioSource(24000, 1) 
    output_track = rtc.LocalAudioTrack.create_audio_track("agent_voice", audio_source)
    await ctx.room.local_participant.publish_track(output_track)
    logger.info("Agent published audio track")

    # --- Define the pipeline tasks (unchanged) ---

    async def audio_to_stt_task():
        try:
            async for audio_frame in audio_stream:
                stt_stream.push_frame(audio_frame.frame)
        except Exception as e:
            logger.error(f"Error in audio_to_stt_task: {e}")
        finally:
            stt_stream.end_input() 

    async def stt_to_tts_task():
        try:
            async for stt_event in stt_stream:
                # OpenAI STT plugin also uses SpeechEventType.FINAL_TRANSCRIPT
                if stt_event.type == SpeechEventType.FINAL_TRANSCRIPT: 
                    transcript = stt_event.alternatives[0].text
                    if transcript:
                        logger.info(f"Heard: {transcript}")
                        tts_stream.push_text(transcript + " ") 
        except Exception as e:
            logger.error(f"Error in stt_to_tts_task: {e}")
        finally:
            tts_stream.end_input()

    async def tts_to_room_task():
        logger.info("Starting tts_to_room_task: Waiting for audio frames from TTS...") # <-- Add this
        frame_count = 0 # <-- Add counter
        try:
            async for audio_frame in tts_stream:
                frame_count += 1 # <-- Increment counter
                if frame_count == 1:
                     logger.info("Received first audio frame from TTS.") # <-- Log first frame
                # Log periodically, e.g., every 50 frames, to avoid spamming
                if frame_count % 50 == 0:
                    logger.debug(f"Received TTS audio frame #{frame_count}") # <-- Log periodically

                await audio_source.capture_frame(audio_frame.frame)

            # Log if the loop finishes *without* receiving frames (if frame_count is still 0)
            if frame_count == 0:
                 logger.warning("TTS stream ended but NO audio frames were received.") # <-- Add this warning
            else:
                 logger.info(f"TTS stream ended. Received total {frame_count} audio frames.") # <-- Log total frames

        except Exception as e:
            logger.error(f"Error in tts_to_room_task: {e}", exc_info=True) # <-- Log errors with traceback
        finally:
            logger.info("tts_to_room_task finished.") # <-- Confirm task completion

    # --- Run all tasks concurrently (unchanged) ---
    try:
        await asyncio.gather(
            audio_to_stt_task(),
            stt_to_tts_task(),
            tts_to_room_task()
        )
    except Exception as e:
        logger.error(f"Main pipeline error: {e}")
    finally:
        logger.info("Pipeline finished")


if __name__ == "__main__":
    # Ensure load_dotenv() is called before cli.run_app if using .env
    load_dotenv() 
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))