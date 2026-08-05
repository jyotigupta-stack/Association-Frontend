"use client"
import React, { useState } from 'react'

type ActiveModal = "season" | "guest" | "transfer" | null;
const ActivePlayers = () => {
  const [currentPage, setCurrentPage] = useState(2);
  
  // Modal states typed explicitly as string | null
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const playersData = Array(7).fill({
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    district: "Mysore",
    club: "Chamundi Hills CC",
    registration: "Renewal/ Primary"
  });

  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 font-sans text-gray-900 relative">
      {/* Main Container Card */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8">
        
        {/* Header Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-6">Recent Registration</h1>

        {/* Table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFBFF]">
                <th className="py-4 px-6 text-[13px] font-bold text-gray-700 uppercase tracking-wider">Player</th>
                <th className="py-4 px-6 text-[13px] font-bold text-gray-700 uppercase tracking-wider">Home District</th>
                <th className="py-4 px-6 text-[13px] font-bold text-gray-700 uppercase tracking-wider">Club</th>
                <th className="py-4 px-6 text-[13px] font-bold text-gray-700 uppercase tracking-wider">Registration</th>
                <th className="py-4 px-6 text-[13px] font-bold text-gray-700 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {playersData.map((player, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  {/* Player info column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                     
                      <div>
                        <div className="font-bold text-sm text-gray-900">{player.name}</div>
                        <div className="text-sm text-gray-500">{player.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* District column */}
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">
                    {player.district}
                  </td>

                  {/* Club column */}
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">
                    {player.club}
                  </td>

                  {/* Registration type column */}
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">
                    {player.registration}
                  </td>

                  {/* Actions column */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-xs font-semibold">
                      <button 
                        onClick={() => setActiveModal('season')} 
                        className="text-[#4B70C3] hover:underline"
                      >
                        Season Renewal
                      </button>
                      <span className="text-gray-200">|</span>
                      <button 
                        onClick={() => setActiveModal('guest')} 
                        className="text-[#4B70C3] hover:underline"
                      >
                        Make Guest Player
                      </button>
                      <span className="text-gray-200">|</span>
                      <button 
                        onClick={() => setActiveModal('transfer')} 
                        className="text-[#4B70C3] hover:underline"
                      >
                        Inter Club Transfer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex items-center justify-center gap-2 pt-8 pb-2">
          <button className="px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-400 hover:bg-gray-50 transition-colors">
            ‹ Back
          </button>
          
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center ${
                currentPage === num
                  ? 'bg-black text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {num}
            </button>
          ))}

          <button className="px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Next ›
          </button>
        </div>

      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Season Renewal Modal */}
      {activeModal === 'season' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[480px] rounded-3xl p-8 relative text-center shadow-xl">
            
            <button onClick={closeModal} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="w-[60px] h-[60px] bg-[#F0F5FF] rounded-full flex items-center justify-center mx-auto mb-3">
              <img src="/Logo.png" alt="Logo" className="w-[30px] h-[30px] object-contain" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Season Renewal</h2>

            <div className="space-y-4 text-left mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Player</label>
                <div className="w-full p-4 bg-[#FAFBFF] border border-[#E5F0FF] rounded-xl text-sm text-gray-400 flex justify-between items-center cursor-pointer">
                  <span>Select Player</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#83878D" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Season</label>
                <input 
                  type="text" 
                  placeholder="Enter Season" 
                  className="w-full p-4 bg-[#FAFBFF] border border-[#E5F0FF] rounded-xl text-sm text-gray-900 outline-none focus:border-[#4B70C3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Club</label>
                <input 
                  type="text" 
                  placeholder="Enter Club" 
                  className="w-full p-4 bg-[#FAFBFF] border border-[#E5F0FF] rounded-xl text-sm text-gray-900 outline-none focus:border-[#4B70C3]"
                />
              </div>
            </div>

            <button onClick={closeModal} className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm hover:bg-[#3b5da8] transition-colors">
              Done
            </button>
          </div>
        </div>
      )}

      {/* 2. Guest Player Modal */}
      {activeModal === 'guest' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[480px] rounded-3xl p-8 relative text-center shadow-xl">
            
            <button onClick={closeModal} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="w-[60px] h-[60px] bg-[#F0F5FF] rounded-full flex items-center justify-center mx-auto mb-3">
              <img src="/Logo.png" alt="Logo" className="w-[30px] h-[30px] object-contain" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Player</h2>

            <div className="space-y-4 text-left mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Player</label>
                <div className="w-full p-4 bg-[#FAFBFF] border border-[#E5F0FF] rounded-xl text-sm text-gray-400 flex justify-between items-center cursor-pointer">
                  <span>Select Player</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#83878D" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Season</label>
                <input 
                  type="text" 
                  placeholder="Enter Season" 
                  className="w-full p-4 bg-[#FAFBFF] border border-[#E5F0FF] rounded-xl text-sm text-gray-900 outline-none focus:border-[#4B70C3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Guest District</label>
                <input 
                  type="text" 
                  placeholder="Enter Guest District" 
                  className="w-full p-4 bg-[#FAFBFF] border border-[#E5F0FF] rounded-xl text-sm text-gray-900 outline-none focus:border-[#4B70C3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Club</label>
                <input 
                  type="text" 
                  placeholder="Enter Club" 
                  className="w-full p-4 bg-[#FAFBFF] border border-[#E5F0FF] rounded-xl text-sm text-gray-900 outline-none focus:border-[#4B70C3]"
                />
              </div>
            </div>

            <button onClick={closeModal} className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm hover:bg-[#3b5da8] transition-colors">
              Done
            </button>
          </div>
        </div>
      )}

      {/* 3. Inter-Club Transfer Modal */}
      {activeModal === 'transfer' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[480px] rounded-3xl p-8 relative text-center shadow-xl">
            
            <button onClick={closeModal} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="w-[60px] h-[60px] bg-[#F0F5FF] rounded-full flex items-center justify-center mx-auto mb-3">
              <img src="/Logo.png" alt="Logo" className="w-[30px] h-[30px] object-contain" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Inter- Club Transfer</h2>

            <div className="space-y-4 text-left mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Player</label>
                <div className="w-full p-4 bg-[#FAFBFF] border border-[#E5F0FF] rounded-xl text-sm text-gray-400 flex justify-between items-center cursor-pointer">
                  <span>Select Player</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#83878D" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Club</label>
                <input 
                  type="text" 
                  placeholder="Enter Club" 
                  className="w-full p-4 bg-[#FAFBFF] border border-[#E5F0FF] rounded-xl text-sm text-gray-900 outline-none focus:border-[#4B70C3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Season</label>
                <input 
                  type="text" 
                  placeholder="Enter Season" 
                  className="w-full p-4 bg-[#FAFBFF] border border-[#E5F0FF] rounded-xl text-sm text-gray-900 outline-none focus:border-[#4B70C3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Reason</label>
                <input 
                  type="text" 
                  placeholder="Reason of Transfer" 
                  className="w-full p-4 bg-[#FAFBFF] border border-[#E5F0FF] rounded-xl text-sm text-gray-900 outline-none focus:border-[#4B70C3]"
                />
              </div>
            </div>

            <button onClick={closeModal} className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm hover:bg-[#3b5da8] transition-colors">
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default ActivePlayers