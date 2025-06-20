import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import axios from 'axios'
const Footer = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newEmail = {
      email
    }
    const url = "https://skillonx-server.onrender.com/"

    try{
      const res = await axios.post('https://skillonx-server.onrender.com/stayconnected', newEmail)
      // console.log("Email Saved Successful:", res.data);

    }catch(e){
      console.error("Error  in email saving:", e);

    }


  }
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">SkillonX</h2>
            <p className="text-gray-300">Empowering tech enthusiasts worldwide with cutting-edge skills and industry-relevant education.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Learn</h3>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-gray-300 hover:text-white">All Courses</Link></li>
              <li><Link to="/paths" className="text-gray-300 hover:text-white">Learning Paths</Link></li>
              <li><Link to="/certifications" className="text-gray-300 hover:text-white">Certifications</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white">Tech Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-300 hover:text-white">Help Center</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQs</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Career */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Career</h3>
            <ul className="space-y-2">
              <li><Link to="/job-board" className="text-gray-300 hover:text-white">Job Board</Link></li>
              <li><Link to="/career-services" className="text-gray-300 hover:text-white">Career Services</Link></li>
              <li><Link to="/mentorship" className="text-gray-300 hover:text-white">Mentorship</Link></li>
              <li><Link to="/hire-graduates" className="text-gray-300 hover:text-white">Hire Our Graduates</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
          <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest tech insights and updates.</p>
          <form onSubmit={handleSubmit} className="flex max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e)=>setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social Media and Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-gray-300 hover:text-white"><Facebook size={24} /></a>
            <a href="#" className="text-gray-300 hover:text-white"><Linkedin size={24} /></a>
          </div>
          <div className="text-gray-300 text-sm">
            © {new Date().getFullYear()} SkillonX. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;