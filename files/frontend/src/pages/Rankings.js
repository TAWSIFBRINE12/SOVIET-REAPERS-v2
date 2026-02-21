import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaTrophy, FaMedal } from 'react-icons/fa';

export default function Rankings() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get('/api/users/ranking');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch rankings');
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

  const getRankColor = (rank) => {
    const colors = {
      boss: 'text-red-600',
      leader: 'text-yellow-600',
      moderator: 'text-blue-600',
      member: 'text-gray-400'
    };
    return colors[rank] || colors.member;
  };

  const getMedalIcon = (index) => {
    if (index === 0) return <FaTrophy className="text-yellow-400" />;
    if (index === 1) return <FaMedal className="text-gray-400" />;
    if (index === 2) return <FaMedal className="text-orange-600" />;
    return <span className="text-gray-500">#{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-3xl font-bold text-white">Rankings</h1>
      </div>

      {/* Rankings Table */}
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white border-opacity-10">
          <table className="w-full">
            <thead className="border-b border-white border-opacity-10">
              <tr>
                <th className="px-6 py-4 text-left text-white font-bold">Rank</th>
                <th className="px-6 py-4 text-left text-white font-bold">User</th>
                <th className="px-6 py-4 text-left text-white font-bold">Title</th>
                <th className="px-6 py-4 text-right text-white font-bold">Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 transition">
                  <td className="px-6 py-4 flex items-center gap-2">
                    {getMedalIcon(index)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                      <span className="text-white">{user.username}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 font-bold ${getRankColor(user.rank)}`}>
                    {user.rank.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-right text-green-400 font-bold">{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}