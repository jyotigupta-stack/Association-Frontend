// components/dashboard/LiveMatches.tsx
"use client"


"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Match {
  id: string;     
  match_id: number; 
  name: string;     
  date: string;    
}

export default function LiveMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveMatches = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_Backend_URL}/matches/active-matches`, {
          method: 'GET',
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          if (response.status === 401) console.error("Unauthorized: Check your cookies/token");
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        
        // --- FILTERING & SORTING LOGIC ---
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredAndSorted = data
          .filter((m: Match) => {
            const mDate = new Date(m.date);
            mDate.setHours(0, 0, 0, 0);
            // Only keep matches that are today or in the future
            return mDate.getTime() >= today.getTime();
          })
          .sort((a: Match, b: Match) => {
            // Sort by date ascending (closer dates first)
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

  if (loading) return <div className="p-10 text-center animate-pulse">Loading matches...</div>;

  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-xs">
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#0D0D12]">Live & Upcoming Matches</h2>
        <button className="text-sm font-semibold text-slate-700 hover:text-black hover:underline cursor-pointer">View all</button>
      </div>

      <div className="overflow-x-auto scrollbar-hide pb-2">
        <div className="flex flex-nowrap gap-6">
          {matches.map((m) => {
            const matchDate = m.date ? new Date(m.date) : new Date();
            const today = new Date();
            
            // Check if it's Live (Same day)
            const isLive = matchDate.toDateString() === today.toDateString();

            const teams = m.name.split(/ vs | VS /i);
            const teamA = teams[0] || "TBD";
            const teamB = teams[1] || "TBD";

            return (
              <Link 
                href={`/admin/analytics/${m.id}`} 
                key={m.id} 
                className="block transition-transform hover:scale-[1.02] active:scale-95 flex-none w-[calc(25%-18px)] min-w-[280px]"
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
                      <div className="flex flex-row gap-4 items-center justify-center mb-1">
                        <div className="w-10 h-10 bg-yellow-300 rounded-full mb-2 mx-auto overflow-hidden flex items-center justify-center text-[10px] font-bold text-slate-900">
                          {teamA.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="font-bold text-black text-sm">{teamA}</p>
                      </div>
                    </div>

                    <span className="text-[#D23624] font-semibold text-xs bg-white p-2 rounded-full shadow-sm">Vs</span>

                    <div className="text-center">
                      <div className="flex flex-row gap-4 items-center justify-center mb-2">
                        <p className="font-bold text-black text-sm">{teamB}</p>
                        <div className="w-10 h-10 bg-indigo-300 rounded-full mb-2 mx-auto overflow-hidden flex items-center justify-center text-[10px] font-bold text-slate-900">
                          {teamB.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 text-center">
                    <p className="text-[15px] text-slate-900">
                      Date - {m.date ? new Date(m.date).toLocaleDateString('en-GB') : 'Date TBD'}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
          
          {matches.length === 0 && (
             <div className="w-full py-10 text-center text-slate-400 italic">
                No active or upcoming matches  found. Please
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

