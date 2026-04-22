"use client";

import React, { useState, useEffect } from 'react';

// 1. Define the Interface
interface Ground {
  id: string;
  name: string;
  location: string;
  pitchType?: string;
  straightBoundary?: string;
  sideBoundary?: string;
  tournaments?: any[];
}

interface CricketGroundProps {
  selectedGroundId: string | null;
  onGroundSelect: (id: string) => void;
}

export default function CricketGround({ selectedGroundId, onGroundSelect }: CricketGroundProps) {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_Backend_URL}/ground/all`);
        if (response.ok) {
          const data: Ground[] = await response.json();
          setGrounds(data);
          
          // Optional: Auto-select the first ground on initial load if none is selected
          if (data.length > 0 && !selectedGroundId) {
            onGroundSelect(data[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching grounds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrounds();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-xs w-full">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="flex gap-4">
              <div className="h-40 bg-slate-200 rounded-[24px] w-[320px]"></div>
              <div className="h-40 bg-slate-200 rounded-[24px] w-[320px]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-4 rounded-[24px] border border-gray-200 shadow-xs flex-grow w-full overflow-hidden">
      <h1 className='font-bold text-2xl text-slate-900 mb-4'>Cricket Grounds</h1>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {grounds.length > 0 ? (
          grounds.map((g, i) => {
            const isActive = selectedGroundId === g.id;
            
            return (
              <div 
                key={g.id || i} 
                onClick={() => onGroundSelect(g.id)}
                className={`min-w-[320px] flex-1 p-4 rounded-[24px]  transition-all cursor-pointer relative overflow-hidden ${
                  isActive 
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs border-l-2' 
                    : 'border-slate-200 border bg-white '
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`z-10 text-[10px] font-bold px-2 py-1 rounded-md ${
                    isActive ? 'bg-[#CEA700] text-[#987d06]' : 'bg-[#A3E9D2] text-[#1E7F64]'
                  }`}>
                    {isActive ? 'Active Venue' : 'Upcoming'}
                  </span>
                  
                  <div className='absolute top-6 right-6 transition-opacity '>
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 12.5V2.5L12.5 7.5L2.5 12.5ZM40 12.5V2.5L50 7.5L40 12.5ZM22.5 10V0L32.5 5L22.5 10ZM22.5 50C19.3333 49.9167 16.3854 49.6562 13.6562 49.2188C10.9271 48.7812 8.55208 48.2292 6.53125 47.5625C4.51042 46.8958 2.91667 46.125 1.75 45.25C0.583333 44.375 0 43.4583 0 42.5V20C0 18.9583 0.65625 17.9896 1.96875 17.0938C3.28125 16.1979 5.0625 15.4062 7.3125 14.7188C9.5625 14.0312 12.2083 13.4896 15.25 13.0938C18.2917 12.6979 21.5417 12.5 25 12.5C28.4583 12.5 31.7083 12.6979 34.75 13.0938C37.7917 13.4896 40.4375 14.0312 42.6875 14.7188C44.9375 15.4062 46.7188 16.1979 48.0312 17.0938C49.3438 17.9896 50 18.9583 50 20V42.5C50 43.4583 49.4167 44.375 48.25 45.25C47.0833 46.125 45.4896 46.8958 43.4688 47.5625C41.4479 48.2292 39.0729 48.7812 36.3438 49.2188C33.6146 49.6562 30.6667 49.9167 27.5 50V40H22.5V50ZM25 22.5C29.0417 22.5 32.5312 22.2604 35.4688 21.7812C38.4062 21.3021 40.75 20.75 42.5 20.125C42.5 19.9167 40.9167 19.4271 37.75 18.6562C34.5833 17.8854 30.3333 17.5 25 17.5C19.6667 17.5 15.4167 17.8854 12.25 18.6562C9.08333 19.4271 7.5 19.9167 7.5 20.125C9.25 20.75 11.5938 21.3021 14.5312 21.7812C17.4688 22.2604 20.9583 22.5 25 22.5ZM17.5 44.625V35H32.5V44.625C35.8333 44.2917 38.5625 43.8021 40.6875 43.1562C42.8125 42.5104 44.25 41.9375 45 41.4375V24.5C42.7083 25.4167 39.8333 26.1458 36.375 26.6875C32.9167 27.2292 29.125 27.5 25 27.5C20.875 27.5 17.0833 27.2292 13.625 26.6875C10.1667 26.1458 7.29167 25.4167 5 24.5V41.4375C5.75 41.9375 7.1875 42.5104 9.3125 43.1562C11.4375 43.8021 14.1667 44.2917 17.5 44.625Z" fill={isActive ? "#d3dcd7dc" : "#d3dcd7dc"}/>
                    </svg>
                  </div>
                </div>

                <h3 className='text-2xl font-bold tracking-tight relative z-10 text-slate-900 '>
                  {g.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4 flex items-center gap-1 relative z-10">
                  <span className="text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                      <path d="M5 6C5.34375 6 5.63802 5.8825 5.88281 5.6475C6.1276 5.4125 6.25 5.13 6.25 4.8C6.25 4.47 6.1276 4.1875 5.88281 3.9525C5.63802 3.7175 5.34375 3.6 5 3.6C4.65625 3.6 4.36198 3.7175 4.11719 3.9525C3.8724 4.1875 3.75 4.47 3.75 4.8C3.75 5.13 3.8724 5.4125 4.11719 5.6475C4.36198 5.8825 4.65625 6 5 6ZM5 10.41C6.27083 9.29 7.21354 8.2725 7.82812 7.3575C8.44271 6.4425 8.75 5.63 8.75 4.92C8.75 3.83 8.38802 2.9375 7.66406 2.2425C6.9401 1.5475 6.05208 1.2 5 1.2C3.94792 1.2 3.0599 1.5475 2.33594 2.2425C1.61198 2.9375 1.25 3.83 1.25 4.92C1.25 5.63 1.55729 6.4425 2.17188 7.3575C2.78646 8.2725 3.72917 9.29 5 10.41ZM5 12C3.32292 10.63 2.07031 9.3575 1.24219 8.1825C0.414063 7.0075 0 5.92 0 4.92C0 3.42 0.502604 2.225 1.50781 1.335C2.51302 0.445 3.67708 0 5 0C6.32292 0 7.48698 0.445 8.49219 1.335C9.4974 2.225 10 3.42 10 4.92C10 5.92 9.58594 7.0075 8.75781 8.1825C7.92969 9.3575 6.67708 10.63 5 12Z" fill="#83878D"/>
                    </svg>
                  </span> 
                  {g.location}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-1 relative z-10">
                  <div>
                    <p className="text-[12px] text-slate-400 uppercase font-semibold tracking-wider">Matches</p>
                    <p className='text-xl font-bold text-black'>
                      {g.tournaments?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-400 uppercase font-semibold tracking-wider">Straight Boundary</p>
                    <p className="text-xl font-bold text-black">
                      {g.straightBoundary || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-400 uppercase font-semibold tracking-wider">Side Boundary</p>
                    <p className="text-xl font-bold text-black">
                      {g.sideBoundary || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 relative z-10">
                  <p className="text-[13px] text-slate-500 mb-2">Primary Pitch Type</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#9481FF]"></div>
                    <span className="text-sm font-bold text-slate-700">{g.pitchType || "Standard"}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-slate-400 p-4">No venues registered yet.</p>
        )}
      </div>
    </div>
  );
}