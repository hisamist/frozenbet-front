"use client";

import { getIconColorById } from "@/colors";
import MatchesTable from "@/components/MatchTable";
import YourBetTable from "@/components/YourBetTable";
import { getGroupById, getBetsByGroupId } from "@/services/APIService";
import { GroupFull, Prediction } from "@/types";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import SportsHockeyIcon from "@mui/icons-material/SportsHockey";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GroupPage() {
  const params = useParams();
  const groupId = params.id as string;
  const [isParticipating, setIsParticipating] = useState(false);
  const iconColor = getIconColorById(Number(groupId));
  // Mock group data
  const [group, setGroup] = useState<GroupFull | null>(null);
  const [bets, setBets] = useState<Prediction[]>([]);
  const [yourBets, setYourBets] = useState<Prediction[]>([]);

  // Charger les données du groupe et les paris via API
  useEffect(() => {
    const loadData = async () => {
      const apiGroup = await getGroupById(Number(groupId));
      setGroup(apiGroup as GroupFull);
      const apiBets = await getBetsByGroupId(Number(groupId));
      setBets(apiBets);
      // Exemple: filtrer pour l'utilisateur courant (mock id 1 si pas d'auth)
      const filtered = apiBets.filter((bet: Prediction) => bet.userId === 1);
      setYourBets(filtered);
    };
    loadData();
  }, [groupId]);

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-6">
          <div className="relative w-40 h-40 shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <SportsHockeyIcon sx={{ fontSize: 120, color: iconColor }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{group?.name}</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{group?.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Owner: {group?.owner?.username ?? "Unknown"}
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
          {group?.competition?.name ?? "Competition"}
        </p>
      </div>

      {/* Members */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Membres ({group?.members?.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {group?.members?.map((member) => (
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
          {group?.scoringRules?.map((rule) => (
            <li key={rule.id}>
              {rule.ruleDescription} : {rule.points} points
            </li>
          ))}
        </ul>
      </div>

      {/* Tables */}
      <MatchesTable competitionId={1} isParticipating={isParticipating} groupId={Number(groupId)} />
      <YourBetTable bets={yourBets} isParticipating={isParticipating} />

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
            {group?.rankings?.map((r) => (
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
