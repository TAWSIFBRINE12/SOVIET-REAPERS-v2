import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLogOut, FaUsers, FaComments, FaTrophy } from 'react-icons/fa';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalMembers: 0, activeChats: 0, topRank: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data');
        logout();
      }
    };
    fetchUserData();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Soviet Reapers</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <FaLogOut /> Logout
        </button>
      </header>

      {/* Welcome Section */}
      {user && (
        <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white border-opacity-10">
          <h2 className="text-2xl font-bold mb-2">Welcome, {user.username}</h2>
          <p className="text-gray-400">Rank: <span className="text-yellow-400">{user.rank}</span></p>
          <p className="text-gray-400">Points: <span className="text-green-400">{user.points}</span></p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-10">
          <div className="flex items-center gap-3">
            <FaUsers className="text-blue-400 text-2xl" />
            <div>
              <p className="text-gray-400">Members</p>
              <p className="text-2xl font-bold">{stats.totalMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-10">
          <div className="flex items-center gap-3">
            <FaComments className="text-green-400 text-2xl" />
            <div>
              <p className="text-gray-400">Active Chats</p>
              <p className="text-2xl font-bold">{stats.activeChats}</p>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-10">
          <div className="flex items-center gap-3">
            <FaTrophy className="text-yellow-400 text-2xl" />
            <div>
              <p className="text-gray-400">Top Rank</p>
              <p className="text-2xl font-bold">{stats.topRank || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/rankings')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105"
        >
          View Rankings
        </button>
        <button
          onClick={() => navigate('/chat')}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105"
        >
          Join Chat
        </button>
      </div>
    </div>
  );
}