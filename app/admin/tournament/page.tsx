"use client";

import React from "react";


import ActiveTournament from "../components/tournament/ActiveTournament";


export default function TournamentPage() {
  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* 1. Performance Overview Row */}
      <ActiveTournament />

      

      
    </div>
  );
}

// "use client";

// import React, { useState } from "react";
// import ActiveTournament from "../components/tournament/ActiveTournament";
// import UpcomingMatches from "../components/tournament/UpcomingMatches";
// import MatchOverview from "../components/tournament/MatchOverview";

// export default function TournamentPage() {
//   // Track which tournament is active
//   const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
//   // Track which match is active for the overview
//   const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

//   const handleTournamentChange = (id: string) => {
//     setSelectedTournamentId(id);
//     setSelectedMatchId(null); // Reset match overview when switching tournaments
//   };

//   return (
//     <div className="space-y-4 max-w-[1600px] mx-auto">
//       {/* 1. Select Tournament */}
//       <ActiveTournament 
//         onSelectTournament={handleTournamentChange} 
//         selectedId={selectedTournamentId} 
//       />

//       {/* 2. Bottom Row: List and Details */}
//       <div className="flex flex-col xl:flex-row gap-6">
//          <UpcomingMatches 
//             tournamentId={selectedTournamentId} 
//             onSelectMatch={setSelectedMatchId}
//             selectedMatchId={selectedMatchId}
//          /> 
//          <MatchOverview 
//             matchId={selectedMatchId} 
//          /> 
//       </div>
//     </div>
//   );
// }