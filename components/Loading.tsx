"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      textAlign="center"
      gap={2}
    >
      <CircularProgress />
      <span>{message}</span>
    </Box>
  );
}
