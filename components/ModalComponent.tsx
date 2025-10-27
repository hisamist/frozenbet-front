"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface ModalComponentProps {
  title: string;
  children: React.ReactNode;
  buttonText?: string;
}
interface ModalComponentProps {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function ModalComponent({ title, children, open, onClose }: ModalComponentProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          {title}
        </Typography>
        <div>{children}</div>
        <Box mt={2} textAlign="right">
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
