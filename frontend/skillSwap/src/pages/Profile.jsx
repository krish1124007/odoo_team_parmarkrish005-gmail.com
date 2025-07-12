import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Github, MapPin, Clock, Plus, X, Edit } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {});
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const handleSave = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const addSkill = (type) => {
    const newSkill = type === 'skillsOffered' ? newSkillOffered : newSkillWanted;
    if (newSkill.trim()) {
      setEditData(prev => ({
        ...prev,
        [type]: [...(prev[type] || []), newSkill.trim()]
      }));
      if (type === 'skillsOffered') {
        setNewSkillOffered('');
      } else {
        setNewSkillWanted('');
      }
    }
  };

  const removeSkill = (type, skill) => {
    setEditData(prev => ({
      ...prev,
      [type]: (prev[type] || []).filter((s) => s !== skill)
    }));
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Profile Header */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl lg:text-3xl font-bold">
              {user.username?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editData.username || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Username"
                    />
                    <Input
                      value={editData.location || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Location"
                    />
                    <Input
                      value={editData.githubProfile || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, githubProfile: e.target.value }))}
                      placeholder="GitHub Profile URL"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {user.username || user.email.split('@')[0]}
                    </h1>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                      {user.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {user.location}
                        </div>
                      )}
                      {user.availability && user.availability.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {user.availability.join(', ')}
                        </div>
                      )}
                      {user.githubProfile && (
                        <a
                          href={user.githubProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-500"
                        >
                          <Github className="h-4 w-4" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills I Offer */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Offer</h2>
          
          {isEditing && (
            <div className="flex gap-2 mb-4">
              <Input
                value={newSkillOffered}
                onChange={(e) => setNewSkillOffered(e.target.value)}
                placeholder="Add a skill you can teach"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('skillsOffered'))}
              />
              <Button
                type="button"
                onClick={() => addSkill('skillsOffered')}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {(isEditing ? editData.skillsOffered : user.skillsOffered)?.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {skill}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeSkill('skillsOffered', skill)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
            {(!user.skillsOffered || user.skillsOffered.length === 0) && !isEditing && (
              <p className="text-gray-500">No skills added yet</p>
            )}
          </div>
        </Card>

        {/* Skills I Want to Learn */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Want to Learn</h2>
          
          {isEditing && (
            <div className="flex gap-2 mb-4">
              <Input
                value={newSkillWanted}
                onChange={(e) => setNewSkillWanted(e.target.value)}
                placeholder="Add a skill you want to learn"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('skillsWanted'))}
              />
              <Button
                type="button"
                onClick={() => addSkill('skillsWanted')}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {(isEditing ? editData.skillsWanted : user.skillsWanted)?.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm bg-emerald-100 text-emerald-800"
              >
                {skill}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeSkill('skillsWanted', skill)}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
            {(!user.skillsWanted || user.skillsWanted.length === 0) && !isEditing && (
              <p className="text-gray-500">No learning goals added yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Stats & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Profile Views</span>
              <span className="font-medium">142</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Connections</span>
              <span className="font-medium">28</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed Swaps</span>
              <span className="font-medium">12</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>
          <div className="space-y-2">
            {user.availability?.map((time, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 mr-2 mb-2"
              >
                {time}
              </span>
            ))}
            {(!user.availability || user.availability.length === 0) && (
              <p className="text-gray-500">No availability set</p>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Profile Visibility</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                user.profileVisibility === 'public' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.profileVisibility}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;