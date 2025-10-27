"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import TableComponent from "@/components/TableComponent";

// Mock data simplifié pour HockerBet
const mockGroups = [
  {
    id: "1",
    name: "HockerBet Champions",
    description: "Pariez et défiez vos amis sur vos équipes favorites !",
    avatarUrl: "/images/group1.jpg",
    ownerName: "Alice",
    competition: { name: "Champions League 2025", logoUrl: "/images/competition.jpg" },
    members: [
      { id: 1, username: "Alice", avatarUrl: "/images/user1.jpg" },
      { id: 2, username: "Bob", avatarUrl: "/images/user2.jpg" },
      { id: 3, username: "Charlie", avatarUrl: "/images/user3.jpg" },
    ],
    scoringRules: [
      { id: 1, rule_type: "Exact Score", points: 5 },
      { id: 2, rule_type: "Correct Winner", points: 2 },
    ],
    rankings: [
      { userId: 1, username: "Alice", totalPoints: 12, rank: 1 },
      { userId: 2, username: "Bob", totalPoints: 8, rank: 2 },
    ],
  },
];

const randomImages = [
  "/images/group1.jpg",
  "/images/group2.jpg",
  "/images/group3.jpg",
  "/images/group4.jpg",
];

export default function GroupPage() {
  const params = useParams();
  const groupId = params.id;

  // Récupérer le groupe ou fallback mock
  const group = mockGroups.find((g) => g.id === groupId) || {
    id: groupId,
    name: `Groupe ${groupId}`,
    description: "Description non disponible",
    avatarUrl: randomImages[Math.floor(Math.random() * randomImages.length)],
    ownerName: "Inconnu",
    competition: { name: "Competition inconnue", logoUrl: randomImages[0] },
    members: [],
    scoringRules: [],
    rankings: [],
  };

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8">
      {/* Image + Nom du Groupe */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="relative w-40 h-40">
          <Image src={group.avatarUrl} alt={group.name} fill className="object-cover rounded-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
          <p className="text-gray-700 dark:text-gray-300 mt-2">{group.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Owner: {group.ownerName}</p>
        </div>
      </div>

      {/* Competition associée */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div className="relative w-16 h-16">
          <Image
            src={group.competition.logoUrl}
            alt={group.competition.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {group.competition.name}
        </p>
      </div>

      {/* Membres */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Membres ({group.members.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {group.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded"
            >
              {member.avatarUrl && (
                <div className="relative w-10 h-10">
                  <Image
                    src={member.avatarUrl}
                    alt={member.username}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              )}
              <span className="text-gray-900 dark:text-white">{member.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Règles de scoring */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Règles de scoring
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          {group.scoringRules.map((rule) => (
            <li key={rule.id}>
              {rule.rule_type} : {rule.points} points
            </li>
          ))}
        </ul>
      </div>
      <TableComponent />
      {/* Classement */}
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
            {group.rankings.map((r, i) => (
              <tr key={r.userId} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-2 py-1">{r.rank}</td>
                <td className="px-2 py-1">{r.username}</td>
                <td className="px-2 py-1">{r.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
