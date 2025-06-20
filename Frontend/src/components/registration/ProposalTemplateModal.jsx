import React from 'react';
import { X } from 'lucide-react';

const ProposalTemplateModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Hackathon Proposal Template</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 text-gray-700">
          <div className="prose max-w-none">
            <h1 className="text-2xl font-bold mb-6">Hackathon Proposal: [Project Title]</h1>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Team Information</h2>
            <p><strong>Team Name:</strong></p>
            <p><strong>Team Members:</strong></p>
            <ul>
              <li>[Name] - [Role/Expertise] - [Contact Info]</li>
              <li>[Name] - [Role/Expertise] - [Contact Info]</li>
              <li>[Name] - [Role/Expertise] - [Contact Info]</li>
            </ul>
            <p><strong>Team Captain:</strong> [Name] - [Contact Info]</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Project Summary</h2>
            <p>A brief 2-3 sentence overview of your project.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Problem Statement</h2>
            <p>Describe the problem you're addressing. What pain points exist? Who is affected? Why does this matter?</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Solution Overview</h2>
            <p>Explain your proposed solution at a high level. How does it address the problem you've identified?</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Technical Implementation</h2>
            <p>Outline the technical approach to your solution.</p>
            
            <p><strong>Technology Stack:</strong></p>
            <ul>
              <li>Frontend:</li>
              <li>Backend:</li>
              <li>Database:</li>
              <li>APIs/Services:</li>
              <li>Other tools:</li>
            </ul>
            
            <p><strong>Key Features:</strong></p>
            <ul>
              <li>[Feature 1]</li>
              <li>[Feature 2]</li>
              <li>[Feature 3]</li>
            </ul>
            
            <p><strong>Technical Challenges:</strong></p>
            <p>What are the difficult technical aspects you anticipate?</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Innovation Aspects</h2>
            <p>What makes your solution innovative or unique? How is it different from existing solutions?</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Impact</h2>
            <p>Describe the potential social, environmental, or business impact of your solution.</p>
            <p><strong>Target Users/Audience:</strong></p>
            <p><strong>Potential Benefits:</strong></p>
            <p><strong>Success Metrics:</strong></p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Implementation Plan</h2>
            <p>Break down your development process into stages.</p>
            <table className="min-w-full border border-gray-300 mt-4">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Phase</th>
                  <th className="border border-gray-300 px-4 py-2">Timeframe</th>
                  <th className="border border-gray-300 px-4 py-2">Deliverables</th>
                  <th className="border border-gray-300 px-4 py-2">Team Member(s)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Research & Design</td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Core Development</td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Testing & Iteration</td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Final Polish & Demo Prep</td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
              </tbody>
            </table>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Resources Required</h2>
            <p>List the resources, tools, or support you'll need.</p>
            <p><strong>Hardware:</strong></p>
            <p><strong>Software/Services:</strong></p>
            <p><strong>Other Resources:</strong></p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Demo Plan</h2>
            <p>How will you demonstrate your project at the end of the hackathon?</p>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalTemplateModal;