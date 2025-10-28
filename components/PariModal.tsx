"use client";

import ModalComponent from "@/components/ModalComponent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export interface PredictionInput {
  userId: number;
  matchId: number;
  groupId?: number;
  homeScorePrediction: number;
  awayScorePrediction: number;
  predictedAt: string;
  pointsEarned?: number;
  isLocked: boolean;
}

interface PariModalProps {
  open: boolean;
  onClose: () => void;
  matchId: number;
  groupId?: number;
  userId: number;
  onSubmit: (prediction: PredictionInput) => void;
}

export function PariModal({ open, onClose, matchId, groupId, userId, onSubmit }: PariModalProps) {
  const [homeScore, setHomeScore] = useState<number | "">("");
  const [awayScore, setAwayScore] = useState<number | "">("");
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = () => {
    if (homeScore === "" || awayScore === "") {
      alert("Veuillez saisir un score pour les deux équipes.");
      return;
    }

    const prediction: PredictionInput = {
      userId,
      matchId,
      groupId,
      homeScorePrediction: Number(homeScore),
      awayScorePrediction: Number(awayScore),
      predictedAt: new Date().toISOString(),
      isLocked,
    };

    onSubmit(prediction);

    setHomeScore("");
    setAwayScore("");
    setIsLocked(false);
    onClose();
  };

  return (
    <ModalComponent open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: "background.paper" }}>
        <Typography variant="h5" sx={{ mb: 3, color: "text.primary" }}>
          Faire un pari
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="body1" color="text.secondary">
            Entrez votre pronostic pour le match :
          </Typography>
          <TextField
            label="Score équipe à domicile"
            type="number"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value ? Number(e.target.value) : "")}
          />
          <TextField
            label="Score équipe à l'extérieur"
            type="number"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value ? Number(e.target.value) : "")}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
            Enregistrer le pari
          </Button>
        </Box>
      </Box>
    </ModalComponent>
  );
}
