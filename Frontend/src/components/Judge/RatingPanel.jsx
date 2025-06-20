import React, { useState, useEffect } from 'react';
import TeamCard from './TeamCard';
import { useNavigate } from 'react-router-dom';
import { getShortlisted, submitTeamRating } from '../../api/judge';

const RatingPanel = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    domain: '',
    status: '',
    sortBy: 'name'
  });
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

  // Helper function to safely check if a team has ratings
  const hasRatings = (team) => {
    return team.ratings && Array.isArray(team.ratings) && team.ratings.length > 0;
  };

  // Fetch teams data from API
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await getShortlisted();

        const findTeamsArray = (responseObj) => {
          if (Array.isArray(responseObj)) {
            return responseObj;
          }
          if (responseObj && Array.isArray(responseObj.data)) {
            return responseObj.data;
          }
          if (responseObj && responseObj.data && Array.isArray(responseObj.data.data)) {
            return responseObj.data.data;
          }
          if (responseObj && responseObj.data) {
            const dataResult = findTeamsArray(responseObj.data);
            if (dataResult) return dataResult;
          }
          return null;
        };

        const teamsArray = findTeamsArray(response);

        if (!teamsArray) {
          console.error('Could not find teams array in response:', response);
          throw new Error('Invalid data format received from server');
        }

        const mappedTeams = teamsArray.map(team => {
          return {
            id: team._id,
            name: team.teamName ? team.teamName.split(',')[0].trim() : 'Unknown Team',
            project: team.domain || 'Project Title Not Available',
            description: `Team of ${team.memberCount || '?'} from ${team.institution || 'Unknown Institution'}`,
            members: [
              team.fullName,
              ...(team.teamMembers?.map(member => member.fullName) || [])
            ].filter(Boolean),
            leaderEmail: team.email || 'No email available',
            memberEmails: team.teamMembers?.map(member => member.email) || [],
            submissionTime: team.createdAt,
            domain: team.domain,
            institution: team.institution,
            paymentStatus: team.paymentStatus,
            averageRating: team.averageRating || 0,
            ratings: team.ratings || []
          };
        });

        setTeams(mappedTeams);
        setFilteredTeams(mappedTeams);
      } catch (err) {
        setError('Failed to load teams. Please try again later.');
        console.error('Error fetching teams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Apply filters and search when teams, filters, or search term changes
  useEffect(() => {
    let result = [...teams];

    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(team => {
        const nameMatch = team.name.toLowerCase().includes(searchLower);
        const emailMatch = team.leaderEmail?.toLowerCase().includes(searchLower) || false;
        const memberEmailMatch = team.memberEmails?.some(email =>
          email && email.toLowerCase().includes(searchLower)
        );
        return nameMatch || emailMatch || memberEmailMatch;
      });
    }

    if (filters.domain) {
      result = result.filter(team => team.domain === filters.domain);
    }

    if (filters.status === 'rated') {
      result = result.filter(team => hasRatings(team));
    } else if (filters.status === 'unrated') {
      result = result.filter(team => !hasRatings(team));
    }

    switch (filters.sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'institution':
        result.sort((a, b) => a.institution.localeCompare(b.institution));
        break;
      case 'rating':
        result.sort((a, b) => {
          if (!a.averageRating && b.averageRating) return 1;
          if (a.averageRating && !b.averageRating) return -1;
          return b.averageRating - a.averageRating;
        });
        break;
      case 'submission':
        result.sort((a, b) => new Date(b.submissionTime) - new Date(a.submissionTime));
        break;
      default:
        break;
    }

    setFilteredTeams(result);
  }, [teams, filters, searchTerm]);

  const handleSubmitRating = async (teamId, ratings) => {
    setSubmitting(true);
    try {
      await submitTeamRating(teamId, ratings);

      const totalScore = (
        ratings.innovation +
        ratings.technicality +
        ratings.presentation +
        ratings.feasibility +
        ratings.impact
      ) / 5;

      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === teamId
            ? {
              ...team,
              ratings: [
                ...(team.ratings || []),
                {
                  innovation: ratings.innovation,
                  technicality: ratings.technicality,
                  presentation: ratings.presentation,
                  feasibility: ratings.feasibility,
                  impact: ratings.impact,
                  comments: ratings.comments,
                  totalScore: totalScore
                }
              ],
              averageRating: team.averageRating || totalScore
            }
            : team
        )
      );

      setNotification({
        type: 'success',
        message: 'Rating submitted successfully!'
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);

    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Failed to submit rating. Please try again.'
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
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
          <p className="text-purple-200">Loading teams...</p>
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
          <div className="pt-20 pb-10 container mx-auto px-4 max-w-6xl">
            {/* Title with animation */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Team Evaluation Panel
              </h1>
              <p className="text-purple-200/80">
                Rate each team based on the given criteria
              </p>
            </div>

            {/* Notification */}
            {notification && (
              <div
                className={`fixed top-20 right-4 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-300 backdrop-blur-xl border ${
                  notification.type === 'success'
                    ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-200'
                    : 'bg-red-500/20 border-red-400/30 text-red-200'
                }`}
              >
                <div className="flex items-center">
                  {notification.type === 'success' ? (
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <p>{notification.message}</p>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6 bg-purple-900/20 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/30 shadow-xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by team name or email..."
                  className="w-full bg-purple-950/50 border border-purple-600/50 rounded-xl text-white placeholder-purple-300/60 pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200 backdrop-blur-sm"
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button
                      onClick={handleClearSearch}
                      className="text-purple-300 hover:text-purple-200 focus:outline-none transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="mb-8 bg-purple-900/20 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/30 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                Filter & Sort
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="domain" className="block text-sm font-medium text-purple-200 mb-2">Domain</label>
                  <select
                    id="domain"
                    name="domain"
                    value={filters.domain}
                    onChange={handleFilterChange}
                    className="w-full bg-purple-950/50 border border-purple-600/50 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
                  >
                    <option value="">All Domains</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Open Innovation">Open Innovation</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-purple-200 mb-2">Rating Status</label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full bg-purple-950/50 border border-purple-600/50 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
                  >
                    <option value="">All Teams</option>
                    <option value="rated">Rated</option>
                    <option value="unrated">Not Rated</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium text-purple-200 mb-2">Sort by</label>
                  <select
                    id="sortBy"
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-full bg-purple-950/50 border border-purple-600/50 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
                  >
                    <option value="name">Team Name</option>
                    <option value="institution">Institution</option>
                    <option value="rating">Rating (High to Low)</option>
                    <option value="submission">Submission Date</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-xl p-3 border border-purple-400/30 w-full">
                    <div className="text-purple-200 text-sm font-medium">
                      Showing {filteredTeams.length} of {teams.length} teams
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team cards */}
            <div className="space-y-6">
              {filteredTeams.length === 0 ? (
                <div className="text-center p-8 bg-purple-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-xl">
                  <svg className="mx-auto h-12 w-12 text-purple-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">No Teams Found</h3>
                  <p className="text-purple-200/80 mb-4">
                    {searchTerm.trim() !== ''
                      ? `No teams match the search term "${searchTerm}".`
                      : teams.length > 0
                        ? "Try changing your filters to see more teams."
                        : "No teams have been shortlisted yet. Check back later."}
                  </p>
                  {searchTerm.trim() !== '' && (
                    <button
                      onClick={handleClearSearch}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                filteredTeams.map((team) => (
                  <div key={team.id}>
                    <TeamCard
                      team={team}
                      onSubmitRating={handleSubmitRating}
                      isSubmitting={submitting}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingPanel;