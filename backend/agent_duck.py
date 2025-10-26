from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    RunContext,
    WorkerOptions,
    cli,
    function_tool,
)
from livekit.plugins import deepgram, elevenlabs, openai, silero

@function_tool
async def explain_concept(
    context: RunContext,
    concept: str,
):
    """Explain a programming languages concept in simple terms."""
    explanations = {
        "lambda calculus": "Lambda calculus is a formal system for expressing computation using function abstraction and application. It's the foundation of functional programming languages.",
        "type inference": "Type inference is when a compiler automatically figures out the types of expressions without explicit type annotations from the programmer.",
        "recursion": "Recursion is when a function calls itself to solve smaller parts of a problem until it reaches a base case.",
    }

    return {
        "concept": concept,
        "explanation": explanations.get(concept.lower(), "That’s an interesting concept! Let’s explore it together.")
    }


async def entrypoint(ctx: JobContext):
    await ctx.connect()

    agent = Agent(
        instructions=(
            "You are Professor GPT, a knowledgeable but friendly computer science professor. "
            "You teach Principles of Programming Languages — topics like lambda calculus, "
            "type systems, recursion, functional programming, and semantics. "
            "Explain things clearly and give analogies when useful."
        ),
        tools=[explain_concept],
    )

    session = AgentSession(
        vad=silero.VAD.load(),
        stt=deepgram.STT(model="nova-3"),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=elevenlabs.TTS(),
    )

    await session.start(agent=agent, room=ctx.room)
    await session.generate_reply(instructions="greet the student and ask what topic they're curious about today")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
