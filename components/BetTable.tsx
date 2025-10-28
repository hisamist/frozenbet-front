"use client";

import { PariModal } from "@/components/PariModal";
import { useAuth } from "@/context/AuthContext";
import { getMatchesByCompetitionId } from "@/services/APIService";
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
  groupId: number; // 🏆 reçu du parent
}

export default function MatchesTable({
  competitionId,
  isParticipating,
  groupId,
}: MatchesTableProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  const { user } = useAuth(); // ✅ récupération de l'utilisateur connecté
  const userId = user?.id;

  // 🧠 Fetch des matchs de la compétition
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await getMatchesByCompetitionId(Number(competitionId));
        console.log("✅ Matches reçus:", res);
        setMatches(res.data || []);
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

  // ⚽ Quand l’utilisateur clique sur "Parier"
  const handleParierClick = (matchId: number) => {
    if (!isParticipating) return;
    setSelectedMatchId(matchId);
    setOpen(true);
  };

  // ✅ Callback quand un pari est soumis depuis le modal
  const handlePredictionSubmit = (prediction: any) => {
    console.log("🎯 Pari soumis:", prediction);
    alert(`Pari enregistré pour le match ${prediction.matchId}`);
    setOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Typography variant="h6" component="div" sx={{ p: 2 }}>
          Matches de la compétition
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
            {matches.map((match) => (
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
                    color="success"
                    size="small"
                    onClick={() => handleParierClick(match.id)}
                    disabled={!isParticipating}
                  >
                    Parier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🪟 Modal de pari */}
      {open && selectedMatchId !== null && userId && (
        <PariModal
          open={open}
          onClose={() => setOpen(false)}
          matchId={selectedMatchId}
          groupId={groupId}
          userId={userId}
          onSubmit={handlePredictionSubmit}
        />
      )}
    </>
  );
}
