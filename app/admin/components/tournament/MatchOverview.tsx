"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { apiFetch } from "@/app/lib/api";

interface MatchEntity {
  id: string;
  match_id: number;
  match_no: string | null;
  name: string; // Expected format: "TeamA vs TeamB"
  date: string | null;
  innings: number | null;
  tournament_id: string;
}

interface MatchOverviewProps {
  matchId: string | null;
}

const MatchOverview: React.FC<MatchOverviewProps> = ({ matchId }) => {
  const [match, setMatch] = useState<MatchEntity | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!matchId) return;
      setLoading(true);
      try {
        const response = await apiFetch(`${process.env.NEXT_PUBLIC_Backend_URL}/matches/${matchId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setMatch(data);
        }
      } catch (error) {
        console.error("Error fetching match:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchDetails();
  }, [matchId]);

  // Status Logic Helper
  const getMatchStatus = () => {
    if (!match?.date) return { label: 'Scheduled', color: 'bg-slate-400' };

    const matchDate = new Date(match.date);
    const today = new Date();

    // Reset time to compare only dates
    matchDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (matchDate.getTime() === today.getTime()) {
      return { label: 'Live', color: 'bg-[#D11B1B] animate-pulse' };
    } else if (matchDate.getTime() > today.getTime()) {
      return { label: 'Upcoming', color: 'bg-blue-500' };
    } else {
      return { label: 'Finished', color: 'bg-emerald-600' };
    }
  };

  // Team Name Parsing Logic
  const getTeamNames = () => {
    if (!match?.name) return { team1: 'TBD', team2: 'TBD' };
    const parts = match.name.split(/\s+vs\s+/i);
    return {
      team1: parts[0]?.trim() || 'Team 1',
      team2: parts[1]?.trim() || 'Team 2'
    };
  };

  if (!matchId) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-10 shadow-sm w-full max-w-6xl mx-auto flex items-center justify-center">
        <p className="text-slate-400 font-medium">Select a match to view overview</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-10 shadow-sm w-full max-w-6xl mx-auto animate-pulse flex items-center justify-center">
        <p className="text-slate-400 font-medium">Loading match data...</p>
      </div>
    );
  }

  const { label, color } = getMatchStatus();
  const { team1, team2 } = getTeamNames();

  const renderStatPlaceholder = (title: string) => (
    <div className="p-2 rounded-2xl border border-slate-100 bg-white flex flex-col gap-3">
      <p className="text-[11px] text-slate-400 font-medium">{title}</p>
      <div className="flex justify-between items-end">
        <span className="text-[13px] font-bold text-slate-300">Pending</span>
        <span className="text-[13px] font-bold text-slate-300">Pending</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm w-full max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Match Overview</h2>
        <Link href={`/admin/scorecard`}>
          <button className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            View More
          </button>
        </Link>
      </div>
      <div className='border-t border-gray-100 '/>

      <div className="flex flex-col lg:flex-row gap-0 lg:divide-x divide-y divide-slate-100">
        
        {/* Left Column */}
        <div className="flex-1 pr-0 lg:pr-5 pb-10 lg:pb-0 flex flex-col gap-3 ">
          <div className="p-3 rounded-[20px] border border-slate-100 relative bg-gray-50/30 mt-4">
            <span className={`absolute top-4 left-1/2 -translate-x-1/2 ${color} text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider`}>
              {label}
            </span>
            <p className="text-center text-[13px] text-black mt-6 mb-4 font-medium uppercase">
               Match ID - {match?.match_id ?? 'N/A'}
            </p>
            
            <div className="flex justify-between items-center px-1">
              <div className="text-center flex-1">
                <p className="font-bold text-slate-900 text-sm mb-1">{team1}</p>
                <p className="text-[11px] text-slate-400">Score Pending</p>
              </div>
              <span className="text-red-500 font-semibold text-xs bg-white p-2 rounded-full -mt-4 ">Vs</span>
              <div className="text-center flex-1">
                <p className="font-bold text-slate-900 text-sm mb-1">{team2}</p>
                <p className="text-[11px] text-slate-400">Score Pending</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100/50 text-center mt-4">
              <p className="text-[13px] text-slate-900 font-medium">
                Date: {match?.date ? new Date(match.date).toLocaleDateString('en-GB') : 'To be updated'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                {match?.innings ? `Current: Innings ${match.innings}` : 'Match not yet started'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-md text-slate-900 mb-1">Man Of Match</h3>
            <div className="flex items-center gap-3 opacity-40">
              <div className="w-10 h-10 bg-slate-100 rounded-full" />
              <p className="text-sm text-slate-500 italic">Available post-match</p>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-slate-900 mb-1">Best Partnership</h3>
            <p className="text-xs text-slate-300 italic mb-2">Calculating live stats...</p>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-200" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 pl-0 lg:pl-5 pt-10 lg:pt-0 flex flex-col gap-4">
          <section className='lg:mt-4 mt-0'>
            <h3 className="text-lg text-slate-900 mb-5">Key Performers</h3>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-2 rounded-2xl border border-slate-100 bg-white shadow-xs opacity-50">
                  <p className="text-[9px] text-slate-400 font-bold mb-1 uppercase">PLAYER</p>
                  <p className="text-sm font-semibold text-slate-300">UPDATING</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-md font-semibold text-slate-900 mb-2">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderStatPlaceholder("Total Six(6)")}
              {renderStatPlaceholder("Total Four(4)")}
              <div className="col-span-1">
                {renderStatPlaceholder("Extras")}
              </div>
            </div>
          </section>
          
          <Link href={`/admin/analytics/${matchId}`}>
            <button className='w-full px-4 py-4 border rounded-xl bg-black text-white font-semibold hover:bg-slate-800 transition-all shadow-lg active:scale-95'>
              Start Analysis
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MatchOverview;

// import Link from 'next/link';
// import React from 'react';

// // Interfaces
// interface TeamStats {
//   MI: number;
//   CSK: number;
// }

// const MatchOverview: React.FC = () => {
//   // Mock Data
//   const matchId = "230B54";
//   const date = "20/01/2026";
  
//   const keyPerformers = [
//     { name: "Rohit Sharma(MI)", performance: "68(45)" },
//     { name: "R.Jadeja(CSK)", performance: "23/2" },
//     { name: "Sanju Samson(CSK)", performance: "68(45)" },
//     { name: "J.Bumrah(CSK)", performance: "32/5" },
//   ];

//   const quickStats = {
//     sixes: { MI: 17, CSK: 17 },
//     fours: { MI: 17, CSK: 17 },
//     extras: { MI: 10, CSK: 15 },
//   };

//   const renderStatBlock = (title: string, data: TeamStats) => (
//     <div className="p-2 rounded-2xl border border-slate-100 bg-white flex flex-col gap-3">
//       <p className="text-[11px] text-slate-400 font-medium">{title}</p>
//       <div className="flex justify-between items-end">
//         <div className="flex flex-col">
//           <span className="text-[10px] text-slate-400 font-bold mb-1">MI</span>
//           <span className="text-[13px] font-bold text-slate-900">{data.MI}</span>
//         </div>
//         <div className="flex flex-col items-end">
//           <span className="text-[10px] text-slate-400 font-bold mb-1">CSK</span>
//           <span className="text-[13px] font-bold text-slate-900">{data.CSK}</span>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm w-full max-w-6xl mx-auto font-sans">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold text-slate-900">Match Overview</h2>
//         <Link href="/admin/scorecard">
//         <button className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
//           View More
//         </button>
//         </Link>
//       </div>
//       <div className='border-t border-gray-100 '/>

//       <div className="flex flex-col lg:flex-row gap-0 lg:divide-x divide-y divide-slate-100">
    
        
//         {/*  Match Details, MoM, and Partnership */}
//         <div className="flex-1 pr-0 lg:pr-5 pb-10 lg:pb-0 flex flex-col gap-3 ">
          
//           {/* Main Scoreboard Card */}
//           <div  className="p-3 rounded-[20px] border border-slate-100 relative bg-gray-50/30 mt-4">
//             <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#D11B1B] text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Live</span>
//             <p className="text-center text-[13px] text-black mt-6 mb-4 font-medium">Match ID - 230B54</p>
//             <div className="flex justify-between items-center px-1">
//               <div className="text-center">
//                 <div className="flex flex-row gap-4 items-center justify-center mb-1">
//                 <div className="w-8 h-8 bg-slate-100 rounded-full mb-2 mx-auto overflow-hidden">
//                    <img src="https://flagcdn.com/za.svg" alt="SA" className="w-full h-full object-cover" />
//                 </div>
//                 <p className="font-bold text-black text-xs">SA</p>
//                 </div>
//                 <p className="text-[11px] text-black">225/9 (20 ov)</p>
//               </div>
//               <span className="text-[#D23624] font-semibold text-xs bg-white p-2 rounded-full -mt-4">Vs</span>
//               <div className="text-center">
//                 <div className="flex flex-row gap-4 items-center justify-center mb-2">
//                     <p className="font-bold text-black text-xs">ENG</p>
//                 <div className="w-8 h-8 bg-slate-100 rounded-full mb-2 mx-auto overflow-hidden">
//                    <img src="https://flagcdn.com/gb-eng.svg" alt="ENG" className="w-full h-full object-cover" />
//                 </div>
                
//                 </div>
//                 <p className="text-[11px] text-black">143/3 (16 ov)</p>
//               </div>
//             </div>
//             <div className=" pt-2 border-t border-slate-50 text-center">
//               <p className="text-[13px] text-slate-900 ">Date - 20/01/2026</p>
//               <p className="text-[13px] text-slate-400 ">CSK Need 82 Runs In 24 Balls</p>
//             </div>
//           </div>

//           {/* Man Of Match Section */}
//           <div>
//             <h3 className="text-md  text-slate-900 mb-1">Man Of Match</h3>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
//                    {/* Placeholder for player image */}
//                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bumrah" alt="J. Bumrah" className="w-full h-full object-cover" />
//                 </div>
//                 <div>
//                   <p className="text-sm  text-slate-900">J. Bumrah</p>
//                   <p className="text-xs text-slate-400 font-medium">Bowler</p>
//                 </div>
//               </div>
//               <p className="text-[13px] font-bold text-slate-900">32/5</p>
//             </div>
//           </div>

//           {/* Best Partnership Section */}
//           <div >
//             <h3 className="text-md font-semibold text-slate-900 mb-1">Best Partnership</h3>
//             <div className="flex justify-between text-sm mb-2">
//               <span className="font-bold text-slate-900">Rohit Sharma</span>
//               <span className="font-bold text-slate-900">Shubman Gill</span>
//             </div>
//             <div className="flex justify-between items-baseline mb-2">
//               <p className="text-md font-bold text-slate-900">44 <span className="text-xs text-slate-400 font-medium">(38)</span></p>
//               <p className="text-xl font-bold text-slate-900">82<span className="text-md text-slate-900">(32)</span></p>
//               <p className="text-md font-bold text-slate-900">35 <span className="text-xs text-slate-400 font-medium">(30)</span></p>
//             </div>
//             {/* Progress Bar */}
//             <div className="w-full h-2 bg-blue-100 rounded-full flex overflow-hidden">
//               <div className="h-full bg-blue-500" style={{ width: '55%' }}></div>
//             </div>
//             <div className="flex justify-between mt-2">
//               <span className="text-[11px] font-bold text-slate-400">55% contribution</span>
//               <span className="text-[11px] font-bold text-slate-400">45% contribution</span>
//             </div>
//           </div>
//         </div>

//         {/*  Key Performers & Quick Stats  */}
//         <div className="flex-1 pl-0 lg:pl-5 pt-10 lg:pt-0 flex flex-col gap-4">
          
//           <section className='lg:mt-4 mt-0'>
//             <h3 className="text-lg  text-slate-900 mb-5">Key Performers</h3>
//             <div className="grid grid-cols-2 gap-2">
//               {keyPerformers.map((p, i) => (
//                 <div key={i} className="p-2 rounded-2xl border border-slate-100 bg-white shadow-xs">
//                   <p className="text-[9px] text-slate-400 font-bold mb-2 uppercase tracking-wide">{p.name}</p>
//                   <p className="text-sm font-semibold text-slate-900">{p.performance}</p>
//                 </div>
//               ))}
//             </div>
//           </section>

//           <section>
//             <h3 className="text-md font-semibold text-slate-900 mb-2">Quick Stats</h3>
//             <div className="grid grid-cols-2 gap-4">
//               {renderStatBlock("Total Six(6)", quickStats.sixes)}
//               {renderStatBlock("Total Four(4)", quickStats.fours)}
//               <div className="col-span-1">
//                 {renderStatBlock("Extras", quickStats.extras)}
//               </div>
//             </div>
//           </section>
//           <Link href="/admin/analytics">
//           <button className='w-full px-4 py-4 border rounded-xl bg-black text-white font-semibold' >Start Analysis</button>
//           </Link>

//         </div>
//       </div>

//     </div>
    
//   );
// };

// export default MatchOverview;

