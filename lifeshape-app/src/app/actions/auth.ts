"use server";

import { redirect } from "next/navigation";

import { createSession, deleteSession } from "@/lib/session";
import { requireSession, getOptionalSession } from "@/lib/dal";
import {
  acceptInvite,
  ClassroomIOAuthError,
  requestPasswordReset,
  resetPassword,
  savePersona,
  signIn,
  signOut,
} from "@/lib/classroomio/auth-client";

export type FormState = { error?: string; ok?: boolean } | undefined;

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ClassroomIOAuthError) return error.message || fallback;
  return fallback;
}

export async function signInAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  try {
    const { token } = await signIn(email, password);
    await createSession(token);
  } catch (error) {
    return { error: errorMessage(error, "Não foi possível entrar.") };
  }

  redirect("/");
}

export async function signOutAction(): Promise<void> {
  const session = await getOptionalSession();
  if (session) {
    await signOut(session.token).catch(() => {});
  }
  await deleteSession();
  redirect("/entrar");
}

export async function acceptInviteAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const inviteToken = String(formData.get("inviteToken") ?? "");
  const name = String(formData.get("name") ?? "").trim() || undefined;
  const password = String(formData.get("password") ?? "") || undefined;

  if (!inviteToken) {
    return { error: "Convite inválido." };
  }

  // Reuse an existing session if there is one — lets an already-logged-in
  // student accept a second course invite without a password prompt.
  const existing = await getOptionalSession();

  try {
    const result = await acceptInvite({ inviteToken, name, password, token: existing?.token });
    if (result.token) {
      await createSession(result.token);
    }
  } catch (error) {
    return { error: errorMessage(error, "Não foi possível aceitar o convite.") };
  }

  redirect("/");
}

export async function requestPasswordResetAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { error: "Informe seu e-mail." };
  }

  // Always the same outcome regardless of whether the e-mail exists —
  // never reveal that from the UI either.
  await requestPasswordReset(email).catch(() => {});

  return { ok: true };
}

export async function resetPasswordAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const token = String(formData.get("token") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (!token) {
    return { error: "Link inválido ou expirado. Peça um novo link de redefinição." };
  }
  if (!newPassword) {
    return { error: "Informe a nova senha." };
  }

  try {
    await resetPassword(token, newPassword);
  } catch (error) {
    return { error: errorMessage(error, "Não foi possível redefinir sua senha.") };
  }

  redirect("/entrar");
}

export async function savePersonaAction(persona: string): Promise<void> {
  const { token } = await requireSession();
  await savePersona(token, persona);
  redirect("/home");
}
