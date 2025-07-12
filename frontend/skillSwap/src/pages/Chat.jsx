import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSend, FiArrowLeft, FiVideo, FiPhone, FiMoreVertical } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';

const Chat = () => {
  const { connectionId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(state?.user || null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('skillswap_token');

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        // Fetch messages for this connection
        const messagesResponse = await axios.get(`http://localhost:1124/api/v1/chat/${connectionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setMessages(messagesResponse.data?.data || []);

        // If user data wasn't passed in location state, fetch it
        if (!user) {
          const userId = state?.senderId || state?.receiverId;
          if (userId) {
            const userResponse = await axios.get(`http://localhost:1124/api/v1/user/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setUser(userResponse.data?.data?.user);
          }
        }
      } catch (err) {
        console.error('Error fetching chat data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [connectionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        'http://localhost:1124/api/v1/chat/send',
        {
          connectionId,
          message: newMessage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  const initiateVideoCall = () => {
    // Replace with your actual video call implementation
    // This could be a link to a video call page or initiating a WebRTC call
    console.log('Initiating video call with', user?.username);
    navigate(`/call/video/${connectionId}`, { 
      state: { 
        user,
        callType: 'video' 
      } 
    });
  };

  const initiateVoiceCall = () => {
    // Replace with your actual voice call implementation
    console.log('Initiating voice call with', user?.username);
    navigate(`/call/voice/${connectionId}`, { 
      state: { 
        user,
        callType: 'audio' 
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-4"
            onClick={() => window.history.back()}
          >
            <FiArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center">
            <img
              src={user?.profile_photo || 'https://via.placeholder.com/40'}
              alt={user?.username}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{user?.username || 'Chat'}</h2>
              <p className="text-sm text-gray-500">
                {user?.skills_offered?.join(', ')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-blue-600"
            onClick={initiateVoiceCall}
            title="Voice Call"
          >
            <FiPhone className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-blue-600"
            onClick={initiateVideoCall}
            title="Video Call"
          >
            <FiVideo className="w-5 h-5" />
          </Button>
          <Dropdown
            trigger={
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                <FiMoreVertical className="w-5 h-5" />
              </Button>
            }
            items={[
              { label: 'View Profile', onClick: () => navigate(`/profile/${user?._id}`) },
              { label: 'Block User', onClick: () => console.log('Block user') },
            ]}
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === user?._id ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === user?._id
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <p>{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === user?._id ? 'text-gray-500' : 'text-blue-100'
                  }`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="px-4"
            >
              <FiSend className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default Chat;