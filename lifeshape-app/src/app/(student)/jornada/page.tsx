import { Card } from "@/components/ui";
import { CalendarIcon } from "@/components/icons";
import { journey, student } from "@/lib/data";
import { cn } from "@/lib/cn";

const dotColor: Record<string, string> = {
  ink: "bg-ink",
  b: "bg-ring-b",
  accent: "bg-accent",
  a: "bg-ring-a",
  c: "bg-ring-c",
};

export default function JornadaPage() {
  return (
    <div className="px-5 pt-6 pb-8">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[26px] font-bold tracking-tight">Sua jornada</div>
        <div className="w-9 h-9 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_10px_rgba(0,0,0,0.05)] flex items-center justify-center">
          <CalendarIcon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-[14px] text-ink-secondary mb-5">
        Desde {student.memberSince} · com a Lifeshape
      </div>

      <div className="flex flex-col">
        {journey.map((event, i) => (
          <div key={event.title} className="flex gap-3.5">
            <div className="flex flex-col items-center w-5 shrink-0">
              <div className={cn("w-[11px] h-[11px] rounded-full mt-1", dotColor[event.color])} />
              {i < journey.length - 1 && <div className="w-[1.5px] flex-1 bg-divider mt-1" />}
            </div>
            <Card
              className={cn(
                "flex-1 p-4 mb-4.5",
                event.muted && "shadow-none border-[1.5px] border-dashed border-divider bg-transparent",
              )}
            >
              <div className="text-[12px] text-ink-secondary font-semibold">{event.date}</div>
              <div className="text-[15px] font-semibold mt-0.5">{event.title}</div>
              {event.detail && (
                <div className="text-[12.5px] text-ink-secondary mt-1">{event.detail}</div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
