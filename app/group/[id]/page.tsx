"use client";

import { getIconColorById } from "@/colors";
import { InvitationModal } from "@/components/InvitationModal";
import MatchesTable from "@/components/MatchTable";
import RankingTable from "@/components/RankingTable";
import YourBetTable from "@/components/YourBetTable";
import { useAuth } from "@/context/AuthContext";
import {
  getBetsByGroupId,
  getGroupById,
  getGroupMembers,
  getYourBets,
  joinGroup,
  leaveGroup,
  removeMember,
} from "@/services/APIService";
import { GroupFull, Prediction } from "@/types";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SportsHockeyIcon from "@mui/icons-material/SportsHockey";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useParams } from "next/navigation";
import { userAgent } from "next/server";
import { useEffect, useState } from "react";

export default function GroupPage() {
  const params = useParams();
  const { user } = useAuth();
  const groupId = params.id as string;
  const [isParticipating, setIsParticipating] = useState(false);
  const iconColor = getIconColorById(Number(groupId));
  // Mock group data
  const [group, setGroup] = useState<GroupFull | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [bets, setBets] = useState<Prediction[]>([]);
  const [yourBets, setYourBets] = useState<Prediction[]>([]);
  const [invitationModalOpen, setInvitationModalOpen] = useState(false);

  // Charger les données du groupe et les paris via API
  useEffect(() => {
    const loadData = async () => {
      const apiGroup = await getGroupById(Number(groupId));
      setGroup(apiGroup as GroupFull);

      // Fetch members separately using the API
      const apiMembers = await getGroupMembers(Number(groupId));
      setMembers(apiMembers);

      // Check if current user is a member of the group
      if (user?.id) {
        const isMember = apiMembers.some((member: any) => member.userId === user.id);
        setIsParticipating(isMember);
      }

      const apiBets = await getBetsByGroupId(Number(groupId));
      setBets(apiBets);

      // Only fetch user bets if user is loaded
      if (user?.id) {
        const allUserBets = await getYourBets(user.id);
        // Filter bets for current group
        const filteredBets = allUserBets.filter((bet: any) => bet.groupId === Number(groupId));
        setYourBets(filteredBets);
      }
    };

    loadData();
  }, [groupId, user?.id]);

  // Handle join/leave group
  const handleJoinLeave = async () => {
    if (!user) return;

    try {
      if (isParticipating) {
        // Leave the group
        await leaveGroup(Number(groupId));
        setIsParticipating(false);
        // Refresh members list
        const apiMembers = await getGroupMembers(Number(groupId));
        setMembers(apiMembers);
      } else {
        // Join the group (no invite code for public groups)
        await joinGroup(Number(groupId));
        setIsParticipating(true);
        // Refresh members list
        const apiMembers = await getGroupMembers(Number(groupId));
        setMembers(apiMembers);
      }
    } catch (error) {
      console.error("Error joining/leaving group:", error);
      alert(error instanceof Error ? error.message : "Une erreur est survenue");
    }
  };

  // Handle remove member (owner only)
  const handleRemoveMember = async (userId: number, username: string) => {
    if (!user || user.id !== group?.ownerId) return;

    const confirmed = window.confirm(`Êtes-vous sûr de vouloir retirer ${username} du groupe ?`);
    if (!confirmed) return;

    try {
      await removeMember(Number(groupId), userId);
      // Refresh members list
      const apiMembers = await getGroupMembers(Number(groupId));
      setMembers(apiMembers);
    } catch (error) {
      console.error("Error removing member:", error);
      alert(error instanceof Error ? error.message : "Une erreur est survenue");
    }
  };

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
            onClick={handleJoinLeave}
            disabled={!user}
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Membres ({members.length})
          </h2>
          {group?.visibility === "private" && user?.id === group?.ownerId && (
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setInvitationModalOpen(true)}
              size="small"
            >
              Inviter un membre
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded"
            >
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <PersonIcon sx={{ fontSize: 20, color: "gray" }} />
                </div>
                <span className="text-gray-900 dark:text-white">
                  {member.user?.username ?? "Unknown"}
                </span>
              </div>
              {user?.id === group?.ownerId && member.userId !== user?.id && (
                <IconButton
                  size="small"
                  onClick={() =>
                    handleRemoveMember(member.userId, member.user?.username ?? "ce membre")
                  }
                  sx={{ color: "error.main" }}
                  title="Retirer du groupe"
                >
                  <PersonRemoveIcon fontSize="small" />
                </IconButton>
              )}
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
        <RankingTable groupId={Number(groupId)} />
      </div>

      {/* Invitation Modal */}
      {group && (
        <InvitationModal
          open={invitationModalOpen}
          onClose={() => setInvitationModalOpen(false)}
          groupId={Number(groupId)}
          groupName={group.name}
        />
      )}
    </div>
  );
}
