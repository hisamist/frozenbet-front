import { Box, Container, Link, Stack, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "grey.900", color: "grey.100", py: 6 }}>
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center">
          <div className="text-inherit no-underline flex items-center grow">
            <img
              src="/logo-frozenbet.png"
              alt="FrozenBet Logo"
              width={40}
              height={40}
              className="mr-3"
            />
            <Typography variant="h6" component="span">
              FrozenBet
            </Typography>
          </div>
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} FrozenBet. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
