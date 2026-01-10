import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlowingCardProps {
  className?: string;
  title: string | number;
  subtitle: string;
  icon?: ReactNode;
  hue?: number; // Optional hue rotation for different colors
}

export const GlowingCard = ({ className, title, subtitle, icon, hue = 0 }: GlowingCardProps) => {
  return (
    <div className={cn("glowing-card-outer", className)} style={{ "--hue": hue } as React.CSSProperties}>
      <div className="glowing-card-dot" />
      <div className="glowing-card-inner">
        <div className="glowing-card-ray" />
        <div className="glowing-card-content">
          {icon && <div className="mb-2 text-primary-500">{icon}</div>}
          <div className="glowing-card-text">{title}</div>
          <div className="text-sm text-text-secondary">{subtitle}</div>
        </div>
        <div className="glowing-card-line line-top" />
        <div className="glowing-card-line line-left" />
        <div className="glowing-card-line line-bottom" />
        <div className="glowing-card-line line-right" />
      </div>
    </div>
  );
};
