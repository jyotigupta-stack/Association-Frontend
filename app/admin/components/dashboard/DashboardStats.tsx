import React, { useState,useEffect } from 'react';
import { apiFetch } from "@/app/lib/api";


// Define the interface based on your API and UI usage
interface Ground {
  id: string;
  name: string;
  location: string;
  matches: number;
  straightBoundary: string;
  sideBoundary: string;
  avgScore: string;
  pitch: string;
  status?: string; 
}

//  Ground Details Component  
const GroundDetails = () => {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const response = await apiFetch(`${process.env.NEXT_PUBLIC_Backend_URL}/ground/all`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setGrounds(data);
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
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[320px] h-[200px] rounded-[24px] bg-gray-50 animate-pulse border border-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {grounds.map((g, i) => (
        <div key={g.id || i} className="min-w-[320px] flex-1 p-4 rounded-[24px] border border-slate-100 bg-white relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            {/* Logic: First ground is Active Venue, others are Upcoming */}
            <span className={`z-10 text-[10px] font-bold px-2 py-1 rounded-md ${i === 0 ? 'bg-[#C29508] text-[#4E3E00]' : 'bg-[#A3E9D2] text-[#1E7F64]'}`}>
              {i === 0 ? 'ACTIVE VENUE' : 'UPCOMING'}
            </span>
            
            <div className="absolute top-6 right-6 opacity-10">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 12.5V2.5L12.5 7.5L2.5 12.5ZM40 12.5V2.5L50 7.5L40 12.5ZM22.5 10V0L32.5 5L22.5 10ZM22.5 50C19.3333 49.9167 16.3854 49.6562 13.6562 49.2188C10.9271 48.7812 8.55208 48.2292 6.53125 47.5625C4.51042 46.8958 2.91667 46.125 1.75 45.25C0.583333 44.375 0 43.4583 0 42.5V20C0 18.9583 0.65625 17.9896 1.96875 17.0938C3.28125 16.1979 5.0625 15.4062 7.3125 14.7188C9.5625 14.0312 12.2083 13.4896 15.25 13.0938C18.2917 12.6979 21.5417 12.5 25 12.5C28.4583 12.5 31.7083 12.6979 34.75 13.0938C37.7917 13.4896 40.4375 14.0312 42.6875 14.7188C44.9375 15.4062 46.7188 16.1979 48.0312 17.0938C49.3438 17.9896 50 18.9583 50 20V42.5C50 43.4583 49.4167 44.375 48.25 45.25C47.0833 46.125 45.4896 46.8958 43.4688 47.5625C41.4479 48.2292 39.0729 48.7812 36.3438 49.2188C33.6146 49.6562 30.6667 49.9167 27.5 50V40H22.5V50ZM25 22.5C29.0417 22.5 32.5312 22.2604 35.4688 21.7812C38.4062 21.3021 40.75 20.75 42.5 20.125C42.5 19.9167 40.9167 19.4271 37.75 18.6562C34.5833 17.8854 30.3333 17.5 25 17.5C19.6667 17.5 15.4167 17.8854 12.25 18.6562C9.08333 19.4271 7.5 19.9167 7.5 20.125C9.25 20.75 11.5938 21.3021 14.5312 21.7812C17.4688 22.2604 20.9583 22.5 25 22.5ZM17.5 44.625V35H32.5V44.625C35.8333 44.2917 38.5625 43.8021 40.6875 43.1562C42.8125 42.5104 44.25 41.9375 45 41.4375V24.5C42.7083 25.4167 39.8333 26.1458 36.375 26.6875C32.9167 27.2292 29.125 27.5 25 27.5C20.875 27.5 17.0833 27.2292 13.625 26.6875C10.1667 26.1458 7.29167 25.4167 5 24.5V41.4375C5.75 41.9375 7.1875 42.5104 9.3125 43.1562C11.4375 43.8021 14.1667 44.2917 17.5 44.625Z" fill="#191C1E"/>
              </svg>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-800 tracking-tight relative z-10">{g.name}</h3>
          <p className="text-slate-400 text-sm mb-4 flex items-center gap-1 relative z-10">
             <span className="text-xs">
               <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                 <path d="M5 6C5.34375 6 5.63802 5.8825 5.88281 5.6475C6.1276 5.4125 6.25 5.13 6.25 4.8C6.25 4.47 6.1276 4.1875 5.88281 3.9525C5.63802 3.7175 5.34375 3.6 5 3.6C4.65625 3.6 4.36198 3.7175 4.11719 3.9525C3.8724 4.1875 3.75 4.47 3.75 4.8C3.75 5.13 3.8724 5.4125 4.11719 5.6475C4.36198 5.8825 4.65625 6 5 6ZM5 10.41C6.27083 9.29 7.21354 8.2725 7.82812 7.3575C8.44271 6.4425 8.75 5.63 8.75 4.92C8.75 3.83 8.38802 2.9375 7.66406 2.2425C6.9401 1.5475 6.05208 1.2 5 1.2C3.94792 1.2 3.0599 1.5475 2.33594 2.2425C1.61198 2.9375 1.25 3.83 1.25 4.92C1.25 5.63 1.55729 6.4425 2.17188 7.3575C2.78646 8.2725 3.72917 9.29 5 10.41ZM5 12C3.32292 10.63 2.07031 9.3575 1.24219 8.1825C0.414063 7.0075 0 5.92 0 4.92C0 3.42 0.502604 2.225 1.50781 1.335C2.51302 0.445 3.67708 0 5 0C6.32292 0 7.48698 0.445 8.49219 1.335C9.4974 2.225 10 3.42 10 4.92C10 5.92 9.58594 7.0075 8.75781 8.1825C7.92969 9.3575 6.67708 10.63 5 12Z" fill="#83878D"/>
               </svg>
             </span> {g.location}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-1 relative z-10">
            <div>
              <p className="text-[12px] text-slate-400 uppercase font-semibold tracking-wider">Matches</p>
              <p className="text-xl font-bold text-slate-800">{g.matches || '0'}</p>
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
              <span className="text-sm font-bold text-slate-700">{g.pitch}</span>
            </div>
          </div>
        </div>
      ))}
      
      {!loading && grounds.length === 0 && (
        <div className="w-full py-10 text-center text-slate-400 font-medium">
          No ground details available.
        </div>
      )}
    </div>
  );
};
//  Define the allowed roles as a Union Type
type PlayerRole = 'Batsman' | 'Bowler';

//  Define the structure of the Player Stats
interface PlayerStat {
  name: string;
  role: string;
  head: string;
  weight: number;
  shoulder: string;
  stance: string;
}

//  Update the Analytics component props
interface AnalyticsProps {
  activeRole: PlayerRole;
}

//  Analytics Component
const Analytics: React.FC<AnalyticsProps> = ({ activeRole }) =>{
  

  // Sample data for both roles
  const batsmanStats = Array(8).fill({
    name: "Virat Kohli",
    role: "Batter",
    head: "Slightly Falling",
    weight: 48,
    shoulder: "Open",
    stance: "Wide"
  });

  const bowlerStats = Array(8).fill({
    name: "Jasprit Bumrah",
    role: "Bowler",
    head: "Stable",
    weight: 65,
    shoulder: "Closed",
    stance: "Narrow"
  });

  // Determine which data to show
  const stats = activeRole === 'Batsman' ? batsmanStats : bowlerStats;

  return (
    <div className="w-full">
      
      
      {/* Scroll container for Analytics Table */}
      <div className="max-h-[220px] overflow-y-auto overflow-x-auto scrollbar-hide">
        <table className="w-full text-left min-w-[800px] border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-[12px] text-slate-400 font-medium">
              <th className="pb-4 px-2">Players</th>
              <th className="pb-4">Head Position</th>
              <th className="pb-4">Weight Distribution</th>
              <th className="pb-4">Shoulder</th>
              <th className="pb-4 text-right pr-4">Stance</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr 
                key={i} 
                className={`transition-colors ${i % 2 === 0 ? 'bg-[#F8FAFC]' : 'bg-white'} hover:bg-slate-100/50`}
              >
                <td className="py-2 px-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex-shrink-0 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}${i}`} alt="avatar" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{s.name}</p>
                    <p className="text-[11px] text-slate-400">{s.role}</p>
                  </div>
                </td>
                <td className="text-sm font-medium text-slate-700">{s.head}</td>
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    {/* Progress Bar Track */}
                    <div className="relative w-40 h-2 bg-slate-100 rounded-full">
                      {/* Active Progress Fill */}
                      <div 
                        className="absolute left-0 top-0 h-full bg-[#9481FF] rounded-full" 
                        style={{ width: `${s.weight}%` }}
                      ></div>
                      
                      {/* Slider Thumb with Left & Right Arrows */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 bg-[#9481FF] text-white rounded-full w-6 h-6 shadow-[0_0_10px_rgba(148,129,255,0.4)] flex items-center justify-center cursor-pointer border-2 border-white" 
                        style={{ left: `calc(${s.weight}% - 12px)` }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 17l-5-5 5-5" />
                          <path d="M15 17l5-5-5-5" />
                        </svg>
                      </div>
                    </div>
                    {/* Percentage Text */}
                    <span className="text-sm font-bold text-[#6366F1]">{s.weight}%</span>
                  </div>
                </td>
                <td className="text-sm font-medium text-slate-400">{s.shoulder}</td>
                <td className="text-sm font-medium text-slate-400 text-right pr-4">{s.stance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default function DashboardStats() {
  const [activeTab, setActiveTab] = useState('Player Stats');
  const [activeRole, setActiveRole] = useState<PlayerRole>('Batsman');
  const tabs = ['Player Stats', 'Ground Details', 'Analytics'];
  
  
  const players = Array(8).fill({ 
    name: "Virat Kohli", 
    role: "Batter", 
    score: "4000 / 12", 
    growth: "+1.2%", 
    rate: "148.5" 
  });

  return (
    <div className="bg-white p-4 md:p-3 rounded-[24px] border border-slate-100 shadow-sm flex-grow w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex gap-1 md:gap-2 bg-gray-100 p-1.5 rounded-2xl w-full sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl transition-all ${
                activeTab === tab 
                ? 'bg-white text-slate-700 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Role Toggle: Only visible when Analytics is selected */}
        {activeTab === 'Analytics' && (
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 w-full sm:w-auto">
            <button 
              onClick={() => setActiveRole('Batsman')}
              className={`flex-1 sm:flex-none px-5 py-1.5 text-sm font-medium transition-all rounded-lg ${
                activeRole === 'Batsman' 
                ? 'bg-white shadow-sm text-slate-700 border border-slate-100' 
                : 'text-slate-400'
              }`}
            >
              Batsman
            </button>
            <button 
              onClick={() => setActiveRole('Bowler')}
              className={`flex-1 sm:flex-none px-5 py-1.5 text-sm font-medium transition-all rounded-lg ${
                activeRole === 'Bowler' 
                ? 'bg-white shadow-sm text-slate-700 border border-slate-100' 
                : 'text-slate-400'
              }`}
            >
              Bowler
            </button>
          </div>
        )}
      </div>

      <div className="mt-1">
        {activeTab === 'Player Stats' && (
          /* Fixed height container: roughly 5 rows (5 * 64px) + header */
          <div className="w-full overflow-x-auto scrollbar-hide max-h-[250px] overflow-y-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-[11px] text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 px-4 font-medium">Players</th>
                  <th className="pb-3 font-medium text-center">Runs/Wickets</th>
                  <th className="pb-3 font-medium text-center">Performance Graph</th>
                  <th className="pb-3 font-medium text-center">Growth</th>
                  <th className="pb-3 font-medium text-center">Strike Rate/Economy</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={i} className={`transition-colors ${i % 2 === 0 ? 'bg-[#F8FAFC]' : 'bg-white'} hover:bg-slate-100/50`}>
                    <td className="py-2 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 5}`} alt="avatar" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{p.role}</p>
                      </div>
                    </td>
                    <td className="py-4 text-xs font-bold text-gray-900 text-center">{p.score}</td>
                    <td className="py-4">
                      <div className="w-24 h-6 mx-auto overflow-hidden">
                        <svg viewBox="0 0 100 30" className="w-full h-full">
                          <path 
                            d={i % 2 === 0 ? "M0,20 L20,15 L40,25 L60,10 L80,18 L100,5" : "M0,10 L20,25 L40,15 L60,20 L80,5 L100,12"} 
                            fill="none" 
                            stroke={p.growth.startsWith('+') ? "#10b981" : "#ef4444"} 
                            strokeWidth="2.5" 
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </td>
                    <td className={`py-4 text-xs font-bold text-center ${p.growth.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {p.growth}
                    </td>
                    <td className="py-4 text-sm font-bold text-slate-400 text-center">{p.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Ground Details' && <GroundDetails />}
        {activeTab === 'Analytics' && <Analytics activeRole={activeRole} />}
      </div>
    </div>
  );
}
