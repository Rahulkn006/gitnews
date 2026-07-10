import React from "react";

interface BackNavigationProps {
  label?: string;
  href?: string;
  className?: string;
}

export function BackNavigation({
  label = "Back To Home",
  href = "/",
  className = "",
}: BackNavigationProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-stone-500 hover:text-emerald-500 transition-colors ${className}`}
    >
      <span>←</span> {label}
    </a>
  );
}
