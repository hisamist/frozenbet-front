"use client";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getBets } from "@/services/APIService";
import { MatchWithPredictions, Prediction } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function ResultPage() {
  const params = useParams();
  const matchId = Number(params.id); // id du match
  const { user } = useAuth();

  const [match, setMatch] = useState<MatchWithPredictions | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!matchId) return;

      try {
        // Récupère toutes les paris pour ce match
        const bets: Prediction[] = await getBets(undefined, matchId);
        console.log(bets);
        setPredictions(bets);

        // Récupère le match depuis la première prédiction si disponible
        if (bets.length > 0) {
          setMatch(bets[0].match as MatchWithPredictions);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des paris :", error);
      }
    };

    fetchData();
  }, [matchId]);

  if (!match) return <Typography>Chargement du match...</Typography>;

  const userPrediction = predictions.find((p) => p.userId === user?.id);

  return (
    <Box
      sx={{
        px: { xs: 3, sm: 6, md: 12 },
        py: 6,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <Typography variant="h4" mb={2}>
        Résultat du match : {match.homeTeam?.name} vs {match.awayTeam?.name}
      </Typography>
      <Typography variant="h6">
        Score : {match.homeScore ?? "-"} - {match.awayScore ?? "-"} (
        {new Date(match.scheduledDate).toLocaleString()})
      </Typography>

      {userPrediction && (
        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <Typography variant="h6" mb={1}>
            Votre pari
          </Typography>
          <Typography>
            Prédiction : {userPrediction.homeScorePrediction} - {userPrediction.awayScorePrediction}
          </Typography>
          <Typography>Points gagnés : {userPrediction.pointsEarned ?? 0}</Typography>
        </Box>
      )}

      <Typography variant="h5" mb={2}>
        Prédictions des utilisateurs
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Utilisateur</TableCell>
            <TableCell>Prédiction</TableCell>
            <TableCell>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {predictions.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.user?.username ?? "Inconnu"}</TableCell>
              <TableCell>
                {p.homeScorePrediction} - {p.awayScorePrediction}
              </TableCell>
              <TableCell>{p.pointsEarned ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
