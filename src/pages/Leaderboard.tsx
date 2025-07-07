import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  karmaPoints: number;
  complaintsResolved: number;
  complaintsAgainst: number;
  badges: Array<{ name: string; earnedAt: string }>;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/leaderboard`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 1:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 2:
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return <Star className="w-8 h-8 text-gray-300" />;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 1:
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 2:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-purple-400 to-blue-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Leaderboard</h1>
        <p className="text-gray-600">See who's the best flatmate in your group!</p>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rankings yet</h3>
          <p className="text-gray-600">Start resolving complaints to earn karma points!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {users.map((user, index) => (
            <div
              key={user._id}
              className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200 ${
                index < 3 ? 'ring-2 ring-purple-200' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getRankColor(index)}`}>
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        #{index + 1} {user.username}
                      </h3>
                      {index === 0 && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                          Best Flatmate
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">
                      {user.karmaPoints} karma points
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{user.complaintsResolved}</p>
                      <p className="text-gray-600">Resolved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{user.complaintsAgainst}</p>
                      <p className="text-gray-600">Against</p>
                    </div>
                  </div>
                </div>
              </div>

              {user.badges.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge, badgeIndex) => (
                      <span
                        key={badgeIndex}
                        className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {badge.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;