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
} from "@mui/material";
import { useEffect, useState } from "react";

interface MatchesTableProps {
  competitionId: number;
  isParticipating: boolean;
  groupId: number;
}

export default function MatchesTable({
  competitionId,
  isParticipating,
  groupId,
}: MatchesTableProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await getMatchesByCompetitionId(Number(competitionId));
        setMatches(res || []);
      } catch (err: any) {
        console.error("❌ Erreur lors de la récupération des matches :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [competitionId]);

  if (loading) return <p>Chargement des matches...</p>;
  if (!matches.length) return <p>Aucun match trouvé pour cette compétition.</p>;

  const handleParier = (match: Match) => {
    if (!isParticipating || match.status !== "scheduled") return;
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
      const res = await makePrediction(payload);
      console.log("🎯 Prédiction créée :", res);
      alert(
        `Pari enregistré pour le match ${selectedMatch.homeTeam?.name} vs ${selectedMatch.awayTeam?.name}`
      );
    } catch (err: any) {
      console.error("❌ Erreur lors de la création de la prédiction :", err);
      alert("Erreur lors de la création de la prédiction : " + err.message);
    } finally {
      setOpen(false);
      setSelectedMatch(null);
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Typography variant="h6" component="div" sx={{ p: 2 }}>
          Matches disponibles
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Équipe domicile</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Équipe extérieure</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match) => {
              const canParier = isParticipating && match.status === "scheduled";
              return (
                <TableRow key={match.id}>
                  <TableCell>{new Date(match.scheduledDate).toLocaleString()}</TableCell>
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
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={!canParier}
                      onClick={() => handleParier(match)}
                    >
                      Parier
                    </Button>
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
            // call async handler without returning the Promise to match the expected void signature
            handlePredictionSubmit(prediction.homeScorePrediction, prediction.awayScorePrediction);
          }}
        />
      )}
    </>
  );
}
