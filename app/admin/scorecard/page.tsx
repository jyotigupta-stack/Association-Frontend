"use client"

import React from 'react';

const currentInnings = {
  batsmen: [
    { name: "Quinton de Kock", runs: 74, balls: 44, "4s": 8, "6s": 3, SR: 168.18 },
    { name: "Reeza Hendricks", runs: 19, balls: 18, "4s": 2, "6s": 0, SR: 105.56 },
    { name: "Aiden Markram", runs: 48, balls: 32, "4s": 4, "6s": 1, SR: 150.00 },
  ],
  bowlers: [
    { name: "Jofra Archer", overs: 4, maiden: 0, runs_given: 40, wickets_taken: 3, economy: 10.0 },
    { name: "Adil Rashid", overs: 4, maiden: 0, runs_given: 20, wickets_taken: 1, economy: 5.0 },
    { name: "Moeen Ali", overs: 2, maiden: 0, runs_given: 25, wickets_taken: 0, economy: 12.5 },
  ]
};

const ScoreCard: React.FC = () => {
  return (
    <>
    <header className="flex items-center justify-between mb-6 bg-transparent px-1">
  
  {/* Left Side: Breadcrumbs */}
  <div className="flex items-center text-[13px] font-medium text-slate-500">
    Home <span className="mx-2 text-slate-400 font-light">{'>'}</span> 
    <span className="text-slate-900">Scorecard</span>
  </div>

  {/* Right Side: Static Navigation Tabs */}
  <div className="flex bg-[#F1F3F6] p-1 rounded-xl shadow-sm border border-slate-200/50">
    {/* Scorer Link (Inactive state for now) */}
    <div className="md:px-10 px-2 py-2 rounded-lg text-sm font-bold transition-all text-gray-500 cursor-pointer hover:text-gray-700">
      Inning 1
    </div>

    {/* Scorecard Link (Active state) */}
    <div className="md:px-10 px-2 py-2 rounded-lg text-sm font-bold transition-all bg-black text-white shadow-md cursor-pointer">
      Inning 2
    </div>
  </div>
</header>

    <div className="w-full text-black  p-3 md:p-6  animate-in fade-in slide-in-from-top-2 duration-500 max-h-screen overflow-y-auto custom-scrollbar">
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
           background: #4b77c4; 
           border-radius: 1px;
           
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #355899; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* BATTING STATS SECTION */}
      <h3 className="text-xl md:text-2xl font-bold mb-4">Batting Stats</h3>
      <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="flex justify-between items-center px-4 md:px-6 py-4 bg-[#E8EFF3]">
          <h3 className="font-extrabold text-[#1A1C21] text-sm md:text-base">Batting Scorecard</h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">India</span>
        </div>

        {/* Horizontal Scroll for Table on Mobile */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[600px] md:min-w-full">
            <thead className="bg-[#F0F4F780] text-[11px] md:text-[12px] text-gray-700 font-bold uppercase">
              <tr>
                <th className="text-left px-4 md:px-8 py-3">Batsman</th>
                <th className="text-center py-3 px-4">R</th>
                <th className="text-center py-3 px-4">B</th>
                <th className="text-center py-3 px-4">4s</th>
                <th className="text-center py-3 px-4">6s</th>
                <th className="text-right px-4 md:px-8 py-3">SR</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentInnings.batsmen.map((b, i) => (
                <tr key={i} className="border-b last:border-0 border-gray-100">
                  <td className="px-4 md:px-8 py-4 relative">
                    <div className={`absolute left-2 md:left-4 top-1/4 bottom-1/4 w-1 rounded-full ${i % 2 === 0 ? 'bg-indigo-500' : 'bg-gray-600'}`} />
                    <div className="font-bold text-[#1A1C21]">{b.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 font-medium italic">c Smith b Starc</div>
                  </td>
                  <td className="text-center font-bold text-base md:text-lg">{b.runs}</td>
                  <td className="text-center text-gray-500">{b.balls}</td>
                  <td className="text-center text-gray-500">{b["4s"]}</td>
                  <td className="text-center text-gray-500">{b["6s"]}</td>
                  <td className="text-right px-4 md:px-8 text-gray-500 font-medium">{b.SR}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Extras & Totals Footer */}
        <div className="flex flex-col md:flex-row border-t border-gray-100 bg-gray-50 p-4 md:p-6 gap-4 md:gap-6 ">
          <div className="flex-1 p-6 text-xs bg-white rounded-xl border border-gray-100 items-center ">
            <span className="font-bold uppercase text-gray-900 tracking-wider">Extras -</span>
            <span className="ml-2 text-gray-500 font-medium">(b 1, lb 4, w 5, nb 0)</span>
            <span className="float-right font-bold text-base text-slate-900">10</span>
          </div>
          <div className="flex-1 bg-[#4A5568] text-white px-6 md:px-8 py-4 flex justify-between items-center rounded-xl ">
            <span className="font-bold text-sm tracking-widest uppercase">Total</span>
            <div className="text-right">
              <p className="text-xl font-bold">163/6</p>
              <p className="text-[10px] opacity-70 font-medium">(20 Overs, RR 8.15)</p>
            </div>
          </div>
        </div>
      </div>

      {/* BOWLING STATS SECTION */}
      <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4">Bowling Stats</h3>
      <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="flex justify-between items-center px-4 md:px-6 py-4 bg-[#E8EFF3]">
          <h3 className="font-extrabold text-[#1A1C21] text-sm md:text-base">Bowling Card</h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">England</span>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[500px] md:min-w-full">
            <thead className="bg-[#F8F9FA] text-[11px] md:text-[12px] text-gray-700 font-bold uppercase">
              <tr>
                <th className="text-left px-4 md:px-8 py-3">Bowler</th>
                <th className="text-center py-3 px-4">O</th>
                <th className="text-center py-3 px-4">M</th>
                <th className="text-center py-3 px-4">R</th>
                <th className="text-center py-3 px-4">W</th>
                <th className="text-right px-4 md:px-8 py-3">Econ</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold">
              {currentInnings.bowlers.map((bw, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 md:px-8 py-4 text-[#1A1C21]">{bw.name}</td>
                  <td className="text-center text-gray-500 font-medium">{bw.overs}</td>
                  <td className="text-center text-gray-500 font-medium">{bw.maiden}</td>
                  <td className="text-center text-gray-500 font-medium">{bw.runs_given}</td>
                  <td className="text-center text-[#1A1C21] font-black">{bw.wickets_taken}</td>
                  <td className="text-right px-4 md:px-8 text-gray-500 font-medium">{bw.economy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FALL OF WICKETS */}
      <div className="mt-8">
        <h3 className="text-xl md:text-2xl font-bold mb-4">Fall of Wickets</h3>
        <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 shadow-xs overflow-x-auto no-scrollbar">
          <table className="w-full text-sm min-w-[450px]">
            <thead className="bg-[#F1F3F6] text-[10px] font-bold text-gray-400 uppercase">
              <tr>
                <th className="px-4 md:px-8 py-3 text-left">Wickets</th>
                <th className="py-3 text-left">Batsman Out</th>
                <th className="py-3 text-center">Score</th>
                <th className="px-4 md:px-8 py-3 text-right">Over</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 last:border-0">
                <td className="px-4 md:px-8 py-4 font-bold">1</td>
                <td className="py-4 font-bold text-xs md:text-sm">Quinton de Kock <span className="block text-[10px] text-gray-400 font-medium italic">c. Buttler b. Archer</span></td>
                <td className="py-4 text-center font-bold">86 <span className="text-gray-400 font-normal">/ 1</span></td>
                <td className="px-4 md:px-8 py-4 text-right font-medium">11.4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PARTNERSHIP SECTION */}
      <div className="mt-8">
        <h3 className="text-xl md:text-2xl font-bold mb-4">Partnership</h3>
        <div className="space-y-4">
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-1/4 text-center md:text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">1ST WICKET</span>
              <p className="text-xs font-medium text-gray-600">Over 0.1 - 11.4</p>
            </div>
            
            <div className="flex-1 w-full md:px-8 text-center">
              <div className="flex justify-between items-end mb-2">
                <div className="text-left">
                  <p className="font-bold text-xs md:text-sm">Q de Kock</p>
                  <p className="text-xs md:text-sm font-bold text-gray-700">74 <span className="text-gray-400 font-normal text-[10px] md:text-[12px]">(44)</span></p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-black text-slate-900">86 <span className="text-xs text-gray-500 font-bold">runs</span></p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 font-medium uppercase">70 BALLS • 7.37 RPO</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xs md:text-sm">R Hendricks</p>
                  <p className="text-xs md:text-sm font-bold text-gray-700">12 <span className="text-gray-400 font-normal text-[10px] md:text-[12px]">(26)</span></p>
                </div>
              </div>
              <div className="w-full h-2 bg-blue-100 rounded-full flex overflow-hidden">
                <div className="h-full bg-blue-500" style={{width: '86%'}}></div>
                <div className="h-full bg-blue-200" style={{width: '14%'}}></div>
              </div>
              <div className="flex justify-between text-[10px] md:text-[11px] font-bold text-gray-600 mt-2 uppercase tracking-tight">
                <span>86% contribution</span>
                <span>14% contribution</span>
              </div>
            </div>

            <div className="w-full md:w-1/6 text-center md:text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Extras</p>
              <p className="text-xl font-black text-slate-900">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ScoreCard;