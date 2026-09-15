"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/app/actions/auth";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4 flex-1">
      <input type="hidden" name="token" value={token} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="newPassword" className="text-[13px] font-semibold text-ink-secondary">
          Nova senha
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="w-full rounded-[14px] border-[1.5px] border-divider px-4 py-3.5 text-[15px] outline-none focus:border-ink"
        />
        <span className="text-[12px] text-ink-secondary">Mínimo de 8 caracteres.</span>
      </div>

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
        {pending ? "Salvando..." : "Salvar nova senha"}
      </button>
    </form>
  );
}
