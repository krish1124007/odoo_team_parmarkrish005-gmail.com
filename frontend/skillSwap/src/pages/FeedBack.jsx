import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Feedback = () => {
  const [username, setUsername] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ username, feedback, rating });
    alert('Feedback submitted!');
    // You can post this data to your backend here
    setUsername('');
    setFeedback('');
    setRating(0);
  };

  return (
    <motion.div
      className="max-w-xl mx-auto mt-10 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Give Us Your Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700">What did you learn?</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="4"
              placeholder="Write your learning or feedback here..."
              required
            />
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rate your experience</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    rating >= star ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  fill={rating >= star ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" className="w-full">Submit Feedback</Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default Feedback;
