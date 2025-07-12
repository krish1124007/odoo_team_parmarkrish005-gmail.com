// src/pages/Call.jsx
import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FiVideo, FiPhone, FiMic, FiMicOff, FiVideoOff, FiPhoneOff } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Call = () => {
  const { callType, connectionId } = useParams();
  const { user } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting');
  // Example client-side code (React)
  const startCall = async (callType) => {
  try {
    // Initiate the call via your API
    const response = await axios.post('/api/v1/call/initiate', {
      connectionId,
      callType
    });
    
    const { callId, roomId, receiver } = response.data.data;
    
    // Initialize WebRTC
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          // Add your TURN servers if needed
        ]
      }
    });
    
    // Handle signaling
    peer.on('signal', async (data) => {
      await axios.post('/api/v1/call/signal', {
        callId,
        signal: JSON.stringify(data)
      });
    });
    
    // When call is answered
    peer.on('connect', () => {
      // Call is connected
    });
    
    // Handle stream
    peer.on('stream', (stream) => {
      // Remote stream received
      setRemoteStream(stream);
    });
    
    // Get local stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: callType === 'video',
      audio: true
    });
    
    peer.addStream(stream);
    setLocalStream(stream);
    
  } catch (error) {
    console.error('Call initiation failed', error);
  }
  };

  // WebRTC implementation would go here
  useEffect(() => {
    // Initialize call based on callType (video/voice)
    console.log(`Starting ${callType} call with ${user.data?.username}`);
    
    // Simulate call connected after 2 seconds
    const timer = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);

    return () => clearTimeout(timer);
  }, [callType, connectionId]);

  const endCall = () => {
    // End call logic
    window.history.back();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex flex-col">
      <div className="flex-1 relative">
        {/* Remote video/audio stream */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          {callType === 'video' && !isVideoOff ? (
            <div className="text-center">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-2xl">Video call with {user.data?.username}</div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">
                  {state.user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-2xl">{state.user?.username}</div>
              <div className="text-gray-400 mt-2">
                {callType === 'video' ? 'Video call' : 'Voice call'}
              </div>
            </div>
          )}
        </div>

        {/* Local video (for video calls) */}
        {callType === 'video' && (
          <div className="absolute bottom-4 right-4 w-32 h-48 bg-gray-700 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              Local Video
            </div>
          </div>
        )}
      </div>

      {/* Call controls */}
      <div className="py-6 flex justify-center space-x-6 bg-gray-800">
        <button
          className={`p-4 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-700'} hover:bg-gray-600`}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <FiMicOff size={24} /> : <FiMic size={24} />}
        </button>
        
        {callType === 'video' && (
          <button
            className={`p-4 rounded-full ${isVideoOff ? 'bg-red-600' : 'bg-gray-700'} hover:bg-gray-600`}
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? <FiVideoOff size={24} /> : <FiVideo size={24} />}
          </button>
        )}

        <button
          className="p-4 rounded-full bg-red-600 hover:bg-red-700"
          onClick={endCall}
        >
          <FiPhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};

export default Call;