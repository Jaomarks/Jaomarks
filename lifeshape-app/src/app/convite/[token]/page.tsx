import Link from "next/link";

import { getOptionalSession } from "@/lib/dal";
import { previewInvite, ClassroomIOAuthError, type InvitePreview } from "@/lib/classroomio/auth-client";
import { InviteForm } from "./invite-form";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.08)]">
        <div className="px-6 pt-9 flex flex-col gap-7">
          <div>
            <div className="text-[20px] font-bold tracking-tight">LIFESHAPE</div>
            <div className="text-[10px] font-semibold tracking-[0.24em] text-ink-secondary mt-0.5">
              BRASIL
            </div>
          </div>
        </div>
        <div className="px-6 py-7 flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}

function statusMessage(status: InvitePreview["invite"]["status"]): string {
  switch (status) {
    case "EXPIRED":
      return "Este link de convite expirou. Peça um novo convite ao seu líder ou coordenador.";
    case "REVOKED":
      return "Este convite foi cancelado. Peça um novo convite ao seu líder ou coordenador.";
    case "USED_UP":
      return "Este convite já foi utilizado.";
    default:
      return "Não foi possível carregar este convite.";
  }
}

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  let preview: InvitePreview;
  try {
    preview = await previewInvite(token);
  } catch (error) {
    const message =
      error instanceof ClassroomIOAuthError
        ? "Este link de convite não é válido. Verifique se copiou o link completo."
        : "Não foi possível carregar este convite. Tente novamente em instantes.";

    return (
      <Shell>
        <h1 className="text-[24px] font-bold tracking-tight leading-[1.15]">Convite não encontrado</h1>
        <p className="text-[15px] text-ink-secondary mt-2.5 leading-snug">{message}</p>
      </Shell>
    );
  }

  if (preview.invite.status !== "ACTIVE") {
    return (
      <Shell>
        <h1 className="text-[24px] font-bold tracking-tight leading-[1.15]">Convite indisponível</h1>
        <p className="text-[15px] text-ink-secondary mt-2.5 leading-snug">
          {statusMessage(preview.invite.status)}
        </p>
      </Shell>
    );
  }

  const { recipientEmail, recipientExists } = preview.inviteContext;

  if (!recipientEmail) {
    return (
      <Shell>
        <h1 className="text-[24px] font-bold tracking-tight leading-[1.15]">Link de convite incompleto</h1>
        <p className="text-[15px] text-ink-secondary mt-2.5 leading-snug">
          Peça ao seu líder ou coordenador para gerar um convite pessoal para o seu e-mail.
        </p>
      </Shell>
    );
  }

  const intro = (
    <div>
      <h1 className="text-[26px] font-bold tracking-tight leading-[1.15]">
        Você foi convidado(a) pela {preview.organization.name}
      </h1>
      <p className="text-[15px] text-ink-secondary mt-2.5 leading-snug">
        Curso: <span className="font-semibold text-ink">{preview.course.title}</span>
      </p>
    </div>
  );

  if (recipientExists) {
    const session = await getOptionalSession();
    const alreadySignedInAsRecipient = session?.info?.user.email.toLowerCase() === recipientEmail.toLowerCase();

    return (
      <Shell>
        {intro}
        <div className="mt-6 flex-1 flex flex-col">
          {alreadySignedInAsRecipient ? (
            <InviteForm inviteToken={token} mode="join-only" />
          ) : (
            <p className="text-[15px] text-ink-secondary leading-snug">
              O e-mail <span className="font-semibold text-ink">{recipientEmail}</span> já tem uma conta na
              Lifeshape.{" "}
              <Link href="/entrar" className="font-semibold text-ink underline">
                Faça login
              </Link>{" "}
              para entrar neste curso.
            </p>
          )}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {intro}
      <p className="text-[13px] text-ink-secondary mt-2">
        {recipientEmail} · crie sua senha para começar
      </p>
      <div className="mt-6 flex-1 flex flex-col">
        <InviteForm inviteToken={token} mode="sign-up" />
      </div>
    </Shell>
  );
}
