"use client";

import CricketGround from "../components/ground/CricketGround";

export default function GroundsPage() {
  return (
    <div className=" max-w-[1600px] mx-auto">
    
      {/* 
          We no longer pass onGroundSelect because 
          the child handles navigation via Link 
      */}
      <CricketGround selectedGroundId={null} />
    </div>
  );
}

// "use client";

// import  { useState } from "react";
// import CricketGround from "../components/ground/CricketGround";
// import TournamentList from "../components/ground/Tournament";
// import UpcomingMatches from "../components/ground/upcomingMatches";

// export default function GroundPage() {
//   const [selectedGroundId, setSelectedGroundId] = useState<string | null>(null);
//   const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

//   const handleGroundSelect = (id: string) => {
//     setSelectedGroundId(id);
//     setSelectedTournamentId(null); 
//   };

//   return (
//     <div className="space-y-4 max-w-[1600px] mx-auto">
//       {/* Pass the ID and the selection handler */}
//       <CricketGround 
//         selectedGroundId={selectedGroundId} 
//         onGroundSelect={handleGroundSelect} 
//       />

//       <div className="flex flex-col xl:flex-row gap-6">
//         {/* TournamentList now reacts to selectedGroundId */}
//         <TournamentList 
//           groundId={selectedGroundId}
//           selectedId={selectedTournamentId} 
//           onSelect={setSelectedTournamentId} 
//         />
        
//         <UpcomingMatches tournamentId={selectedTournamentId} selectedGroundId={selectedGroundId}/> 
//       </div>
//     </div>
//   );
// }