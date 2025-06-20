const API_DEV_URL = 'http://localhost:5000';
const API_PROD_URL='https://skillonx-server.onrender.com'
import axios from "axios";
export const getShortlisted = async () => {
  try {
    const token = localStorage.getItem('token')
    
    const response = await axios.get(`${API_DEV_URL}/hackathon/get-shortlisted`,{
      headers:{
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const getShortlistedLeaderboard = async () => {
  try {
   
    
    const response = await axios.get(`${API_DEV_URL}/hackathon/get-shortlisted-leaderboard`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const submitTeamRating = async (teamId, ratingData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(
      `${API_DEV_URL}/hackathon/rate-team/${teamId}`,
      ratingData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Get the current judge's rating for a specific team
export const getJudgeRating = async (teamId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(
      `${API_DEV_URL}/hackathon/judge-rating/${teamId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all ratings for a specific team
export const getTeamRatings = async (teamId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(
      `${API_DEV_URL}/hackathon/team-ratings/${teamId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response;
  } catch (error) {
    throw error;
  }
};
export const getLeaderboard = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(
      `${API_DEV_URL}/hackathon/leaderboard`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response;
  } catch (error) {
    throw error;
  }
};