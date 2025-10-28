"use client";

import ModalComponent from "@/components/ModalComponent";
import { createGroup, createRuleByGroupId } from "@/services/APIService";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import CompetitionSelect from "./CompetitionSelect";

interface CreateGroupModalProps {
  isLoggedIn: boolean;
}

type RuleType =
  | "EXACT_SCORE"
  | "CORRECT_WINNER"
  | "CORRECT_DRAW"
  | "GOAL_DIFFERENCE"
  | "BOTH_TEAMS_SCORE";

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
  const [ruleType, setRuleType] = useState<RuleType>("EXACT_SCORE"); // Nouveau champ

  const [errors, setErrors] = useState({
    groupName: "",
    gameDescription: "",
    selectedCompetitionId: "",
    ruleName: "",
    rulePoints: "",
    ruleType: "",
  });

  const [createdGroupId, setCreatedGroupId] = useState<number | null>(null);

  const handleOpen = () => {
    if (!isLoggedIn) {
      setOpenAuthModal(true);
      return;
    }
    setOpenGroupModal(true);
  };

  const handleStep1Submit = async () => {
    const newErrors = {
      groupName: groupName ? "" : "Le nom du groupe est requis",
      gameDescription: gameDescription ? "" : "La description est requise",
      selectedCompetitionId: selectedCompetitionId ? "" : "Veuillez choisir une compétition",
      ruleName: "",
      rulePoints: "",
      ruleType: "",
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
      if (!res?.data.id) {
        alert("Erreur : l'ID du groupe créé est introuvable !");
        return;
      }
      setCreatedGroupId(res.data.id);
      setStep(2);
    } catch (err: any) {
      alert("Erreur lors de la création du groupe : " + err.message);
    }
  };

  const handleFinish = async () => {
    const newErrors = {
      groupName: "",
      gameDescription: "",
      selectedCompetitionId: "",
      ruleName: ruleName ? "" : "Le nom de la règle est requis",
      rulePoints: rulePoints !== "" ? "" : "Les points sont requis",
      ruleType: ruleType ? "" : "Le type de règle est requis",
    };
    setErrors(newErrors);

    if (!ruleName || rulePoints === "" || !createdGroupId) return;

    try {
      await createRuleByGroupId({
        groupId: createdGroupId,
        description: ruleDescription,
        points: rulePoints as number,
        type: ruleType, // Nouveau champ envoyé à l’API
      });

      alert(`Règle ajoutée : ${ruleName} (${rulePoints} pts, type: ${ruleType})`);
    } catch (err: any) {
      alert("Erreur lors de la création de la règle : " + err.message);
      return;
    }

    // Reset complet
    setGroupName("");
    setGameDescription("");
    setSelectedCompetitionId("");
    setRuleName("");
    setRuleDescription("");
    setRulePoints("");
    setRuleType("EXACT_SCORE");
    setCreatedGroupId(null);
    setStep(1);
    setOpenGroupModal(false);
    setErrors({
      groupName: "",
      gameDescription: "",
      selectedCompetitionId: "",
      ruleName: "",
      rulePoints: "",
      ruleType: "",
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

            <FormControl fullWidth margin="normal">
              <InputLabel id="rule-type-label">Type de pari</InputLabel>
              <Select
                labelId="rule-type-label"
                value={ruleType}
                label="Type de pari"
                onChange={(e) => setRuleType(e.target.value as RuleType)}
              >
                <MenuItem value="EXACT_SCORE">Exact Score</MenuItem>
                <MenuItem value="CORRECT_WINNER">Correct Winner</MenuItem>
                <MenuItem value="CORRECT_DRAW">Correct Draw</MenuItem>
                <MenuItem value="GOAL_DIFFERENCE">Goal Difference</MenuItem>
                <MenuItem value="BOTH_TEAMS_SCORE">Both Teams Score</MenuItem>
              </Select>
            </FormControl>

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
