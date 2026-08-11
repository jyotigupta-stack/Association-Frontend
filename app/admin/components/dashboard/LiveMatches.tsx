// components/dashboard/LiveMatches.tsx
"use client"

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react'; 
import { apiFetch } from "@/app/lib/api";

interface Match {
  id: string;     
  match_id: number; 
  name: string;     
  date: string;
  tournament: {
    id: string;
    name: string;
  };
}

export default function LiveMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    const fetchActiveMatches = async () => {
      try {
        const response = await apiFetch(`${process.env.NEXT_PUBLIC_Backend_URL}/matches/active-matches`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredAndSorted = data
          .filter((m: Match) => {
            const mDate = new Date(m.date);
            mDate.setHours(0, 0, 0, 0);
            return mDate.getTime() >= today.getTime();
          })
          .sort((a: Match, b: Match) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });

        setMatches(filteredAndSorted);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveMatches();
  }, []);

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(searchTerm) || 
        m.match_id.toString().includes(searchTerm)
      );
    });
  }, [matches, searchQuery]);

  const uniqueTournamentIds = Array.from(new Set(matches.map(m => m.tournament?.id)));
  const viewAllHref = uniqueTournamentIds.length === 1 
    ? `/admin/tournament/${uniqueTournamentIds[0]}` 
    : `/admin/tournament`;

  if (loading) return <div className="p-10 text-center animate-pulse">Loading matches...</div>;

  return (
    <div className="bg-white p-4 md:p-5 rounded-[24px] border border-slate-100 shadow-xs">
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-lg font-bold text-[#0D0D12] whitespace-nowrap">Live & Upcoming Matches</h2>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by ID or Team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg w-full sm:w-64 transition-all text-slate-500"
            />
          </div>
          <Link href={viewAllHref}>
            <button className="text-sm font-semibold text-slate-700 hover:text-black hover:underline cursor-pointer whitespace-nowrap">
              View all
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide pb-2">
        {/* Adjusted flex container to handle responsive widths */}
        <div className="flex flex-nowrap gap-4 md:gap-6">
          {filteredMatches.map((m) => {
            const matchDate = m.date ? new Date(m.date) : new Date();
            const today = new Date();
            const isLive = matchDate.toDateString() === today.toDateString();

            const teams = m.name.split(/ vs | VS /i);
            const teamA = teams[0] || "TBD";
            const teamB = teams[1] || "TBD";

            return (
              <Link 
                href={`/admin/ground/matchdetail/${m.id}`} 
                key={m.id} 
                className="block transition-transform hover:scale-[1.02] active:scale-95 flex-none w-[280px] sm:w-[300px] md:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)]"
              >
                <div className="p-3 rounded-[20px] border border-slate-100 relative bg-gray-50/30 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all h-full">
                  <span className={`absolute top-4 left-1/2 -translate-x-1/2 text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    isLive ? 'bg-[#D11B1B]' : 'bg-green-500'
                  }`}>
                    {isLive ? 'Live' : 'Upcoming'}
                  </span>

                  <p className="text-center text-[13px] text-black mt-6 mb-4 font-medium">Match ID - {m.match_id}</p>
                  
                  <div className="flex justify-between items-center px-1">
                    <div className="text-center">
                      <div className="flex flex-row gap-2 sm:gap-4 items-center justify-center mb-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-300 rounded-full mb-2 mx-auto overflow-hidden flex items-center justify-center text-[10px] font-bold text-slate-900">
                          {teamA.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="font-bold text-black text-xs sm:text-sm">{teamA}</p>
                      </div>
                    </div>

                    <span className="text-[#D23624] font-semibold text-[10px] sm:text-xs bg-white p-1.5 sm:p-2 rounded-full shadow-sm">Vs</span>

                    <div className="text-center">
                      <div className="flex flex-row gap-2 sm:gap-4 items-center justify-center mb-2">
                        <p className="font-bold text-black text-xs sm:text-sm">{teamB}</p>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-300 rounded-full mb-2 mx-auto overflow-hidden flex items-center justify-center text-[10px] font-bold text-slate-900">
                          {teamB.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 text-center">
                    <p className="text-[13px] sm:text-[15px] text-slate-900">
                      Date - {m.date ? new Date(m.date).toLocaleDateString('en-GB') : 'Date TBD'}
                    </p>
                    {uniqueTournamentIds.length > 1 && (
                      <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 uppercase font-semibold">
                        {m.tournament?.name}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
          
          {filteredMatches.length === 0 && (
             <div className="w-full py-10 text-center text-slate-400 italic">
                {searchQuery ? `No matches found matching "${searchQuery}"` : "No active or upcoming matches found."}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
// components/dashboard/LiveMatches.tsx
// import React from 'react';
// import Link from 'next/link'; // Import Link from Next.js

// export default function LiveMatches() {
//   const matches = [1, 2, 3];
//   return (
//     <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-xs">
//       <div className="flex justify-between items-center mb-1">
//         <h2 className="text-lg font-bold text-[#0D0D12]">Live & Recent Matches</h2>
//         <button className="text-sm font-semibold text-slate-700 hover:text-black hover:underline cursor-pointer">View all</button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {matches.map((m) => (
//           /* Wrap the card in a Link component */
//           <Link href="/admin/analytics" key={m} className="block transition-transform hover:scale-[1.02] active:scale-95">
//             <div className="p-3 rounded-[20px] border border-slate-100 relative bg-gray-50/30 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all">
//               <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#D11B1B] text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Live</span>
//               <p className="text-center text-[13px] text-black mt-6 mb-4 font-medium">Match ID - 230B54</p>
              
//               <div className="flex justify-between items-center px-1">
//                 <div className="text-center">
//                   <div className="flex flex-row gap-4 items-center justify-center mb-1">
//                     <div className="w-10 h-10 bg-slate-100 rounded-full mb-2 mx-auto overflow-hidden">
//                       <img src="https://flagcdn.com/za.svg" alt="SA" className="w-full h-full object-cover" />
//                     </div>
//                     <p className="font-bold text-black">SA</p>
//                   </div>
//                   <p className="text-[12px] text-black">225/9 (20 ov)</p>
//                 </div>

//                 <span className="text-[#D23624] font-semibold text-xs bg-white p-2 rounded-full shadow-sm">Vs</span>

//                 <div className="text-center">
//                   <div className="flex flex-row gap-4 items-center justify-center mb-2">
//                     <p className="font-bold text-black">ENG</p>
//                     <div className="w-10 h-10 bg-slate-100 rounded-full mb-2 mx-auto overflow-hidden">
//                       <img src="https://flagcdn.com/gb-eng.svg" alt="ENG" className="w-full h-full object-cover" />
//                     </div>
//                   </div>
//                   <p className="text-[12px] text-black">143/3 (16 ov)</p>
//                 </div>
//               </div>

//               <div className="pt-4   text-center">
//                 <p className="text-[15px] text-slate-900">Date - 20/01/2026</p>
//                 <p className="text-[15px] text-slate-400 mt-1">CSK Need 82 Runs In 24 Balls</p>
//               </div>
//             </div>
//           </Link>
//         ))}

//         {/* Static Summary Card - Also linked to Analytics */}
//         <Link href="/admin/analytics" className="block transition-transform hover:scale-[1.02]">
//           <div className="p-4 h-full rounded-[20px] border border-slate-100 bg-gray-50/30 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all">
//             <div className="flex items-center gap-3">
//               <img src="/cricket1.png" alt="cricket" className="w-4 h-4 object-contain" />
//               <div>
//                 <h4 className="font-semibold text-black mt-3">India Vs West Indies</h4>
//                 <p className="text-gray-400 text-[14px] mb-2">MEN’S T20 TRI-Series</p>
//               </div>
//             </div>
//             <div className="space-y-3 mt-4">
//               <div className="flex justify-between items-center text-xs font-bold">
//                 <div className="flex items-center gap-2 text-[14px] text-black">
//                   <div className="w-8 h-8 rounded-full bg-purple-900" /> WI
//                 </div>
//                 <span className='text-black text-[14px]'>94/6</span>
//               </div>
//               <div className="flex justify-between items-center text-xs font-bold">
//                 <div className="flex items-center gap-2 text-[14px] text-black">
//                   <div className="w-8 h-8 rounded-full bg-blue-500" /> IND
//                 </div>
//                 <span className='text-black text-[14px]'>95/2</span>
//               </div>
//             </div>
//             <p className="text-[16px] text-black mt-4">India won by 8 wickets</p>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }

