"use client";

import { useState } from "react";
import { Card, ScrollPills } from "@/components/ui";
import { BellIcon, PinIcon, HeartIcon, MessageIcon } from "@/components/icons";
import { pinnedAnnouncement, communityPosts } from "@/lib/data";

const turmas = ["Liderança 24", "Impacto 2025", "Geral"] as const;

export default function ComunidadePage() {
  const [turma, setTurma] = useState<(typeof turmas)[number]>("Liderança 24");
  const posts = communityPosts.filter((p) => p.turma === turma);

  return (
    <div className="px-5 pt-6 pb-8 flex flex-col gap-4.5">
      <div className="flex items-center justify-between">
        <div className="text-[26px] font-bold tracking-tight">Comunidade</div>
        <div className="w-9 h-9 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_10px_rgba(0,0,0,0.05)] flex items-center justify-center">
          <BellIcon className="w-[18px] h-[18px]" />
        </div>
      </div>

      <ScrollPills options={turmas} value={turma} onChange={(v) => setTurma(v as (typeof turmas)[number])} />

      <Card className="p-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <PinIcon className="w-3.5 h-3.5 text-ring-a" />
          <span className="text-[11.5px] font-bold text-ring-a uppercase tracking-wide">
            Fixado · {pinnedAnnouncement.author}
          </span>
        </div>
        <p className="text-[14.5px] leading-relaxed">{pinnedAnnouncement.text}</p>
        <div className="flex gap-3.5 text-[12px] text-ink-tertiary">
          <span className="flex items-center gap-1.5">
            <HeartIcon className="w-3.5 h-3.5" />
            {pinnedAnnouncement.likes}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageIcon className="w-3.5 h-3.5" />
            {pinnedAnnouncement.replies}
          </span>
        </div>
      </Card>

      <div className="text-[13px] font-semibold text-ink-secondary uppercase tracking-wide">
        Mural · {turma}
      </div>

      {posts.length === 0 && (
        <p className="text-[14px] text-ink-secondary">Ainda não há posts nesta turma.</p>
      )}

      {posts.map((post) => (
        <Card key={post.author + post.time} className="p-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-full bg-divider" />
            <div className="flex-1">
              <div className="text-[14px] font-semibold">{post.author}</div>
              <div className="text-[11.5px] text-ink-tertiary">{post.time}</div>
            </div>
          </div>
          <p className="text-[14px] leading-relaxed">{post.text}</p>
          <div className="flex gap-3.5 text-[12px] text-ink-tertiary">
            <span className="flex items-center gap-1.5">
              <HeartIcon className="w-3.5 h-3.5" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageIcon className="w-3.5 h-3.5" />
              {post.replies} respostas
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
