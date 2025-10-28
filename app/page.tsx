import CreateGroupModal from "@/components/CreateGroupModal";
import GroupCard from "@/components/GroupCard";
import { Group } from "@/types";

export default function Home() {
  // Mock data : 16 groupes pour 4x4
  const groups: Group[] = Array.from({ length: 16 }).map((_, i) => ({
    id: i + 1,
    name: `Groupe ${i + 1}`,
    description: "Description du groupe",
    ownerId: i + 100, // mock owner id
    competitionId: i + 1, // mock competition id
    visibility: i % 2 === 0 ? "public" : "private",
    inviteCode: `INVITE${String(i + 1).padStart(4, "0")}`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(), // mock created date

    // Relations optionnelles (facultatives pour le mock)
    owner: {
      id: i + 100,
      username: `owner${i + 1}`,
      email: `owner${i + 1}@example.com`,
      passwordHash: "hashed_password",
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    },
    competition: {
      id: i + 1,
      themeId: 1,
      name: `Competition ${i + 1}`,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: "upcoming",
      createdAt: new Date().toISOString(),
    },
  }));

  return (
    <div className="flex flex-col w-full">
      {/* Fond gris sur toute la largeur */}
      <div className="w-full bg-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur FrozenBet</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Contenu principal de la page d’accueil.
          </p>
          <CreateGroupModal isLoggedIn={false} />
        </div>
      </div>

      {/* Section Group Cards */}
      <div className="max-w-8xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Vos Groupes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
}
