"use client";

import React, { useState } from "react";
import CricketGround from "../components/ground/CricketGround";
import TournamentList from "../components/ground/Tournament";
import UpcomingMatches from "../components/ground/upcomingMatches";

export default function TournamentPage() {
  const [selectedGroundId, setSelectedGroundId] = useState<string | null>(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

  const handleGroundSelect = (id: string) => {
    setSelectedGroundId(id);
    setSelectedTournamentId(null); // Reset tournament selection when ground changes
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Pass the ID and the selection handler */}
      <CricketGround 
        selectedGroundId={selectedGroundId} 
        onGroundSelect={handleGroundSelect} 
      />

      <div className="flex flex-col xl:flex-row gap-6">
        {/* TournamentList now reacts to selectedGroundId */}
        <TournamentList 
          groundId={selectedGroundId}
          selectedId={selectedTournamentId} 
          onSelect={setSelectedTournamentId} 
        />
        
        <UpcomingMatches tournamentId={selectedTournamentId} /> 
      </div>
    </div>
  );
}