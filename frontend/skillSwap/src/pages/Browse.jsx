import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MapPin, Clock, Github, Send } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import axios from 'axios';

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState([]);
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem('skillswap_token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = token
          ? 'http://localhost:1124/api/v1/user/getalluser'
          : 'http://localhost:1124/api/v1/user/getalluser-notlogin';

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(url, { headers });
        const fetchedUsers = response.data.data.data;
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  const sendConnectRequest = async (receiverId) => {
    try {
      setSending(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(
        'http://localhost:1124/api/v1/swap/request',
        { receiverId },
        { headers }
      );
      const updatedUsers = users.map(user =>
        user._id === receiverId ? { ...user, userConnect: { status: 'pending' } } : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to send connect request:', error);
    } finally {
      setSending(false);
    }
  };

  const allSkills = Array.from(
    new Set(users.flatMap(user => [...(user.skills_offered || []), ...(user.skills_wanted || [])]))
  ).sort();

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.skills_offered || []).some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.skills_wanted || []).some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.some(skill =>
        (user.skills_offered || []).includes(skill) ||
        (user.skills_wanted || []).includes(skill)
      );

    return matchesSearch && matchesSkills;
  });

  const toggleSkillFilter = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Browse Developers
        </h1>
        <p className="text-gray-600">
          Find developers to swap skills with and grow together
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by username or skills..."
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-4"
            >
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkillFilter(skill)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {selectedSkills.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  <button
                    onClick={() => setSelectedSkills([])}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <img
                      src={user.profile_photo}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(user.github, '_blank')}>
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className={`transition-all duration-300 ${
                        user.userConnect?.status === 'pending'
                          ? 'bg-yellow-400 text-white'
                          : user.userConnect?.status === 'accepted'
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      onClick={() => user.userConnect ? null : sendConnectRequest(user._id)}
                      disabled={sending || user.userConnect}
                    >
                      {user.userConnect?.status === 'pending'
                        ? 'Request Pending'
                        : user.userConnect?.status === 'accepted'
                        ? 'Connected'
                        : 'Connect'}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location || 'N/A'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {(user.availability && user.availability[0]) || 'Flexible'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 block mb-2">Offers:</span>
                    <div className="flex flex-wrap gap-1">
                      {(user.skills_offered || []).map((skill, i) => (
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
                    <span className="text-sm text-gray-500 block mb-2">Wants to learn:</span>
                    <div className="flex flex-wrap gap-1">
                      {(user.skills_wanted || []).map((skill, i) => (
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
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No developers found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedSkills([]);
              }}
            >
              Clear filters
            </Button>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default Browse;