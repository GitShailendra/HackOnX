// src/components/EligibilitySection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Users, BookOpen, Award, GraduationCap } from 'lucide-react';

const EligibilitySection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const categories = [
    {
      title: "Engineering Students",
      description: "Currently enrolled in any engineering discipline",
      icon: <GraduationCap className="w-6 h-6" />,
      requirements: [
        "Any year of study",
        "Any engineering branch"
      ]
    },
    {
      title: "MBA Students",
      description: "Pursuing Master of Business Administration",
      icon: <BookOpen className="w-6 h-6" />,
      requirements: [
        "First or second year MBA",
        "Interest in technology"
      ]
    },
    {
      title: "PG M.Tech Students",
      description: "Postgraduate students in M.Tech programs",
      icon: <Award className="w-6 h-6" />,
      requirements: [
        "Any specialization",
        "Any year of study"
      ]
    },
    {
      title: "UG BSc Students",
      description: "Undergraduate BSc degree students",
      icon: <Users className="w-6 h-6" />,
      requirements: [
        "Any science discipline",
        "Any year of study"
      ]
    }
  ];

  const teamRules = [
    "Team size: 1-4 members",
    "Cross-institution teams allowed",
    "At least one member with coding experience",
    "Mix of backgrounds encouraged"
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4"
    >
      <motion.h2
        variants={itemVariants}
        className="text-3xl font-bold text-center text-gray-800 mb-8"
      >
        Who Can Participate?
      </motion.h2>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-blue-500">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {category.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <ul className="space-y-2">
              {category.requirements.map((req, idx) => (
                <li key={idx} className="flex items-center text-gray-600">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  {req}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Team Requirements */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Team Formation Rules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamRules.map((rule, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2 text-gray-700"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check className="w-4 h-4 text-green-500" />
              <span>{rule}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* <motion.div
        variants={itemVariants}
        className="mt-8 bg-blue-50 rounded-xl p-6 text-center"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Registration Process
        </h3>
        <p className="text-gray-600">
          Registration is now closed. Thank you for your interest in HACKONX 2.0.
        </p>
      </motion.div> */}
    </motion.div>
  );
};

export default EligibilitySection;