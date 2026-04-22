"use client";

import React from "react";
import PerformanceOverview from "../components/dashboard/performanceCards";
import LiveMatches from "../components/dashboard/LiveMatches";
import PlayerStats from "../components/dashboard/DashboardStats";
import TournamentDetails from "../components/dashboard/TournamentDetails";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Performance Overview Row */}
      <PerformanceOverview />

      {/* 2. Live & Recent Matches Row */}
       <LiveMatches />

      {/* 3. Bottom Row: Stats and Details Side-by-Side */}
      <div className="flex flex-col lg:flex-row gap-6">
         <PlayerStats /> 
         <TournamentDetails /> 
      </div>
    </div>
  );
}
