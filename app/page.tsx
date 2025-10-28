"use client";

import CreateGroupModal from "@/components/CreateGroupModal";
import GroupCard from "@/components/GroupCard";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { MockAPIService } from "@/services/MockAPIService";
import { Group } from "@/types";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth(); // ✅ Hook pour savoir si user connecté
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await MockAPIService.getGroups();
        setGroups(data);
      } catch (err) {
        console.error("Failed to fetch groups", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  if (loading) {
    return <Loading message="Loading groups..." />;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div
        className="w-full bg-gray-200 py-16 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/lyon-hockey.png')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-white">Bienvenue sur FrozenBet</h1>
          <p className="text-lg text-white mb-6">Contenu principal de la page d'accueil.</p>
          {/* Passer l’état de l’utilisateur */}
          <CreateGroupModal isLoggedIn={isAuthenticated} />
        </div>
      </div>

      {/* Group Cards */}
      <div className="max-w-6xl mx-auto px-4 py-8">
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
