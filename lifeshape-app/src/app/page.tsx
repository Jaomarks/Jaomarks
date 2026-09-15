import { redirect } from "next/navigation";

import { requireSession } from "@/lib/dal";
import { PersonaPicker } from "./persona-picker";

export default async function OnboardingPage() {
  const { info } = await requireSession();

  // Already picked a persona on a previous visit — nothing to do here.
  if (info.persona) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.08)]">
        <PersonaPicker />
      </div>
    </div>
  );
}
