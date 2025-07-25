import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, MapPin, Github } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import axios from 'axios';
import UserProfilePopup from '../components/UserProfilePopup';

const Home = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const token = localStorage.getItem('skillswap_token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = token
          ? 'http://localhost:1124/api/v1/user/getalluser'
          : 'http://localhost:1124/api/v1/user/getalluser-notlogin';

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(url, { headers });
        const users = response.data.data.data;
        setSuggestions(
          token && user?.data?._id
            ? users.filter((u) => u._id !== user.data._id)
            : users
        );
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token, user]);

  const sendSwapRequest = async (receiverId, message) => {
    try {
      const response = await axios.post(
        'http://localhost:1124/api/v1/user/sendswaprequest',
        { receiverId, message: message || '' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Swap request sent!');
      return response.data;
    } catch (error) {
      console.error('Error sending swap request:', error.response?.data || error.message);
      alert('Failed to send swap request');
    }
  };

  const recentActivity = [
    { id: 1, type: 'request_received', user: 'Alex Kim', skill: 'React Native', time: '2 hours ago' },
    { id: 2, type: 'session_completed', user: 'Jamie Wilson', skill: 'Python', time: '1 day ago' },
    { id: 3, type: 'new_match', user: 'Taylor Brown', skill: 'GraphQL', time: '2 days ago' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Welcome back, {user?.data?.username || user?.data?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-blue-100 mb-4">
          You have 3 new skill swap opportunities and 2 pending requests.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary" size="sm">View Requests</Button>
          <Button variant="outline" size="sm" className="border-white text-black hover:bg-white hover:text-blue-600">Browse Skills</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Skill Swaps</h2>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <motion.div key={suggestion._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 cursor-pointer" onClick={() => setSelectedUserId(suggestion._id)}>
                        <img src={suggestion.profile_photo} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-medium text-gray-900">{suggestion.username}</h3>
                            <span className="text-sm text-gray-500">@{suggestion.username}</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{suggestion.rating || 5}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {suggestion.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {suggestion.availability?.[0] || 'Flexible'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm text-gray-500">Offers: </span>
                              <div className="inline-flex flex-wrap gap-1">
                                {suggestion.skills_offered.map((skill, i) => (
                                  <span key={i} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{skill}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Wants: </span>
                              <div className="inline-flex flex-wrap gap-1">
                                {suggestion.skills_wanted.map((skill, i) => (
                                  <span key={i} className="inline-block px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">{skill}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-sm font-medium text-blue-600">{suggestion.matchScore || 50}% match</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline"><Github className="h-4 w-4" /></Button>
                          {suggestion.userConnect?.status === 'pending' ? (
                            <Button size="sm" disabled>Request Pending</Button>
                          ) : suggestion.userConnect?.status === 'accepted' ? (
                            <Button size="sm" variant="success" disabled>Connected</Button>
                          ) : suggestion.userConnect?.status === 'rejected' ? (
                            <Button size="sm" variant="destructive" disabled>Rejected</Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                if (!user || !user.data) {
                                  alert('Please login to use connect feature.');
                                  return;
                                }
                                sendSwapRequest(suggestion._id, 'connect');
                              }}
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600">Skills Offered</span><span className="font-medium">{user?.data?.skills_offered?.length || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Skills Learning</span><span className="font-medium">{user?.data?.skills_wanted?.length || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Active Swaps</span><span className="font-medium">3</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Completed Sessions</span><span className="font-medium">12</span></div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="text-sm">
                  <div className="text-gray-900">
                    {activity.type === 'request_received' && '📩 Request from '}
                    {activity.type === 'session_completed' && '✅ Session with '}
                    {activity.type === 'new_match' && '🎯 New match with '}
                    <span className="font-medium">{activity.user}</span>
                  </div>
                  <div className="text-gray-500">{activity.skill} • {activity.time}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {selectedUserId && (
        <UserProfilePopup
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </motion.div>
  );
};

export default Home;
