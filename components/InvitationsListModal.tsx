"use client";

import ModalComponent from "@/components/ModalComponent";
import {
  acceptInvitation,
  deleteInvitation,
  getReceivedInvitations,
  getSentInvitations,
  rejectInvitation,
} from "@/services/APIService";
import { GroupInvitation } from "@/types";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

interface InvitationsListModalProps {
  open: boolean;
  onClose: () => void;
  onInvitationAccepted?: () => void;
}

export function InvitationsListModal({
  open,
  onClose,
  onInvitationAccepted,
}: InvitationsListModalProps) {
  const [tab, setTab] = useState<0 | 1>(0);
  const [receivedInvitations, setReceivedInvitations] = useState<GroupInvitation[]>([]);
  const [sentInvitations, setSentInvitations] = useState<GroupInvitation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const [received, sent] = await Promise.all([getReceivedInvitations(), getSentInvitations()]);
      setReceivedInvitations(received);
      setSentInvitations(sent);
    } catch (err: any) {
      alert(err.message || "Erreur lors du chargement des invitations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadInvitations();
    }
  }, [open]);

  const handleAccept = async (token: string) => {
    try {
      await acceptInvitation(token);
      alert("Invitation acceptée ✅");
      await loadInvitations();
      if (onInvitationAccepted) {
        onInvitationAccepted();
      }
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'acceptation de l'invitation");
    }
  };

  const handleReject = async (token: string) => {
    try {
      await rejectInvitation(token);
      alert("Invitation refusée");
      await loadInvitations();
    } catch (err: any) {
      alert(err.message || "Erreur lors du rejet de l'invitation");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette invitation ?")) {
      return;
    }
    try {
      await deleteInvitation(id);
      alert("Invitation supprimée");
      await loadInvitations();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression de l'invitation");
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "pending":
        return <Chip label="En attente" color="warning" size="small" />;
      case "accepted":
        return <Chip label="Acceptée" color="success" size="small" />;
      case "declined":
        return <Chip label="Refusée" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ModalComponent open={open} onClose={onClose} title="Liste des invitations">
      <Box sx={{ p: 4, minWidth: 600, maxWidth: 800 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Invitations
        </Typography>

        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Reçues" />
          <Tab label="Envoyées" />
        </Tabs>

        {loading ? (
          <Typography sx={{ textAlign: "center", py: 3 }}>Chargement...</Typography>
        ) : (
          <>
            {tab === 0 && (
              <Box>
                {receivedInvitations.length === 0 ? (
                  <Typography sx={{ textAlign: "center", py: 3, color: "text.secondary" }}>
                    Aucune invitation reçue
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Groupe</TableCell>
                          <TableCell>Invité par</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Statut</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {receivedInvitations.map((invitation) => (
                          <TableRow key={invitation.id}>
                            <TableCell>{invitation.group?.name || "N/A"}</TableCell>
                            <TableCell>{invitation.inviter?.username || "N/A"}</TableCell>
                            <TableCell>{formatDate(invitation.createdAt)}</TableCell>
                            <TableCell>{getStatusChip(invitation.status)}</TableCell>
                            <TableCell align="right">
                              {invitation.status === "pending" && (
                                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleAccept(invitation.token)}
                                    title="Accepter"
                                  >
                                    <CheckIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleReject(invitation.token)}
                                    title="Refuser"
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </Box>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}

            {tab === 1 && (
              <Box>
                {sentInvitations.length === 0 ? (
                  <Typography sx={{ textAlign: "center", py: 3, color: "text.secondary" }}>
                    Aucune invitation envoyée
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Groupe</TableCell>
                          <TableCell>Email invité</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Statut</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sentInvitations.map((invitation) => (
                          <TableRow key={invitation.id}>
                            <TableCell>{invitation.group?.name || "N/A"}</TableCell>
                            <TableCell>{invitation.inviteeEmail}</TableCell>
                            <TableCell>{formatDate(invitation.createdAt)}</TableCell>
                            <TableCell>{getStatusChip(invitation.status)}</TableCell>
                            <TableCell align="right">
                              {invitation.status === "pending" && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(invitation.id)}
                                  title="Supprimer"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button variant="outlined" onClick={onClose}>
            Fermer
          </Button>
        </Box>
      </Box>
    </ModalComponent>
  );
}
