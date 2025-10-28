"use client";

import { useState } from "react";
import Image from "next/image";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BetListTable from "@/components/BetTable";
import YourBetTable from "@/components/YourBetTable";
import { GroupFull, Match, Prediction, User } from "@/types";

export default function GroupPage() {
  const [isParticipating, setIsParticipating] = useState(false);

  // Mock group data
  const group: GroupFull = {
    id: 1,
    name: "HockerBet Champions",
    description: "Pariez et défiez vos amis sur vos équipes favorites !",
    ownerId: 1,
    competitionId: 1,
    visibility: "public",
    createdAt: new Date().toISOString(),
    owner: {
      id: 1,
      username: "Alice",
      email: "alice@example.com",
      passwordHash: "hashed",
      createdAt: new Date().toISOString(),
      avatarUrl: "", // optional
    } as User,
    competition: {
      id: 1,
      themeId: 1,
      name: "Champions League 2025",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: "upcoming",
      createdAt: new Date().toISOString(),
    },
    members: [
      {
        id: 1,
        groupId: 1,
        userId: 1,
        role: "owner",
        joinedAt: new Date().toISOString(),
        totalPoints: 12,
        user: {
          id: 1,
          username: "Alice",
          email: "alice@example.com",
          passwordHash: "hashed",
          createdAt: new Date().toISOString(),
        },
      },
      {
        id: 2,
        groupId: 1,
        userId: 2,
        role: "member",
        joinedAt: new Date().toISOString(),
        totalPoints: 8,
        user: {
          id: 2,
          username: "Bob",
          email: "bob@example.com",
          passwordHash: "hashed",
          createdAt: new Date().toISOString(),
        },
      },
    ],
    scoringRules: [
      {
        id: 1,
        groupId: 1,
        ruleDescription: "Exact Score",
        points: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        groupId: 1,
        ruleDescription: "Correct Winner",
        points: 2,
        createdAt: new Date().toISOString(),
      },
    ],
    rankings: [
      {
        id: 1,
        groupId: 1,
        userId: 1,
        totalPoints: 12,
        totalPredictions: 5,
        correctPredictions: 3,
        rank: 1,
        user: {
          id: 1,
          username: "Alice",
          email: "alice@example.com",
          passwordHash: "hashed",
          createdAt: new Date().toISOString(),
        },
      },
      {
        id: 2,
        groupId: 1,
        userId: 2,
        totalPoints: 8,
        totalPredictions: 5,
        correctPredictions: 2,
        rank: 2,
        user: {
          id: 2,
          username: "Bob",
          email: "bob@example.com",
          passwordHash: "hashed",
          createdAt: new Date().toISOString(),
        },
      },
    ],
  };

  // Mock Predictions for Bets
  const mockBets: Prediction[] = [
    {
      id: 1,
      userId: 1,
      matchId: 101,
      groupId: 1,
      match: {
        id: 101,
        competitionId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeam: { id: 1, competitionId: 1, name: "Team A", createdAt: new Date().toISOString() },
        awayTeam: { id: 2, competitionId: 1, name: "Team B", createdAt: new Date().toISOString() },
        scheduledDate: "2025-11-01T20:00:00.000Z",
        status: "finished",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Match,
      user: group.owner,
      homeScorePrediction: 2,
      awayScorePrediction: 1,
      pointsEarned: 3,
      predictedAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: 1,
      matchId: 102,
      groupId: 1,
      match: {
        id: 102,
        competitionId: 1,
        homeTeamId: 3,
        awayTeamId: 4,
        homeTeam: { id: 3, competitionId: 1, name: "Team C", createdAt: new Date().toISOString() },
        awayTeam: { id: 4, competitionId: 1, name: "Team D", createdAt: new Date().toISOString() },
        scheduledDate: "2025-11-02T18:30:00.000Z",
        status: "scheduled",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Match,
      user: group.owner,
      homeScorePrediction: 1,
      awayScorePrediction: 1,
      pointsEarned: null,
      predictedAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-6">
          <div className="relative w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <GroupIcon sx={{ fontSize: 60, color: "gray" }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{group.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Owner: {group.owner?.username ?? "Unknown"}
            </p>
          </div>
        </div>
        <div>
          <button
            className={`px-4 py-2 rounded ${
              isParticipating
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={() => setIsParticipating(!isParticipating)}
          >
            {isParticipating ? "Sortir du groupe" : "Participer"}
          </button>
        </div>
      </div>

      {/* Competition */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <EmojiEventsIcon sx={{ fontSize: 40, color: "gray" }} />
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {group.competition?.name ?? "Competition"}
        </p>
      </div>

      {/* Members */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Membres ({group.members?.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {group.members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <PersonIcon sx={{ fontSize: 20, color: "gray" }} />
              </div>
              <span className="text-gray-900 dark:text-white">
                {member.user?.username ?? "Unknown"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scoring Rules */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Règles de scoring
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          {group.scoringRules?.map((rule) => (
            <li key={rule.id}>
              {rule.ruleDescription} : {rule.points} points
            </li>
          ))}
        </ul>
      </div>

      {/* Tables */}
      <BetListTable isParticipating={isParticipating} predictions={mockBets} />
      <YourBetTable bets={mockBets} isParticipating={isParticipating} />

      {/* Rankings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Classement</h2>
        <table className="min-w-full text-left text-gray-900 dark:text-white">
          <thead>
            <tr>
              <th className="px-2 py-1">Rang</th>
              <th className="px-2 py-1">Utilisateur</th>
              <th className="px-2 py-1">Points</th>
            </tr>
          </thead>
          <tbody>
            {group.rankings?.map((r) => (
              <tr key={r.userId} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-2 py-1">{r.rank}</td>
                <td className="px-2 py-1">{r.user?.username ?? "Unknown"}</td>
                <td className="px-2 py-1">{r.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
