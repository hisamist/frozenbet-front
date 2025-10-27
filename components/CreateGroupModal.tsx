"use client";

import ModalComponent from "@/components/ModalComponent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";

export default function CreateGroupModal() {
  const [groupName, setGroupName] = useState("");

  const handleCreate = () => {
    alert(`Groupe créé : ${groupName}`);
  };

  return (
    <ModalComponent title="Créer un groupe" buttonText="Ajouter Groupe">
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
        label="Type du jeux"
        variant="outlined"
        margin="normal"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
       <TextField
        fullWidth
        label="Nom du groupe"
        variant="outlined"
        margin="normal"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleCreate}
      >
        Confirmer
      </Button>
    </ModalComponent>
  );
}
