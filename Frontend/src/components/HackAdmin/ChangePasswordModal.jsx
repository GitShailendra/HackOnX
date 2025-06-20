import React, { useState } from 'react';
import axios from 'axios';
import { XCircle, Lock, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

const ChangeParticipantPasswordModal = ({ isOpen, onClose, participant }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { auth } = useAuth();
  
  // const devUrl = 'http://localhost:5000';
  const devUrl = "https://hackonx.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess(false);
    
    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please enter both password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length  <4) {
      setError('Password must be at least 4 characters long');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await axios.put(
        `${devUrl}/hackathon/reset-participant-password/${participant._id}`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );
      
      if (response.data.success) {
        setSuccess(true);
        setNewPassword('');
        setConfirmPassword('');
        
        // Auto close after success
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <div className="relative max-w-md w-full bg-purple-900/90 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-purple-500/30">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Lock className="w-5 h-5 mr-2 text-purple-300" />
            Reset Participant Password
          </h3>
          <button
            onClick={onClose}
            className="text-purple-200 hover:text-white"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-purple-200">
              You are resetting password for: <span className="text-white font-medium">{participant.fullName}</span>
            </p>
            <p className="text-purple-200 text-sm mt-1">
              Email: {participant.email}
            </p>
          </div>
          
          {success && (
            <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center">
              <Check className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-200">Password reset successfully!</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-200">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-purple-200 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-purple-800/30 backdrop-blur-sm border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-purple-200 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-purple-800/30 backdrop-blur-sm border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 bg-purple-700/50 hover:bg-purple-800/50 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 bg-indigo-600/50 hover:bg-indigo-700/50 text-white rounded-md transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Resetting...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Reset Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangeParticipantPasswordModal;