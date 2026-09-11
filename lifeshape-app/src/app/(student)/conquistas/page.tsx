import Link from "next/link";
import { Card } from "@/components/ui";
import {
  SearchIcon,
  FlameIcon,
  MessageIcon,
  UsersIcon,
  TrophyIcon,
  CheckIcon,
  LockIcon,
} from "@/components/icons";
import { student, badges, leaderboard } from "@/lib/data";
import { cn } from "@/lib/cn";

const badgeIcons: Record<string, typeof FlameIcon> = {
  streak10: FlameIcon,
  "voz-ativa": MessageIcon,
  "mao-na-obra": UsersIcon,
  "nota-maxima": TrophyIcon,
  "primeira-turma": CheckIcon,
};

const badgeTone: Record<string, { bg: string; fg: string }> = {
  a: { bg: "bg-ring-a-soft", fg: "text-ring-a" },
  b: { bg: "bg-ring-b-soft", fg: "text-ring-b" },
  c: { bg: "bg-ring-c-soft", fg: "text-ring-c" },
  accent: { bg: "bg-[#e8f2ff]", fg: "text-accent" },
  success: { bg: "bg-success-soft", fg: "text-success" },
};

const weekDays = [
  { d: "S", on: true },
  { d: "T", on: true },
  { d: "Q", on: true },
  { d: "Q", on: true },
  { d: "S", on: true },
  { d: "S", on: false },
  { d: "D", on: false, today: true },
];

export default function ConquistasPage() {
  const xpPct = Math.round((student.xpIntoLevel / student.xpForNextLevel) * 100);

  return (
    <div className="px-5 pt-6 pb-8 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="text-[26px] font-bold tracking-tight">Conquistas</div>
        <div className="w-9 h-9 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_10px_rgba(0,0,0,0.05)] flex items-center justify-center">
          <SearchIcon className="w-[17px] h-[17px]" />
        </div>
      </div>

      <Card className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <FlameIcon className="w-[30px] h-[30px] text-ring-a" filled />
          <div>
            <div className="text-[22px] font-bold tracking-tight">{student.streak} dias seguidos</div>
            <div className="text-[13px] text-ink-secondary">
              Sua maior sequência: {student.longestStreak} dias
            </div>
          </div>
        </div>
        <div className="flex gap-1.5">
          {weekDays.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={cn("text-[10px]", day.today ? "text-accent font-bold" : "text-ink-secondary")}>
                {day.d}
              </div>
              <div
                className={cn(
                  "w-full h-8 rounded-[9px]",
                  day.on ? "bg-ring-a" : day.today ? "bg-white border-2 border-accent" : "bg-[#f0f0f2]",
                )}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4.5 flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <div className="text-[15px] font-semibold">
            Nível {student.level} · {student.levelLabel}
          </div>
          <div className="text-[12px] text-ink-secondary">
            {student.xpForNextLevel - student.xpIntoLevel} para o Nível {student.level + 1}
          </div>
        </div>
        <div className="h-2 rounded-full bg-[#f0f0f2] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-ring-c to-accent"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <div className="text-[12px] text-ink-secondary">
          Próximo nível libera 15% de desconto na loja
        </div>
      </Card>

      <div>
        <div className="text-[13px] font-semibold text-ink-secondary uppercase tracking-wide mb-2.5">
          Emblemas
        </div>
        <Card className="p-4.5 grid grid-cols-4 gap-y-4 gap-x-2">
          {badges.map((badge) => {
            const Icon = badge.earned ? (badgeIcons[badge.id] ?? TrophyIcon) : LockIcon;
            const tone = badge.earned ? badgeTone[badge.color] : { bg: "bg-bg", fg: "text-ink-tertiary" };
            return (
              <div key={badge.id} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-[52px] h-[52px] rounded-full flex items-center justify-center",
                    tone.bg,
                  )}
                >
                  <Icon className={cn("w-[21px] h-[21px]", tone.fg)} />
                </div>
                <div
                  className={cn(
                    "text-[10px] text-center font-medium leading-tight",
                    !badge.earned && "text-ink-tertiary",
                  )}
                >
                  {badge.label}
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      <div>
        <div className="text-[13px] font-semibold text-ink-secondary uppercase tracking-wide mb-2.5">
          Ranking · Turma {student.turma}
        </div>
        <Card className="px-4 py-1">
          {leaderboard.map((entry, i) => (
            <div
              key={entry.name}
              className={cn(
                "flex items-center gap-3 py-2.5",
                i < leaderboard.length - 1 && !entry.you && "border-b border-[#ececee]",
                entry.you && "bg-[#f5f9ff] -mx-2.5 px-2.5 rounded-xl",
              )}
            >
              <div
                className={cn(
                  "w-5 text-center text-[14px] font-bold",
                  i === 0 && "text-[#c9a227]",
                  i === 1 && "text-[#9a9a9e]",
                  entry.you && "text-accent",
                  i > 1 && !entry.you && "text-ink-secondary",
                )}
              >
                {i + 1}
              </div>
              <div className={cn("w-9 h-9 rounded-full shrink-0", entry.you ? "bg-ink" : "bg-divider")} />
              <div className={cn("flex-1 text-[14.5px]", entry.you ? "font-bold" : "font-semibold")}>
                {entry.you ? "Você" : entry.name}
              </div>
              <div
                className={cn(
                  "text-[13px] font-semibold",
                  entry.you ? "text-accent font-bold" : "text-ink-secondary",
                )}
              >
                {entry.points.toLocaleString("pt-BR")}
              </div>
            </div>
          ))}
        </Card>
      </div>

      <Link href="/jornada" className="text-center text-[13px] font-semibold text-accent">
        Ver jornada completa
      </Link>
    </div>
  );
}
