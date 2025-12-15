import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const BackButton = ({
  children = "Back",
  className = "gap-1",
  variant = "ghost",
  size = "sm",
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented) navigate(-1);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`cursor-pointer ${className}`}
    >
      <ChevronLeft className="w-4 h-4" />
      {children}
    </Button>
  );
};

export default BackButton;
