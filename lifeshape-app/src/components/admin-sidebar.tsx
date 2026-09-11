import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  GridIcon,
  UsersIcon,
  CalendarIcon,
  CheckIcon,
  CoinIcon,
  BagIcon,
  TrophyIcon,
  MegaphoneIcon,
  GearIcon,
} from "@/components/icons";
import { adminNav } from "@/lib/data";

const iconMap = {
  grid: GridIcon,
  users: UsersIcon,
  calendar: CalendarIcon,
  check: CheckIcon,
  coin: CoinIcon,
  bag: BagIcon,
  trophy: TrophyIcon,
  megaphone: MegaphoneIcon,
};

export function AdminSidebar() {
  return (
    <aside className="w-60 shrink-0 bg-[#fbfbfd] border-r border-divider p-4 flex flex-col">
      <div className="px-3 pt-1.5 pb-6">
        <div className="text-[17px] font-bold tracking-tight">LIFESHAPE</div>
        <div className="text-[9px] font-semibold tracking-[0.22em] text-ink-secondary mt-0.5">
          BRASIL · ADMIN
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        {adminNav.map(({ label, icon }, i) => {
          const Icon = iconMap[icon];
          const active = i === 0;
          const content = (
            <>
              <Icon className="w-[17px] h-[17px]" />
              {label}
            </>
          );
          const classes = cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-[9px] text-[13.5px]",
            active ? "bg-[#e8e8ed] text-ink font-semibold" : "text-[#424245] font-medium",
          );
          return active ? (
            <Link key={label} href="/admin" className={classes}>
              {content}
            </Link>
          ) : (
            <div key={label} className={cn(classes, "opacity-60 cursor-default")}>
              {content}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-[9px] text-[13.5px] text-[#424245] font-medium opacity-60">
          <GearIcon className="w-[17px] h-[17px]" />
          Configurações
        </div>
      </div>
    </aside>
  );
}
