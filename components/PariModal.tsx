"use client";

import ModalComponent from "@/components/ModalComponent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

interface PariModalProps {
  open: boolean;
  onClose: () => void;
  matchId: number;
  groupId?: number;
  userId?: number;
  onSubmit: (prediction: PredictionInput) => void;
}

interface PredictionInput {
  user_id: number;
  match_id: number;
  group_id?: number;
  home_score_prediction: number;
  away_score_prediction: number;
  predicted_at: string;
  points_earned?: number;
  is_locked: boolean;
}

export function PariModal({
  open,
  onClose,
  matchId,
  groupId,
  userId = 0,
  onSubmit,
}: PariModalProps) {
  const [homeScore, setHomeScore] = useState<number | "">("");
  const [awayScore, setAwayScore] = useState<number | "">("");
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = () => {
    if (homeScore === "" || awayScore === "") {
      alert("Veuillez saisir un score pour les deux équipes.");
      return;
    }

    const prediction: PredictionInput = {
      user_id: userId,
      match_id: matchId,
      group_id: groupId,
      home_score_prediction: Number(homeScore),
      away_score_prediction: Number(awayScore),
      predicted_at: new Date().toISOString(),
      is_locked: isLocked,
    };

    onSubmit(prediction);
    setHomeScore("");
    setAwayScore("");
    setIsLocked(false);
    onClose();
  };

  return (
    <ModalComponent open={open} onClose={onClose} title="Faire un pari">
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="body1">Entrez votre pronostic pour le match :</Typography>
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
    </ModalComponent>
  );
}
