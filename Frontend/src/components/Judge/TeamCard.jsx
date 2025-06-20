import React, { useState, useEffect } from 'react';
import { getJudgeRating, submitTeamRating } from '../../api/judge';

const TeamCard = ({ team, onSubmitRating, isSubmitting }) => {
  const [expanded, setExpanded] = useState(false);
  const [ratings, setRatings] = useState({
    innovation: 0,
    technicality: 0,
    presentation: 0,
    feasibility: 0,
    impact: 0,
    comments: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false); // New state for edit mode

  // Check if team has ratings without making API call
  const hasRatings = team.ratings && Array.isArray(team.ratings) && team.ratings.length > 0;

  // Use existing ratings data if available
  useEffect(() => {
    if (!expanded) return;

    // If the team already has ratings from the backend, we don't need to fetch again
    if (hasRatings) {
      // Just to be safe, use the first rating in the array if there is one
      const existingRating = team.ratings[0];
      if (existingRating) {
        setRatings({
          innovation: existingRating.innovation || 0,
          technicality: existingRating.technicality || 0,
          presentation: existingRating.presentation || 0,
          feasibility: existingRating.feasibility || 0,
          impact: existingRating.impact || 0,
          comments: existingRating.comments || ''
        });
        return;
      }
    }

    // If no rating exists yet, initialize with default values
    setRatings({
      innovation: 0,
      technicality: 0,
      presentation: 0,
      feasibility: 0,
      impact: 0,
      comments: ''
    });
  }, [expanded, team.ratings, hasRatings]);

  const handleRatingChange = (criterion, value) => {
    setRatings(prev => ({
      ...prev,
      [criterion]: value
    }));
  };

  const handleCommentsChange = (e) => {
    setRatings(prev => ({
      ...prev,
      comments: e.target.value
    }));
  };
  const toggleEditMode = () => {
    setEditMode(!editMode);
    // Reset error when toggling edit mode
    setError(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasRatings && !editMode) {
      setError('You have already rated this team. Click the Edit button to change your rating.');
      return;
    }

    try {
      await submitTeamRating(team.id, ratings);
      onSubmitRating(team.id, ratings);
      if (editMode) {
        setEditMode(false);
      }
    } catch (err) {
      console.error('Error submitting rating:', err);

      // Check for specific error message from backend
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to submit rating. Please try again.');
      }
    }
  };

  const calculateAverageRating = () => {
    const { innovation, technicality, presentation, feasibility, impact } = ratings;
    const sum = innovation + technicality + presentation + feasibility + impact;
    return sum / 5;
  };

  return (
    <div className="bg-blue-900 bg-opacity-20 rounded-xl border border-blue-800 overflow-hidden transition-all duration-300">
      {/* Team Header */}
      <div
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="text-xl font-semibold text-white">{team.name}</h3>
          <p className="text-blue-300">{team.project}</p>
          <p className="text-sm text-blue-400">{team.description}</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasRatings && (
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
              Rated {team.averageRating.toFixed(1)}/10
            </span>
          )}
          <svg
            className={`h-6 w-6 text-blue-300 transition-transform duration-300 ${expanded ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 border-t border-blue-800 bg-blue-900 bg-opacity-10">
          {/* Team Details */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Team Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-blue-300 text-sm">Domain</p>
                <p className="text-white">{team.domain}</p>
              </div>
              {/* Team Email Information */}
<div className="mt-3 border-t border-blue-700 pt-3">
  <p className="text-blue-300 text-sm mb-1">
    <span className="font-semibold">Team Lead Email:</span> {team.leaderEmail}
  </p>
  
  {team.memberEmails && team.memberEmails.length > 0 && (
    <div>
      <p className="text-blue-300 text-sm font-semibold">Team Member Emails:</p>
      <ul className="text-blue-300 text-sm pl-4">
        {team.memberEmails.map((email, index) => (
          <li key={index}>{email || 'No email available'}</li>
        ))}
      </ul>
    </div>
  )}
</div>
              <div>
                <p className="text-blue-300 text-sm">Institution</p>
                <p className="text-white">{team.institution}</p>
              </div>
              <div>
                <p className="text-blue-300 text-sm">Members</p>
                <ul className="text-white list-disc list-inside">
                  {team.members.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-blue-300 text-sm">Payment Status</p>
                <p className={`font-medium ${team.paymentStatus === 'approved'
                    ? 'text-green-400'
                    : team.paymentStatus === 'rejected'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                  }`}>
                  {team.paymentStatus.charAt(0).toUpperCase() + team.paymentStatus.slice(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Form */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-white">Rating Criteria</h4>
              
              {/* Add Edit Button when team is already rated */}
              {hasRatings && !editMode && (
                <button
                  type="button"
                  onClick={toggleEditMode}
                  className="px-4 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                >
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Rating
                  </span>
                </button>
              )}
              
              {/* Show Cancel button when in edit mode */}
              {editMode && (
                <button
                  type="button"
                  onClick={toggleEditMode}
                  className="px-4 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-300"></div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
                    {error}
                  </div>
                )}

                {/* If the team is rated and not in edit mode, show rating summary */}
                {hasRatings && !editMode ? (
                  <div className="space-y-6 mb-6">
                    {[
                      { id: 'innovation', label: 'Innovation & Creativity' },
                      { id: 'technicality', label: 'Technical Complexity' },
                      { id: 'presentation', label: 'Presentation & Demo' },
                      { id: 'feasibility', label: 'Feasibility & Practicality' },
                      { id: 'impact', label: 'Impact & Usefulness' }
                    ].map((criterion) => (
                      <div key={criterion.id}>
                        <div className="flex justify-between mb-2">
                          <label className="text-blue-200">{criterion.label}</label>
                          <span className="text-white font-medium">{ratings[criterion.id]}/10</span>
                        </div>
                        <div className="w-full h-2 bg-blue-700 bg-opacity-30 rounded-lg">
                          <div
                            className="h-full bg-blue-500 rounded-lg"
                            style={{ width: `${(ratings[criterion.id] / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Display comments if any */}
                    {ratings.comments && (
                      <div className="mt-4">
                        <h5 className="text-blue-200 mb-2">Your Comments:</h5>
                        <div className="p-3 bg-blue-900 bg-opacity-50 text-white border border-blue-700 rounded-lg">
                          {ratings.comments}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Show rating sliders when in edit mode or when not yet rated */
                  <>
                    {/* Rating Sliders */}
                    <div className="space-y-6 mb-6">
                      {[
                        { id: 'innovation', label: 'Innovation & Creativity' },
                        { id: 'technicality', label: 'Technical Complexity' },
                        { id: 'presentation', label: 'Presentation & Demo' },
                        { id: 'feasibility', label: 'Feasibility & Practicality' },
                        { id: 'impact', label: 'Impact & Usefulness' }
                      ].map((criterion) => (
                        <div key={criterion.id}>
                          <div className="flex justify-between mb-2">
                            <label className="text-blue-200">{criterion.label}</label>
                            <span className="text-white font-medium">{ratings[criterion.id]}/10</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={ratings[criterion.id]}
                            onChange={(e) => handleRatingChange(criterion.id, parseInt(e.target.value))}
                            className="w-full h-2 bg-blue-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Comments */}
                    <div className="mb-6">
                      <label className="block text-blue-200 mb-2">Comments (Optional)</label>
                      <textarea
                        rows="3"
                        className="w-full bg-blue-900 bg-opacity-50 text-white border border-blue-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add your comments about this team's project..."
                        value={ratings.comments}
                        onChange={handleCommentsChange}
                      ></textarea>
                    </div>
                  </>
                )}

                {/* Average Rating */}
                <div className="mb-6 p-4 bg-blue-800 bg-opacity-30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Average Rating</span>
                    <span className="text-2xl font-bold text-white">{calculateAverageRating().toFixed(1)}/10</span>
                  </div>
                </div>

                {/* Submit Button - Only show when in edit mode or not yet rated */}
                {(!hasRatings || editMode) && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : editMode ? (
                        'Update Rating'
                      ) : (
                        'Submit Rating'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamCard;