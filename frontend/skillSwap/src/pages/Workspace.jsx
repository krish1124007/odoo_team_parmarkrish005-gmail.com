import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiUser, FiClock, FiMapPin, FiGithub } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';


const Workspace = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('skillswap_token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuccessRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:1124/api/v1/user/allsuccessrequest', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        const data = response.data?.data?.data;
        
        // Combine and normalize all connections
        const normalizedConnections = [
          ...(data?.allSendSuccess || []).map(req => ({
            ...req,
            type: 'sent',
            user: req.receiver,
            date: req.createdAt
          })),
          ...(data?.allReciveRequest || []).map(req => ({
            ...req,
            type: 'received',
            user: req.sender,
            date: req.createdAt
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setConnections(normalizedConnections);
      } catch (err) {
        console.error('Error fetching success requests', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessRequests();
  }, []);

  const handleChatClick = (user, connectionId) => {
    navigate(`/chat/${connectionId}`, {
      state: { user }
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
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Connections</h1>
        <p className="mt-2 text-gray-600">Manage your skill swap connections and start chatting</p>
      </div>

      {connections.length === 0 ? (
        <EmptyState 
          title="No connections yet"
          description="Once you have accepted or sent connection requests, they will appear here."
          icon={<FiUser className="w-10 h-10 text-gray-400" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <Card 
              key={connection._id} 
              className="p-6 hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleChatClick(connection.user, connection._id)}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={connection.user?.profile_photo || 'https://via.placeholder.com/40'}
                    alt={connection.user?.username}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {connection.user?.username || 'Unknown User'}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      connection.type === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {connection.type === 'sent' ? 'You connected' : 'Connected with you'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {connection.user?.skills_offered?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Offers</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {connection.user.skills_offered.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {connection.user?.skills_wanted?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Wants</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {connection.user.skills_wanted.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="mr-1.5" />
                    <span>{new Date(connection.date).toLocaleDateString()}</span>
                  </div>

                  {connection.user?.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <FiMapPin className="mr-1.5" />
                      <span>{connection.user.location}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChatClick(connection.user, connection._id);
                    }}
                  >
                    <FiMessageSquare className="mr-2" />
                    Chat
                  </Button>

                  {connection.user?.github_profile && (
                    <a 
                      href={connection.user.github_profile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiGithub className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Workspace;