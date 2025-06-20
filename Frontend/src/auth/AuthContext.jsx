// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        return { token, user: JSON.parse(user) };
      }
      return null;
    } catch (error) {
      // If there's any error in parsing, clear the potentially corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  });

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
  };

  // User type checks
  const isStudent = () => auth?.user?.userType === 'student';
  const isUniversity = () => auth?.user?.userType === 'university';
  const isAdmin = () => auth?.user?.userType === 'admin';
  const isHackathonUser = () => auth?.user?.userType === 'hackathonUser';
  const isHackathonUser2 = () => auth?.user?.userType === 'hackathonUser2';
  const isHackathonManager = () => auth?.user?.userType === 'manageHackathon';
  const isInnonvonoxAdmin = () => auth?.user?.userType ==='InnonvonoxAdmin';
  const isInnovvietJudge = () => auth?.user?.userType === 'InnovvietJudge';
  const isInnonvonxOrganizer = () => auth?.user?.userType === 'Organizer';
  const isInnonvonoxParticipant = () => auth?.user?.userType === 'Participant';
  const isHackathonManager2 = () => auth?.user?.userType === 'manageHackathon2';
  const isInnovonxJudgeTwo = () => auth?.user?.userType === 'InnovonxJudgeTwo';
  const isInnonvonxJudgeOrganizer = () =>auth?.user?.userType==='InnonvonxJudge';
  const isInnonvonxSponsor = () =>auth?.user?.userType === 'InnonvonoxSponsor'
  // Get dashboard route based on user type
  const getDashboardRoute = () => {
    switch (auth?.user?.userType) {
      case 'admin':
        return '/admin';
      case 'student':
        return '/student-dashboard';
      case 'university':
        return '/university-dashboard';
      case 'HackOnXUser':
        return '/hackathon-dashboard';
      case 'hackathonUser2':
        return '/hackathon-dashboard2';
      case 'HackOnXManager':
        return '/hackathon-manager';
      case 'manageHackathon2':
        return '/hackathon-manager2';
      case 'InnonvonoxAdmin':
        return '/innonvonox-admin'
      case 'HackOnXJudge':
        return '/judge'
      case 'Organizer':
        return '/innonvonox-organizer'
      case 'InnovonxJudgeTwo':
        return '/judge-dashboard2'
      case 'Participant':
        return '/innonvonox-participant'
      case 'InnonvonxJudge':
        return '/innonvonox-judge'
      case 'InnonvonoxSponsor':
        return '/innonvonx-sponsor/dashboard'
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      auth, 
      login, 
      logout, 
      isStudent, 
      isUniversity, 
      isAdmin,
      isHackathonUser,
      isHackathonUser2,
      isHackathonManager,
      isHackathonManager2,
      isInnonvonoxAdmin,
      isInnovvietJudge,
      isInnonvonxOrganizer,
      isInnonvonoxParticipant,
      isInnovonxJudgeTwo,
      isInnonvonxJudgeOrganizer,
      isInnonvonxSponsor,
      getDashboardRoute 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;