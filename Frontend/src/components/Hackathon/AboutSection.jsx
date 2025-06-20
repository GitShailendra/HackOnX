// src/components/AboutSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Code, Shield, Lightbulb, Award, Clock, Users } from 'lucide-react';

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const domains = [
    {
      icon: <Cpu className="w-8 h-8 text-blue-500" />,
      name: "Artificial Intelligence & Machine Learning",
      description: "Develop AI/ML solutions that address real-world problems."
    },
    {
      icon: <Code className="w-8 h-8 text-green-500" />,
      name: "IoT & Hardware",
      description: "Create innovative hardware solutions and IoT applications."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      name: "Cybersecurity & Blockchain",
      description: "Build secure systems using cutting-edge security technologies and blockchain."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      name: "Open Innovation",
      description: "Freedom to innovate across domains and create unique solutions."
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-10 px-4"
    >
      {/* Header section */}
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">About HACKONX</h2>
        <p className="text-gray-600 text-lg">
          HACKONX is an exciting hackathon that brings together aspiring innovators, developers, and tech enthusiasts
          to collaborate and push the boundaries of technology.
        </p>
      </motion.div>

      {/* Main description */}
      <motion.div variants={itemVariants} className="bg-blue-50 p-8 rounded-xl">
        <p className="text-gray-700 leading-relaxed">
          Organized by the Electronics and Communication Department of Dayananda Sagar Academy of Technology and Management,
          this 8-hour coding marathon challenges participants in cutting-edge domains. With a grand prize pool of INR 50,000,
          the event fosters creativity, problem-solving, and teamwork. The hackathon culminates with a valedictory ceremony
          featuring a cultural show, an award distribution, and a guest appearance, making it a celebration of talent and innovation.
        </p>
      </motion.div>

      {/* Domains */}
      <motion.div variants={itemVariants}>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Hackathon Domains</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map((domain, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-start">
                <div className="p-3 rounded-lg bg-gray-50">
                  {domain.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{domain.name}</h3>
                  <p className="text-gray-600">{domain.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Event highlights */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Event Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
            <h4 className="text-lg font-semibold mb-2">₹50,000 Prize Pool</h4>
            <p className="text-gray-600">Compete for exciting cash prizes and recognition</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="text-lg font-semibold mb-2">8-Hour Marathon</h4>
            <p className="text-gray-600">Intensive coding challenge to test your skills</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Valedictory Ceremony</h4>
            <p className="text-gray-600">Cultural show and award distribution</p>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div variants={itemVariants} className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Join Us for a Day of Innovation</h3>
        <p className="text-gray-600 mb-6">
          Be part of this exciting journey where ideas transform into reality and innovation takes center stage.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AboutSection;