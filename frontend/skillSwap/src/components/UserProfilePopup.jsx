import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserDetail } from '../api/user'; // Your API to get user detail
import Button from './ui/Button';
import { X } from 'lucide-react';

const UserProfilePopup = ({ userId, onClose }) => {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('skillswap_token');
        const res = await getUserDetail(userId, token);
        setUserDetail(res);
      } catch (err) {
        console.error('Error loading user detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (!userId) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
        >
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            <X size={20} />
          </button>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <img
                  src={userDetail.user.profile_photo || '/default-avatar.png'}
                  alt={userDetail.user.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold">
                    {userDetail.user.username}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {userDetail.user.email}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-sm text-gray-500">
                  Skills Offered:
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {userDetail.user.skills_offered?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-sm text-gray-500">
                  Skills Wanted:
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {userDetail.user.skills_wanted?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                {userDetail.swapRequest?.action === 'send-request' && (
                  <Button size="sm">Send Swap Request</Button>
                )}

                {userDetail.swapRequest?.action === 'requested' && (
                  <Button size="sm" variant="outline" disabled>
                    Request Pending
                  </Button>
                )}

                {userDetail.swapRequest?.action === 'respond' && (
                  <div className="flex gap-2">
                    <Button size="sm">Accept</Button>
                    <Button size="sm" variant="outline">
                      Decline
                    </Button>
                  </div>
                )}

                {userDetail.swapRequest?.action === 'accepted' && (
                  <Button size="sm" variant="outline" disabled>
                    Already Connected
                  </Button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserProfilePopup;
