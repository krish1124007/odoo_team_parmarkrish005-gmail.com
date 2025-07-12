import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, MapPin, Github } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button'
import axios from 'axios';
import { useEffect, useState } from 'react';

const Home = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
  const fetchUsers = async () => {
    try {
    
      const response = await axios.get('http://localhost:1124/api/v1/user/getalluser');
      setSuggestions(response.data.data.data); // adjust if API structure is different
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  fetchUsers();
}, []);

  console.log(suggestions)
  console.log(user)
  // Mock data for skill swap suggestions
 

  const recentActivity = [
    {
      id: 1,
      type: 'request_received',
      user: 'Alex Kim',
      skill: 'React Native',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'session_completed',
      user: 'Jamie Wilson',
      skill: 'Python',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'new_match',
      user: 'Taylor Brown',
      skill: 'GraphQL',
      time: '2 days ago'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Welcome back, {user?.username || user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-blue-100 mb-4">
          You have 3 new skill swap opportunities and 2 pending requests.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary" size="sm">
            View Requests
          </Button>
          <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-blue-600">
            Browse Skills
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recommended Skill Swaps
            </h2>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img
                          src={suggestion.profile_photo}
                          alt="nothiung"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {suggestion.username}
                            </h3>
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
                              {suggestion.availability[0]}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm text-gray-500">Offers: </span>
                              <div className="inline-flex flex-wrap gap-1">
                                {suggestion.skills_offered.map((skill, i) => (
                                  <span
                                    key={i}
                                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Wants: </span>
                              <div className="inline-flex flex-wrap gap-1">
                                {suggestion.skills_wanted.map((skill, i) => (
                                  <span
                                    key={i}
                                    className="inline-block px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-sm font-medium text-blue-600">
                          {suggestion.matchScore || 50}% match
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Github className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            Connect
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Skills Offered</span>
                <span className="font-medium">{user?.skillsOffered?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Skills Learning</span>
                <span className="font-medium">{user?.skillsWanted?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Swaps</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed Sessions</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
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
                  <div className="text-gray-500">
                    {activity.skill} • {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
