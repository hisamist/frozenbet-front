import CreateGroupModal from "@/components/CreateGroupModal";
import GroupCard from "@/components/GroupCard";

export default function Home() {
  // Mock data : 16 groupes pour 4x4
  const groups = Array.from({ length: 16 }).map((_, i) => ({
    id: i + 1,
    name: `Groupe ${i + 1}`,
    description: "Description du groupe",
    ownerName: `Owner ${i + 1}`,
    avatarUrl: "/images/group-placeholder.jpg", // image placeholder
    membersCount: Math.floor(Math.random() * 10) + 1,
    maxMembers: 10,
    visibility: i % 2 === 0 ? "public" : "private",
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
          <CreateGroupModal />
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
