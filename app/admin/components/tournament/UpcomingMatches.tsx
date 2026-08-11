"use client";

import React, { useState, useEffect } from 'react';
import { apiFetch } from "@/app/lib/api";

interface Match {
  id: string; // UUID
  match_id: number; // Incrementing ID
  name: string; // "MI vs CSK"
  date: string | null;
  match_no: string;
  // Computed fields or placeholders for UI
  score1?: string;
  score2?: string;
  statusText?: string;
  type?: string;
  isLive?: boolean;
  team1?: string;
  team2?: string;
}

interface Props {
  tournamentId: string | null;
  selectedMatchId: string | null;
  onSelectMatch: (id: string) => void;
}

const UpcomingMatches = ({ tournamentId, selectedMatchId, onSelectMatch }: Props) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const filters = ['All', 'Live', 'Upcoming', 'Finished'];

  useEffect(() => {
    const fetchMatches = async () => {
      if (!tournamentId) return;
      
      setLoading(true);
      try {
        const response = await apiFetch(`${process.env.NEXT_PUBLIC_Backend_URL}/matches/tournament/${tournamentId}`, {
          method: 'GET',
        });
        
        const data = await response.json();
        
        // Process data to add logic for Live/Upcoming/Finished
        const processedData = (Array.isArray(data) ? data : []).map((match: any) => {
          const today = new Date().toISOString().split('T')[0];
          const matchDate = match.date ? new Date(match.date).toISOString().split('T')[0] : '';
          
          let isLive = false;
          let statusText = "UPCOMING";
          let type = "Upcoming";
          let sortOrder = 2; // Default for Upcoming

          if (matchDate === today) {
            isLive = true;
            statusText = "LIVE - 1st Innings";
            type = "Live";
            sortOrder = 1; // Highest Priority
          } else if (matchDate < today && match.date !== null) {
            isLive = false;
            statusText = "FINISHED";
            type = "Finished";
            sortOrder = 3; // Lowest Priority
          }

          const teams = match.name?.split(' vs ') || ["T1", "T2"];

          return {
            ...match,
            team1: teams[0],
            team2: teams[1],
            score1: isLive ? "NA" : "0/0",
            score2: isLive ? "NA" : "0/0",
            statusText,
            type,
            isLive,
            sortOrder // Internal field for sorting
          };
        });

        // Sort: Live (1) -> Upcoming (2) -> Finished (3)
        processedData.sort((a: any, b: any) => a.sortOrder - b.sortOrder);

        setMatches(processedData);

        if (processedData.length > 0 && !selectedMatchId) {
          onSelectMatch(processedData[0].id);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [tournamentId, onSelectMatch, selectedMatchId]);

  const filteredMatches = matches.filter((match) => {
    if (activeFilter === 'All') return true;
    return match.type === activeFilter;
  });

  return (
    <div className="w-full bg-white rounded-[24px] border border-slate-100 p-6 shadow-xs">
      {/* Custom Scrollbar Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-md md:text-lg font-semibold text-slate-900 tracking-tight">
          Recent & Upcoming Matches
        </h2>
        
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-sm font-medium transition-all rounded-lg ${
                activeFilter === filter
                  ? 'bg-white shadow-sm text-slate-700 border border-slate-100'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="w-[25%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Match Details</th>
                <th className="w-[30%] py-3 px-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Matchup</th>
                <th className="w-[20%] py-3 px-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Scoreline</th>
                <th className="w-[25%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right">Status</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="overflow-y-auto max-h-[365px] overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400 text-xs font-medium animate-pulse">
                    Loading tournament matches...
                  </td>
                </tr>
              ) : filteredMatches.length > 0 ? (
                filteredMatches.map((match) => {
                  const isRowSelected = selectedMatchId === match.id;
                  return (
                    <tr 
                      key={match.id} 
                      onClick={() => onSelectMatch(match.id)}
                      className={`group transition-colors border-b border-slate-100 last:border-0 cursor-pointer ${
                        isRowSelected ? 'bg-blue-50/70' : (match.isLive ? 'bg-[#F5F8FF]' : 'hover:bg-slate-50/50')
                      }`}
                    >
                      <td className={`w-[25%] py-3 px-4 ${isRowSelected ? 'border-l-[4px] border-blue-600' : (match.isLive ? 'border-l-[4px] border-blue-400' : 'border-l-[4px] border-transparent')}`}>
                        <p className="text-sm font-bold text-slate-900 leading-tight">Match {match.match_id}</p>
                        <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                          {match.date ? new Date(match.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'TBD'}
                        </p>
                      </td>

                      <td className="w-[30%] py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5 shrink-0">
                            <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center text-[9px] font-bold text-white border-2 border-white shadow-sm">
                              {match.team1?.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="w-7 h-7 rounded-full bg-[#FACC15] flex items-center justify-center text-[9px] font-bold text-white border-2 border-white shadow-sm">
                              {match.team2?.substring(0, 2).toUpperCase()}
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-slate-700 truncate">{match.name}</span>
                        </div>
                      </td>

                      <td className="w-[20%] py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 whitespace-nowrap">{match.score1}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">vs</span>
                          <span className="text-xs font-bold text-slate-900 whitespace-nowrap">{match.score2}</span>
                        </div>
                      </td>

                      <td className="w-[25%] py-3 px-4 text-right">
                        {match.isLive ? (
                          <div className="flex items-center justify-end gap-1.5 text-[#D92D20]">
                            <span className="w-1.5 h-1.5 bg-[#D92D20] rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase tracking-tight whitespace-nowrap">{match.statusText}</span>
                          </div>
                        ) : (
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight whitespace-nowrap ${
                            match.type === 'Upcoming' 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'bg-[#ECFDF3] text-[#027A48]'
                          }`}>
                            {match.statusText}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400 text-xs font-medium">
                    No {activeFilter.toLowerCase()} matches found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMatches;