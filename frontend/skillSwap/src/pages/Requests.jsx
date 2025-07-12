import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  Calendar,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import React, { useEffect, useState } from 'react';
import {
  getReceivedSwapRequests,
  getSentSwapRequests,
} from '../api/swapRequests';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const [receivedData, sentData] = await Promise.all([
          getReceivedSwapRequests(),
          getSentSwapRequests(),
        ]);
        setReceivedRequests(receivedData);
        setSentRequests(sentData);
      } catch (err) {
        console.error('Error loading requests', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

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
    // TODO: call accept/decline API
  };

  if (loading) return <p>Loading...</p>;

  const requestsToShow =
    activeTab === 'received' ? receivedRequests : sentRequests;

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

      {/* Tabs */}
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
        {requestsToShow.map((request, index) => {
          const user =
            activeTab === 'received' ? request.sender : request.receiver;

          const skillLabel =
            activeTab === 'received'
              ? ['They offer', 'They want to learn']
              : ['You offer', 'You want to learn'];

          return (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={user?.profile_photo || '/default-avatar.png'}
                      alt={user?.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {user?.username}
                      </h3>
                      <p className="text-sm text-gray-600">@{user?.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(request.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">
                          {skillLabel[0]}:
                        </span>
                        <div className="mt-1">
                          <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            {request.skillOffered}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          {skillLabel[1]}:
                        </span>
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
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Message:
                      </span>
                    </div>
                    <p className="text-gray-600 pl-6">{request.message}</p>
                  </div>

                  {/* Schedule */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Proposed Schedule:
                      </span>
                    </div>
                    <p className="text-gray-600 pl-6">
                      {request.proposedSchedule}
                    </p>
                  </div>

                  {/* Actions */}
                  {activeTab === 'received' && request.status === 'pending' && (
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() =>
                          handleRequestAction(request._id, 'accept')
                        }
                        size="sm"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() =>
                          handleRequestAction(request._id, 'decline')
                        }
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
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {requestsToShow.length === 0 && (
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
            {activeTab === 'sent' && <Button>Browse Developers</Button>}
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default Requests;
