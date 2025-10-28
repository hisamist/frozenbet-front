"use client";

import { PariModal } from "@/components/PariModal";
import { useAuth } from "@/context/AuthContext";
import { getMatchesByCompetitionId, makePrediction } from "@/services/APIService";
import { Match } from "@/types";
import { Button, Tooltip, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface MatchesTableProps {
  competitionId: number;
  isParticipating: boolean;
  groupId: number;
}

type Order = "asc" | "desc";

export default function MatchesTable({
  competitionId,
  isParticipating,
  groupId,
}: MatchesTableProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order>("desc"); // default newest first
  const [orderBy, setOrderBy] = useState<"date" | "button">("date");
  const [open, setOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await getMatchesByCompetitionId(Number(competitionId));
        setMatches(res || []);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des matches :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [competitionId]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography>Chargement des matches...</Typography>
      </Box>
    );
  if (!matches.length)
    return (
      <Typography align="center" py={4}>
        Aucun match trouvé pour cette compétition.
      </Typography>
    );

  const handleSort = (column: "date" | "button") => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortedMatches = [...matches].sort((a, b) => {
    const now = new Date();
    const aCan = isParticipating && a.status === "scheduled" && new Date(a.scheduledDate) > now;
    const bCan = isParticipating && b.status === "scheduled" && new Date(b.scheduledDate) > now;

    if (orderBy === "button") {
      return order === "asc" ? Number(aCan) - Number(bCan) : Number(bCan) - Number(aCan);
    }

    // Default: sort first by button availability, then by date
    if (aCan !== bCan) {
      return bCan ? 1 : -1; // place bettable matches on top
    }

    const aDate = new Date(a.scheduledDate).getTime();
    const bDate = new Date(b.scheduledDate).getTime();
    return order === "asc" ? aDate - bDate : bDate - aDate; // newest first
  });

  const handleParier = (match: Match) => {
    if (!isParticipating) return;
    const matchDate = new Date(match.scheduledDate);
    if (match.status !== "scheduled" || matchDate <= new Date()) return;
    setSelectedMatch(match);
    setOpen(true);
  };

  const handlePredictionSubmit = async (
    homeScorePrediction: number,
    awayScorePrediction: number
  ) => {
    if (!selectedMatch || !userId) return;
    const payload = {
      matchId: selectedMatch.id,
      groupId,
      homeScorePrediction,
      awayScorePrediction,
    };
    try {
      await makePrediction(payload);
      alert(
        `Pari enregistré pour le match ${selectedMatch.homeTeam?.name} vs ${selectedMatch.awayTeam?.name}`
      );
    } catch (err: any) {
      alert("Erreur lors de la création de la prédiction : " + err.message);
    } finally {
      setOpen(false);
      setSelectedMatch(null);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Matches disponibles
        </h2>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {orderBy === "date" && (
                      <span className="text-blue-600 dark:text-blue-400">
                        {order === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Équipe domicile
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Équipe extérieure
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Lieu
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleSort("button")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Action
                    {orderBy === "button" && (
                      <span className="text-blue-600 dark:text-blue-400">
                        {order === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedMatches.map((match) => {
                const matchDate = new Date(match.scheduledDate);
                const now = new Date();
                const canParier =
                  isParticipating && match.status === "scheduled" && matchDate > now;

                return (
                  <tr
                    key={match.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${canParier ? "opacity-100" : "opacity-50"}`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {matchDate.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {match.homeTeam?.name || match.homeTeamId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {match.homeScore != null && match.awayScore != null
                        ? `${match.homeScore} - ${match.awayScore}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {match.awayTeam?.name || match.awayTeamId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {match.status}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {match.location || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                      <Tooltip
                        title={
                          !isParticipating
                            ? "Vous ne participez pas à ce groupe"
                            : match.status !== "scheduled"
                              ? "Le pari est fermé pour ce match"
                              : matchDate <= now
                                ? "Le match a déjà commencé ou est terminé"
                                : ""
                        }
                      >
                        <span>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={!canParier}
                            onClick={() => handleParier(match)}
                          >
                            Parier
                          </Button>
                        </span>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {open && selectedMatch && userId && (
        <PariModal
          open={open}
          onClose={() => setOpen(false)}
          matchId={selectedMatch.id}
          groupId={groupId}
          userId={userId}
          onSubmit={(prediction: any) => {
            handlePredictionSubmit(prediction.homeScorePrediction, prediction.awayScorePrediction);
          }}
        />
      )}
    </>
  );
}
