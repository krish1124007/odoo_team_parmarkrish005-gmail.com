import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, MessageSquare, User, Calendar } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('received');

  // Mock data for requests
  const receivedRequests = [
    {
      id: 1,
      from: {
        name: 'Alex Kim',
        username: 'alexdev',
        avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      skillOffered: 'React Native',
      skillWanted: 'Node.js',
      message: 'Hi! I saw your profile and I think we could have a great skill swap. I can help you with React Native development, and I\'d love to learn Node.js from you.',
      status: 'pending',
      createdAt: '2 hours ago',
      proposedSchedule: 'Weekends, 2-3 hours per session'
    },
    {
      id: 2,
      from: {
        name: 'Sarah Wilson',
        username: 'sarahdesign',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      skillOffered: 'UI/UX Design',
      skillWanted: 'React',
      message: 'Hello! I\'m interested in learning React and I can offer UI/UX design skills in exchange. Would you be interested?',
      status: 'pending',
      createdAt: '1 day ago',
      proposedSchedule: 'Evenings, 1-2 hours per session'
    },
    {
      id: 3,
      from: {
        name: 'Michael Chen',
        username: 'mikecode',
        avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      skillOffered: 'Python',
      skillWanted: 'TypeScript',
      message: 'Hey! I\'m a Python developer looking to learn TypeScript. I can help you with Python in return.',
      status: 'accepted',
      createdAt: '3 days ago',
      proposedSchedule: 'Weekdays after 6 PM'
    }
  ];

  const sentRequests = [
    {
      id: 4,
      to: {
        name: 'Emma Davis',
        username: 'emmatech',
        avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      skillOffered: 'Node.js',
      skillWanted: 'iOS Development',
      message: 'Hi Emma! I\'m interested in learning iOS development and I can teach Node.js. Would you be interested in a skill swap?',
      status: 'pending',
      createdAt: '1 day ago',
      proposedSchedule: 'Weekends, flexible timing'
    },
    {
      id: 5,
      to: {
        name: 'James Rodriguez',
        username: 'jamesml',
        avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      skillOffered: 'React',
      skillWanted: 'Machine Learning',
      message: 'Hello! I\'d like to learn machine learning and I can offer React expertise in exchange.',
      status: 'declined',
      createdAt: '5 days ago',
      proposedSchedule: 'Evenings, 2 hours per session'
    },
    {
      id: 6,
      to: {
        name: 'Lisa Park',
        username: 'lisadev',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      skillOffered: 'TypeScript',
      skillWanted: 'DevOps',
      message: 'Hi Lisa! I\'m looking to learn DevOps practices and I can help with TypeScript development.',
      status: 'accepted',
      createdAt: '1 week ago',
      proposedSchedule: 'Flexible, prefer video calls'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRequestAction = (id, action) => {
    console.log(`${action} request ${id}`);
    // In a real app, this would update the request status
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Skill Swap Requests
        </h1>
        <p className="text-gray-600">
          Manage your incoming and outgoing skill swap requests
        </p>
      </div>

      {/* Tab Navigation */}
      <Card>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'received'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'sent'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {activeTab === 'received' && receivedRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="space-y-4">
                {/* Request Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <img
                      src={request.from.avatar}
                      alt={request.from.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.from.name}
                      </h3>
                      <p className="text-sm text-gray-600">@{request.from.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(request.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">{request.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skill Exchange */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">They offer:</span>
                      <div className="mt-1">
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          {request.skillOffered}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">They want to learn:</span>
                      <div className="mt-1">
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
                          {request.skillWanted}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Message:</span>
                  </div>
                  <p className="text-gray-600 pl-6">{request.message}</p>
                </div>

                {/* Proposed Schedule */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Proposed Schedule:</span>
                  </div>
                  <p className="text-gray-600 pl-6">{request.proposedSchedule}</p>
                </div>

                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleRequestAction(request.id, 'accept')}
                      size="sm"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleRequestAction(request.id, 'decline')}
                      variant="outline"
                      size="sm"
                    >
                      Decline
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                )}
                {request.status === 'accepted' && (
                  <div className="flex gap-3 pt-2">
                    <Button size="sm">
                      Schedule Session
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}

        {activeTab === 'sent' && sentRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="space-y-4">
                {/* Request Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <img
                      src={request.to.avatar}
                      alt={request.to.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.to.name}
                      </h3>
                      <p className="text-sm text-gray-600">@{request.to.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(request.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">{request.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skill Exchange */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">You offer:</span>
                      <div className="mt-1">
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          {request.skillOffered}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">You want to learn:</span>
                      <div className="mt-1">
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
                          {request.skillWanted}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Your message:</span>
                  </div>
                  <p className="text-gray-600 pl-6">{request.message}</p>
                </div>

                {/* Actions */}
                {request.status === 'accepted' && (
                  <div className="flex gap-3 pt-2">
                    <Button size="sm">
                      Schedule Session
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {((activeTab === 'received' && receivedRequests.length === 0) ||
        (activeTab === 'sent' && sentRequests.length === 0)) && (
        <Card>
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} requests
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'received'
                ? "You haven't received any skill swap requests yet."
                : "You haven't sent any skill swap requests yet."}
            </p>
            {activeTab === 'sent' && (
              <Button>
                Browse Developers
              </Button>
            )}
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default Requests;
