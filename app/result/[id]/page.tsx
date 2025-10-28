"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { getBets } from "@/services/APIService";

export default function ResultPage() {
  const params = useParams();
  const resultId = Number(params.id); // id du match

  const [match, setMatch] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState(1); // mock user id

  useEffect(() => {
    async function fetchData() {
      // Récupérer toutes les bets pour ce match
      const bets = await getBets(undefined, resultId);
      setPredictions(bets);

      // Optionnel : récupérer le match depuis le premier pari (mock)
      if (bets.length > 0) setMatch(bets[0].match);
    }
    fetchData();
  }, [resultId]);

  if (!match) return <Typography>Loading...</Typography>;

  const userPrediction = predictions.find((p) => p.userId === currentUserId);

  return (
    <Box
      sx={{ px: { xs: 3, sm: 6, md: 12 }, py: 6, display: "flex", flexDirection: "column", gap: 6 }}
    >
      <Typography variant="h4" mb={2}>
        Résultat du match : {match.homeTeam.name} vs {match.awayTeam.name}
      </Typography>
      <Typography variant="h6">
        Score : {match.homeScore} - {match.awayScore} (
        {new Date(match.scheduledDate).toLocaleString()})
      </Typography>

      {userPrediction && (
        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <Typography variant="h6" mb={1}>
            Votre pari
          </Typography>
          <Typography>
            Prediction : {userPrediction.homeScorePrediction} - {userPrediction.awayScorePrediction}
          </Typography>
          <Typography>Points gagnés : {userPrediction.pointsEarned}</Typography>
        </Box>
      )}

      <Typography variant="h5" mb={2}>
        Prédictions des utilisateurs
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Utilisateur</TableCell>
            <TableCell>Prediction</TableCell>
            <TableCell>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {predictions.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.user.username}</TableCell>
              <TableCell>
                {p.homeScorePrediction} - {p.awayScorePrediction}
              </TableCell>
              <TableCell>{p.pointsEarned}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
