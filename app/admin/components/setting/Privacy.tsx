'use client';

import React, { useState } from 'react';
import { MoveRight } from 'lucide-react';


// Defines the structure for each request option row
interface RequestOption {
  title: string;
  sub: string;
}

// Props for the individual request row component
interface RequestRowProps extends RequestOption {
  onRequest: () => void;
}
 

// RequestRow: Replicates the row structure from the image
const RequestRow: React.FC<RequestRowProps> = ({ title, sub, onRequest }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sm:py-3.5 transition-all -mx-2 px-2 rounded-xl hover:bg-gray-50/50">
    {/* Text Section */}
    <div className="flex-1 min-w-0">
      <h4 className="text-[12px] sm:text-[17px] font-semibold text-gray-900 leading-tight truncate">{title}</h4>
      <p className="text-xs text-gray-500 mt-1 sm:mt-0.5 leading-snug">{sub}</p>
    </div>
    
    {/* Action Button - Replicates the 'Request ->' look exactly */}
    <button 
      onClick={onRequest}
      className="flex items-center gap-1.5 px-3 py-2 text-sm  text-gray-900 border border-gray-100 bg-white rounded-lg hover:border-gray-200 transition-colors flex-shrink-0"
    >
      Request
      <MoveRight size={16} />
    </button>
  </div>
);




const privacyRequestOptions: RequestOption[] = [
  { 
    title: "Request Data", 
    sub: "Request a copy of your personal data stored by the platform." 
  },
  { 
    title: "Request Deletion", 
    sub: "Request deletion of some or all of your personal data." 
  },
  { 
    title: "Request Export", 
    sub: "Request export of your data in a downloadable format." 
  },
  { 
    title: "Request Correction", 
    sub: "Request to update, modify, or correct your personal information." 
  },
  { 
    title: "Manage Cookies", 
    sub: "Manage your cookie and privacy preferences." 
  },
];

// Main Privacy & Data Setting Page

export const PrivacyDataPage: React.FC = () => {
  // Static state matching the header values in the image
  const [formData, setFormData] = useState({
    name: "Tushar Pal",
    email: "tusharXXXpal@gmail.com",
  });

  // Placeholder function to handle a request action
  const handleRequest = (title: string) => {
    console.log(`Requested action for: ${title}`);
    // You would add your logic here to open a modal or send an API request
  };

  return (
    <>
      {/* Main card container, matching the dashboard pattern */}
      <div className="h-screen flex-1 max-w-7xl mx-auto bg-white border border-gray-100 rounded-2xl p-8 shadow-xs flex flex-col">
        
        <div className="flex justify-between items-start mb-6">
            <div>
          <h1 className="text-xl font-semibold text-gray-900">Privacy & Data</h1>
          <p className="text-gray-400 text-xs mt-1 font-medium leading-tight">Improve Player Performance by Our Analytics Tips</p>
          </div>
         <button 
          //onClick={handleSaveChanges}
          //disabled={updating}
          className="bg-[#0D0D12] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-all flex items-center gap-2 disabled:opacity-70"
        >
          
          Save Changes
        </button>
        </div>
        <div className="h-px bg-gray-50 w-full mt-2 mb-5" />
        
        
        {/* Content Area - Scrollable for mobile */}
        <div className="flex-1 space-y-8 overflow-y-auto pr-2 -mr-2 pt-8">
          
          {/* User & Intro Section */}
          
             <div className="flex items-center gap-4 mb-5">
                
                <div className="text-left">
                  <h2 className="text-md font-semibold text-gray-900 tracking-tight">Your Account & Data</h2>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">
                     You have several rights related to your personal information. For more detailed information, please review our full{' '}
                     <button className="text-indigo-600  hover:text-indigo-700 transition-colors">Privacy Policy</button>{' '}and{' '}
                     <button className="text-indigo-600  hover:text-indigo-700 transition-colors">Cookie Policy</button>.
                  </p>
                </div>
             </div>
          

          

          {/* Request Options Section */}
          <section className="space-y-4 pb-4">
             {privacyRequestOptions.map((option, index) => (
                <RequestRow 
                  key={option.title} 
                  title={option.title} 
                  sub={option.sub} 
                  onRequest={() => handleRequest(option.title)}
                />
             ))}
          </section>
          
          
        </div>
      </div>
    </>
  );
};