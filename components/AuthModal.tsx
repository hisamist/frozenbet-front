"use client";
import { useState } from "react";
import ModalComponent from "@/components/ModalComponent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useAuth } from "@/context/AuthContext"; // hook AuthProvider

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // appelé après login/register
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [authTab, setAuthTab] = useState<0 | 1>(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { login, register } = useAuth(); // fonctions depuis AuthProvider
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async () => {
    setLoading(true);
    try {
      if (authTab === 0) {
        // Login
        if (!email || !password) {
          alert("Veuillez remplir email et mot de passe");
          setLoading(false);
          return;
        }
        await login(email, password);
      } else {
        // Register
        if (!username || !email || !password) {
          alert("Veuillez remplir tous les champs pour l'inscription");
          setLoading(false);
          return;
        }
        await register({ username, email, password });
      }

      // Reset inputs
      setEmail("");
      setPassword("");
      setUsername("");

      onClose();
      onSuccess();
    } catch (err: any) {
      alert(err.message || "Erreur inconnue");
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
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
