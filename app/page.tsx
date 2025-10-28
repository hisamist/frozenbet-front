"use client";

import { useEffect, useState } from "react";
import CreateGroupModal from "@/components/CreateGroupModal";
import GroupCard from "@/components/GroupCard";
import { Group } from "@/types";
import { getGroups } from "@/services/APIService";
import Loading from "@/components/Loading";

export default function Home() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch groups from API
    const fetchGroups = async () => {
      try {
        const data = await getGroups();
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
      <div className="w-full bg-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur FrozenBet</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Contenu principal de la page d’accueil.
          </p>
          <CreateGroupModal isLoggedIn={false} />
        </div>
      </div>

      {/* Group Cards */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Vos Groupes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.isArray(groups) && groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
}
