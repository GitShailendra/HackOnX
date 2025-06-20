import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  User,
  Building,
  Phone,
  LogOut,
  Code,
  Brain,
  Rocket,
  Upload,
  AlertTriangle,
  AlertCircle,
  FileUp,
  X
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import paymentImg from '../../assets/Payment/payment.jpg'
import ProposalTemplateModal from '../registration/ProposalTemplateModal'

const HackathonDashboardTwo = () => {
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalFile, setProposalFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ loading: false, error: null, success: false });
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentUploadStatus, setPaymentUploadStatus] = useState({ loading: false, error: null, success: false });
  const [showProposalTemplate, setShowProposalTemplate] = useState(false);
  
  const paymentFileInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const devUrl = 'http://localhost:5000'
  const prodUrl = "https://skillonx-server.onrender.com"

  useEffect(() => {
    const fetchParticipantDetails = async () => {
      try {
        const response = await axios.get(`${devUrl}/hackathon/participant-details`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        console.log('response of participant', response)
        if (response.data.success) {
          setParticipant(response.data.participant);
        } else {
          setError('Failed to fetch participant details');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching your details');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantDetails();
  }, [auth.token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProposalFile(e.target.files[0]);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  const closeModal = () => {
    setShowProposalModal(false);
    setProposalFile(null);
    setUploadStatus({ loading: false, error: null, success: false });
  };

  const submitProposal = async () => {
    if (!proposalFile) {
      setUploadStatus({
        loading: false,
        error: 'Please select a file to upload',
        success: false
      });
      return;
    }

    setUploadStatus({ loading: true, error: null, success: false });

    const formData = new FormData();
    formData.append('proposalFile', proposalFile);

    try {
      const response = await axios.post(
        `${devUrl}/hackathon/submit-proposal`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.token}`
          }
        }
      );

      if (response.data.success) {
        setUploadStatus({ loading: false, error: null, success: true });

        setTimeout(() => {
          const fetchUpdatedParticipant = async () => {
            try {
              const updatedResponse = await axios.get(`${devUrl}/hackathon/participant-details`, {
                headers: {
                  Authorization: `Bearer ${auth.token}`
                }
              });

              if (updatedResponse.data.success) {
                setParticipant(updatedResponse.data.participant);
                closeModal();
              }
            } catch (err) {
              console.error('Error updating participant data:');
            }
          };

          fetchUpdatedParticipant();
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to upload proposal');
      }
    } catch (err) {
      setUploadStatus({
        loading: false,
        error: err.response?.data?.message || 'Failed to upload proposal. Please try again.',
        success: false
      });
    }
  };

  const handlePaymentFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentFile(e.target.files[0]);
    }
  };

  const openPaymentFileSelector = () => {
    paymentFileInputRef.current.click();
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentFile(null);
    setPaymentUploadStatus({ loading: false, error: null, success: false });
  };

  const submitPayment = async () => {
    if (!paymentFile) {
      setPaymentUploadStatus({
        loading: false,
        error: 'Please select a screenshot to upload',
        success: false
      });
      return;
    }

    setPaymentUploadStatus({ loading: true, error: null, success: false });

    const formData = new FormData();
    formData.append('paymentFile', paymentFile);

    try {
      const response = await axios.post(
        `${devUrl}/hackathon/submit-payment`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.token}`
          }
        }
      );
      console.log('response of payment', response);
      if (response.data.success) {
        setPaymentUploadStatus({ loading: false, error: null, success: true });

        setTimeout(() => {
          const fetchUpdatedParticipant = async () => {
            try {
              const updatedResponse = await axios.get(`${devUrl}/hackathon/participant-details`, {
                headers: {
                  Authorization: `Bearer ${auth.token}`
                }
              });

              if (updatedResponse.data.success) {
                setParticipant(updatedResponse.data.participant);
                closePaymentModal();
              }
            } catch (err) {
              console.error('Error updating participant data:', err);
            }
          };

          fetchUpdatedParticipant();
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to upload payment screenshot');
      }
    } catch (err) {
      setPaymentUploadStatus({
        loading: false,
        error: err.response?.data?.message || 'Failed to upload payment screenshot. Please try again.',
        success: false
      });
    }
  };

  const formatTeamName = (teamName) => {
    if (!teamName) return '';

    if (teamName.includes(',')) {
      const parts = teamName.split(',').map(part => part.trim());

      if (parts.length >= 2 && parts[0] === parts[1]) {
        return parts[0];
      }
    }

    return teamName;
  };

  // Background floating icons component with inline styles
  const FloatingIcons = () => (
    <div 
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #3730a3 100%)'
      }}
    >
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-20px) translateX(10px); }
            100% { transform: translateY(0px) translateX(0px); }
          }
          .animate-float {
            animation: float ease-in-out infinite;
          }
        `}
      </style>
      {[...Array(15)].map((_, i) => {
        const icons = [Code, Brain, Rocket];
        const Icon = icons[i % icons.length];
        const size = Math.floor(Math.random() * 30) + 15;
        const opacity = (Math.floor(Math.random() * 3) + 1) * 0.05;

        return (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            <Icon
              size={size}
              className="text-white"
              style={{ opacity }}
            />
          </div>
        );
      })}
    </div>
  );

  // Proposal Upload Modal
  const ProposalModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-purple-900/80 backdrop-blur-xl rounded-xl border border-purple-500/30 w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Submit Project Proposal</h3>
          <button
            onClick={closeModal}
            className="text-purple-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-purple-200 mb-4">
            Upload your project proposal document. This is required for your application to be considered.
          </p>

          {uploadStatus.error && (
            <div className="mb-4 p-3 bg-red-500/20 rounded-md border border-red-500/30 text-red-200 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{uploadStatus.error}</p>
            </div>
          )}

          {uploadStatus.success && (
            <div className="mb-4 p-3 bg-green-500/20 rounded-md border border-green-500/30 text-green-200 flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>Your proposal has been uploaded successfully! Updating your dashboard...</p>
            </div>
          )}

          <div
            onClick={openFileSelector}
            className="mt-2 border-2 border-dashed border-purple-500/40 rounded-lg p-8 text-center hover:border-purple-400/60 transition-colors cursor-pointer"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />

            <FileUp className="w-12 h-12 text-purple-400 mx-auto mb-3" />

            {proposalFile ? (
              <div>
                <p className="text-green-300 font-medium">Selected File:</p>
                <p className="text-white truncate max-w-xs mx-auto">{proposalFile.name}</p>
                <p className="text-purple-300 text-sm mt-1">
                  {(proposalFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-white font-medium">Click to select PDF file</p>
                <p className="text-purple-300 text-sm mt-1">or drag and drop</p>
                <p className="text-purple-400 text-xs mt-3">Maximum size: 10MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-purple-800/50 text-white rounded-md hover:bg-purple-700/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submitProposal}
            disabled={!proposalFile || uploadStatus.loading || uploadStatus.success}
            className={`px-4 py-2 rounded-md flex items-center ${!proposalFile || uploadStatus.loading || uploadStatus.success
              ? 'bg-indigo-600/30 text-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600/70 text-white hover:bg-indigo-500/70'
              } transition-colors`}
          >
            {uploadStatus.loading ? (
              <>
                <div className="w-4 h-4 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit Proposal
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-purple-900/80 backdrop-blur-xl rounded-xl border border-purple-500/30 w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Submit Payment Screenshot</h3>
          <button
            onClick={closePaymentModal}
            className="text-purple-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-purple-200 mb-4">
            Please upload a screenshot of your payment. The registration fee is ₹500.
          </p>

          <div className="p-3 bg-indigo-500/20 rounded-md border border-indigo-500/30 text-indigo-200 flex items-start mb-4">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Payment Details:</p>
              <p>Account Name: HackOnX Hackathon</p>
              <p>Reference: {participant?.teamName || participant?.fullName}</p>
            </div>
          </div>

          {paymentUploadStatus.error && (
            <div className="mb-4 p-3 bg-red-500/20 rounded-md border border-red-500/30 text-red-200 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{paymentUploadStatus.error}</p>
            </div>
          )}

          {paymentUploadStatus.success && (
            <div className="mb-4 p-3 bg-green-500/20 rounded-md border border-green-500/30 text-green-200 flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>Your payment screenshot has been uploaded successfully! Our team will verify it shortly.</p>
            </div>
          )}

          <div
            onClick={openPaymentFileSelector}
            className="mt-2 border-2 border-dashed border-purple-500/40 rounded-lg p-8 text-center hover:border-purple-400/60 transition-colors cursor-pointer"
          >
            <input
              type="file"
              ref={paymentFileInputRef}
              onChange={handlePaymentFileChange}
              accept=".jpg,.jpeg,.png"
              className="hidden"
            />

            <FileUp className="w-12 h-12 text-purple-400 mx-auto mb-3" />

            {paymentFile ? (
              <div>
                <p className="text-green-300 font-medium">Selected File:</p>
                <p className="text-white truncate max-w-xs mx-auto">{paymentFile.name}</p>
                <p className="text-purple-300 text-sm mt-1">
                  {(paymentFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-white font-medium">Click to select payment screenshot</p>
                <p className="text-purple-300 text-sm mt-1">or drag and drop</p>
                <p className="text-purple-400 text-xs mt-3">JPG, JPEG or PNG • Maximum size: 10MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={closePaymentModal}
            className="px-4 py-2 bg-purple-800/50 text-white rounded-md hover:bg-purple-700/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submitPayment}
            disabled={!paymentFile || paymentUploadStatus.loading || paymentUploadStatus.success}
            className={`px-4 py-2 rounded-md flex items-center ${!paymentFile || paymentUploadStatus.loading || paymentUploadStatus.success
              ? 'bg-indigo-600/30 text-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600/70 text-white hover:bg-indigo-500/70'
              } transition-colors`}
          >
            {paymentUploadStatus.loading ? (
              <>
                <div className="w-4 h-4 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Helper function to render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'shortlisted':
        return (
          <div className="flex items-center px-3 py-1 bg-green-500/30 backdrop-blur-sm text-green-100 rounded-full text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Approved</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center px-3 py-1 bg-yellow-500/30 backdrop-blur-sm text-yellow-100 rounded-full text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>Under Review</span>
          </div>
        );
      case 'pending_proposal':
        return (
          <div className="flex items-center px-3 py-1 bg-orange-500/30 backdrop-blur-sm text-orange-100 rounded-full text-sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Proposal Required</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center px-3 py-1 bg-red-500/30 backdrop-blur-sm text-red-100 rounded-full text-sm">
            <XCircle className="w-4 h-4 mr-1" />
            <span>Not Selected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center px-3 py-1 bg-gray-500/30 backdrop-blur-sm text-gray-100 rounded-full text-sm">
            <span>Unknown</span>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #3730a3 100%)'
      }}>
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #3730a3 100%)'
      }}>
        <FloatingIcons />
        <div className="backdrop-blur-lg bg-white/10 rounded-xl shadow-2xl overflow-hidden border border-white/20 p-6 max-w-xl relative z-10">
          <h2 className="text-xl font-bold text-red-300 mb-2">Error</h2>
          <p className="text-white/80">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600/50 hover:bg-red-700/50 backdrop-blur-sm text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #3730a3 100%)'
      }}>
        <FloatingIcons />
        <div className="backdrop-blur-lg bg-white/10 rounded-xl shadow-2xl overflow-hidden border border-white/20 p-6 max-w-xl relative z-10">
          <h2 className="text-xl font-bold text-yellow-300 mb-2">No Data Found</h2>
          <p className="text-white/80">We couldn't find your registration information.</p>
          <a
            href="/register"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600/50 hover:bg-indigo-700/50 backdrop-blur-sm text-white rounded-md transition-colors"
          >
            Register Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-auto">
      <FloatingIcons />

      {showProposalModal && <ProposalModal />}
      {showPaymentModal && <PaymentModal />}

      <div className="relative z-10 min-h-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 mb-8">
            <div className="p-6 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-md text-white flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-purple-500/30 rounded-t-2xl">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  HackOnX
                </h1>
                <p className="text-purple-200 text-lg">Participant Dashboard</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                <div className="text-right">
                  <p className="text-sm mb-1 text-purple-200">Application Status:</p>
                  {renderStatusBadge(participant.applicationStatus)}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-purple-700/50 hover:bg-purple-800/50 backdrop-blur-sm text-white rounded-md transition-colors flex items-center border border-purple-500/30"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Proposal Required Warning */}
          {participant.applicationStatus === 'pending_proposal' && !participant.isProposal && (
            <div className="mb-8 p-6 bg-orange-500/20 backdrop-blur-lg rounded-2xl border border-orange-400/30 shadow-xl">
              <div className="flex items-start">
                <AlertTriangle className="w-8 h-8 text-orange-300 mr-4 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-orange-300 mb-3">Project Proposal Required</h3>
                  <p className="text-orange-100 mb-4 leading-relaxed">
                    Your registration is incomplete. Please submit your project proposal to complete your application.
                  </p>
                  <p className="text-orange-200 mb-4">
                    Don't know the structure of project proposal?{' '}
                    <button
                      type="button"
                      onClick={() => setShowProposalTemplate(true)}
                      className="text-blue-300 underline hover:text-blue-200 transition-colors"
                    >
                      click here!
                    </button>
                  </p>
                  <button
                    onClick={() => setShowProposalModal(true)}
                    className="px-6 py-3 bg-orange-600/60 hover:bg-orange-700/60 backdrop-blur-sm text-white rounded-lg transition-colors flex items-center font-medium"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Proposal Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
                <User className="w-6 h-6 mr-3 text-purple-300" />
                Participant Information
              </h2>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
                {/* Personal Details */}
                <div className="bg-gradient-to-br from-purple-800/40 to-indigo-800/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <User className="w-6 h-6 mr-3 text-purple-300" />
                    Personal Details
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm text-purple-300 mb-1">Institution</p>
                      <p className="font-medium text-white">{participant.institution}</p>
                    </div>
                  </div>
                </div>

                {/* Project & Team Information */}
                <div className="bg-gradient-to-br from-purple-800/40 to-indigo-800/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Building className="w-6 h-6 mr-3 text-purple-300" />
                    Team & Project Information
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm text-purple-300 mb-1">Participation Type</p>
                      <p className="font-medium text-white text-lg capitalize">{participant.teamType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-300 mb-1">Team Name</p>
                      <p className="font-medium text-white">{formatTeamName(participant.teamName)}</p>
                    </div>
                    {participant.teamType === 'team' && (
                      <div>
                        <p className="text-sm text-purple-300 mb-1">Team Size</p>
                        <p className="font-medium text-white">{participant.memberCount} members</p>
                      </div>
                    )}

                    {/* Team Members */}
                    {participant.teamType === 'team' && participant.teamMembers && participant.teamMembers.length > 0 && (
                      <div>
                        <p className="text-sm text-purple-300 mb-3">Team Members:</p>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {participant.teamMembers.map((member, index) => (
                            <div
                              key={index}
                              className="bg-purple-700/30 backdrop-blur-sm p-4 rounded-lg border border-purple-600/20"
                            >
                              <p className="font-medium text-white mb-2">{member.fullName}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <p className="text-purple-300 flex items-center">
                                  <User className="inline w-3 h-3 mr-2" />
                                  {member.email}
                                </p>
                                <p className="text-purple-300 flex items-center">
                                  <Phone className="inline w-3 h-3 mr-2" />
                                  {member.contactNumber}
                                </p>
                                <p className="text-purple-300 col-span-full flex items-center">
                                  <Building className="inline w-3 h-3 mr-2" />
                                  {member.institution}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-purple-300 mb-1">Project Domain</p>
                      <p className="font-medium text-white">{participant.domain}</p>
                    </div>

                    {/* Project Proposal Status */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-purple-300">Project Proposal</p>
                        {participant.applicationStatus === 'pending_proposal' && (
                          <span className="text-xs text-orange-300 bg-orange-500/20 px-2 py-1 rounded-full">Required</span>
                        )}
                      </div>

                      {participant.isProposal || participant.proposalFile ? (
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-green-300 mr-2" />
                          <p className="font-medium text-white">Submitted</p>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <XCircle className="w-5 h-5 text-red-300 mr-2" />
                            <p className="font-medium text-white">Not submitted</p>
                          </div>
                          <button
                            onClick={() => setShowProposalModal(true)}
                            className="text-sm px-3 py-1 bg-indigo-600/50 hover:bg-indigo-500/50 text-white rounded-md transition-colors flex items-center"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Upload
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            {/* Application Timeline */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-300" />
                  Application Timeline
                </h3>

                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-500/30"></div>

                  {/* Registration step */}
                  <div className="relative pl-10 pb-5">
                    <div className="absolute left-0 rounded-full bg-green-500/70 backdrop-blur-sm p-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Registration Submitted</p>
                      <p className="text-sm text-purple-300">
                        {new Date(participant.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Proposal submission step */}
                  <div className="relative pl-10 pb-5">
                    <div className={`absolute left-0 rounded-full p-2 ${participant.isProposal
                      ? 'bg-green-500/70 backdrop-blur-sm'
                      : 'bg-purple-600/30 backdrop-blur-sm'
                      }`}>
                      <FileText className={`w-4 h-4 ${participant.isProposal ? 'text-white' : 'text-purple-300'
                        }`} />
                    </div>
                    <div>
                      <p className={`font-medium ${participant.isProposal ? 'text-white' : 'text-purple-300'
                        }`}>
                        Proposal Submission
                      </p>
                      <p className="text-sm text-purple-300">
                        {participant.isProposal
                          ? 'Proposal submitted successfully'
                          : 'Waiting for proposal submission'}
                      </p>
                    </div>
                  </div>

                  {/* Application review step */}
                  <div className="relative pl-10 pb-5">
                    <div className={`absolute left-0 rounded-full p-2 ${(participant.applicationStatus !== 'pending' && participant.applicationStatus !== 'pending_proposal')
                      ? 'bg-green-500/70 backdrop-blur-sm'
                      : 'bg-purple-600/30 backdrop-blur-sm'
                      }`}>
                      <Clock className={`w-4 h-4 ${(participant.applicationStatus !== 'pending' && participant.applicationStatus !== 'pending_proposal')
                        ? 'text-white' : 'text-purple-300'
                        }`} />
                    </div>
                    <div>
                      <p className={`font-medium ${(participant.applicationStatus === 'pending' || participant.applicationStatus === 'pending_proposal')
                        ? 'text-purple-300' : 'text-white'
                        }`}>
                        Application Review
                      </p>
                      <p className="text-sm text-purple-300">
                        {(participant.applicationStatus === 'pending_proposal')
                          ? 'Waiting for proposal submission'
                          : participant.applicationStatus === 'pending'
                            ? 'In progress'
                            : 'Completed'}
                      </p>
                    </div>
                  </div>

                  {/* Selection step */}
                  <div className="relative pl-10">
                    <div className={`absolute left-0 rounded-full p-2 ${participant.applicationStatus === 'shortlisted'
                      ? 'bg-green-500/70 backdrop-blur-sm'
                      : 'bg-purple-600/30 backdrop-blur-sm'
                      }`}>
                      <CheckCircle className={`w-4 h-4 ${participant.applicationStatus === 'shortlisted' ? 'text-white' : 'text-purple-300'
                        }`} />
                    </div>
                    <div>
                      <p className={`font-medium ${participant.applicationStatus !== 'shortlisted' ? 'text-purple-300' : 'text-white'
                        }`}>
                        Selection Confirmed
                      </p>
                      <p className="text-sm text-purple-300">
                        {participant.applicationStatus === 'shortlisted'
                          ? 'Congratulations! You\'ve been selected.'
                          : participant.applicationStatus === 'rejected'
                            ? 'Unfortunately, your application was not selected.'
                            : 'Awaiting decision'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Shortlisted/Approved Status */}
              {(participant.applicationStatus === 'approved' || participant.applicationStatus === 'shortlisted') && (
                <div className="p-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl border border-green-400/30 shadow-xl">
                  <div className="flex flex-col lg:flex-row items-center mb-6">
                    <img
                      src={paymentImg}
                      alt="Congratulations"
                      className="w-48 h-48 lg:w-64 lg:h-64 object-contain mb-6 lg:mb-0 lg:mr-8"
                    />
                    <div className="text-center lg:text-left">
                      <h3 className="text-2xl font-bold text-green-300 mb-4">🎉 Congratulations!</h3>
                      <p className="text-green-100 text-lg leading-relaxed">
                        Your application has been shortlisted. Please complete your registration by submitting the payment.
                      </p>
                    </div>
                  </div>

                  {/* Payment Status Section */}
                  <div className="border-t border-green-400/30 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-semibold text-green-300">Registration Payment</h4>
                      {participant.paymentStatus === 'pending' && participant.hasPaymentProof ? (
                        <span className="px-3 py-1 rounded-full bg-yellow-500/40 text-yellow-100 text-sm font-medium">
                          Under Review
                        </span>
                      ) : participant.paymentStatus === 'approved' ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/40 text-green-100 text-sm font-medium">
                          Approved
                        </span>
                      ) : participant.paymentStatus === 'rejected' ? (
                        <span className="px-3 py-1 rounded-full bg-red-500/40 text-red-100 text-sm font-medium">
                          Rejected
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-purple-500/40 text-purple-100 text-sm font-medium">
                          Payment Required
                        </span>
                      )}
                    </div>

                    <div>
                      {participant.paymentStatus === 'approved' ? (
                        <div className="flex items-center text-green-100 p-4 bg-green-500/20 rounded-lg">
                          <CheckCircle className="w-6 h-6 mr-3 text-green-300" />
                          <p className="text-lg">Payment confirmed. You're all set for the hackathon!</p>
                        </div>
                      ) : participant.paymentStatus === 'pending' && participant.hasPaymentProof ? (
                        <div className="flex items-center text-yellow-100 p-4 bg-yellow-500/20 rounded-lg">
                          <Clock className="w-6 h-6 mr-3 text-yellow-300" />
                          <p>Your payment is being verified. This usually takes 24-48 hours.</p>
                        </div>
                      ) : participant.paymentStatus === 'rejected' ? (
                        <div className="space-y-4">
                          <div className="flex items-center text-red-100 p-4 bg-red-500/20 rounded-lg">
                            <XCircle className="w-6 h-6 mr-3 text-red-300" />
                            <p>Your payment was rejected. Please submit a new payment screenshot.</p>
                          </div>
                          <button
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600/60 hover:bg-indigo-500/60 text-white rounded-lg transition-colors flex items-center justify-center font-medium"
                          >
                            <Upload className="w-5 h-5 mr-2" />
                            Submit New Payment
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center text-purple-100 p-4 bg-purple-500/20 rounded-lg">
                            <AlertCircle className="w-6 h-6 mr-3 text-purple-300" />
                            <p>Please complete your registration by submitting the payment.</p>
                          </div>
                          <div className="bg-indigo-500/20 p-4 rounded-lg border border-indigo-500/30">
                            <p className="text-indigo-200 mb-2">
                              Registration fee: <span className="font-bold text-white">₹500</span>
                            </p>
                            <p className="text-indigo-200 mb-2">
                              Total members: <span className="font-bold text-white">{participant.memberCount}</span>
                            </p>
                            <p className="text-white font-bold text-lg">
                              Total amount: <span className="text-green-300">₹500</span>
                            </p>
                          </div>
                          <button
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600/60 hover:bg-indigo-500/60 text-white rounded-lg transition-colors flex items-center justify-center font-medium"
                          >
                            <Upload className="w-5 h-5 mr-2" />
                            Submit Payment Screenshot
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Rejected Status */}
              {participant.applicationStatus === 'rejected' && (
                <div className="p-8 bg-red-500/20 backdrop-blur-lg rounded-2xl border border-red-400/30 shadow-xl">
                  <h3 className="text-2xl font-semibold text-red-300 mb-4">Application Not Selected</h3>
                  <p className="text-red-100 text-lg leading-relaxed">
                    Unfortunately, your application was not selected for this hackathon. We encourage you to apply for future events.
                  </p>
                </div>
              )}

              {/* Pending Status */}
              {participant.applicationStatus === 'pending' && (
                <div className="p-8 bg-yellow-500/20 backdrop-blur-lg rounded-2xl border border-yellow-400/30 shadow-xl">
                  <h3 className="text-2xl font-semibold text-yellow-300 mb-4">Application Under Review</h3>
                  <p className="text-yellow-100 text-lg leading-relaxed">
                    Your application is currently being reviewed by our panel. You will be notified about the decision soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <ProposalTemplateModal isOpen={showProposalTemplate} onClose={() => setShowProposalTemplate(false)} />
      </div>
    </div>
  );
};

export default HackathonDashboardTwo;