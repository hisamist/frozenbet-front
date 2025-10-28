"use client";
import { useState } from "react";
import ModalComponent from "@/components/ModalComponent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [authTab, setAuthTab] = useState<0 | 1>(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { login, register } = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleAuthSubmit = async () => {
    setLoading(true);
    const newErrors: { [key: string]: string } = {};

    if (authTab === 0) {
      // Login validation
      if (!email) newErrors.email = "Email obligatoire";
      else if (!emailRegex.test(email)) newErrors.email = "Email invalide";

      if (!password) newErrors.password = "Mot de passe obligatoire";
      else if (!passwordRegex.test(password))
        newErrors.password =
          "Mot de passe ≥8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial";
    } else {
      // Register validation
      if (!username) newErrors.username = "Nom d'utilisateur obligatoire";

      if (!email) newErrors.email = "Email obligatoire";
      else if (!emailRegex.test(email)) newErrors.email = "Email invalide";

      if (!password) newErrors.password = "Mot de passe obligatoire";
      else if (!passwordRegex.test(password))
        newErrors.password =
          "Mot de passe ≥8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      if (authTab === 0) {
        await login(email, password);
        alert("Connexion réussie ✅");
      } else {
        await register({ username, email, password });
        alert("Compte créé avec succès ✅");
      }

      setEmail("");
      setPassword("");
      setUsername("");
      setErrors({});
      onClose();
      onSuccess();
    } catch (err: any) {
      alert(err.message || "Erreur inconnue ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalComponent open={open} onClose={onClose} title="Connexion ou Inscription">
      <Tabs value={authTab} onChange={(e, v) => setAuthTab(v as 0 | 1)} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <Box mt={2}>
        {authTab === 0 ? (
          <>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
          </>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleAuthSubmit}
          disabled={loading}
        >
          {loading ? "Veuillez patienter..." : authTab === 0 ? "Se connecter" : "S'inscrire"}
        </Button>
      </Box>
    </ModalComponent>
  );
}
