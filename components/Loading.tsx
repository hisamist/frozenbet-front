// components/Loading.tsx
"use client";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

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
