from livekit import agents, rtc
from livekit.agents.tts import SynthesizedAudio
from livekit.plugins import cartesia
from typing import AsyncIterable

async def entrypoint(ctx: agents.JobContext):
    text_stream: AsyncIterable[str] = """A rule tree proof, also known as a derivation tree, is a visual format for proving that a statement is true using a system of formal rules. You start by writing your goal statement at the very bottom of the tree (the root). You then work upward by finding an inference rule whose conclusion matches your goal. You write the premises of that rule above your goal, creating new branches. You repeat this process for each new premise, treating it as a new sub-goal. The proof is complete when every branch of the tree ends in an axiom, which is a special rule with no premises, serving as the "leaves" of the tree. This structure provides a clear, step-by-step logical argument showing how the final goal was derived from the system's foundational truths."""
    audio_source = rtc.AudioSource(44100, 1)

    track = rtc.LocalAudioTrack.create_audio_track("agent-audio", audio_source)
    await ctx.room.local_participant.publish_track(track)

    tts = cartesia.TTS(model="sonic-english")
    tts_stream = tts.stream()

    # create a task to consume and publish audio frames
    ctx.create_task(send_audio(tts_stream))

    # push text into the stream, TTS stream will emit audio frames along with events
    # indicating sentence (or segment) boundaries.
    async for text in text_stream:
        tts_stream.push_text(text)
    tts_stream.end_input()

    async def send_audio(audio_stream: AsyncIterable[SynthesizedAudio]):
        async for a in audio_stream:
            await audio_source.capture_frame(a.audio.frame)

if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))