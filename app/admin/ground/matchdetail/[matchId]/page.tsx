"use client";

import React from 'react';
import { ArrowLeft} from 'lucide-react';
import { useRouter } from 'next/navigation';
import MatchAnalysis from '../../../components/ground/MatchDetails';

// Define the shape of the params as a Promise
interface PageProps {
  params: Promise<{ matchId: string }>;
}

export default function MatchDetailsPage({ params }: PageProps) {
  const router = useRouter();
  
  // Unwrap the params promise using React.use()
  const resolvedParams = React.use(params);
  const matchId = resolvedParams.matchId;

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-6">
      {/* Breadcrumbs / Back Navigation */}
      <div className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-500">
        {/* Back Arrow - Triggers browser back */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-slate-800 transition-colors cursor-pointer border-none bg-transparent p-0"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Grounds
        </button>
        
        <span>{'>'}</span>
        <span className='text-slate-800'>Tournament</span>
        <span>{'>'}</span>
        <span className='text-slate-800'>Matches</span>
        <span>{'>'}</span>
        <span className="text-slate-900">Match Details</span>
      </div>

      {/* Main Analysis Component using the unwrapped ID */}
      <MatchAnalysis matchId={matchId} />
    </div>
  );
}