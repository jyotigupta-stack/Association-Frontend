import React, { useState,useEffect } from 'react';



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
  const [statsData, setStatsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const tabs = ['Player Stats', 'Analytics'];

  // Fetch data using native fetch
  useEffect(() => {
    if (activeTab === 'Player Stats') {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SCORING_API_URL}/api/v1/statistics/leaders`, {
  method: 'GET', // or your required method
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json" // Include if your API requires it
  }
});
          const data = await response.json();
          console.log("Fetched stats data:", data);
          // Merge run scorers and wicket takers into one list
          const combined = [
            ...(data.top_run_scorers || []),
            ...(data.top_wicket_takers || [])
          ];
          setStatsData(combined);
        } catch (error) {
          console.error("Failed to fetch stats:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [activeTab]);

  // Filter logic
  const filteredPlayers = statsData.filter(p => 
    activeRole === 'Batsman' ? p.player_type === 'batsman' : p.player_type === 'bowler'
  );

  return (
    <div className="bg-white p-4 md:p-3 rounded-[24px] border border-slate-100 shadow-sm flex-grow w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex gap-1 md:gap-2 bg-gray-100 p-1.5 rounded-2xl w-full sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl transition-all ${
                activeTab === tab ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Unified Role Toggle for both tabs */}
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 w-full sm:w-auto">
          <button 
            onClick={() => setActiveRole('Batsman')}
            className={`flex-1 sm:flex-none px-5 py-1.5 text-sm font-medium transition-all rounded-lg ${activeRole === 'Batsman' ? 'bg-white shadow-sm text-slate-700 border border-slate-100' : 'text-slate-400'}`}
          >Batsman</button>
          <button 
            onClick={() => setActiveRole('Bowler')}
            className={`flex-1 sm:flex-none px-5 py-1.5 text-sm font-medium transition-all rounded-lg ${activeRole === 'Bowler' ? 'bg-white shadow-sm text-slate-700 border border-slate-100' : 'text-slate-400'}`}
          >Bowler</button>
        </div>
      </div>

      <div className="mt-1">
        {activeTab === 'Player Stats' && (
          <div className="w-full overflow-x-auto scrollbar-hide max-h-[250px] overflow-y-auto">
            {loading ? <p className="text-center p-4 text-sm text-slate-400">Loading...</p> : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="sticky top-0 bg-white z-10 ">
                  <tr className="text-[11px]  uppercase tracking-wider font-bold text-black">
                    <th className="pb-3 px-4 font-bold">Players</th>
                    <th className="pb-3 font-bold text-center">{activeRole === 'Batsman' ? 'Runs' : 'Wickets'}</th>
                    <th className="pb-3 font-bold text-center">Performance</th>
                    <th className="pb-3 font-bold text-center">Growth</th>
                    <th className="pb-3 font-bold text-center">{activeRole === 'Batsman' ? 'Strike Rate' : 'Economy'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 border-b border-slate-50">
                      <td className="py-2 px-4 flex items-center gap-3">
                        
                        <div>
                          <p className="text-xs font-bold text-slate-900">{p.player_name}</p>
                          <p className="text-[12px] text-slate-500">{activeRole}</p>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-bold text-gray-700 text-center">{activeRole === 'Batsman' ? p.total_runs : p.total_wickets}</td>
                      <td className="py-4">
  <div className="w-20 h-6 mx-auto">
    <svg viewBox="0 0 100 30" className="w-full h-full">
      {/* Check if the string starts with a '+' */}
      <path 
        d="M0,20 L50,5 L100,25" 
        fill="none" 
        stroke={p.growth.startsWith('+') ? "#10b981" : "#ef4444"} 
        strokeWidth="3" 
      />
    </svg>
  </div>
</td>
<td className={`py-4 text-xs font-bold text-center ${p.growth.startsWith('+') ? "text-green-500" : "text-red-500"}`}>
  {p.growth}
</td>
                      <td className="py-4 text-sm font-bold text-slate-400 text-center">
                        {activeRole === 'Batsman' ? p.strike_rate : p.economy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {activeTab === 'Analytics' && <Analytics activeRole={activeRole} />}
      </div>
    </div>
  );
}
