"use client";

import React, { useState } from 'react';
import { X, Upload, Search, Trash2, Eye, Edit2, Play, ChevronDown, Send } from 'lucide-react';

interface RefereeActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string; // Added matchId prop
  ballInfo: any;
  onSaveAction: (action: any) => void;
}

export const RefereeActionModal: React.FC<RefereeActionModalProps> = ({ isOpen, onClose, matchId, ballInfo, onSaveAction }) => {
  const [activeTab, setActiveTab] = useState<'coc' | 'appeal' | 'suspected' | 'key_moment' | 'upload_video'>('coc');

  // Form states for COC
  const [cocTeam, setCocTeam] = useState('');
  const [cocPlayer, setCocPlayer] = useState('');
  
  // Custom dropdown state for Incident Category
  const [isCocCategoryOpen, setIsCocCategoryOpen] = useState(false);
  const [cocCategory, setCocCategory] = useState('');
  const [customCocOther, setCustomCocOther] = useState('');

  // Custom dropdown state for Offence Level
  const [isCocLevelOpen, setIsCocLevelOpen] = useState(false);
  const [cocLevel, setCocLevel] = useState('');

  const [cocDesc, setCocDesc] = useState('');

  // Form states for Appeal
  const [appealDecision, setAppealDecision] = useState("Umpire's call");
  const [appealUmpire, setAppealUmpire] = useState("Umpire's call");
  const [appealDesc, setAppealDesc] = useState('');

  // Form states for Suspected Insight
  const [suspectedActions, setSuspectedActions] = useState<Record<string, boolean>>({
    chucking: true,
    ballTampering: false,
    beamer: false,
    timeWasting: false,
    dangerousDelivery: false,
    others: false,
  });
  const [suspectedDesc, setSuspectedDesc] = useState('');

  // Form states for Key Moment
  const [keyMomentDesc, setKeyMomentDesc] = useState('');

  // Video Preview Modal state inside Upload Video tab
  const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);

  if (!isOpen) return null;

  const handleNextTab = () => {
    if (activeTab === 'coc') setActiveTab('appeal');
    else if (activeTab === 'appeal') setActiveTab('suspected');
    else if (activeTab === 'suspected') setActiveTab('key_moment');
    else if (activeTab === 'key_moment') setActiveTab('upload_video');
  };

  const handleFinalSubmit = () => {
    onSaveAction({
      id: Date.now(),
      matchId: matchId,
      over: ballInfo?.over_number ? `Over ${Math.floor(Number(ballInfo.over_number)) + 1}` : "Over 12",
      ball: ballInfo?.over_number || "12.4",
      batterBowler: cocPlayer || ballInfo?.batsman_name || "Marco Jansen",
      actionTaken: activeTab.toUpperCase(),
      details: cocCategory || appealDecision || suspectedDesc || keyMomentDesc || "Recorded via Referee Modal",
      by: "Ranjan Madugalle",
      role: "Match Referee",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[850px] max-h-[95vh] overflow-y-auto p-6 md:p-8 relative flex flex-col custom-scrollbar text-black">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 w-9 h-9 flex items-center justify-center rounded-full border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* --- TABS NAVIGATION BAR --- */}
        <div className="flex items-center justify-center bg-slate-50 p-1.5 rounded-2xl border border-slate-200 mb-8 max-w-xl mx-auto w-full">
          {[
            { id: 'coc', label: 'COC' },
            { id: 'appeal', label: 'Appeal' },
            { id: 'suspected', label: 'Suspected Insight' },
            { id: 'key_moment', label: 'Key Moment' },
            { id: 'upload_video', label: 'Upload Video' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all truncate ${
                activeTab === tab.id
                  ? 'bg-[#0F1117] text-white shadow-md'
                  : 'text-slate-900 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── TAB 1: CODE OF CONDUCT (COC) ─── */}
        {activeTab === 'coc' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-indigo-100 text-[#6366F1]">
                ⚖️
              </div>
              <h3 className="text-xl font-bold text-black">Code Of Conduct</h3>
              <p className="text-slate-600 text-xs font-medium mt-0.5">Review and Record Player/ Match Officials Behaviours.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-black block mb-1.5">Team</label>
                <div className="relative">
                  <select 
                    value={cocTeam} 
                    onChange={(e) => setCocTeam(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-black outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Your Team</option>
                    <option value="South Africa">South Africa</option>
                    <option value="England">England</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-black block mb-1.5">Player</label>
                <div className="relative">
                  <select 
                    value={cocPlayer} 
                    onChange={(e) => setCocPlayer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-black outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Player</option>
                    <option value="Marco Jansen">Marco Jansen</option>
                    <option value="R. Sharma">R. Sharma</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-black block mb-1.5">Over</label>
                <input 
                  type="text" 
                  readOnly 
                  value={ballInfo?.over_number ? `Over ${Math.floor(Number(ballInfo.over_number)) + 1}` : "Over 12"} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-black outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-black block mb-1.5">Ball No.</label>
                  <input type="text" readOnly value={ballInfo?.over_number || "12.4"} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-black outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-black block mb-1.5">Time</label>
                  <input type="text" readOnly value={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-black outline-none" />
                </div>
              </div>

              {/* INCIDENT CATEGORY CUSTOM DROPDOWN WITH 'OTHERS' AT THE VERY BOTTOM */}
              <div className="relative">
                <label className="text-xs font-bold text-black block mb-1.5">Incident Category</label>
                <div 
                  onClick={() => setIsCocCategoryOpen(!isCocCategoryOpen)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-black flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{cocCategory === 'Others' ? (customCocOther || 'Others') : (cocCategory || "Select Incident Category")}</span>
                  <ChevronDown size={16} className="text-black shrink-0" />
                </div>

                {isCocCategoryOpen && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 max-h-72 overflow-y-auto space-y-3 text-xs font-bold text-black">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-extrabold px-2 mb-1">Player Conduct</p>
                      {["Verbal Abuse / Offensive Language", "Aggressive Behaviour", "Dissent Against Decision", "Provocative Gesture"].map((item) => (
                        <div key={item} onClick={() => { setCocCategory(item); setIsCocCategoryOpen(false); }} className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-black"></span> {item}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-2">
                      <p className="text-[10px] text-slate-400 uppercase font-extrabold px-2 mb-1">On-Field Conduct</p>
                      {["Dangerous Bowling", "Time Wasting", "Deliberate Distraction", "Ball Tampering"].map((item) => (
                        <div key={item} onClick={() => { setCocCategory(item); setIsCocCategoryOpen(false); }} className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-black"></span> {item}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-2">
                      <p className="text-[10px] text-slate-400 uppercase font-extrabold px-2 mb-1">Match Official</p>
                      {["Disrespect Toward Official", "Intimidation of Official", "Failure to Follow Instruction"].map((item) => (
                        <div key={item} onClick={() => { setCocCategory(item); setIsCocCategoryOpen(false); }} className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-black"></span> {item}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-2">
                      <p className="text-[10px] text-slate-400 uppercase font-extrabold px-2 mb-1">Match Integrity</p>
                      {["Suspected Match Manipulation", "Betting-Related Violation", "Corrupt Approach"].map((item) => (
                        <div key={item} onClick={() => { setCocCategory(item); setIsCocCategoryOpen(false); }} className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-black"></span> {item}
                        </div>
                      ))}
                    </div>

                    {/* OTHERS PLACED AT THE VERY BOTTOM */}
                    <div className="border-t border-slate-100 pt-2">
                      <div onClick={() => { setCocCategory("Others"); setIsCocCategoryOpen(false); }} className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-2 text-indigo-600 font-extrabold">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Others
                      </div>
                    </div>
                  </div>
                )}

                {cocCategory === 'Others' && (
                  <div className="mt-2 relative">
                    <input 
                      type="text" 
                      value={customCocOther} 
                      onChange={(e) => setCustomCocOther(e.target.value)}
                      placeholder="Write Others kind of Incident Here" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-black outline-none pr-10"
                    />
                    <Send size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600" />
                  </div>
                )}
              </div>

              {/* OFFENCE LEVEL CUSTOM DROPDOWN */}
              <div className="relative">
                <label className="text-xs font-bold text-black block mb-1.5">Offence Level</label>
                <div 
                  onClick={() => setIsCocLevelOpen(!isCocLevelOpen)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-black flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{cocLevel || "Select Offence Level"}</span>
                  <ChevronDown size={16} className="text-black shrink-0" />
                </div>

                {isCocLevelOpen && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 text-xs font-bold text-black">
                    {[
                      { title: "Level 1 • Minor", desc: "Low-level misconduct" },
                      { title: "Level 2 • Moderate", desc: "Repeated / more serious misconduct" },
                      { title: "Level 3 • Serious", desc: "Significant breach of conduct" },
                      { title: "Level 4 • Severe", desc: "Major misconduct / integrity breach" },
                    ].map((lvl) => (
                      <div key={lvl.title} onClick={() => { setCocLevel(lvl.title); setIsCocLevelOpen(false); }} className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer">
                        <p className="font-extrabold text-black">{lvl.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{lvl.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-black block mb-1.5">Description</label>
              <textarea 
                rows={4}
                value={cocDesc}
                onChange={(e) => setCocDesc(e.target.value)}
                placeholder="Provide detailed context of the incident..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-black outline-none focus:border-[#FF5521] resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button 
                onClick={handleFinalSubmit}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-black text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Submit Case
              </button>
              <button 
                onClick={handleNextTab}
                className="px-6 py-3 bg-[#0F1117] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 2: APPEAL ─── */}
        {activeTab === 'appeal' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100 text-blue-600">
                🙌
              </div>
              <h3 className="text-xl font-bold text-black">Appeal</h3>
              <p className="text-slate-600 text-xs font-medium mt-0.5">Select the Umpire's Decision & Umpire Name</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-black block mb-2">Decision</label>
                <div className="space-y-2">
                  {["Umpire's call", "Stay", "Overturned"].map((item) => (
                    <div 
                      key={item}
                      onClick={() => setAppealDecision(item)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        appealDecision === item ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <input type="checkbox" checked={appealDecision === item} readOnly className="w-4 h-4 rounded text-blue-600 accent-blue-600 pointer-events-none" />
                      <span className="text-xs font-bold text-black">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-black block mb-2">Umpire</label>
                <div className="space-y-2">
                  {["Umpire's call", "Stay", "Overturned"].map((item) => (
                    <div 
                      key={item}
                      onClick={() => setAppealUmpire(item)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        appealUmpire === item ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <input type="checkbox" checked={appealUmpire === item} readOnly className="w-4 h-4 rounded text-blue-600 accent-blue-600 pointer-events-none" />
                      <span className="text-xs font-bold text-black">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-black block mb-1.5">Description</label>
              <textarea 
                rows={4}
                value={appealDesc}
                onChange={(e) => setAppealDesc(e.target.value)}
                placeholder="Provide detailed context of the incident..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-black outline-none focus:border-[#FF5521] resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button 
                onClick={handleFinalSubmit}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-black text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Submit Case
              </button>
              <button 
                onClick={handleNextTab}
                className="px-6 py-3 bg-[#0F1117] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 3: SUSPECTED INSIGHT ─── */}
        {activeTab === 'suspected' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-100 text-amber-600">
                🚨
              </div>
              <h3 className="text-xl font-bold text-black">Suspected Incident</h3>
              <p className="text-slate-600 text-xs font-medium mt-0.5">Select the Suspected Actions Done by Player</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'chucking', label: 'Chucking' },
                { id: 'timeWasting', label: 'Time Wasting' },
                { id: 'ballTampering', label: 'Ball Tampering' },
                { id: 'dangerousDelivery', label: 'Dangerous Delivery' },
                { id: 'beamer', label: 'Beamer' },
                { id: 'others', label: 'Others' },
              ].map((act) => (
                <div 
                  key={act.id}
                  onClick={() => setSuspectedActions(prev => ({ ...prev, [act.id]: !prev[act.id] }))}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    suspectedActions[act.id] ? 'border-amber-500 bg-amber-50/20' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={suspectedActions[act.id]} 
                    readOnly 
                    className="w-4 h-4 rounded text-amber-600 accent-amber-600 pointer-events-none" 
                  />
                  <span className="text-xs font-bold text-black">{act.label}</span>
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-black block mb-1.5">Description</label>
              <textarea 
                rows={4}
                value={suspectedDesc}
                onChange={(e) => setSuspectedDesc(e.target.value)}
                placeholder="Provide detailed context of the incident..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-black outline-none focus:border-[#FF5521] resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button 
                onClick={handleFinalSubmit}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-black text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Submit Case
              </button>
              <button 
                onClick={handleNextTab}
                className="px-6 py-3 bg-[#0F1117] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 4: KEY MOMENT ─── */}
        {activeTab === 'key_moment' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-orange-100 text-orange-600">
                ⭐
              </div>
              <h3 className="text-xl font-bold text-black">Key Moments</h3>
              <p className="text-slate-600 text-xs font-medium mt-0.5">Describe your key Moments here</p>
            </div>

            <div>
              <label className="text-xs font-bold text-black block mb-1.5">Describe key Moments Here</label>
              <textarea 
                rows={6}
                value={keyMomentDesc}
                onChange={(e) => setKeyMomentDesc(e.target.value)}
                placeholder="Provide detailed context of the incident..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-black outline-none focus:border-[#FF5521] resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button 
                onClick={handleFinalSubmit}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-black text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Submit Case
              </button>
              <button 
                onClick={handleNextTab}
                className="px-6 py-3 bg-[#0F1117] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 5: UPLOAD VIDEO ─── */}
        {activeTab === 'upload_video' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Drag & Drop Upload Card */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
              <p className="text-xs font-bold text-black">Drag & drop video files here</p>
              <p className="text-[11px] text-slate-500 my-1">or</p>
              <button className="px-4 py-2 bg-[#0F1117] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-slate-800 transition-colors cursor-pointer">
                Choose File
              </button>
              <p className="text-[10px] text-slate-500 mt-3">Supports: MP4, MOV, AVI, MKV • Max file size: 5 GB per file</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search videos..." 
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-slate-50 text-black" 
                />
              </div>
              <div className="relative w-full sm:w-auto">
                <select className="w-full sm:w-auto px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50 outline-none cursor-pointer text-black">
                  <option>All Categories</option>
                  <option>Umpire Cam</option>
                  <option>Broadcast Feed</option>
                </select>
              </div>
            </div>

            {/* Video List Table */}
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8FAFC] text-[10px] font-bold text-black uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center"><input type="checkbox" className="rounded" /></th>
                    <th className="py-3 px-4">Preview</th>
                    <th className="py-3 px-4">Details & Metadata</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-black">
                  {[
                    { title: "Over 8.6 - Player Dissent", angle: "Angle: Umpire Cam", time: "21 Jan 2026, 02:30 PM", size: "Size: 210 MB", status: "Ready" },
                    { title: "Over 16.4 - Possible Dangerous Bowling", angle: "Angle: Front On", time: "21 Jan 2026, 03:42 PM", size: "Size: 145 MB", status: "Ready" },
                    { title: "Full Match Highlights", angle: "Angle: Broadcast Feed", time: "21 Jan 2026, 01:20 PM", size: "Size: 1.2 GB", status: "Ready" },
                  ].map((vid, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-center"><input type="checkbox" className="rounded" /></td>
                      <td className="py-3 px-4">
                        <div className="w-20 h-12 bg-slate-200 rounded-lg overflow-hidden relative flex items-center justify-center">
                          <Play size={16} className="text-white fill-white drop-shadow-md" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-black">{vid.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{vid.angle} • {vid.time} • {vid.size}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {vid.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button title="Delete" className="p-1.5 text-black hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                          {/* EYE ICON CLICK TO OPEN VIDEO PREVIEW MODAL */}
                          <button 
                            title="View Video" 
                            onClick={() => setIsVideoPreviewOpen(true)}
                            className="p-1.5 text-black hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>
                          <button title="Edit" className="p-1.5 text-black hover:text-slate-900 transition-colors"><Edit2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button 
                onClick={handleFinalSubmit}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-black text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Submit Case
              </button>
              <button 
                onClick={handleFinalSubmit}
                className="px-6 py-3 bg-[#0F1117] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ─── VIDEO PREVIEW MODAL OVERLAY (Opened via Eye Icon) ─── */}
      {isVideoPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[800px] overflow-hidden relative flex flex-col p-6 text-black">
            
            {/* Close Button for Video Modal */}
            <button 
              onClick={() => setIsVideoPreviewOpen(false)}
              className="absolute top-6 right-6 text-black hover:text-gray-600 w-9 h-9 flex items-center justify-center rounded-full border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer z-10"
            >
              <X size={18} />
            </button>

            {/* Video Player Mock with Skeleton Overlay */}
            <div className="w-full h-[380px] bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center mb-6">
              <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md">
                Over - 12.4
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <Play size={24} className="text-white fill-white ml-1" />
              </div>
            </div>

            {/* Video Sub-list metadata */}
            <div className="border border-slate-100 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8FAFC] text-[10px] font-bold text-black uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Preview</th>
                    <th className="py-2.5 px-4">Details & Metadata</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-black">
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="w-16 h-10 bg-slate-200 rounded-lg overflow-hidden relative flex items-center justify-center">
                        <Play size={12} className="text-white fill-white" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-black">Over 16.4 - Possible Dangerous Bowling</p>
                      <p className="text-[10px] text-slate-500">Angle: Front On • Date: 21 Jan 2026, 03:42 PM • Size: 145 MB</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-blue-600 font-bold hover:underline cursor-pointer flex items-center justify-end gap-1">
                        View Video →
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setIsVideoPreviewOpen(false)}
                className="px-6 py-3 bg-[#0F1117] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};