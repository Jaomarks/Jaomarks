"use client";

import { useState } from "react";
import {
  SearchIcon,
  AlertIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
} from "@/components/icons";
import { adminKpis, engagementSeries, atRiskStudents } from "@/lib/data";
import { cn } from "@/lib/cn";

const W = 640;
const H = 200;
const TOP = 20;
const BASE = 180;

function buildChartPaths(series: readonly number[]) {
  const step = W / (series.length - 1);
  const points = series.map((v, i) => [i * step, BASE - (v / 100) * (BASE - TOP)] as const);
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W},${BASE} L0,${BASE} Z`;
  return { line, area, points };
}

export default function AdminPage() {
  const [sent, setSent] = useState<Set<string>>(new Set());
  const { line, area, points } = buildChartPaths(engagementSeries);
  const last = points[points.length - 1];

  function toggleSent(name: string) {
    setSent((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16 shrink-0 border-b border-divider flex items-center justify-between px-8 bg-white">
        <div className="flex items-center gap-2.5 bg-bg rounded-[9px] px-3 py-2 w-70">
          <SearchIcon className="w-[15px] h-[15px] text-ink-tertiary" />
          <span className="text-[13px] text-ink-tertiary">Buscar aluno, turma...</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="text-[13.5px] font-semibold">Camila Ferreira</div>
          <div className="w-8 h-8 rounded-full bg-ink" />
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col gap-6 overflow-hidden">
        <div className="flex items-baseline justify-between">
          <div className="text-[24px] font-bold tracking-tight">Visão geral · Temporada Impacto 2025</div>
          <div className="text-[13px] text-ink-secondary bg-white border border-divider px-3 py-1.5 rounded-lg">
            Últimas 8 semanas
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4.5">
          {adminKpis.map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-2xl border border-[#e9e9eb] p-4.5">
              <div className="text-[12.5px] text-ink-secondary font-semibold">{kpi.label}</div>
              <div className="text-[28px] font-bold tracking-tight mt-2">{kpi.value}</div>
              <div
                className={cn(
                  "flex items-center gap-1.5 text-[12.5px] font-semibold mt-1",
                  kpi.trend === "up" ? "text-success" : "text-danger",
                )}
              >
                {kpi.trend === "up" ? <ArrowUpIcon /> : <ArrowDownIcon />}
                {kpi.note}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-5 flex-1 overflow-hidden">
          <div className="flex-[2] bg-white rounded-2xl border border-[#e9e9eb] p-6 flex flex-col gap-3.5">
            <div className="text-[15px] font-bold">Engajamento médio por semana</div>
            <svg viewBox={`0 0 ${W + 30} ${H + 10}`} className="w-full h-56" preserveAspectRatio="none">
              {[20, 73, 127].map((y) => (
                <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#eeeeef" strokeWidth="1" />
              ))}
              <line x1="0" y1={BASE} x2={W} y2={BASE} stroke="#d2d2d7" strokeWidth="1" />
              <text x={W + 4} y="24" fontSize="11" fill="#86868b">100</text>
              <text x={W + 4} y="131" fontSize="11" fill="#86868b">50</text>
              <text x={W + 4} y="184" fontSize="11" fill="#86868b">0</text>
              <path d={area} fill="var(--color-accent)" opacity="0.08" />
              <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={last[0]} cy={last[1]} r="4" fill="var(--color-accent)" />
              {engagementSeries.map((_, i) => (
                <text
                  key={i}
                  x={(W / (engagementSeries.length - 1)) * i}
                  y={H}
                  fontSize="11"
                  fill="#86868b"
                >
                  S{i + 1}
                </text>
              ))}
            </svg>
            <div className="flex gap-6 pt-4 border-t border-[#ececee]">
              <div>
                <div className="text-[12.5px] text-ink-secondary font-semibold">Turma que mais cresceu</div>
                <div className="text-[14px] font-semibold mt-1">Liderança 24 · +11 pts</div>
              </div>
              <div>
                <div className="text-[12.5px] text-ink-secondary font-semibold">Certificados emitidos</div>
                <div className="text-[14px] font-semibold mt-1">96 este mês</div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl border border-[#e9e9eb] p-5 flex flex-col gap-3.5 overflow-hidden">
            <div className="flex items-center gap-2">
              <AlertIcon className="w-4 h-4 text-danger" />
              <div className="text-[15px] font-bold">Queda de engajamento</div>
            </div>
            <div className="flex flex-col overflow-y-auto">
              {atRiskStudents.map((s, i) => {
                const isSent = sent.has(s.name);
                return (
                  <div
                    key={s.name}
                    className={cn(
                      "flex items-center gap-2.5 py-2.5",
                      i < atRiskStudents.length - 1 && "border-b border-[#f0f0f2]",
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-divider shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold truncate">{s.name}</div>
                      <div className="text-[11.5px] text-ink-secondary truncate">{s.detail}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSent(s.name)}
                      className={cn(
                        "shrink-0 text-[12px] font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1",
                        isSent ? "bg-success-soft text-success" : "bg-accent text-white",
                      )}
                    >
                      {isSent && <CheckIcon className="w-2.5 h-2.5" />}
                      {isSent ? "Enviado" : "Enviar apoio"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-auto text-center text-[13px] font-semibold text-accent">
              Ver os 23 alunos em atenção
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
