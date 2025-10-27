import React from "react";
import Button from "@mui/material/Button";

interface MyButtonProps {
  text: string;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "error" | "success" | "warning";
  onClick?: () => void;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const MyButton: React.FC<MyButtonProps> = ({
  text,
  variant = "contained",
  color = "primary",
  onClick,
  fullWidth = false,
  startIcon,
  endIcon,
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
    >
      {text}
    </Button>
  );
};

export default MyButton;
