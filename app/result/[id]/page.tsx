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

interface Prediction {
  id: string;
  user: {
    id: string;
    username: string;
  };
  homeScorePrediction: number;
  awayScorePrediction: number;
  pointsEarned: number;
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
}

interface UserRanking {
  user: {
    id: string;
    username: string;
  };
  totalPoints: number;
  rank: number;
}

export default function ResultPage() {
  const params = useParams();
  const resultId = params.id as string;

  const [match, setMatch] = useState<Match | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [currentUserId, setCurrentUserId] = useState("u1"); // mock user id

  useEffect(() => {
    // Mock fetch
    setMatch({
      id: resultId!,
      homeTeam: "Team A",
      awayTeam: "Team B",
      homeScore: 2,
      awayScore: 1,
      date: "2025-10-27T18:00:00Z",
    });

    setPredictions([
      {
        id: "1",
        user: { id: "u1", username: "Alice" },
        homeScorePrediction: 2,
        awayScorePrediction: 1,
        pointsEarned: 5,
      },
      {
        id: "2",
        user: { id: "u2", username: "Bob" },
        homeScorePrediction: 1,
        awayScorePrediction: 1,
        pointsEarned: 2,
      },
    ]);

    setRankings([
      { user: { id: "u1", username: "Alice" }, totalPoints: 25, rank: 1 },
      { user: { id: "u2", username: "Bob" }, totalPoints: 18, rank: 2 },
    ]);
  }, [resultId]);

  if (!match) return <Typography>Loading...</Typography>;

  const userPrediction = predictions.find((p) => p.user.id === currentUserId);

  return (
    <Box
      sx={{ px: { xs: 3, sm: 6, md: 12 }, py: 6, display: "flex", flexDirection: "column", gap: 6 }}
    >
      {/* Match Info */}
      <Typography variant="h4" mb={2}>
        Résultat du match : {match.homeTeam} vs {match.awayTeam}
      </Typography>
      <Typography variant="h6">
        Score : {match.homeScore} - {match.awayScore} ({new Date(match.date).toLocaleString()})
      </Typography>

      {/* User Bet */}
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

      {/* Predictions Table */}
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

      {/* User Rankings */}
      <Typography variant="h5" mt={4} mb={2}>
        Classement des utilisateurs
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rang</TableCell>
            <TableCell>Utilisateur</TableCell>
            <TableCell>Total Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankings.map((r) => (
            <TableRow key={r.user.id}>
              <TableCell>{r.rank}</TableCell>
              <TableCell>{r.user.username}</TableCell>
              <TableCell>{r.totalPoints}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
