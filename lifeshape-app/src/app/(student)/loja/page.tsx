"use client";

import { useState } from "react";
import { Card, ScrollPills } from "@/components/ui";
import { CoinIcon, ShirtIcon, TicketIcon, MugIcon, HeartIcon, BookIcon } from "@/components/icons";
import { student, storeCategories, products, type Product } from "@/lib/data";
import { cn } from "@/lib/cn";

const productIcons: Record<Product["icon"], typeof ShirtIcon> = {
  shirt: ShirtIcon,
  hoodie: ShirtIcon,
  ticket: TicketIcon,
  mug: MugIcon,
  heart: HeartIcon,
  book: BookIcon,
  compass: BookIcon,
};

const tone: Record<Product["icon"], { bg: string; fg: string }> = {
  shirt: { bg: "bg-[#e8f2ff]", fg: "text-accent" },
  hoodie: { bg: "bg-bg", fg: "text-ink-secondary" },
  ticket: { bg: "bg-ring-a-soft", fg: "text-ring-a" },
  mug: { bg: "bg-bg", fg: "text-ink-secondary" },
  heart: { bg: "bg-ring-c-soft", fg: "text-ring-c" },
  book: { bg: "bg-ring-b-soft", fg: "text-ring-b" },
  compass: { bg: "bg-ring-b-soft", fg: "text-ring-b" },
};

export default function LojaPage() {
  const [category, setCategory] = useState<(typeof storeCategories)[number]>("Tudo");
  const filtered = products.filter((p) => category === "Tudo" || p.category === category);

  return (
    <div className="px-5 pt-6 pb-8 flex flex-col gap-4.5">
      <div className="flex items-center justify-between">
        <div className="text-[26px] font-bold tracking-tight">Loja</div>
        <div className="flex items-center gap-1.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_10px_rgba(0,0,0,0.05)] px-3 py-1.5 rounded-full">
          <CoinIcon className="w-[15px] h-[15px] text-ring-b" />
          <span className="text-[13.5px] font-bold">{student.sementes.toLocaleString("pt-BR")}</span>
        </div>
      </div>

      <ScrollPills options={storeCategories} value={category} onChange={(v) => setCategory(v as (typeof storeCategories)[number])} />

      <div className="bg-ink rounded-[18px] p-5 flex flex-col gap-2.5">
        <div className="text-[11px] font-bold text-ring-a uppercase tracking-wide">
          Nível {student.level} desbloqueado
        </div>
        <div className="text-[19px] font-bold text-white tracking-tight leading-[1.25]">
          15% off em qualquer evento este mês
        </div>
        <div className="text-[13px] text-[#aeaeb2]">Aplicado automaticamente no checkout</div>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {filtered.map((product) => {
          const Icon = productIcons[product.icon];
          const t = tone[product.icon];
          return (
            <Card key={product.id} className="overflow-hidden flex flex-col relative">
              {product.levelRequired && (
                <span className="absolute top-2 left-2 z-10 bg-ink text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full">
                  Nível {product.levelRequired}+
                </span>
              )}
              <div className={cn("h-24 flex items-center justify-center", t.bg)}>
                <Icon className={cn("w-[34px] h-[34px]", t.fg)} />
              </div>
              <div className="p-3 flex flex-col gap-1.5">
                <div className="text-[13.5px] font-semibold leading-tight">{product.title}</div>
                {product.priceSementes !== undefined ? (
                  <div className="flex items-center gap-1.5">
                    <CoinIcon className="w-[13px] h-[13px] text-ring-b" />
                    <span className="text-[13px] font-bold">{product.priceSementes}</span>
                  </div>
                ) : product.priceFrom ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-ink-tertiary line-through">{product.priceFrom}</span>
                    <span className="text-[13px] font-bold text-ring-a">{product.priceNow}</span>
                  </div>
                ) : (
                  <span className="text-[12.5px] font-bold text-ring-a">{product.priceNow}</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
