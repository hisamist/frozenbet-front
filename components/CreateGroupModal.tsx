"use client";
import { useState } from "react";
import ModalComponent from "@/components/ModalComponent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AuthModal } from "./AuthModal";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
// ==================== CreateGroupModal.tsx ====================
interface CreateGroupModalProps {
  isLoggedIn: boolean;
}

export default function CreateGroupModal({ isLoggedIn }: CreateGroupModalProps) {
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [step, setStep] = useState(1);

  const [groupName, setGroupName] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [ruleName, setRuleName] = useState("");
  const [rulePoints, setRulePoints] = useState<number | "">("");

  const handleOpen = () => {
    if (!isLoggedIn) {
      setOpenAuthModal(true);
      return;
    }
    setOpenGroupModal(true);
  };

  const handleNext = () => {
    if (!groupName) {
      alert("Veuillez remplir le nom du groupe et le type du jeu");
      return;
    }
    setStep(2);
  };

  const handleFinish = () => {
    if (!ruleName || rulePoints === "") {
      alert("Veuillez remplir le nom de la règle et les points");
      return;
    }
    alert(`Groupe créé : ${groupName}\nRègle ajoutée : ${ruleName} (${rulePoints} pts)`);
    setGroupName("");
    setGameDescription("");
    setRuleName("");
    setRulePoints("");
    setStep(1);
    setOpenGroupModal(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Ajouter Groupe
      </Button>

      <AuthModal
        open={openAuthModal}
        onClose={() => setOpenAuthModal(false)}
        onSuccess={() => setOpenGroupModal(true)}
      />

      <ModalComponent
        open={openGroupModal}
        onClose={() => {
          setOpenGroupModal(false);
          setStep(1);
        }}
        title={step === 1 ? "Créer un groupe" : "Ajouter des règles"}
      >
        {step === 1 ? (
          <>
            <TextField
              fullWidth
              label="Nom du groupe"
              variant="outlined"
              margin="normal"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Description (optionnel)"
              variant="outlined"
              margin="normal"
              multiline
              rows={4} // hauteur de 4 lignes
              value={gameDescription}
              onChange={(e) => setGameDescription(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="visibility-label">Visibilité</InputLabel>
              <Select
                labelId="visibility-label"
                value={visibility}
                label="Visibilité"
                onChange={(e) => setVisibility(e.target.value as "public" | "private")}
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Privé</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" color="primary" fullWidth onClick={handleNext}>
              Suivant
            </Button>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="Nom de la règle"
              variant="outlined"
              margin="normal"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Points attribués"
              variant="outlined"
              margin="normal"
              type="number"
              value={rulePoints}
              onChange={(e) => setRulePoints(Number(e.target.value))}
            />
            <Button variant="contained" color="secondary" fullWidth onClick={handleFinish}>
              Terminer
            </Button>
          </>
        )}
      </ModalComponent>
    </>
  );
}
