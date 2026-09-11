"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { HomeIcon, BookIcon, UsersIcon, BagIcon, UserIcon } from "@/components/icons";

const items = [
  { href: "/home", label: "Início", Icon: HomeIcon, match: (p: string) => p === "/home" },
  { href: "/cursos", label: "Cursos", Icon: BookIcon, match: (p: string) => p.startsWith("/cursos") },
  {
    href: "/comunidade",
    label: "Comunidade",
    Icon: UsersIcon,
    match: (p: string) => p.startsWith("/comunidade"),
  },
  { href: "/loja", label: "Loja", Icon: BagIcon, match: (p: string) => p.startsWith("/loja") },
  {
    href: "/conquistas",
    label: "Perfil",
    Icon: UserIcon,
    match: (p: string) => p.startsWith("/conquistas") || p.startsWith("/jornada"),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 inset-x-0 bg-white/85 backdrop-blur-xl border-t border-divider/70 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))] px-2">
      <div className="flex">
        {items.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 text-[10px] font-medium py-0.5",
                active ? "text-ink" : "text-ink-tertiary",
              )}
            >
              <Icon className="w-[22px] h-[22px]" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
