"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { personas, type PersonaId } from "@/lib/data";
import { CapIcon, BriefcaseIcon, BookIcon, CheckIcon } from "@/components/icons";

const personaIcons: Record<PersonaId, typeof CapIcon> = {
  universitario: CapIcon,
  profissional: BriefcaseIcon,
  pastor: BookIcon,
};

export default function OnboardingPage() {
  const [selected, setSelected] = useState<PersonaId>("universitario");

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.08)]">
        <div className="px-6 pt-9 flex flex-col gap-7">
          <div>
            <div className="text-[20px] font-bold tracking-tight">LIFESHAPE</div>
            <div className="text-[10px] font-semibold tracking-[0.24em] text-ink-secondary mt-0.5">
              BRASIL
            </div>
          </div>

          <div>
            <h1 className="text-[30px] font-bold tracking-tight leading-[1.15]">
              Qual desses combina mais com você?
            </h1>
            <p className="text-[15px] text-ink-secondary mt-2.5 leading-snug">
              Assim a gente já te direciona pra trilha certa desde o primeiro dia.
            </p>
          </div>
        </div>

        <div className="px-6 py-7 flex flex-col gap-3.5">
          {personas.map((p) => {
            const Icon = personaIcons[p.id];
            const active = selected === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                className={cn(
                  "flex items-center gap-3.5 rounded-[18px] border-[1.5px] p-4.5 text-left transition-colors",
                  active ? "bg-ink border-ink text-white" : "border-divider text-ink",
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                    active ? "bg-white/15" : "bg-bg",
                  )}
                >
                  <Icon className="w-[22px] h-[22px]" />
                </div>
                <div className="flex-1">
                  <div className="text-[16px] font-semibold">{p.label}</div>
                  <div className={cn("text-[13px] mt-0.5", active ? "opacity-75" : "text-ink-secondary")}>
                    {p.description}
                  </div>
                </div>
                <div
                  className={cn(
                    "w-[22px] h-[22px] rounded-full border-[1.5px] shrink-0 flex items-center justify-center",
                    active ? "border-white bg-white" : "border-divider",
                  )}
                >
                  {active && <CheckIcon className="w-3 h-3 text-ink" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-auto px-6 pb-9 pt-4">
          <Link
            href="/home"
            className="block bg-ink text-white text-[16px] font-semibold text-center py-4 rounded-full"
          >
            Continuar
          </Link>
        </div>
      </div>
    </div>
  );
}
