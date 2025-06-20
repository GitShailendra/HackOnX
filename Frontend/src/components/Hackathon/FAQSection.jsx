// src/components/FAQSection.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Mail, MessageCircle, ExternalLink, User, Phone, Send } from 'lucide-react';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setSubmitStatus(null);
      }, 3000);
    }, 1500);
  };

  const faqs = [
    {
      question: "Who can participate in HACKONX",
      answer: "HACKONX is open to Engineering Students, MBA Students, Postgraduate and Undergraduate students who are passionate about AI and ML technologies. Professionals with an interest in technology innovation are also welcome to apply."
    },
    {
      question: "How can I register for the event?",
      answer: "Registration can be completed through our official website by clicking on the 'Register' button. You'll need to provide basic information about yourself and your team members, if applicable. After registration, you'll receive a confirmation email with further instructions."
    },
    {
      question: "Can I participate individually, or do I need a team?",
      answer: "Teams should consist of 2-4 members. However, individual participants can also register and we will help match you with other participants to form a team based on complementary skills and interests."
    },
    {
      question: "What should be included in the proposal submission?",
      answer: "Your proposal should include a clear problem statement, your proposed solution, technical architecture, implementation plan, and potential impact. It's important to highlight the innovation aspect and how your solution leverages AI/ML technologies. Detailed guidelines will be provided after registration."
    },
    {
      question: "What happens after the proposal submission?",
      answer: "After submission, all proposals will be reviewed by our panel of experts. Shortlisted teams will be invited to the next round where they will develop prototypes. Finalists will present their solutions during the main event. Results and feedback will be provided at each stage."
    },
    {
      question: "Will there be mentorship during the event?",
      answer: "Yes, we provide comprehensive mentorship throughout the event. Industry experts and technical specialists will be available to guide teams, provide feedback, and help overcome challenges. Mentorship sessions will be scheduled regularly, and teams can also request specific assistance when needed."
    },
    {
      question: "Do I need prior hackathon experience?",
      answer: "No, prior hackathon experience is not required. We welcome participants of all experience levels who are enthusiastic about technology and innovation. We provide resources, workshops, and mentorship to help everyone participate effectively regardless of their previous experience."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 pb-16"
    >
      <motion.h2
        variants={itemVariants}
        className="text-3xl font-bold text-center text-gray-800 mb-8"
      >
        Frequently Asked Questions
      </motion.h2>

      <motion.div variants={containerVariants} className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <motion.button
              onClick={() => toggleQuestion(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              whileHover={{ backgroundColor: "rgba(240, 240, 250, 1)" }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Contact Support with Form */}
      <motion.div
        variants={itemVariants}
        className="mt-16 rounded-xl overflow-hidden shadow-xl"
      >
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white">
          <motion.h3
            className="text-2xl font-bold mb-4 text-center"
            variants={itemVariants}
          >
            Didn't find what you're looking for?
          </motion.h3>

          <motion.p
            className="text-center mb-6 text-blue-100 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Our team is ready to assist you with any queries about HACKONX. Fill out the form below and we'll get back to you as soon as possible.
          </motion.p>
        </div>

        <div className="bg-white p-8">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={containerVariants}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Name Field */}
              <motion.div variants={itemVariants} className="relative">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants} className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="example@email.com"
                  />
                </div>
              </motion.div>

              {/* Phone Field */}
              <motion.div variants={itemVariants} className="relative">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
              </motion.div>

              {/* Message Field */}
              <motion.div variants={itemVariants} className="relative md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </span>
                )}
              </motion.button>
            </motion.div>

            {/* Success Message */}
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-green-600 bg-green-50 p-3 rounded-md"
                >
                  Thank you! Your message has been sent successfully.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Coordinator Contact Information */}
          <motion.div
            variants={containerVariants}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <motion.h4
              variants={itemVariants}
              className="text-lg font-semibold text-gray-800 mb-4 text-center"
            >
              Or contact our coordinators directly
            </motion.h4>

            <motion.div
              className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"
              variants={containerVariants}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Contact Card Component with Framer Motion
const ContactCard = ({ title, email, icon }) => {
  return (
    <motion.a
      href={`mailto:${email}`}
      className="bg-gray-50 rounded-xl p-4 block w-full border border-gray-100"
      whileHover={{
        scale: 1.03,
        backgroundColor: "rgba(239, 246, 255, 1)",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)"
      }}
    >
      <div className="flex items-start space-x-4">
        <motion.div
          className="p-3 rounded-full bg-blue-100 text-blue-600"
          whileHover={{ backgroundColor: "#3b82f6", color: "#ffffff" }}
        >
          {icon}
        </motion.div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-500 truncate overflow-hidden text-sm">
            {email}
          </p>
          <motion.div
            className="mt-2 flex items-center text-sm text-blue-600 opacity-0"
            whileHover={{ opacity: 1 }}
          >
            <span className="font-medium">Email Now</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
};

export default FAQSection;