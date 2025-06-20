import React, { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Phone, MessageCircle, ExternalLink, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';

const RegistrationPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-0">
      {/* Simple Header */}
      <header className="bg-[#5D4FE0] text-white py-10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link to="/hackathon" className="absolute left-4 top-4 inline-flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back</span>
          </Link>

          <div className="pt-6">
            <h5 className="text-lg font-normal mb-2">
              HACKONX
            </h5>
            <h1 className="text-5xl sm:text-6xl font-bold">
              Registration
            </h1>
          </div>
        </div>
      </header>

      {/* Registration Steps Info */}
      <div className="max-w-4xl mx-auto px-4 mb-12 mt-16">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Registration Process</h2>
          <ol className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">1</span>
              <span><strong>Create an Account</strong> – Sign up using your email ID and create a participant profile.</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">2</span>
              <span><strong>Form a Team</strong> – Either register individually or create/join a team.</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">3</span>
              <span><strong>Fill the Registration Form</strong> - Provide required personal and team details.</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">4</span>
              <span><strong>Submit Proposal</strong> – Upload your innovative project proposal.</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">5</span>
              <span><strong>Confirmation Email</strong> – Once registered successfully, a confirmation email with further details will be sent.</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">6</span>
              <span><strong>Await Shortlisting</strong> – The review panel will evaluate proposals and shortlist candidates for the next phase.</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Contact Organizers Section */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Contact Organizers
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 relative z-10">
            <ContactCard
              title="Coordinator 1"
              email="madan@skiilonx.net"
              icon={<Mail className="w-5 h-5" />}
            />



            <ContactCard
              title="Coordinator 3"
              email="akashayk2524@gmail.com"
              icon={<Mail className="w-5 h-5" />}
            />

            <ContactCard
              title="Mail Office"
              email="ateeqbeme07@gmail.com"
              icon={<Mail className="w-5 h-5" />}
            />
          </div>

          <div className="text-center mt-8 text-blue-100">
            <p>Have questions? Feel free to contact any of our organizers for assistance.</p>
          </div>
        </div>
      </div>

      {/* Available Domains */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Domains</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Artificial Intelligence & Machine Learning</h3>
              <p className="text-sm text-gray-600">
                Projects focused on machine learning, natural language processing, computer vision, and other AI technologies.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-medium text-purple-800 mb-2">IOT & HARDWARE</h3>
              <p className="text-sm text-gray-600">
                Building smart IoT systems and hardware-based solutions using sensors, microcontrollers, and real-time data processing for automation and connectivity.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-medium text-green-800 mb-2">CYBERSECURITY & BLOCKCHAIN</h3>
              <p className="text-sm text-gray-600">
                Developing secure digital solutions through encryption, network protection, and leveraging blockchain for decentralized and tamper-proof systems.
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="font-medium text-green-800 mb-2">Open Innovation</h3>
              <p className="text-sm text-gray-600">
                Any innovative technology solution that doesn't fit the other categories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="max-w-6xl mx-auto px-4">
        <RegistrationForm />
      </div>
    </div>
  );
};

// Contact Card Component
const ContactCard = ({ title, email, icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={`mailto:${email}`}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 block w-full transform transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full ${isHovered ? 'bg-white text-blue-600' : 'bg-white/10'} transition-colors duration-300`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className={`transition-colors duration-300 truncate overflow-hidden text-sm ${isHovered ? 'text-blue-200' : 'text-blue-100'}`}>
            {email}
          </p>
          <div className={`mt-2 flex items-center text-sm transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <span className="font-medium">Email Now</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default RegistrationPage;