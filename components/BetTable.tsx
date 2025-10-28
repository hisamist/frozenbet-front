"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { PariModal } from "@/components/PariModal";
import { Prediction } from "@/types";

interface BetTableProps {
  isParticipating: boolean;
  predictions?: Prediction[];
  userId?: number;
  groupId?: number;
}

export default function BetTable({
  isParticipating,
  predictions = [], // fallback à []
  userId = 1,
  groupId = 1,
}: BetTableProps) {
  const [open, setOpen] = useState(false);
  const [currentPredictionId, setCurrentPredictionId] = useState<number | null>(null);

  const handleParticipate = (predictionId: number) => {
    if (!isParticipating) return;
    setCurrentPredictionId(predictionId);
    setOpen(true);
  };

  const handlePredictionSubmit = (prediction: any) => {
    console.log("Pari soumis:", prediction);
    alert(`Pari enregistré pour le match ${prediction.matchId}`);
    setOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper} className="mb-8">
        <Typography variant="h6" component="div" sx={{ p: 2 }}>
          Bets du groupe
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Match</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Score prédit</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {predictions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Aucun pari disponible
                </TableCell>
              </TableRow>
            ) : (
              predictions.map((pred) => (
                <TableRow key={pred.id}>
                  <TableCell>
                    {pred.match?.homeTeam?.name || "Home"} vs {pred.match?.awayTeam?.name || "Away"}
                  </TableCell>
                  <TableCell>{pred.match?.scheduledDate}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar>
                        <AccountCircleIcon />
                      </Avatar>
                      <span>{pred.user?.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {pred.homeScorePrediction} - {pred.awayScorePrediction}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleParticipate(pred.id)}
                      disabled={!isParticipating}
                    >
                      Parier
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {open && currentPredictionId !== null && (
        <PariModal
          open={open}
          onClose={() => setOpen(false)}
          matchId={currentPredictionId}
          groupId={groupId}
          userId={userId}
          onSubmit={handlePredictionSubmit}
        />
      )}
    </>
  );
}
