"use client";

import { useParams, useRouter } from "next/navigation";

import { ArrowLeft} from 'lucide-react';
import UpcomingMatches from "@/app/admin/components/ground/upcomingMatches";

export default function TournamentMatchesPage() {
  const params = useParams();
  const router = useRouter();
  
  const groundId = params.groundId as string;
  const tournamentId = params.tournamentId as string;

  return (
    <div className=" max-w-[1600px] mx-auto">
      <div className="flex flex-row gap-5 mb-2">
      <button 
        onClick={() => router.back()} 
        className=" text-3xl text-gray-500 font-medium  flex items-center gap-1 cursor-pointer"
      >
         <ArrowLeft className="w-5 h-5 mr-1" />
      </button>
      <div className="flex items-center text-[13px] font-medium text-slate-500">
          Ground <span className="mx-2 text-slate-400 font-light">{">"}</span>
          
           Tournament <span className="mx-2 text-slate-400 font-medium">{">"}</span>
          <span className="text-slate-900 font-medium">Match</span>
        </div>
        </div>
    

      
        
        
        <UpcomingMatches
         
          tournamentId={tournamentId} 
          selectedGroundId={groundId} 
        />
     
    </div>
  );
}