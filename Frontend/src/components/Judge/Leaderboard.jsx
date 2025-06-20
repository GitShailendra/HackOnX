import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard, getShortlisted } from '../../api/judge'

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'totalScore', direction: 'desc' });
  const [judgeInfo, setJudgeInfo] = useState(null);
  const navigate = useNavigate();

  // Hide scrollbars and prevent overflow
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      // Get shortlisted teams from API
      const response = await getShortlisted();
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
      className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors duration-200 group"
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
          <svg className="w-4 h-4 ml-1 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        )}
      </div>
    </th>
  );

  // Get cell background color based on score (higher = more vibrant purple)
  const getCellBackground = (score) => {
    const percentage = score / 10;
    const opacity = 0.15 + (percentage * 0.3);
    return `rgba(139, 92, 246, ${opacity})`; // purple-500 with dynamic opacity
  };

  if (loading) {
    return (
      <div 
        className="fixed inset-0 flex justify-center items-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b69 25%, #6b46c1 50%, #8b5cf6 75%, #c084fc 100%)'
        }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-300 mb-4"></div>
          <p className="text-purple-200">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="fixed inset-0 flex justify-center items-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b69 25%, #6b46c1 50%, #8b5cf6 75%, #c084fc 100%)'
        }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="text-center p-8 bg-purple-900/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/30 relative z-10 max-w-md mx-4">
          <svg className="mx-auto h-12 w-12 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-xl font-medium text-white">Error</h3>
          <p className="mt-1 text-purple-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400/50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div 
        className="fixed inset-0 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b69 25%, #6b46c1 50%, #8b5cf6 75%, #c084fc 100%)'
        }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-3/4 left-1/3 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Scrollable content area */}
        <div className="relative z-10 h-full overflow-y-auto">
          <div className="min-h-full">
            <div className="pt-20 pb-10 container mx-auto px-4">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Hackathon Leaderboard
                </h1>
                <p className="text-purple-200/80">
                  Teams ranked by overall performance
                </p>
              </div>

              <div className="flex justify-center items-center min-h-[40vh]">
                <div className="text-center p-8 bg-purple-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-xl max-w-lg">
                  <svg className="mx-auto h-12 w-12 text-purple-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">No Ratings Yet</h3>
                  <p className="text-purple-200/80">
                    There are no teams with ratings yet. Once judges start rating teams, they will appear on this leaderboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b69 25%, #6b46c1 50%, #8b5cf6 75%, #c084fc 100%)'
      }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-3/4 left-1/3 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Scrollable content area */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="min-h-full">
          <div className="pt-20 pb-10 container mx-auto px-4 max-w-7xl">
            {/* Title */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Hackathon Leaderboard
              </h1>
              <p className="text-purple-200/80">
                Teams ranked by overall performance
              </p>
            </div>

            {/* Leaderboard table */}
            <div className="bg-purple-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-600/30">
                  <thead className="bg-purple-800/30 backdrop-blur-sm">
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
                  <tbody className="bg-purple-900/10 backdrop-blur-sm divide-y divide-purple-700/20">
                    {sortedData.map((team, index) => (
                      <tr
                        key={team.id}
                        className={`transition-all duration-300 transform hover:scale-[1.01] hover:bg-purple-600/20 hover:shadow-lg ${
                          index < 3 ? 'bg-gradient-to-r from-purple-600/10 to-violet-600/10' : ''
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`
                            flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-lg
                            ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                              index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' : 
                              index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800' : 'bg-gradient-to-r from-purple-600 to-violet-600'}
                          `}>
                            {team.rank}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-md font-semibold text-white">{team.name}</div>
                          <div className="text-sm text-purple-300">{team.project}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-white bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                            {team.totalScore.toFixed(1)}
                          </div>
                        </td>
                        {['innovation', 'technical', 'functionality', 'presentation', 'impact'].map((criterion) => (
                          <td key={criterion} className="px-6 py-4 whitespace-nowrap text-center">
                            <div
                              className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-white font-semibold shadow-lg backdrop-blur-sm border border-purple-400/20 transition-all duration-200 hover:scale-110"
                              style={{ backgroundColor: getCellBackground(team.criteriaScores[criterion]) }}
                            >
                              {team.criteriaScores[criterion].toFixed(1)}
                            </div>
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600/20 text-purple-200 border border-purple-400/30">
                            {team.judgeCount}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 text-center">
              <div className="bg-purple-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-xl p-6">
                <h3 className="text-purple-200 text-lg font-semibold mb-4 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Scoring Criteria
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { key: 'innovation', label: 'Innovation' },
                    { key: 'technical', label: 'Technical Complexity' },
                    { key: 'functionality', label: 'Functionality' },
                    { key: 'presentation', label: 'Presentation' },
                    { key: 'impact', label: 'Impact' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-center bg-purple-800/20 rounded-xl p-3 border border-purple-600/30">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-violet-400 mr-2"></div>
                      <span className="text-purple-200 text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;