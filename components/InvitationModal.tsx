"use client";

import ModalComponent from "@/components/ModalComponent";
import { sendInvitation } from "@/services/APIService";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

interface InvitationModalProps {
  open: boolean;
  onClose: () => void;
  groupId: number;
  groupName: string;
}

export function InvitationModal({ open, onClose, groupId, groupName }: InvitationModalProps) {
  const [inviteeEmail, setInviteeEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSendInvitation = async () => {
    setLoading(true);
    setError("");

    if (!inviteeEmail) {
      setError("Email obligatoire");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(inviteeEmail)) {
      setError("Email invalide");
      setLoading(false);
      return;
    }

    try {
      await sendInvitation({ inviteeEmail, groupId });
      alert("Invitation envoyée avec succès ✅");
      setInviteeEmail("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi de l'invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInviteeEmail("");
    setError("");
    onClose();
  };

  return (
    <ModalComponent open={open} onClose={handleClose} title="Invitation modal">
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Inviter un membre
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Invitez quelqu'un à rejoindre le groupe <strong>{groupName}</strong>
        </Typography>

        <TextField
          fullWidth
          label="Email de la personne à inviter"
          type="email"
          value={inviteeEmail}
          onChange={(e) => setInviteeEmail(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mb: 3 }}
          disabled={loading}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleSendInvitation} disabled={loading}>
            {loading ? "Envoi..." : "Envoyer l'invitation"}
          </Button>
        </Box>
      </Box>
    </ModalComponent>
  );
}
