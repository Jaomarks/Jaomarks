"use client";

import { useActionState } from "react";
import { acceptInviteAction } from "@/app/actions/auth";

export function InviteForm({
  inviteToken,
  mode,
}: {
  inviteToken: string;
  mode: "sign-up" | "join-only";
}) {
  const [state, action, pending] = useActionState(acceptInviteAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4 flex-1">
      <input type="hidden" name="inviteToken" value={inviteToken} />

      {mode === "sign-up" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-[13px] font-semibold text-ink-secondary">
              Nome completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="w-full rounded-[14px] border-[1.5px] border-divider px-4 py-3.5 text-[15px] outline-none focus:border-ink"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[13px] font-semibold text-ink-secondary">
              Crie uma senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              className="w-full rounded-[14px] border-[1.5px] border-divider px-4 py-3.5 text-[15px] outline-none focus:border-ink"
            />
            <span className="text-[12px] text-ink-secondary">Mínimo de 8 caracteres.</span>
          </div>
        </>
      )}

      {state?.error && (
        <p role="alert" className="text-[13px] font-medium text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-auto bg-ink text-white text-[16px] font-semibold text-center py-4 rounded-full disabled:opacity-60"
      >
        {pending ? "Enviando..." : mode === "sign-up" ? "Criar conta e entrar no curso" : "Entrar no curso"}
      </button>
    </form>
  );
}
