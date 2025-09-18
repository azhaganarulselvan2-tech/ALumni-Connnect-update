// Simple Card component for Achievement.jsx
import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
