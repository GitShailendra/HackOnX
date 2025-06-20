// src/components/RewardsSection.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Gift, Award, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
const RewardsSection = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Main prize data
  const mainPrizes = [
    {
      position: "First Place",
      amount: "₹25,000",
      extras: [
        "Winner Certificate",
        "Mentorship Opportunity",
      ],
      color: "bg-gradient-to-b from-yellow-400 to-yellow-500",
      icon: <Trophy className="w-8 h-8 text-yellow-100" />
    },
    {
      position: "Second Place",
      amount: "₹15,000",
      extras: [
        "Runner-up Certificate",
        "Internship Opportunity",
      ],
      color: "bg-gradient-to-b from-gray-400 to-gray-500",
      icon: <Trophy className="w-8 h-8 text-gray-100" />
    },
    {
      position: "Third Place",
      amount: "₹10,000",
      extras: [
        "Certificate",
      ],
      color: "bg-gradient-to-b from-amber-600 to-amber-700",
      icon: <Trophy className="w-8 h-8 text-amber-100" />
    }
  ];

  // Additional benefits
  const additionalBenefits = [
    {
      title: "Participation Certificate",
      description: "Digital certificate for all participants",
      icon: <Award className="w-6 h-6" />
    },
    {
      title: "Special Mentions",
      description: "Awards for Most Innovative & Best Technical Implementation",
      icon: <Star className="w-6 h-6" />
    },
    {
      title: "Internship Opportunities",
      description: "Top performers get opportunities with our industry partners",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Goodies & Swag",
      description: "T-shirts, stickers and other merchandise for all participants",
      icon: <Gift className="w-6 h-6" />
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl mx-auto px-4"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl font-bold text-center text-gray-800 mb-12"
        >
          Rewards and Prizes
        </motion.h2>

        {/* Main Prizes */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {mainPrizes.map((prize, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-xl overflow-hidden shadow-md"
            >
              {/* Prize Header */}
              <div className={`${prize.color} p-6 text-center relative`}>
                <div className="absolute top-4 left-4">
                  {prize.icon}
                </div>
                <h3 className="text-xl font-bold text-white mt-6">{prize.position}</h3>
                <div className="text-3xl font-bold text-white mt-2 mb-2">{prize.amount}</div>
              </div>
              
              {/* Prize Details */}
              <div className="p-6">
                <ul className="space-y-3">
                  {prize.extras.map((extra, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">{extra}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Benefits */}
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
            Additional Benefits
          </h3>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {additionalBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-sm text-center"
            >
              <motion.div 
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {benefit.icon}
              </motion.div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{benefit.title}</h4>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-6">
            Join HackOnX and compete for these exciting prizes and opportunities!
          </p>
          <Link
                        to="/register"
                        className={`px-6 py-2 rounded-full font-medium transition-all ${isScrolled
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-transparent'
                          }`}
                        style={{ opacity: isScrolled ? 1 : 0 }}
                      >
                        Register Now
                      </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RewardsSection;