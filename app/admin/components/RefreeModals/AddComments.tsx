"use client";

import React, { useState } from 'react';
import { X, User, ShieldAlert, Send } from 'lucide-react';

/* ─── ADD COMMENT MODAL COMPONENT ─── */
interface AddCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ballInfo: any;
  onConfirm: (comment: string) => void;
}

export const AddCommentModal: React.FC<AddCommentModalProps> = ({ isOpen, onClose, ballInfo, onConfirm }) => {
  const [commentText, setCommentText] = useState("");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[440px] p-6 relative flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="text-center mb-6 mt-2">
          <h3 className="text-xl font-bold text-[#0B1530] tracking-tight mb-1">Add Comment</h3>
          <p className="text-[#7384A6] text-xs font-medium">Add Comments so that other Match Officials can see it.</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 px-1">
            <User size={14} className="text-[#FF5521]" />
            <span>Tushar Pal (Umpire)</span>
          </div>

          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-gray-500 font-medium">
            Ball Result here is not justified, according to video
          </div>

          <div className="relative">
            <input 
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write Comment Here"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-xs font-medium text-gray-800 outline-none focus:border-[#FF5521] transition-colors"
            />
            <button 
              onClick={() => {
                if (!commentText.trim()) return;
                onConfirm(commentText);
                setCommentText("");
                onClose();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6366F1] hover:text-[#4F46E5] transition-colors p-1 cursor-pointer"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            if (!commentText.trim()) return;
            onConfirm(commentText);
            setCommentText("");
            onClose();
          }}
          className="w-full py-3.5 bg-[#0F1117] hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

/* ─── MR JUDGEMENT MODAL COMPONENT ─── */
interface MrJudgementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (judgement: string) => void;
}

export const MrJudgementModal: React.FC<MrJudgementModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [judgement, setJudgement] = useState<"Correct" | "InCorrect">("Correct");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[440px] p-6 relative flex flex-col text-center">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100 text-[#6366F1]">
          <ShieldAlert size={22} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#0B1530] tracking-tight mb-1">
          MR Judgement
        </h3>

        <p className="text-[#7384A6] text-xs font-medium mb-6">
          Select the judgement for the match
        </p>

        {/* Judgement Tabs */}
        <div className="w-full mb-6">
          <label className="text-xs font-bold text-gray-700 block text-left px-1 mb-2">
            Judgement
          </label>

          <div className="flex w-full bg-slate-100 rounded-xl p-1 gap-1">
            {/* Correct */}
            <button
              type="button"
              onClick={() => setJudgement("Correct")}
              className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${
                judgement === "Correct"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Correct
            </button>

            {/* InCorrect */}
            <button
              type="button"
              onClick={() => setJudgement("InCorrect")}
              className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${
                judgement === "InCorrect"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              InCorrect
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={() => {
            onConfirm(judgement);
            onClose();
          }}
          className="w-full py-3.5 bg-[#0F1117] hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};