// src/components/layout/SketchComponents.tsx
import React from "react";

export const SketchButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 border-2 border-black rounded-md shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition"
    >
      {children}
    </button>
  );
};
