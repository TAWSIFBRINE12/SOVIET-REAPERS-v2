import React from 'react';
import { FaGoogle } from 'react-icons/fa';

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-10">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">SOVIET</h1>
            <h2 className="text-3xl font-bold text-red-600">REAPERS</h2>
            <p className="text-gray-400 mt-2">Join the Brotherhood</p>
          </div>

          {/* Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200"
          >
            <FaGoogle size={20} />
            Sign in with Google
          </button>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Secure. Encrypted. Anonymous.
          </p>
        </div>
      </div>
    </div>
  );
}