import { useEffect, useRef, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';

export default function LiveKitIntegration({ 
  duckMode,     // true = connect to rubberDuck, false = do nothing
  videoRef, 
  onTranscriptUpdate 
}) {
  const [room] = useState(() => new Room());
  const [isConnected, setIsConnected] = useState(false);
  const localTrackRef = useRef(null);

  // Connect to LiveKit room ONLY when duck is clicked
  useEffect(() => {
    console.log('🔄 LiveKitIntegration useEffect triggered. duckMode:', duckMode);
    
    // If duck mode is OFF, don't connect at all
    if (!duckMode) {
      console.log('❌ Duck mode is OFF - no connection');
      if (room.state === 'connected') {
        room.disconnect();
        setIsConnected(false);
        console.log('🦆 Duck deactivated - disconnected from room');
      }
      return;
    }

    // Duck mode is ON - connect to rubberDuck agent
    const connectToRoom = async () => {
      try {
        console.log('🦆 Duck activated! Connecting to voice assistant...');
        
        // Get token for voice-assistant room
        const response = await fetch('http://localhost:7860/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            roomName: 'voice-assistant',
            participantName: 'web-user'
          })
        });
        
        const { token, url } = await response.json();
        
        // Connect to room
        await room.connect(url, token);
        setIsConnected(true);
        console.log('✅ Connected to RubberDuck agent in voice-assistant room');

        // Listen for agent's audio track
        room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          if (track.kind === 'audio' && participant.identity.includes('agent')) {
            console.log('🦆 RubberDuck is speaking!');
            const audioElement = track.attach();
            audioElement.play();
            document.body.appendChild(audioElement);
          }
        });

      } catch (error) {
        console.error('❌ Failed to connect to RubberDuck:', error);
      }
    };

    connectToRoom();

    return () => {
      if (room.state === 'connected') {
        room.disconnect();
        setIsConnected(false);
      }
    };
  }, [duckMode, room]);

  // Capture microphone ONLY when connected (duck mode ON)
  useEffect(() => {
    if (!isConnected || !duckMode) return;

    const captureMicrophone = async () => {
      try {
        console.log('🎤 Starting microphone capture...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          } 
        });
        
        const audioTrack = stream.getAudioTracks()[0];
        localTrackRef.current = await room.localParticipant.publishTrack(audioTrack);
        console.log('✅ Microphone audio streaming to RubberDuck!');
        
      } catch (error) {
        console.error('❌ Failed to capture microphone:', error);
        alert('Please allow microphone access to talk to the duck!');
      }
    };

    captureMicrophone();

    return () => {
      // Cleanup - stop microphone
      if (localTrackRef.current) {
        room.localParticipant.unpublishTrack(localTrackRef.current);
        const track = localTrackRef.current.track;
        if (track) {
          track.stop();
          console.log('🛑 Microphone stopped');
        }
      }
    };
  }, [isConnected, duckMode, room]);

  return null;
}
