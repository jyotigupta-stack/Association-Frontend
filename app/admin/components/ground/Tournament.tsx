"use client";

import React, { useState, useEffect } from 'react';
import { apiFetch } from "@/app/lib/api";

//  Interface matching your TypeORM Entity
interface Tournament {
  id: string;
  name: string;
  teamCount: number;
  location: string;
  startDate: string; 
  endDate: string;   
  category?: string;
  sortWeight?: number; 
}

interface TournamentListProps {
  groundId: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const TournamentCard: React.FC<Tournament & { isActive: boolean; onClick: () => void }> = ({
  name,
  teamCount,
  location,
  startDate,
  endDate,
  isActive,
  onClick
}) => {
  const bodyTextColor = "text-gray-600";
  
  // Date Parsing
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Status Logic
  const isLive = now >= start && now <= end;

  //  Progress Calculation Logic
  const calculateProgress = () => {
    if (now < start) return 0;
    if (now > end) return 100;
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    if (totalDuration <= 0) return 0;
    return Math.min(Math.round((elapsed / totalDuration) * 100), 100);
  };

  const progressPercentage = calculateProgress();

  return (
    <div
      onClick={onClick}
      className={`relative w-full p-6 md:p-4 rounded-[1.5rem] transition-all cursor-pointer border ${
        isActive 
          ? 'border-blue-200 border-l-[6px] border-l-blue-600 bg-[#F0F7FF] shadow-sm' 
          : 'border-gray-100 bg-white hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-[#111827] leading-tight">
          {name}
        </h3>
        {isLive ? (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#EF4444] text-white shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest">Live</span>
          </div>
        ) : (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-white shrink-0 ${now < start ? 'bg-blue-600' : 'bg-green-600'}`}>
            <span className="text-xs font-bold uppercase tracking-widest">
              {now < start ? 'Upcoming' : 'Finished'}
            </span>
          </div>
        )}
      </div>

      <div className={`${bodyTextColor} text-md mb-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-x-8`}>
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 shrink-0 text-[#808898]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          <span className="font-medium">{teamCount} Teams</span>
        </div>
        <span className={`${bodyTextColor} hidden md:block text-2xl`}>•</span>
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 shrink-0 text-[#808898]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="font-medium">{location || "Venue TBD"}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#808898] uppercase tracking-wider">Tournament Progress</span>
          <span className="text-sm md:text-md font-bold text-green-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-[#E5E7EB] rounded-full h-[0.5rem]">
          <div
            className="bg-green-600 h-[0.5rem] rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const TournamentList: React.FC<TournamentListProps> = ({ groundId, selectedId, onSelect }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTournaments = async () => {
      if (!groundId) return;

      setLoading(true);
      try {
        const response = await apiFetch(`${process.env.NEXT_PUBLIC_Backend_URL}/tournaments/ground/${groundId}`, {
          method: 'GET'
        });

        if (response.ok) {
          const data = await response.json();
          const now = new Date();

          // Apply Sorting Logic: Live (0) -> Upcoming (1) -> Finished (2)
          const sortedTournaments = (data as Tournament[]).map((t) => {
            const start = new Date(t.startDate);
            const end = new Date(t.endDate);
            
            let weight = 2; // Finished
            if (now >= start && now <= end) {
              weight = 0; // Live
            } else if (now < start) {
              weight = 1; // Upcoming
            }

            return { ...t, sortWeight: weight };
          }).sort((a, b) => {
            // Sort by status weight first
            if (a.sortWeight !== b.sortWeight) {
              return (a.sortWeight ?? 0) - (b.sortWeight ?? 0);
            }
            // Secondary sort: earliest start date first
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          });

          setTournaments(sortedTournaments);
          
          // Auto-select first tournament based on the new priority
          if (sortedTournaments.length > 0 && !selectedId) {
            onSelect(sortedTournaments[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [groundId]);

  return (
    <div className="bg-white border border-gray-200 shadow-xs rounded-xl p-4 font-sans">
      <div className='text-xl mb-4 font-semibold text-black'>Tournaments</div>
      
      <div className="max-h-[580px] w-full xl:w-[450px] overflow-y-auto pr-2 space-y-5 custom-scrollbar">
        {loading ? (
          <div className="text-slate-400 p-4 animate-pulse">Loading tournaments...</div>
        ) : tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <TournamentCard 
              key={tournament.id} 
              {...tournament} 
              isActive={selectedId === tournament.id}
              onClick={() => onSelect(tournament.id)}
            />
          ))
        ) : (
          <div className="text-slate-400 p-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
             No tournaments hosted at this ground yet.
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default TournamentList;