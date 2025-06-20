import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

import axios from 'axios';
import {
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Download,
  Eye,
  FileText,
  User,
  Building,
  ChevronLeft,
  ChevronRight,
  DownloadCloud,
  Code,
  Brain,
  Rocket,
  LogOut, Phone, Lock
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChangeParticipantPasswordModal from './ChangePasswordModal';
// Add these CSS styles to your stylesheet
const styleRules = `
@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
}

.animate-float {
  animation-name: float;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
`;

// Add the style tag to the document head if it's not already present
if (!document.querySelector('style[data-glass-morphism]')) {
  const style = document.createElement('style');
  style.setAttribute('data-glass-morphism', true);
  style.textContent = styleRules;
  document.head.appendChild(style);
}

const ManageHackathon = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [teamTypeFilter, setTeamTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { auth, logout } = useAuth();
  const [paymentProofUrl, setPaymentProofUrl] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedParticipantForPassword, setSelectedParticipantForPassword] = useState(null);
  const navigate = useNavigate();

  const domains = ['Artificial Intelligence', 'Web Development', 'Open Innovation'];
  // const devUrl = 'http://localhost:5000'
 const devUrl = "https://hackonx.onrender.com"  // Fetch applications
  useEffect(() => {

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${devUrl}/hackathon/applications`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        
       
        if (response.data.success) {
          setApplications(response.data.applications);
          setFilteredApplications(response.data.applications);
        } else {
          setError('Failed to fetch applications');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'An error occurred while fetching applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [auth.token]);

  // Apply filters
  useEffect(() => {
    let result = [...applications];

    // Apply search
    if (searchTerm) {
      result = result.filter(app =>
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.teamName && app.teamName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(app => app.applicationStatus === statusFilter);
    }

    // Apply domain filter
    if (domainFilter !== 'all') {
      result = result.filter(app => app.domain === domainFilter);
    }

    // Apply team type filter
    if (teamTypeFilter !== 'all') {
      result = result.filter(app => app.teamType === teamTypeFilter);
    }

    setFilteredApplications(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, domainFilter, teamTypeFilter, applications]);
  const hasPaymentData = (application) => {
    return (
      // Check for hasPaymentProof flag (this is what your API sends)
      application.hasPaymentProof === true ||
      // Or if we have actual proof data in the application object
      (application.paymentProof &&
        (application.paymentProof.data || application.paymentProof.fileName)) ||
      // Or if payment has been processed already
      application.paymentStatus === 'approved' ||
      application.paymentStatus === 'pending' ||
      application.paymentStatus === 'rejected'
    );
  };
  // Update application status
  const updateApplicationStatus = async (id, status) => {
    try {
      setStatusUpdateLoading(true);
      const response = await axios.put(
        `${devUrl}/hackathon/application-status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );

      if (response.data.success) {
        // Update applications list
        const updatedApplications = applications.map(app =>
          app._id === id ? { ...app, applicationStatus: status } : app
        );
        setApplications(updatedApplications);

        // Update selected application if it's the one being modified
        if (selectedApplication && selectedApplication._id === id) {
          setSelectedApplication({ ...selectedApplication, applicationStatus: status });
        }

        // Show success feedback (you can implement a toast notification here)
        alert(`Application status updated to ${status}`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'An error occurred while updating status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Simple downloadFile function that handles JPG and PDF files appropriately
  const downloadFile = async (applicationId, fileType) => {
    try {
      const response = await axios.get(
        `${devUrl}/hackathon/download-file/${applicationId}/${fileType}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          },
          responseType: 'blob'
        }
      );

      // Get the content type from the response
      const contentType = response.headers['content-type'];
      console.log('File content type:', contentType);

      // Determine the file extension based on content type
      let fileExtension = 'pdf'; // Default to pdf

      if (contentType && contentType.includes('image/jpeg')) {
        fileExtension = 'jpg';
      } else if (contentType && contentType.includes('image/jpg')) {
        fileExtension = 'jpg';
      } else if (contentType && contentType.includes('image/png')) {
        fileExtension = 'png';
      }

      // Create a blob URL with the correct content type
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      // Create download link with the correct extension
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileType}_${applicationId}.${fileExtension}`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
      }, 100);

      console.log(`File downloaded with extension: .${fileExtension}`);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file');
    }
  };
  const viewPaymentProof = async (applicationId) => {
    try {
      // Open payment proof in a new window
      window.open(`${devUrl}/hackathon/payment-proof/${applicationId}`, '_blank');
    } catch (err) {
      console.error('Error viewing payment proof:', err);
      alert('Failed to view payment proof');
    }
  };

  // Update payment status
  const updatePaymentStatus = async (id, status) => {
    try {
      setStatusUpdateLoading(true);
      const response = await axios.put(
        `${devUrl}/hackathon/payment-status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );

      if (response.data.success) {
        // Update applications list
        const updatedApplications = applications.map(app =>
          app._id === id ? { ...app, paymentStatus: status } : app
        );
        setApplications(updatedApplications);

        // Update selected application if it's the one being modified
        if (selectedApplication && selectedApplication._id === id) {
          setSelectedApplication({ ...selectedApplication, paymentStatus: status });
        }

        // Show success feedback
        alert(`Payment status updated to ${status}`);
      } else {
        throw new Error('Failed to update payment status');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'An error occurred while updating payment status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };
  // View application details
  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setViewMode('detail');
  };
  // Improved fetchPayment function with better error handling

  const fetchPayment = async (id) => {
    try {
      setStatusUpdateLoading(true);

      console.log('Fetching payment proof for ID:', id);

      const response = await axios.get(`${devUrl}/hackathon/payment-proof/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        responseType: 'blob',
        timeout: 15000
      });

      // Check if response is empty or has zero size
      if (!response.data || response.data.size === 0) {
        console.log('No payment data received');
        alert('No payment proof available for this application.');
        return;
      }

      // Get the content type from the response
      const contentType = response.headers['content-type'];
      console.log('Content type:', contentType);

      // Verify it's an image type
      if (!contentType.startsWith('image/')) {
        console.log('Received non-image content type:', contentType);
        alert('Invalid payment proof format. Only images are supported.');
        return;
      }

      // Create a blob URL
      const blob = new Blob([response.data], { type: contentType });
      const blobUrl = window.URL.createObjectURL(blob);

      // Show in modal
      setPaymentProofUrl(blobUrl);
      setShowProofModal(true);

      console.log('Successfully processed payment proof image');
    } catch (error) {
      console.error('Error fetching payment proof:', error);

      // Error handling
      if (error.response) {
        if (error.response.status === 404) {
          alert('No payment proof has been submitted for this application.');
        } else {
          alert(`Server error (${error.response.status}): ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        alert('Network error: Unable to connect to the server. Please check your connection or try again later.');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setStatusUpdateLoading(false);
    }
  };
  const deleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      return;
    }

    try {
      setStatusUpdateLoading(true);
      const response = await axios.delete(
        `${devUrl}/hackathon/delete-participant/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );

      if (response.data.success) {
        // Remove the application from the state
        const updatedApplications = applications.filter(app => app._id !== id);
        setApplications(updatedApplications);
        setFilteredApplications(updatedApplications);

        // If we're in detail view of the deleted application, go back to list
        if (selectedApplication && selectedApplication._id === id) {
          setViewMode('list');
          setSelectedApplication(null);
        }

        // Show success message
        alert("Application deleted successfully");
      } else {
        throw new Error('Failed to delete application');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'An error occurred while deleting the application');
    } finally {
      setStatusUpdateLoading(false);
    }
  };
  // Return to applications list
  const backToList = () => {
    setViewMode('list');
    setSelectedApplication(null);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const exportToExcel = () => {
    try {
      // Create a filtered version of applications for export, removing unnecessary data
      const dataToExport = filteredApplications.map(app => {
        // Format team members as a string if they exist
        const teamMembersString = app.teamMembers && app.teamMembers.length > 0
          ? app.teamMembers.map(member => 
              `${member.fullName} (${member.email}, ${member.contactNumber})`
            ).join("; ")
          : "";
  
        return {
          'Full Name': app.fullName,
          'Email': app.email,
          'Contact Number': app.contactNumber,
          'Institution': app.institution,
          'Domain': app.domain,
          'T-Shirt Size': app.tShirtSize || 'N/A',
          'Team Type': app.teamType,
          'Team Name': app.teamName || 'N/A',
          'Team Members Count': app.memberCount || 1,
          'Team Members': teamMembersString,
          'Application Status': app.applicationStatus,
          'Payment Status': app.paymentStatus || 'Not Submitted',
          'Application Date': new Date(app.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
      });
  
      // Create worksheet from data
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
      // Auto-size columns
      const colWidths = dataToExport.reduce((acc, row) => {
        Object.keys(row).forEach(key => {
          const value = row[key] ? row[key].toString() : '';
          acc[key] = Math.max(acc[key] || 0, key.length, value.length);
        });
        return acc;
      }, {});
  
      worksheet['!cols'] = Object.keys(colWidths).map(key => ({ wch: colWidths[key] + 2 }));
  
      // Create workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Hackathon Applications');
  
      // Generate Excel file and trigger download
      const fileName = `HackOnX${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      // Show success notification
      alert('Applications exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export applications. Please try again.');
    }
  };
  
  const handleResetPassword = (participant) => {
    setSelectedParticipantForPassword(participant);
    setShowPasswordModal(true);
  };
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const PaymentProofModal = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;

    // Function to determine image file extension from URL or fallback to jpg
    const getImageExtension = () => {
      // Try to extract extension from the URL
      if (imageUrl) {
        if (imageUrl.includes('.png')) return 'png';
        if (imageUrl.includes('.jpeg')) return 'jpeg';
        if (imageUrl.includes('.jpg')) return 'jpg';
      }

      // Default to jpg as fallback
      return 'jpg';
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
        <div className="relative max-w-4xl w-full h-[80vh] bg-purple-900/90 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b border-purple-500/30">
            <h3 className="text-xl font-bold text-white">Payment Proof</h3>
            <button
              onClick={onClose}
              className="text-purple-200 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 flex justify-center h-[calc(100%-8rem)]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Payment Proof"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-purple-200">No payment proof available</div>
            )}
          </div>

          <div className="p-4 border-t border-purple-500/30 flex justify-between">
            <a
              href={imageUrl}
              download={`payment_proof.${getImageExtension()}`}
              className="px-4 py-2 bg-blue-600/50 hover:bg-blue-700/50 text-white rounded-md flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-700/50 hover:bg-purple-800/50 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  // Helper to render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'shortlisted':
        return (
          <div className="flex items-center px-3 py-1 bg-green-500/30 backdrop-blur-sm text-green-100 rounded-full">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Shortlisted</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center px-3 py-1 bg-yellow-500/30 backdrop-blur-sm text-yellow-100 rounded-full">
            <Clock className="w-4 h-4 mr-1" />
            <span>Pending</span>
          </div>
        );
      case 'under_review':
        return (
          <div className="flex items-center px-3 py-1 bg-blue-500/30 backdrop-blur-sm text-blue-100 rounded-full">
            <Eye className="w-4 h-4 mr-1" />
            <span>Under Review</span>
          </div>
        );
      case 'pending_proposal':
        return (
          <div className="flex items-center px-3 py-1 bg-orange-500/30 backdrop-blur-sm text-orange-100 rounded-full">
            <FileText className="w-4 h-4 mr-1" />
            <span>Awaiting Proposal</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center px-3 py-1 bg-red-500/30 backdrop-blur-sm text-red-100 rounded-full">
            <XCircle className="w-4 h-4 mr-1" />
            <span>Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center px-3 py-1 bg-gray-500/30 backdrop-blur-sm text-gray-100 rounded-full">
            <span>Unknown</span>
          </div>
        );
    }
  };
  const renderPaymentStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center px-3 py-1 bg-green-500/30 backdrop-blur-sm text-green-100 rounded-full">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Approved</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center px-3 py-1 bg-yellow-500/30 backdrop-blur-sm text-yellow-100 rounded-full">
            <Clock className="w-4 h-4 mr-1" />
            <span>Pending</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center px-3 py-1 bg-red-500/30 backdrop-blur-sm text-red-100 rounded-full">
            <XCircle className="w-4 h-4 mr-1" />
            <span>Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center px-3 py-1 bg-gray-500/30 backdrop-blur-sm text-gray-100 rounded-full">
            <span>Not Submitted</span>
          </div>
        );
    }
  };
  // Loading state
 if (loading && applications.length === 0) {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #3730a3 100%)'
    }}>
      <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
  const formatTeamName = (teamName) => {
    if (!teamName) return '';

    // Check if it has commas which might indicate duplicated names
    if (teamName.includes(',')) {
      const parts = teamName.split(',').map(part => part.trim());

      // Check if it's duplicated (same name repeated)
      const uniqueNames = [...new Set(parts)];
      if (uniqueNames.length < parts.length) {
        return uniqueNames[0]; // Return just the first occurrence
      }
    }

    return teamName;
  };
  // Error state
  if (error && applications.length === 0) {
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

  // Background floating icons component
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

  // Application detail view
  if (viewMode === 'detail' && selectedApplication) {
    return (
      <div className="fixed inset-0 overflow-auto">

        {showProofModal && (
          <PaymentProofModal
            isOpen={showProofModal}
            onClose={() => {
              setShowProofModal(false);
              if (paymentProofUrl) {
                window.URL.revokeObjectURL(paymentProofUrl);
                setPaymentProofUrl(null);
              }
            }}
            imageUrl={paymentProofUrl}
          />
        )}
        <FloatingIcons />

        <div className="relative z-10 min-h-full px-4 sm:px-6 lg:px-8 py-8">
  <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setViewMode('list')} // This directly sets the view mode without using browser history
              className="flex items-center text-purple-200 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Applications List
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center text-purple-200 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5 mr-1" />
              Logout
            </button>
          </div>

          <div className="backdrop-blur-lg bg-white/10 rounded-xl shadow-2xl overflow-hidden border border-white/20">
            {/* Header with status */}
            <div className="p-6 bg-purple-900/50 backdrop-blur-md text-white flex justify-between items-center border-b border-purple-500/30">
              <div>
                <h1 className="text-2xl font-bold">Application Details</h1>
                <p className="text-purple-200">Application ID: {selectedApplication._id}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm mb-1 text-purple-200">Status:</p>
                  {renderStatusBadge(selectedApplication.applicationStatus)}
                </div>
              </div>
              {/* <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-purple-300" />
                  Account Management
                </h2>
                <div className="bg-purple-800/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                  <p className="mb-4 text-purple-200">Manage participant account:</p>
                  <button
                    onClick={() => handleResetPassword(selectedApplication)}
                    className="w-full py-2 px-4 bg-indigo-600/50 hover:bg-indigo-700/50 backdrop-blur-sm text-white rounded-md transition-colors flex items-center justify-center"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Reset Password
                  </button>
                </div>
              </div> */}
            </div>
            {(selectedApplication.applicationStatus === 'shortlisted') && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-purple-300" />
                  Payment Management
                </h2>
                <div className="bg-purple-800/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                  <div className="mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-purple-300 mb-2">Current Payment Status</p>
                        {renderPaymentStatusBadge(selectedApplication.paymentStatus || 'pending')}
                      </div>

                      {/* Always show the View Proof button for shortlisted applications */}
                      <button
                        onClick={() => fetchPayment(selectedApplication._id)}
                        className="px-3 py-2 bg-indigo-600/50 hover:bg-indigo-700/50 backdrop-blur-sm text-white rounded-md transition-colors flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Proof
                      </button>
                    </div>
                  </div>

                  <p className="mb-4 text-purple-200">Update payment status:</p>
                  <div className="space-y-3">
                    <button
                      onClick={() => updatePaymentStatus(selectedApplication._id, 'approved')}
                      disabled={statusUpdateLoading || selectedApplication.paymentStatus === 'approved'}
                      className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors ${selectedApplication.paymentStatus === 'approved'
                        ? 'bg-green-500/20 text-green-200 cursor-not-allowed'
                        : 'bg-green-600/50 text-white hover:bg-green-700/50 backdrop-blur-sm'
                        }`}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Payment
                    </button>

                    <button
                      onClick={() => updatePaymentStatus(selectedApplication._id, 'rejected')}
                      disabled={statusUpdateLoading || selectedApplication.paymentStatus === 'rejected'}
                      className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors ${selectedApplication.paymentStatus === 'rejected'
                        ? 'bg-red-500/20 text-red-200 cursor-not-allowed'
                        : 'bg-red-600/50 text-white hover:bg-red-700/50 backdrop-blur-sm'
                        }`}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column - Applicant details */}
                <div>
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-purple-300" />
                      Applicant Information
                    </h2>
                    <div className="bg-purple-800/30 backdrop-blur-sm rounded-lg p-4 space-y-4 border border-purple-500/20">
                      <div>
                        <p className="text-sm text-purple-300">Full Name</p>
                        <p className="font-medium text-white">{selectedApplication.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-300">Email</p>
                        <p className="font-medium text-white">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-300">Contact Number</p>
                        <p className="font-medium text-white">{selectedApplication.contactNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-300">Institution</p>
                        <p className="font-medium text-white">{selectedApplication.institution}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-300">T-shirt size</p>
                        <p className="font-medium text-white">{selectedApplication.tShirtSize}</p>
                      </div>
                      {hasPaymentData(selectedApplication) && (
                        <div>
                          <button
                            className="font-medium text-white flex items-center"
                            onClick={() => fetchPayment(selectedApplication._id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Payment Proof
                          </button>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-purple-300">Application Date</p>
                        <p className="font-medium text-white">
                          {new Date(selectedApplication.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>

                      </div>
                    </div>
                  </div>

                  {/* Team Information */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Building className="w-5 h-5 mr-2 text-purple-300" />
                      Team Information
                    </h2>
                    <div className="bg-purple-800/30 backdrop-blur-sm rounded-lg p-4 space-y-4 border border-purple-500/20">
                      <div>
                        <p className="text-sm text-purple-300">Participation Type</p>
                        <p className="font-medium text-white capitalize">{selectedApplication.teamType}</p>
                      </div>
                      {selectedApplication.teamType === 'team' && (
                        <>
                          <div>
                            <p className="text-sm text-purple-300">Team Name</p>
                            <p className="font-medium text-white">{formatTeamName(selectedApplication.teamName)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-purple-300">Team Size</p>
                            <p className="font-medium text-white">{selectedApplication.memberCount} members</p>
                          </div>

                          {/* Team Members Section */}
                          {selectedApplication.teamMembers && selectedApplication.teamMembers.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm text-purple-300 mb-3">Team Members:</p>
                              <div className="space-y-3">
                                {selectedApplication.teamMembers.map((member, index) => (
                                  <div
                                    key={index}
                                    className="bg-purple-700/30 p-3 rounded border border-purple-600/20"
                                  >
                                    <p className="font-medium text-white mb-2">{member.fullName}</p>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                      <p className="text-purple-200 flex items-center">
                                        <User className="w-4 h-4 mr-2 text-purple-300" />
                                        {member.email}
                                      </p>
                                      <p className="text-purple-200 flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-purple-300" />
                                        {member.contactNumber}
                                      </p>
                                      <p className="text-purple-200 flex items-center">
                                        <Building className="w-4 h-4 mr-2 text-purple-300" />
                                        {member.institution}
                                      </p>
                                      {member.tShirtSize && (
                                        <p className="text-purple-200">
                                          T-Shirt Size: {member.tShirtSize}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <div>
                        <p className="text-sm text-purple-300">Project Domain</p>
                        <p className="font-medium text-white">{selectedApplication.domain}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column - Documents and actions */}
                <div>
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-purple-300" />
                      Documents
                    </h2>
                    <div className="bg-purple-800/30 backdrop-blur-sm rounded-lg p-4 space-y-4 border border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">ID Card</p>
                          <p className="text-sm text-purple-300">{selectedApplication.idCard?.fileName || 'Not available'}</p>
                        </div>
                        {selectedApplication.idCard && (
                          <button
                            onClick={() => downloadFile(selectedApplication._id, 'idCard')}
                            className="px-3 py-2 bg-indigo-600/50 hover:bg-indigo-700/50 backdrop-blur-sm text-white rounded-md transition-colors flex items-center"
                          >
                            <DownloadCloud className="w-4 h-4 mr-1" />
                            Download
                          </button>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Project Proposal</p>
                          <p className="text-sm text-purple-300">{selectedApplication.proposalFile?.fileName || 'Not available'}</p>
                        </div>
                        {selectedApplication.proposalFile && (
                          <button
                            onClick={() => downloadFile(selectedApplication._id, 'proposalFile')}
                            className="px-3 py-2 bg-indigo-600/50 hover:bg-indigo-700/50 backdrop-blur-sm text-white rounded-md transition-colors flex items-center"
                          >
                            <DownloadCloud className="w-4 h-4 mr-1" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-purple-300" />
                      Update Status
                    </h2>
                    <div className="bg-purple-800/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                      <p className="mb-4 text-purple-200">Change the application status:</p>
                      <div className="space-y-3">
                        <button
                          onClick={() => updateApplicationStatus(selectedApplication._id, 'shortlisted')}
                          disabled={statusUpdateLoading || selectedApplication.applicationStatus === 'shortlisted'}
                          className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors ${selectedApplication.applicationStatus === 'shortlisted'
                            ? 'bg-green-500/20 text-green-200 cursor-not-allowed'
                            : 'bg-green-600/50 text-white hover:bg-green-700/50 backdrop-blur-sm'
                            }`}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Shortlist Application
                        </button>

                        <button
                          onClick={() => updateApplicationStatus(selectedApplication._id, 'under_review')}
                          disabled={statusUpdateLoading || selectedApplication.applicationStatus === 'under_review'}
                          className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors ${selectedApplication.applicationStatus === 'under_review'
                            ? 'bg-blue-500/20 text-blue-200 cursor-not-allowed'
                            : 'bg-blue-600/50 text-white hover:bg-blue-700/50 backdrop-blur-sm'
                            }`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Mark as Under Review
                        </button>

                        <button
                          onClick={() => updateApplicationStatus(selectedApplication._id, 'pending')}
                          disabled={statusUpdateLoading || selectedApplication.applicationStatus === 'pending'}
                          className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors ${selectedApplication.applicationStatus === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-200 cursor-not-allowed'
                            : 'bg-yellow-600/50 text-white hover:bg-yellow-700/50 backdrop-blur-sm'
                            }`}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Mark as Pending
                        </button>

                        <button
                          onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
                          disabled={statusUpdateLoading || selectedApplication.applicationStatus === 'rejected'}
                          className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors ${selectedApplication.applicationStatus === 'rejected'
                            ? 'bg-red-500/20 text-red-200 cursor-not-allowed'
                            : 'bg-red-600/50 text-white hover:bg-red-700/50 backdrop-blur-sm'
                            }`}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Application
                        </button>
                        <button
                          onClick={() => deleteApplication(selectedApplication._id)}
                          disabled={statusUpdateLoading}
                          className="w-full py-2 px-4 mt-4 rounded-md flex items-center justify-center transition-colors bg-red-800/50 text-white hover:bg-red-900/50 backdrop-blur-sm"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Delete Application
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }

  // Applications list view
  return (
    <div className="fixed inset-0 overflow-auto">



      <FloatingIcons />

      <div className="relative z-10 min-h-full px-4 sm:px-6 lg:px-8 py-8">
  <div className="max-w-6xl mx-auto">
        <div className="backdrop-blur-lg bg-white/10 rounded-xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-6 bg-purple-900/50 backdrop-blur-md text-white flex justify-between items-center border-b border-purple-500/30">
            <div>
              <h1 className="text-2xl font-bold">Manage Hackathon Applications</h1>
              <p className="text-purple-200">Review and manage participant applications for HackOnX </p>
            </div>
            <button
              onClick={exportToExcel}
              className="px-3 py-2 bg-indigo-600/50 hover:bg-indigo-700/50 backdrop-blur-sm text-white rounded-md transition-colors flex items-center"
            >
              <DownloadCloud className="w-4 h-4 mr-1" />
              Export to Excel
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-purple-700/50 hover:bg-purple-800/50 backdrop-blur-sm text-white rounded-md transition-colors flex items-center"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>

          {/* Filters and search */}
          <div className="p-6 border-b border-purple-500/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 md:mr-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, email or team..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-purple-800/30 backdrop-blur-sm border border-purple-500/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-5 w-5" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3">
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-purple-500/20 rounded-md px-3 py-2 bg-purple-800/30 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending_proposal">Awaiting Proposal</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <select
                    value={domainFilter}
                    onChange={(e) => setDomainFilter(e.target.value)}
                    className="border border-purple-500/20 rounded-md px-3 py-2 bg-purple-800/30 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="all">All Domains</option>
                    {domains.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={teamTypeFilter}
                    onChange={(e) => setTeamTypeFilter(e.target.value)}
                    className="border border-purple-500/20 rounded-md px-3 py-2 bg-purple-800/30 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="all">All Types</option>
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Applications list */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-500/20">
                <thead className="bg-purple-800/30 backdrop-blur-sm">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                      Team Info
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                      Domain
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                      Application Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/20">
                  {currentItems.length > 0 ? (
                    currentItems.map((application) => (
                      <tr key={application._id} className="hover:bg-purple-800/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-white">{application.fullName}</div>
                              <div className="text-sm text-purple-300">{application.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm capitalize text-white">{application.teamType}</div>
                          {application.teamType === 'team' ? (
                            <>
                              <div className="text-sm text-purple-300">
                                {formatTeamName(application.teamName)} ({application.memberCount} members)
                              </div>
                              {application.teamMembers && application.teamMembers.length > 0 && (
                                <div className="text-xs text-purple-400 mt-1">
                                  Members: {application.teamMembers.map(m => m.fullName).join(', ')}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-sm text-purple-300">
                              {application.institution} ({application.memberCount || 1} member)
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{application.domain}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(application.applicationStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                          {new Date(application.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => viewApplicationDetails(application)}
                            className="text-indigo-300 hover:text-indigo-100 flex items-center transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResetPassword(application);
                            }}
                            className="text-purple-300 hover:text-purple-100 flex items-center transition-colors"
                          >
                            <Lock className="w-4 h-4 mr-1" />
                            Reset Password
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteApplication(application._id);
                            }}
                            className="text-red-300 hover:text-red-100 flex items-center transition-colors mt-1"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-purple-300">
                        No applications found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {/* Pagination */}
            {filteredApplications.length > 0 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-purple-200">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredApplications.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredApplications.length}</span> results
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-md transition-colors ${currentPage === 1
                      ? 'bg-purple-800/20 text-purple-400 cursor-not-allowed'
                      : 'bg-purple-800/30 backdrop-blur-sm text-purple-200 hover:bg-purple-700/40 hover:text-white'
                      } border border-purple-500/20`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="px-4 py-2 border border-purple-500/20 rounded-md bg-purple-800/30 backdrop-blur-sm text-white">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-md transition-colors ${currentPage === totalPages
                      ? 'bg-purple-800/20 text-purple-400 cursor-not-allowed'
                      : 'bg-purple-800/30 backdrop-blur-sm text-purple-200 hover:bg-purple-700/40 hover:text-white'
                      } border border-purple-500/20`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showPasswordModal && selectedParticipantForPassword && (
        <ChangeParticipantPasswordModal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setSelectedParticipantForPassword(null);
          }}
          participant={selectedParticipantForPassword}
        />
      )}
    </div>
    </div>
  );
};

export default ManageHackathon;