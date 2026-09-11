"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-surface rounded-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_6px_18px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[13px] font-semibold text-ink-secondary uppercase tracking-wide">
      {children}
    </div>
  );
}

const pillVariants = {
  primary: "bg-ink text-white",
  accent: "bg-accent text-white",
  outline: "bg-white text-ink border border-divider",
  soft: "bg-black/[0.04] text-ink",
};

export function Pill({
  children,
  variant = "outline",
  className,
}: {
  children: ReactNode;
  variant?: keyof typeof pillVariants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold whitespace-nowrap",
        pillVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatChip({
  icon,
  value,
  label,
  color,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <Card className="flex-1 flex flex-col gap-1.5 p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.04)]">
      <div style={color ? { color } : undefined}>{icon}</div>
      <div>
        <div className="text-[17px] font-semibold tracking-tight leading-none">{value}</div>
        <div className="text-[11px] text-ink-secondary mt-1">{label}</div>
      </div>
    </Card>
  );
}

const ringColors = {
  a: { strong: "var(--color-ring-a)", soft: "var(--color-ring-a-soft)" },
  b: { strong: "var(--color-ring-b)", soft: "var(--color-ring-b-soft)" },
  c: { strong: "var(--color-ring-c)", soft: "var(--color-ring-c-soft)" },
  accent: { strong: "var(--color-accent)", soft: "#e8f2ff" },
};

export function Ring({
  value,
  color,
  label,
  size = 64,
}: {
  value: number;
  color: keyof typeof ringColors;
  label: string;
  size?: number;
}) {
  const strokeWidth = Math.round(size * 0.11);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100);
  const c = ringColors[color];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={c.soft}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={c.strong}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold">
          {value}%
        </div>
      </div>
      <div className="text-[10px] text-ink-secondary font-medium">{label}</div>
    </div>
  );
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 bg-black/[0.045] rounded-[10px] p-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "flex-1 text-center text-[13px] font-semibold py-2 rounded-lg transition-colors",
            value === opt
              ? "bg-white text-ink shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              : "text-ink-secondary",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function ScrollPills({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto -mx-5 px-5 no-scrollbar">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold whitespace-nowrap",
            value === opt ? "bg-ink text-white" : "bg-white text-ink",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
