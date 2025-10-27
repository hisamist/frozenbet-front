import { Box, Container, Typography, Link, Stack, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "grey.900", color: "grey.100", py: 6 }}>
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center">
          <Typography variant="h6" component="div">
            FrozenBet
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="/" color="inherit" underline="hover">
              Home
            </Link>
            <Link href="/about" color="inherit" underline="hover">
              About
            </Link>
            <Link href="/contact" color="inherit" underline="hover">
              Contact
            </Link>
          </Stack>
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} FrozenBet. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
