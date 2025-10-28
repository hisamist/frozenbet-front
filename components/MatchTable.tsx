"use client";

import { PariModal } from "@/components/PariModal";
import { useAuth } from "@/context/AuthContext";
import { getMatchesByCompetitionId, makePrediction } from "@/services/APIService";
import { Match } from "@/types";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Box,
  TableSortLabel,
} from "@mui/material";
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
      <TableContainer component={Paper} sx={{ mt: 3, maxHeight: 500 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Matches disponibles
        </Typography>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? order : "desc"}
                  onClick={() => handleSort("date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Équipe domicile</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Équipe extérieure</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "button"}
                  direction={orderBy === "button" ? order : "desc"}
                  onClick={() => handleSort("button")}
                >
                  Action
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMatches.map((match) => {
              const matchDate = new Date(match.scheduledDate);
              const now = new Date();
              const canParier = isParticipating && match.status === "scheduled" && matchDate > now;

              return (
                <TableRow key={match.id} sx={{ opacity: canParier ? 1 : 0.5 }}>
                  <TableCell>{matchDate.toLocaleString()}</TableCell>
                  <TableCell>{match.homeTeam?.name || match.homeTeamId}</TableCell>
                  <TableCell>
                    {match.homeScore != null && match.awayScore != null
                      ? `${match.homeScore} - ${match.awayScore}`
                      : "-"}
                  </TableCell>
                  <TableCell>{match.awayTeam?.name || match.awayTeamId}</TableCell>
                  <TableCell>{match.status}</TableCell>
                  <TableCell>{match.location || "-"}</TableCell>
                  <TableCell align="center">
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

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
