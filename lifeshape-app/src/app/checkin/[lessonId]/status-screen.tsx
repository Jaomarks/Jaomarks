import Link from "next/link";
import { CheckIcon } from "@/components/icons";

// Plain presentational piece — no "use client"/"use server" needed, so
// both the server page (early "not found"/"invalid link" cases) and the
// client component (the confirm result) can render it.
export function StatusScreen({
  title,
  message,
  success,
  backHref,
}: {
  title: string;
  message: string;
  success?: boolean;
  backHref?: string;
}) {
  return (
    <div className="px-5 pt-14 pb-8 flex flex-col items-center gap-4 text-center min-h-screen">
      <div
        className={
          success
            ? "w-16 h-16 rounded-full bg-success-soft flex items-center justify-center"
            : "w-16 h-16 rounded-full bg-bg flex items-center justify-center"
        }
      >
        {success && <CheckIcon className="w-7 h-7 text-success" />}
      </div>
      <div className="text-[19px] font-bold tracking-tight">{title}</div>
      <p className="text-[14px] text-ink-secondary max-w-xs">{message}</p>
      {backHref && (
        <Link
          href={backHref}
          className="mt-2 inline-flex items-center gap-1.5 bg-ink text-white text-[14px] font-semibold px-5 py-2.5 rounded-full"
        >
          Ver aula
        </Link>
      )}
    </div>
  );
}
