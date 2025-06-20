import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { getLeaderboard, getShortlistedLeaderboard } from '../../api/judge';

const JudgeLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'totalScore', direction: 'desc' });
  const [judgeInfo, setJudgeInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      // Get shortlisted teams from API
      const response = await getShortlistedLeaderboard();
      console.log('API response:', response);
      
      // Find the data array in the response
      let participantsData = [];
      if (response.data && response.data.data) {
        participantsData = response.data.data;
      } else if (response.data) {
        participantsData = response.data;
      }
      
      // Filter participants that have ratings
      const ratedParticipants = participantsData.filter(
        p => p.ratings && p.ratings.length > 0
      );
      
      // Map to the format needed for the leaderboard
      const processedData = ratedParticipants.map((participant, index) => {
        // Calculate average scores for each criterion
        const criteriaScores = {
          innovation: 0,
          technical: 0,
          functionality: 0,
          presentation: 0,
          impact: 0
        };
        
        // Sum up all ratings
        participant.ratings.forEach(rating => {
          criteriaScores.innovation += rating.innovation || 0;
          criteriaScores.technical += rating.technicality || 0;
          criteriaScores.functionality += rating.feasibility || 0;  // Using feasibility as functionality
          criteriaScores.presentation += rating.presentation || 0;
          criteriaScores.impact += rating.impact || 0;
        });
        
        // Calculate averages
        const judgeCount = participant.ratings.length;
        if (judgeCount > 0) {
          criteriaScores.innovation /= judgeCount;
          criteriaScores.technical /= judgeCount;
          criteriaScores.functionality /= judgeCount;
          criteriaScores.presentation /= judgeCount;
          criteriaScores.impact /= judgeCount;
        }
        
        return {
          id: participant._id,
          rank: index + 1,
          name: participant.teamName ? participant.teamName.split(',')[0].trim() : 'Unknown Team',
          project: participant.domain || 'Project Title Not Available',
          totalScore: participant.averageRating || 0,
          judgeCount: judgeCount,
          criteriaScores: criteriaScores
        };
      });
      
      // Sort by totalScore before setting state
      const sortedData = processedData.sort((a, b) => b.totalScore - a.totalScore);
      
      // Update ranks after sorting
      sortedData.forEach((team, index) => {
        team.rank = index + 1;
      });
      
      setLeaderboardData(sortedData);
      console.log('Processed leaderboard data:', sortedData);
      
    } catch (err) {
      setError('Failed to load leaderboard data. Please try again later.');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sort function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedData = [...leaderboardData].sort((a, b) => {
    if (sortConfig.key.includes('.')) {
      const [parent, child] = sortConfig.key.split('.');
      if (a[parent][child] < b[parent][child]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[parent][child] > b[parent][child]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    } else {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    }
  });

  // Header with sort functionality
  const SortableHeader = ({ column, label }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors duration-200"
      onClick={() => requestSort(column)}
    >
      <div className="flex items-center">
        {label}
        {sortConfig.key === column ? (
          <svg 
            className="w-4 h-4 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {sortConfig.direction === 'asc' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            )}
          </svg>
        ) : (
          <svg className="w-4 h-4 ml-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        )}
      </div>
    </th>
  );

  // Get cell background color based on score (higher = more vibrant)
  const getCellBackground = (score) => {
    const percentage = score / 10;
    const opacity = 0.1 + (percentage * 0.25);
    return `rgba(59, 130, 246, ${opacity})`; // blue-500 with dynamic opacity
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 w-full min-h-screen z-0">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300 mb-4"></div>
            <p className="text-blue-200">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 w-full min-h-screen z-0">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center p-8 bg-red-500 bg-opacity-20 rounded-xl border border-red-500">
            <svg className="mx-auto h-12 w-12 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-white">Error</h3>
            <p className="mt-1 text-blue-200">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-900 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 w-full min-h-screen z-0">
        <div className="pt-20 pb-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Hackathon Leaderboard
            </h1>
            <p className="mt-2 text-blue-200">
              Teams ranked by overall performance
            </p>
          </div>
          
          <div className="flex justify-center items-center min-h-[40vh]">
            <div className="text-center p-8 bg-blue-500 bg-opacity-20 rounded-xl border border-blue-500 max-w-lg">
              <svg className="mx-auto h-12 w-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-white">No Ratings Yet</h3>
              <p className="mt-1 text-blue-200">
                There are no teams with ratings yet. Once judges start rating teams, they will appear on this leaderboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 w-full min-h-screen z-0 overflow-auto">
      <div className='absolute left-52 top-10 border rounded-md py-2 px-4 hover:bg-slate-500'>
        <Link to="/" className='text-white'>Back to Home</Link>
      </div>
      <div className="pt-20 pb-10 px-4">
      {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Hackathon Leaderboard
          </h1>
          <p className="mt-2 text-blue-200">
            Teams ranked by overall performance
          </p>
        </div>
        
        {/* Leaderboard table */}
        <div className="shadow-lg rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-700">
              <thead className="bg-blue-900 bg-opacity-50">
                <tr>
                  <SortableHeader column="rank" label="Rank" />
                  <SortableHeader column="name" label="Team" />
                  <SortableHeader column="totalScore" label="Total Score" />
                  <SortableHeader column="criteriaScores.innovation" label="Innovation" />
                  <SortableHeader column="criteriaScores.technical" label="Technical" />
                  <SortableHeader column="criteriaScores.functionality" label="Functionality" />
                  <SortableHeader column="criteriaScores.presentation" label="Presentation" />
                  <SortableHeader column="criteriaScores.impact" label="Impact" />
                  <SortableHeader column="judgeCount" label="Judges" />
                </tr>
              </thead>
              <tbody className="bg-blue-800 bg-opacity-30 backdrop-blur-sm divide-y divide-blue-900 divide-opacity-50">
                {sortedData.map((team, index) => (
                  <tr 
                    key={team.id}
                    className={`transition-colors duration-200 transform hover:scale-[1.01] hover:bg-blue-700 hover:bg-opacity-20 ${
                      index < 3 ? 'animate-pulse-subtle' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full font-bold text-white
                        ${index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-amber-700' : 'bg-blue-600 bg-opacity-50'}
                      `}>
                        {team.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-md font-medium text-white">{team.name}</div>
                      <div className="text-sm text-blue-300">{team.project}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-white">{team.totalScore.toFixed(1)}</div>
                    </td>
                    {['innovation', 'technical', 'functionality', 'presentation', 'impact'].map((criterion) => (
                      <td key={criterion} className="px-6 py-4 whitespace-nowrap text-center">
                        <div 
                          className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-white font-medium" 
                          style={{ backgroundColor: getCellBackground(team.criteriaScores[criterion]) }}
                        >
                          {team.criteriaScores[criterion].toFixed(1)}
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-blue-200">
                      {team.judgeCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-8 text-center">
          <h3 className="text-blue-200 text-sm font-medium mb-2">Scoring Criteria</h3>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-blue-300">Innovation</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-blue-300">Technical Complexity</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-blue-300">Functionality</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-blue-300">Presentation</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-blue-300">Impact</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeLeaderboard;