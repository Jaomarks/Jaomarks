import type { ReactNode } from "react";
import { BottomNav } from "@/components/bottom-nav";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#e8e8ed] flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen bg-bg flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.08)]">
        <div className="flex-1">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
