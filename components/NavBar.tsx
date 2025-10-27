import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "next/link";

interface NavbarProps {
  onLoginClick: () => void; // callback pour ouvrir le modal
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            FrozenBet
          </Link>
        </Typography>

        {/* Navigation */}
        <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
          <Link href="/" passHref>
            <Button color="inherit">Accueil</Button>
          </Link>
          {/* Bouton Login déclenche modal */}
          <Button color="inherit" onClick={onLoginClick}>
            Login
          </Button>
        </Box>

        {/* Notifications */}
        <IconButton color="inherit">
          <Badge badgeContent={3} color="error">
            🔔
          </Badge>
        </IconButton>

        {/* User icon */}
        <IconButton color="inherit" sx={{ ml: 1 }}>
          👤
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
