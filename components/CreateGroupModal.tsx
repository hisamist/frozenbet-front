"use client";
import { useState } from "react";
import ModalComponent from "@/components/ModalComponent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AuthModal } from "./AuthModal";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import CompetitionSelect from "./CompetitionSelect";
import { createGroup, createRuleByGroupId } from "@/services/APIService";

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
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<number | "">("");

  const [ruleName, setRuleName] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");
  const [rulePoints, setRulePoints] = useState<number | "">("");

  const [errors, setErrors] = useState({
    groupName: "",
    gameDescription: "",
    selectedCompetitionId: "",
    ruleName: "",
    rulePoints: "",
  });

  const [createdGroupId, setCreatedGroupId] = useState<number | null>(null);

  const handleOpen = () => {
    if (!isLoggedIn) {
      setOpenAuthModal(true);
      return;
    }
    setOpenGroupModal(true);
  };

  // STEP 1: Créer le groupe
  const handleStep1Submit = async () => {
    const newErrors = {
      groupName: groupName ? "" : "Le nom du groupe est requis",
      gameDescription: gameDescription ? "" : "La description est requise",
      selectedCompetitionId: selectedCompetitionId ? "" : "Veuillez choisir une compétition",
      ruleName: "",
      rulePoints: "",
    };
    setErrors(newErrors);

    if (!groupName || !gameDescription || !selectedCompetitionId) return;

    try {
      const payload = {
        name: groupName,
        description: gameDescription,
        competitionId: selectedCompetitionId as number,
        visibility,
      };
      const res = await createGroup(payload);

      console.log("Groupe créé ✅", res);
      if (!res?.data.id) {
        alert("Erreur : l'ID du groupe créé est introuvable !");
        return;
      }

      setCreatedGroupId(res.data.id);
      setStep(2); // passe automatiquement à Step 2
    } catch (err: any) {
      alert("Erreur lors de la création du groupe : " + err.message);
    }
  };

  // STEP 2: Créer la règle
  const handleFinish = async () => {
    const newErrors = {
      groupName: "",
      gameDescription: "",
      selectedCompetitionId: "",
      ruleName: ruleName ? "" : "Le nom de la règle est requis",
      rulePoints: rulePoints !== "" ? "" : "Les points sont requis",
    };
    setErrors(newErrors);

    if (!ruleName || rulePoints === "" || !createdGroupId) return;

    try {
      await createRuleByGroupId({
        groupId: createdGroupId,
        name: ruleName,
        description: ruleDescription,
        points: rulePoints as number,
      });

      console.log("Règle créée ✅", { ruleName, ruleDescription, rulePoints });
      alert(`Règle ajoutée : ${ruleName} (${rulePoints} pts)`);
    } catch (err: any) {
      alert("Erreur lors de la création de la règle : " + err.message);
      return;
    }

    // RESET COMPLET
    setGroupName("");
    setGameDescription("");
    setSelectedCompetitionId("");
    setRuleName("");
    setRuleDescription("");
    setRulePoints("");
    setCreatedGroupId(null);
    setStep(1);
    setOpenGroupModal(false);
    setErrors({
      groupName: "",
      gameDescription: "",
      selectedCompetitionId: "",
      ruleName: "",
      rulePoints: "",
    });
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
              error={!!errors.groupName}
              helperText={errors.groupName}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              margin="normal"
              multiline
              rows={3}
              value={gameDescription}
              onChange={(e) => setGameDescription(e.target.value)}
              error={!!errors.gameDescription}
              helperText={errors.gameDescription}
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

            <CompetitionSelect value={selectedCompetitionId} onChange={setSelectedCompetitionId} />
            {errors.selectedCompetitionId && (
              <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.selectedCompetitionId}</p>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleStep1Submit}
              sx={{ mt: 2 }}
            >
              Créer le groupe
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
              error={!!errors.ruleName}
              helperText={errors.ruleName}
            />
            <TextField
              fullWidth
              label="Description de la règle (optionnel)"
              variant="outlined"
              margin="normal"
              multiline
              rows={2}
              value={ruleDescription}
              onChange={(e) => setRuleDescription(e.target.value)}
            />
            <TextField
              fullWidth
              label="Points attribués"
              variant="outlined"
              margin="normal"
              type="number"
              value={rulePoints}
              onChange={(e) => setRulePoints(Number(e.target.value))}
              error={!!errors.rulePoints}
              helperText={errors.rulePoints}
            />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleFinish}
              sx={{ mt: 2 }}
            >
              Terminer
            </Button>
          </>
        )}
      </ModalComponent>
    </>
  );
}
