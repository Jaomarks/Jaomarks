import { requestUploadUrlAction } from "@/app/actions/exercises";

export type UploadedDocument = { fileKey: string; fileName: string; mimeType?: string; size?: number };

/**
 * Uploads a file straight from the browser to object storage via a
 * presigned URL (requestUploadUrlAction only signs the URL — same
 * generic-document flow the ClassroomIO dashboard already uses for
 * FILE_UPLOAD exercise answers). Used by both the lesson exercise panel and
 * the internship report form.
 */
export async function uploadDocument(file: File): Promise<UploadedDocument> {
  const presign = await requestUploadUrlAction(file.name, file.type || "application/octet-stream", file.size);
  if ("error" in presign) {
    throw new Error(presign.error);
  }

  const res = await fetch(presign.url, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) {
    throw new Error("Não foi possível enviar o arquivo. Tente novamente.");
  }

  return { fileKey: presign.fileKey, fileName: file.name, mimeType: file.type || undefined, size: file.size };
}
