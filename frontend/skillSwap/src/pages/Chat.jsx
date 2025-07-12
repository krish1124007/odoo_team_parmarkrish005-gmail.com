import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiSend, FiArrowLeft, FiVideo, FiPhone,
  FiMoreVertical, FiCheck, FiCheckCircle
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import { formatDistanceToNow } from 'date-fns';

const Chat = () => {
  const { connectionId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(state?.user || null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('skillswap_token');

  const currentUser = JSON.parse(localStorage.getItem('skillswap_user'));
  let pollingTimer;

  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? 'Just now' : formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  const fetchChatData = async () => {
    try {
      const res = await axios.get(`http://localhost:1124/api/v1/chat/${connectionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const receivedMessages = Array.isArray(res.data?.data?.messages)
        ? res.data.data.messages
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setMessages(prev => {
        const allIds = new Set(prev.map(m => m._id));
        const newOnes = receivedMessages.filter(m => !allIds.has(m._id));
        return [...prev, ...newOnes].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      });
    } catch (err) {
      console.error('Polling fetch failed', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchChatData();
      setLoading(false);
    };

    init();
    pollingTimer = setInterval(fetchChatData, 10000);
    return () => clearInterval(pollingTimer);
  }, [connectionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempId = Date.now();
    const tempMessage = {
      _id: tempId,
      connectionId,
      sender: currentUser?.data?._id,
      message: newMessage,
      createdAt: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    try {
      const res = await axios.post('http://localhost:1124/api/v1/chat/send', {
        connectionId,
        message: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev =>
        prev.map(msg => (msg._id === tempId ? res.data.data : msg))
      );
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <motion.div className="max-w-3xl mx-auto px-4 py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Button onClick={() => navigate(-1)} variant="ghost"><FiArrowLeft /></Button>
          <img src={user?.profile_photo} alt="" className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="font-bold">{user?.username}</h2>
            <p className="text-sm text-gray-500">{user?.skills_offered?.join(', ')}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost"><FiPhone /></Button>
          <Button variant="ghost"><FiVideo /></Button>
          <Dropdown trigger={<FiMoreVertical />} items={[{ label: 'View Profile', onClick: () => {} }]} />
        </div>
      </div>

      <Card className="h-96 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center">Start the conversation</div>
        ) : (
          messages.map(msg => (
            <div key={msg._id} className={`flex ${msg.sender === currentUser?.data?._id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === currentUser?.data?._id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}>
                <p>{msg.message}</p>
                <div className="flex items-center justify-end text-xs mt-1 space-x-1">
                  <span>{formatMessageTime(msg.createdAt)}</span>
                  {msg.sender === currentUser?.data?._id && (msg.read ? <FiCheckCircle /> : <FiCheck />)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </Card>

      <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2"
        />
        <Button type="submit" variant="primary" disabled={!newMessage.trim()}>
          <FiSend />
        </Button>
      </form>
    </motion.div>
  );
};

export default Chat;