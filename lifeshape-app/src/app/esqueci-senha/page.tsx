import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
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
            <h1 className="text-[26px] font-bold tracking-tight leading-[1.15]">Esqueci minha senha</h1>
            <p className="text-[15px] text-ink-secondary mt-2.5 leading-snug">
              Informe seu e-mail. Se ele tiver uma conta, enviaremos um link para redefinir a senha.
            </p>
          </div>
        </div>

        <div className="px-6 py-7 flex-1 flex flex-col">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
