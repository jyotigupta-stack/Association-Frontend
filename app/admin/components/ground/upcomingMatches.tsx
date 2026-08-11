"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from "@/app/lib/api";

interface Match {
  id: string; // UUID
  match_id: number; 
  name: string; // "MI vs CSK"
  date: string | null;
  match_no?: string;
  // UI Specific Computed Fields
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  statusText: string;
  type: string;
  isLive: boolean;
  time: string;
  sortOrder: number; // For priority sorting
}

interface UpcomingMatchesProps {
  tournamentId: string | null;
  selectedMatchId?: string | null;
  onSelectMatch?: (id: string) => void;
}

const UpcomingMatches: React.FC<UpcomingMatchesProps> = ({ 
  tournamentId, 
  selectedMatchId, 
  onSelectMatch 
}) => {
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
        const processedData = (Array.isArray(data) ? data : []).map((match: any) => {
          const now = new Date();
          const matchDate = match.date ? new Date(match.date) : null;
          
          let isLive = false;
          let statusText = "UPCOMING";
          let type = "Upcoming";
          let sortOrder = 2; // Default priority for Upcoming

          if (matchDate) {
            const isToday = matchDate.toDateString() === now.toDateString();
            if (isToday) {
              isLive = true;
              statusText = "LIVE - 1st Innings";
              type = "Live";
              sortOrder = 1; // Highest Priority
            } else if (matchDate < now) {
              isLive = false;
              statusText = "FINISHED";
              type = "Finished";
              sortOrder = 3; // Lowest Priority
            }
          }

          const teams = match.name?.split(' vs ') || ["T1", "T2"];

          return {
            ...match,
            team1: teams[0] || "T1",
            team2: teams[1] || "T2",
            score1: match.score1 || (isLive ? "0/0" : "0/0"),
            score2: match.score2 || (isLive ? "0/0" : "0/0"),
            time: matchDate ? matchDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : "TBD",
            statusText: match.statusText || statusText,
            type,
            isLive,
            sortOrder
          };
        });

        // Apply Sorting: Live (1) -> Upcoming (2) -> Finished (3)
        processedData.sort((a: Match, b: Match) => a.sortOrder - b.sortOrder);

        setMatches(processedData);

        // Auto-select first match based on priority if none selected
        if (processedData.length > 0 && onSelectMatch && !selectedMatchId) {
          onSelectMatch(processedData[0].id);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [tournamentId]);

  const filteredMatches = matches.filter((match) => {
    if (activeFilter === 'All') return true;
    return match.type === activeFilter;
  });

  return (
    <div className="w-full bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
      {/* Scrollbar Style Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-md md:text-lg font-semibold text-slate-900 tracking-tight">
           Recent & Upcoming Matches
        </h2>
        
        <div className="flex bg-slate-50 rounded-xl border border-slate-100 p-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-sm font-medium transition-all rounded-lg ${
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
        {/* Fixed Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] table-fixed">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="w-[20%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Match Details</th>
                <th className="w-[25%] py-3 px-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Matchup</th>
                <th className="w-[15%] py-3 px-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Scoreline</th>
                <th className="w-[20%] py-3 px-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-center">Status</th>
                <th className="w-[20%] py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right">Analyse</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable Body Container */}
        <div className="overflow-y-auto max-h-[365px] overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px] table-fixed">
            <tbody>
              {loading ? (
                <tr>
                   <td colSpan={5} className="py-10 text-center text-slate-400 text-xs font-medium animate-pulse">
                    Loading matches...
                  </td>
                </tr>
              ) : filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <tr 
                    key={match.id} 
                    onClick={() => onSelectMatch?.(match.id)}
                    className={`group transition-colors border-b border-slate-100 last:border-0 cursor-pointer ${
                      selectedMatchId === match.id ? 'bg-blue-50/50' : (match.isLive ? 'bg-[#F5F8FF]' : 'hover:bg-slate-50/50')
                    }`}
                  >
                    <td className={`w-[20%] py-3 px-4 ${match.isLive ? 'border-l-[4px] border-blue-500' : 'border-l-[4px] border-transparent'}`}>
                      <p className="text-sm font-bold text-slate-900 leading-tight">Match {match.match_id || match.match_no}</p>
                      <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{match.time}</p>
                    </td>

                    <td className="w-[25%] py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5 shrink-0">
                          <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center text-[9px] font-bold text-white border-2 border-white shadow-sm">
                            {match.team1.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="w-7 h-7 rounded-full bg-[#FACC15] flex items-center justify-center text-[9px] font-bold text-white border-2 border-white shadow-sm">
                            {match.team2.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 truncate">{match.name}</span>
                      </div>
                    </td>

                    <td className="w-[15%] py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 whitespace-nowrap">{match.score1}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">vs</span>
                        <span className="text-xs font-bold text-slate-900 whitespace-nowrap">{match.score2}</span>
                      </div>
                    </td>

                    <td className="w-[20%] py-3 px-2 text-center">
                      {match.isLive ? (
                        <div className="flex items-center justify-center gap-1.5 text-[#D92D20]">
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

                    <td className="w-[20%] py-3 px-4 text-right">
                        <Link href={`/admin/analytics/${match.id}`}>
                          <button className="text-xs font-bold text-blue-600 transition-colors whitespace-nowrap inline-flex items-center gap-1">
                            Start Analysis <span className="text-sm">→</span>
                          </button>
                        </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 text-xs font-medium">
                    No {activeFilter.toLowerCase()} matches found.
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