import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MapPin, Clock, Github } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for users
  const users = [
    {
      id: 1,
      name: 'Sarah Chen',
      username: 'sarahcodes',
      location: 'San Francisco, CA',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      skillsOffered: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow'],
      skillsWanted: ['React', 'TypeScript', 'Node.js'],
      rating: 4.9,
      reviews: 23,
      availability: 'Weekends',
      githubProfile: 'https://github.com/sarahcodes',
      joined: '2023'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      username: 'marcusdev',
      location: 'New York, NY',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
      skillsOffered: ['DevOps', 'Docker', 'AWS', 'Kubernetes'],
      skillsWanted: ['Node.js', 'React', 'GraphQL'],
      rating: 4.8,
      reviews: 31,
      availability: 'Evenings',
      githubProfile: 'https://github.com/marcusdev',
      joined: '2022'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      username: 'emilyux',
      location: 'Austin, TX',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      skillsOffered: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
      skillsWanted: ['Frontend Development', 'Vue.js', 'CSS Animations'],
      rating: 4.7,
      reviews: 18,
      availability: 'Flexible',
      githubProfile: 'https://github.com/emilyux',
      joined: '2023'
    },
    {
      id: 4,
      name: 'David Kim',
      username: 'davidcode',
      location: 'Seattle, WA',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
      skillsOffered: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      skillsWanted: ['Backend Development', 'PostgreSQL', 'Go'],
      rating: 4.6,
      reviews: 15,
      availability: 'Weekdays',
      githubProfile: 'https://github.com/davidcode',
      joined: '2024'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      username: 'lisatech',
      location: 'Los Angeles, CA',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150',
      skillsOffered: ['iOS Development', 'Swift', 'SwiftUI', 'Mobile Design'],
      skillsWanted: ['Flutter', 'React Native', 'Android'],
      rating: 4.9,
      reviews: 27,
      availability: 'Weekends',
      githubProfile: 'https://github.com/lisatech',
      joined: '2022'
    },
    {
      id: 6,
      name: 'Alex Chen',
      username: 'alexfullstack',
      location: 'Chicago, IL',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150',
      skillsOffered: ['Full Stack Development', 'Node.js', 'Express', 'MongoDB'],
      skillsWanted: ['System Design', 'Microservices', 'Redis'],
      rating: 4.5,
      reviews: 12,
      availability: 'Evenings',
      githubProfile: 'https://github.com/alexfullstack',
      joined: '2023'
    }
  ];

  const allSkills = Array.from(
    new Set(users.flatMap(user => [...user.skillsOffered, ...user.skillsWanted]))
  ).sort();

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.some(skill => 
        user.skillsOffered.includes(skill) || user.skillsWanted.includes(skill)
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
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Browse Developers
        </h1>
        <p className="text-gray-600">
          Find developers to swap skills with and grow together
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or skills..."
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

          {/* Skill Filters */}
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

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="space-y-4">
                {/* User Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{user.rating}</span>
                          <span className="text-sm text-gray-500">({user.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(user.githubProfile, '_blank')}
                    >
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      Connect
                    </Button>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {user.availability}
                  </div>
                  <span>Joined {user.joined}</span>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 block mb-2">Offers:</span>
                    <div className="flex flex-wrap gap-1">
                      {user.skillsOffered.map((skill, i) => (
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
                      {user.skillsWanted.map((skill, i) => (
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