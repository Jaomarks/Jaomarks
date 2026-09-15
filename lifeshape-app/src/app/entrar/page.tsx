import Link from "next/link";
import { redirect } from "next/navigation";

import { getOptionalSession } from "@/lib/dal";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getOptionalSession();
  if (session) {
    redirect("/");
  }

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

          <div>
            <h1 className="text-[30px] font-bold tracking-tight leading-[1.15]">Entrar</h1>
            <p className="text-[15px] text-ink-secondary mt-2.5 leading-snug">
              Use o e-mail e a senha da sua conta Lifeshape.
            </p>
          </div>
        </div>

        <div className="px-6 py-7 flex-1 flex flex-col">
          <LoginForm />
        </div>

        <div className="px-6 pb-9 pt-4 text-center text-[13px] text-ink-secondary">
          Ainda não tem conta? Peça um convite ao seu líder ou coordenador.
          <br />
          <Link href="/esqueci-senha" className="font-semibold text-ink">
            Esqueci minha senha
          </Link>
        </div>
      </div>
    </div>
  );
}
