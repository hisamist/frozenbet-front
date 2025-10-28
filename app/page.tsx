"use client";

import CreateGroupModal from "@/components/CreateGroupModal";
import GroupCard from "@/components/GroupCard";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { getGroupMembers, getGroups } from "@/services/APIService";
import { Group, GroupMember } from "@/types";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated, user } = useAuth(); // ✅ Hook pour savoir si user connecté
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [publicGroups, setPublicGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch groups from API
    const fetchGroups = async () => {
      try {
        // Récupérer tous les groupes
        const allGroups = await getGroups();

        if (isAuthenticated && user) {
          // Vérifier pour chaque groupe si l'utilisateur en est membre
          const membershipChecks = await Promise.allSettled(
            allGroups.map(async (group: Group) => {
              try {
                // Vérifier si l'utilisateur est propriétaire
                if (group.ownerId === user.id) {
                  return { group, isMember: true };
                }

                // Vérifier si l'utilisateur est membre via l'endpoint
                const members: GroupMember[] = await getGroupMembers(group.id);
                const isMember = members.some((m: GroupMember) => m.userId === user.id);
                return { group, isMember };
              } catch (err) {
                // Si on ne peut pas récupérer les membres, considérer comme non-membre
                return { group, isMember: false };
              }
            })
          );

          const myGroups: Group[] = [];
          const otherPublicGroups: Group[] = [];

          membershipChecks.forEach((result) => {
            if (result.status === "fulfilled") {
              const { group, isMember } = result.value;
              if (isMember) {
                myGroups.push(group);
              } else if (group.visibility === "public") {
                otherPublicGroups.push(group);
              }
            }
          });

          setUserGroups(myGroups);
          setPublicGroups(otherPublicGroups);
        } else {
          // Si non connecté, afficher uniquement les groupes publics
          const onlyPublic = allGroups.filter((g: Group) => g.visibility === "public");
          setPublicGroups(onlyPublic);
        }
      } catch (err) {
        console.error("Failed to fetch groups", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [isAuthenticated, user]);

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
          {/* Passer l'état de l'utilisateur */}
          <CreateGroupModal isLoggedIn={isAuthenticated} />
        </div>
      </div>

      {/* Group Cards */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Mes groupes (si connecté et qu'il y en a) */}
        {isAuthenticated && userGroups.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Mes Groupes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {userGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </div>
        )}

        {/* Autres groupes publics */}
        {publicGroups.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {isAuthenticated ? "Autres Groupes Publics" : "Groupes Publics"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {publicGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </div>
        )}

        {/* Message si aucun groupe */}
        {!isAuthenticated && publicGroups.length === 0 && (
          <p className="text-gray-500 text-center">
            Aucun groupe public disponible pour le moment.
          </p>
        )}
        {isAuthenticated && userGroups.length === 0 && publicGroups.length === 0 && (
          <p className="text-gray-500 text-center">
            Aucun groupe disponible. Créez votre premier groupe !
          </p>
        )}
      </div>
    </div>
  );
}
