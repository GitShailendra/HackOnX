import React, { useState } from 'react';
import { Mail, Users, FileText, Upload, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import axios from 'axios'
import { useAuth } from "../../auth/AuthContext";

import { useNavigate, Link } from 'react-router-dom';
import ProposalTemplateModal from './ProposalTemplateModal'
const RegistrationForm = () => {
  // Display state
  const { login } = useAuth()

  const [showProposalTemplate, setShowProposalTemplate] = useState(false);

  // const devUrl = 'http://localhost:5000'
 const devUrl = "https://hackonx.onrender.com"
   const navigate = useNavigate();
  // Form state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Account information
    email: '',
    password: '',
    confirmPassword: '',

    // Personal information
    fullName: '',
    contactNumber: '',
    institution: '',
    idCard: null,
    tShirtSize: '', // Added t-shirt size for team lead

    // Team information
    teamType: 'individual', // individual or team
    teamName: '',
    memberCount: 1,
    teamMembers: [], // Array to store team members' details

    // Proposal information
    domain: '',
    proposalFile: null,

    // Form status
    isSubmitting: false,
    isSubmitted: false,
    error: null,
    heardAboutUs: ''
  });

  // Domains available for selection
  const domains = [
    'AI & ML',
    'IOT & Hardware',
    'Wev Dev',
    'CYBERSECURITY & BLOCKCAHIN',
    'Web3',
    'OPEN DOMAIN'
  ];

  // T-shirt sizes available for selection
  const tShirtSizes = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL'
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else if (name === 'memberCount' && formData.teamType === 'team') {
      // Handle member count change for team
      const newCount = parseInt(value, 10);
      const currentMembers = [...formData.teamMembers];
      const newMembersArray = [];

      // Preserve existing member data if decreasing
      for (let i = 0; i < newCount - 1; i++) {
        if (i < currentMembers.length) {
          newMembersArray.push(currentMembers[i]);
        } else {
          // Add new empty member object if increasing
          newMembersArray.push({
            fullName: '',
            email: '',
            contactNumber: '',
            institution: '',
            tShirtSize: ''
          });
        }
      }

      setFormData({
        ...formData,
        memberCount: newCount,
        teamMembers: newMembersArray
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    // Validate 10 digit phone number (removes spaces, dashes, and parentheses before checking)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return cleanPhone.length === 10 && /^\d+$/.test(cleanPhone);
  };
  const isValidName = (name) => {
    const nameRegex = /^[A-Za-z\s\-'\.]+$/;
    // Name should be at least 2 characters long
    return name.length >= 3 && nameRegex.test(name);
  };

  // Handle team type selection
  const handleTeamTypeChange = (type) => {
    if (type === 'team') {
      // Initialize team members array with empty objects based on member count
      // Force memberCount to be 2 initially when switching to team
      const membersCount = 2;
      const initialTeamMembers = Array(membersCount - 1).fill().map(() => ({
        fullName: '',
        email: '',
        contactNumber: '',
        institution: '',
        tShirtSize: ''
      }));

      setFormData({
        ...formData,
        teamType: type,
        teamName: formData.teamName || '',
        memberCount: membersCount,
        teamMembers: initialTeamMembers
      });
    } else {

      setFormData({
        ...formData,
        teamType: type,
        memberCount: 1,
        teamMembers: []
      });
    }
  };

  // Handle team member input changes
  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];

    // Ensure the member exists in the array
    if (!updatedMembers[index]) {
      updatedMembers[index] = {
        fullName: '',
        email: '',
        contactNumber: '',
        institution: '',
        tShirtSize: ''
      };
    }

    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };

    setFormData({
      ...formData,
      teamMembers: updatedMembers
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object
    const formDataToSubmit = new FormData();

    // Append all form fields
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('password', formData.password);
    formDataToSubmit.append('fullName', formData.fullName);
    formDataToSubmit.append('contactNumber', formData.contactNumber);
    formDataToSubmit.append('institution', formData.institution);
    formDataToSubmit.append('tShirtSize', formData.tShirtSize);
    formDataToSubmit.append('teamType', formData.teamType);
    formDataToSubmit.append('teamName', formData.teamName); // Always submit team name
    formDataToSubmit.append('domain', formData.domain);
    formDataToSubmit.append('heardAboutUs', formData.heardAboutUs);
    // Append team-related fields if applicable
    if (formData.teamType === 'team') {
      formDataToSubmit.append('teamName', formData.teamName);
      formDataToSubmit.append('memberCount', formData.memberCount);

      // Append team members data as JSON string
      formDataToSubmit.append('teamMembers', JSON.stringify(formData.teamMembers));
    }

    // Append files
    if (formData.idCard) {
      formDataToSubmit.append('idCard', formData.idCard);
    }

    if (formData.proposalFile) {
      formDataToSubmit.append('proposalFile', formData.proposalFile);
    }

    setFormData({
      ...formData,
      isSubmitting: true,
      error: null
    });

    try {
      const response = await axios.post(`${devUrl}/hackathon/register`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('reponse', response)
      const { token, participant } = response.data
      const userData = {
        ...participant,
        userType: 'HackOnXUser',
      };
      if (response.status === 201) {
        // Store token in localStorage
        login(token, userData)
        navigate('/hackathon-dashboard')
        // Redirect to dashboard or show success message
        // window.location.href = '/hackathon-dashboard';

        // Redirect to dashboard or show success message
        // window.location.href = '/dashboard'; // Replace with your dashboard route
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setFormData({
        ...formData,
        isSubmitting: false,
        error: error.response?.data?.message || 'There was an error submitting your registration. Please try again.'
      });
    }
  };

  // Navigation between form steps
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Rendering different steps of the form
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderAccountStep();
      case 2:
        return renderPersonalInfoStep();
      case 3:
        return renderTeamInfoStep();
      case 4:
        return renderProposalStep();
      case 5:
        return renderReviewStep();
      default:
        return renderAccountStep();
    }
  };

  // Step 1: Create an Account
  const renderAccountStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Create an Account</h3>
      <p className="text-gray-600 mb-6">Sign up using your email ID to create a participant profile.</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="youremail@example.com"
          />
          {formData.email && !isValidEmail(formData.email) && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Create a secure password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm your password"
          />
          {formData.password && formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
        </div>
        <div>
          <label htmlFor="heardAboutUs" className="block text-sm font-medium text-gray-700 mb-1">
            Where Did You Hear About Us? *
          </label>
          <select
            id="heardAboutUs"
            name="heardAboutUs"
            required
            value={formData.heardAboutUs}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select an option</option>
            <option value="Social Media">Social Media</option>
            <option value="Offline Poster">Offline Posters</option>
            <option value="Whatsapp">Whatsapp</option>
            <option value="Friends Family">Friends & Family</option>
            <option value="University">University</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Step 2: Personal Information
  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
      <p className="text-gray-600 mb-6">Please provide your personal details.</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
          />
          {formData.fullName && !isValidName(formData.fullName) && (
            <p className="text-red-500 text-sm mt-1">Name should only contain letters, spaces, and special characters (-'.) and be at least 3 characters long</p>
          )}
        </div>

        <div>
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <input
            id="contactNumber"
            name="contactNumber"
            type="tel"
            required
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your contact number"
          />
          {formData.contactNumber && !isValidPhone(formData.contactNumber) && (
            <p className="text-red-500 text-sm mt-1">Phone number must be 10 digits</p>
          )}
        </div>

        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
            Educational Institution/Organization
          </label>
          <input
            id="institution"
            name="institution"
            type="text"
            required
            value={formData.institution}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your institution or organization"
          />
        </div>

        <div>
          <label htmlFor="tShirtSize" className="block text-sm font-medium text-gray-700 mb-1">
            T-Shirt Size
          </label>
          <select
            id="tShirtSize"
            name="tShirtSize"
            required
            value={formData.tShirtSize}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select your t-shirt size</option>
            {tShirtSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="idCard" className="block text-sm font-medium text-gray-700 mb-1">
            ID Card Upload (Mandatory)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="idCard"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="idCard"
                    name="idCard"
                    type="file"
                    className="sr-only"
                    onChange={handleChange}
                    required
                    accept='.pdf, .jpg '
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, PDF up to 10MB
              </p>
              {formData.idCard && (
                <p className="text-sm text-green-500">
                  File selected: {formData.idCard.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3: Team Information
  const renderTeamInfoStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Team Information</h3>
      <p className="text-gray-600 mb-6">Either register individually or create/join a team.</p>

      <div className="space-y-4">
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">
            Participation Type
          </span>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleTeamTypeChange('individual')}
              className={`px-4 py-2 rounded-md ${formData.teamType === 'individual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => handleTeamTypeChange('team')}
              className={`px-4 py-2 rounded-md ${formData.teamType === 'team'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
            >
              Team
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
            Team Name
          </label>
          <input
            id="teamName"
            name="teamName"
            type="text"
            required
            value={formData.teamName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your team name"
          />
          {!formData.teamName && (
            <p className="mt-1 text-sm text-red-500">Team name is required regardless of participation type</p>
          )}
        </div>

        {formData.teamType === 'team' && (
          <>

            <div>
              <label htmlFor="memberCount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Members (including yourself)
              </label>
              <select
                id="memberCount"
                name="memberCount"
                value={formData.memberCount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {[2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} members
                  </option>
                ))}
              </select>
            </div>

            {/* Team Members Information - Always show when team type is selected */}
            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Team Member Details</h4>
              <p className="text-gray-600 mb-6">Please provide details of all team members (excluding yourself).</p>

              {/* Force render team member fields even if array is empty */}
              {Array.from({ length: formData.memberCount - 1 }).map((_, index) => {
                // Get member data if available, otherwise use empty object
                const member = formData.teamMembers[index] || {
                  fullName: '',
                  email: '',
                  contactNumber: '',
                  institution: '',
                  tShirtSize: ''
                };

                return (
                  <div key={index} className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <h5 className="font-medium text-gray-700 mb-4">Team Member {index + 2}</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={member.fullName}
                          onChange={(e) => handleTeamMemberChange(index, 'fullName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter team member's full name"
                        />
                        {member.fullName && !isValidName(member.fullName) && (
                          <p className="text-red-500 text-sm mt-1">Name should only contain letters, spaces, and special characters (-'.) and be at least 3 characters long</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={member.email}
                          onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter team member's email"
                        />
                        {member.email && !isValidEmail(member.email) && (
                          <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={member.contactNumber}
                          onChange={(e) => handleTeamMemberChange(index, 'contactNumber', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter team member's contact number"
                        />
                        {member.contactNumber && !isValidPhone(member.contactNumber) && (
                          <p className="text-red-500 text-sm mt-1">Phone number must be 10 digits</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Educational Institution/Organization
                        </label>
                        <input
                          type="text"
                          required
                          value={member.institution}
                          onChange={(e) => handleTeamMemberChange(index, 'institution', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter team member's institution"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          T-Shirt Size
                        </label>
                        <select
                          required
                          value={member.tShirtSize}
                          onChange={(e) => handleTeamMemberChange(index, 'tShirtSize', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="" disabled>Select t-shirt size</option>
                          {tShirtSizes.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Step 4: Proposal Information
  const renderProposalStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Submit Proposal</h3>
      <p className="text-gray-600 mb-6">
        Upload your innovative project proposal. <span className="font-medium">This step is optional</span> - you can submit your proposal later from your dashboard.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
            Project Domain
          </label>
          <select
            id="domain"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select a domain</option>
            {domains.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="proposalFile" className="block text-sm font-medium text-gray-700 mb-1">
            Project Proposal (Optional)
          </label>
          <span>Don't know the structure of project proposal? <button
            type="button"
            onClick={() => setShowProposalTemplate(true)}
            className='text-blue-600 underline'
          >
            click here!
          </button></span>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="proposalFile"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="proposalFile"
                    name="proposalFile"
                    type="file"
                    className="sr-only"
                    onChange={handleChange}
                    accept='application/pdf'
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF document up to 10MB
              </p>
              {formData.proposalFile && (
                <p className="text-sm text-green-500">
                  File selected: {formData.proposalFile.name}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
            <strong>Note:</strong> If you skip this step now, you must submit your project proposal later from your dashboard. Applications without proposals will not be considered for the final selection.
          </div>
        </div>
      </div>

      {/* Add the modal component */}
      <ProposalTemplateModal isOpen={showProposalTemplate} onClose={() => setShowProposalTemplate(false)} />
    </div>
  );

  // Step 5: Review Information
  const renderReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Review Your Information</h3>
      <p className="text-gray-600 mb-6">Please review all the information before submission.</p>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-800 mb-2">Account Information</h4>
          <p className="text-gray-600">Email: {formData.email}</p>
          <p className="text-gray-600">Heard About Us: {formData.heardAboutUs}</p>

        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-800 mb-2">Personal Information</h4>
          <p className="text-gray-600">Full Name: {formData.fullName}</p>
          <p className="text-gray-600">Contact Number: {formData.contactNumber}</p>
          <p className="text-gray-600">Institution: {formData.institution}</p>
          <p className="text-gray-600">T-Shirt Size: {formData.tShirtSize}</p>
          <p className="text-gray-600">ID Card: {formData.idCard ? formData.idCard.name : 'Not uploaded'}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-800 mb-2">Team Information</h4>
          <p className="text-gray-600">Participation Type: {formData.teamType === 'individual' ? 'Individual' : 'Team'}</p>
          {formData.teamType === 'team' && (
            <>
              <p className="text-gray-600">Team Name: {formData.teamName}</p>
              <p className="text-gray-600">Number of Members: {formData.memberCount}</p>

              {formData.teamMembers.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Team Members:</h5>
                  <div className="space-y-3">
                    {formData.teamMembers.map((member, index) => (
                      <div key={index} className="pl-4 border-l-2 border-gray-300">
                        <p className="text-gray-600"><strong>Member {index + 2}:</strong> {member.fullName}</p>
                        <p className="text-gray-600">Email: {member.email}</p>
                        <p className="text-gray-600">Contact: {member.contactNumber}</p>
                        <p className="text-gray-600">Institution: {member.institution}</p>
                        <p className="text-gray-600">T-Shirt Size: {member.tShirtSize}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-800 mb-2">Proposal Information</h4>
          <p className="text-gray-600">Domain: {formData.domain}</p>
          <p className="text-gray-600">Proposal File: {formData.proposalFile ? formData.proposalFile.name : 'Not uploaded (Can be submitted later)'}</p>
          {!formData.proposalFile && (
            <p className="text-amber-600 mt-2 text-sm">
              <strong>Remember:</strong> You'll need to submit your proposal after registration from your dashboard.
            </p>
          )}
        </div>
      </div>
    </div>
  );



  // Render success message after form submission
  const renderSuccessMessage = () => (
    <div className="text-center py-12">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h3>
      <p className="text-gray-600 mb-8">
        A confirmation email has been sent to {formData.email} with further details.
      </p>
      {!formData.proposalFile && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-8 mx-auto max-w-md">
          <h4 className="font-bold text-amber-700 mb-2">Important Reminder</h4>
          <p className="text-amber-700 mb-2">
            You haven't submitted a project proposal yet. Please login to your dashboard to submit it as soon as possible.
          </p>
          <p className="text-amber-700">
            Applications without proposals will not be considered for the final selection.
          </p>
        </div>
      )}
      <p className="text-gray-600 mb-4">
        Our review panel will evaluate your application and shortlist candidates for the next phase.
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          to="/Hackathon-login"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <LogIn className="mr-2 h-5 w-5" />
          Login to Dashboard
        </Link>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );


  // Helper function to check if current step is valid
  // Helper function to check if current step is valid
  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          formData.email &&
          isValidEmail(formData.email) &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.heardAboutUs
        );
      case 2:
        return (
          formData.fullName &&
          isValidName(formData.fullName) &&
          formData.contactNumber &&
          isValidPhone(formData.contactNumber) &&
          formData.institution &&
          formData.tShirtSize &&
          formData.idCard
        );
      case 3:
        // Always require team name
        if (!formData.teamName) {
          return false;
        }

        // For team participation type, check additional requirements
        if (formData.teamType === 'team') {
          // Check if member count is filled
          if (!formData.memberCount) {
            return false;
          }

          // Check if all team members have required information
          return formData.teamMembers.every(member => (
            member.fullName &&
            isValidName(member.fullName) &&
            member.email &&
            isValidEmail(member.email) &&
            member.contactNumber &&
            isValidPhone(member.contactNumber) &&
            member.institution &&
            member.tShirtSize
          ));
        }

        // For individual participation, only teamName is required
        return true;

      case 4:
        return formData.domain;
      default:
        return true;
    }
  };

  // Main render
  if (formData.isSubmitted) {
    return renderSuccessMessage();
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Register for HackOnX 2025
      </h2>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {['Account', 'Personal', 'Team', 'Proposal', 'Review'].map((label, index) => (
            <div
              key={label}
              className={`flex flex-col items-center ${index + 1 === step ? 'text-blue-600' : index + 1 < step ? 'text-green-500' : 'text-gray-400'
                }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${index + 1 === step
                ? 'border-blue-600 bg-blue-50'
                : index + 1 < step
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
                }`}>
                {index + 1 < step ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-xs mt-1">{label}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(step - 1) * 25}%` }}
          />
        </div>
      </div>

      {/* Form error message */}
      {formData.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{formData.error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {renderStep()}

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`ml-auto px-6 py-2 rounded-md transition-colors ${isStepValid()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={formData.isSubmitting}
              className={`ml-auto px-6 py-2 bg-blue-600 text-white rounded-md transition-colors ${formData.isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
            >
              {formData.isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          )}
        </div>
      </form>

      {/* Already have an account link */}
      <div className="text-center mt-8 pt-6 border-t border-gray-200">
        <Link
          to="/new-participant-login"
          className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center mx-auto"
        >
          <LogIn className="mr-2 h-5 w-5" />
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegistrationForm;