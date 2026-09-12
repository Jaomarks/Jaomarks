"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import { personas, type PersonaId } from "@/lib/data";
import { CapIcon, BriefcaseIcon, BookIcon, CheckIcon } from "@/components/icons";
import { savePersonaAction } from "@/app/actions/auth";

const personaIcons: Record<PersonaId, typeof CapIcon> = {
  universitario: CapIcon,
  profissional: BriefcaseIcon,
  pastor: BookIcon,
};

export function PersonaPicker() {
  const [selected, setSelected] = useState<PersonaId>("universitario");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleContinue() {
    setError(null);
    startTransition(async () => {
      try {
        await savePersonaAction(selected);
      } catch {
        // redirect() throws internally on success — anything that reaches
        // here is a real failure (e.g. session expired mid-click).
        setError("Não foi possível salvar. Tente novamente.");
      }
    });
  }

  return (
    <>
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
        {error && (
          <p role="alert" className="text-[13px] font-medium text-red-600 mb-3 text-center">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={handleContinue}
          disabled={pending}
          className="block w-full bg-ink text-white text-[16px] font-semibold text-center py-4 rounded-full disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Continuar"}
        </button>
      </div>
    </>
  );
}
