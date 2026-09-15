"use client";

import { useActionState } from "react";
import { requestPasswordResetAction } from "@/app/actions/auth";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, undefined);

  if (state?.ok) {
    return (
      <p className="text-[15px] leading-snug">
        Se esse e-mail tiver uma conta na Lifeshape, você vai receber um link para redefinir sua senha em
        instantes.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4 flex-1">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[13px] font-semibold text-ink-secondary">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-[14px] border-[1.5px] border-divider px-4 py-3.5 text-[15px] outline-none focus:border-ink"
        />
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
        {pending ? "Enviando..." : "Enviar link"}
      </button>
    </form>
  );
}
