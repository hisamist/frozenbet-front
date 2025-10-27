// TableComponent.tsx
"use client";

import React from "react";
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

interface Bet {
  id: number;
  match: string;
  scheduledDate: string;
  admin: string;
  adminAvatar: string;
  homeScore: number;
  awayScore: number;
}

interface TableComponentProps {
  isParticipating: boolean; // <-- control active/inactive
}

const mockBets: Bet[] = [
  {
    id: 1,
    match: "Team A vs Team B",
    scheduledDate: "2025-11-01 20:00",
    admin: "Alice",
    adminAvatar: "/images/user1.jpg",
    homeScore: 2,
    awayScore: 1,
  },
  {
    id: 2,
    match: "Team C vs Team D",
    scheduledDate: "2025-11-02 18:30",
    admin: "Alice",
    adminAvatar: "/images/user1.jpg",
    homeScore: 1,
    awayScore: 1,
  },
];

export default function TableComponent({ isParticipating }: TableComponentProps) {
  const handleParticipate = (betId: number) => {
    if (!isParticipating) return; // safety check
    alert(`Vous participez au bet ${betId}`);
  };

  return (
    <TableContainer component={Paper} className="mb-8">
      <Typography variant="h6" component="div" sx={{ p: 2 }}>
        Bets du groupe
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Match</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockBets.map((bet) => (
            <TableRow key={bet.id}>
              <TableCell>{bet.match}</TableCell>
              <TableCell>{bet.scheduledDate}</TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar src={bet.adminAvatar} alt={bet.admin} />
                  <span>{bet.admin}</span>
                </div>
              </TableCell>
              <TableCell>
                {bet.homeScore} - {bet.awayScore}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleParticipate(bet.id)}
                  disabled={!isParticipating} // <-- disabled if not participating
                >
                  Parier
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
