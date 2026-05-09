import { z } from "zod";
import { existsSync, readFileSync } from "fs";
import { basename, extname } from "path";
import { getAccessToken, zoomRequest } from "../zoom-request.js";
import { BASE_URL } from "../config.js";

const MIME_TYPES = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".gif": "image/gif", ".webp": "image/webp", ".bmp": "image/bmp",
  ".pdf": "application/pdf",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".ppt": "application/vnd.ms-powerpoint",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".doc": "application/msword",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".txt": "text/plain", ".csv": "text/csv",
  ".zip": "application/zip", ".mp4": "video/mp4",
  ".mp3": "audio/mpeg", ".wav": "audio/wav",
};

export const sendFileSchema = z.object({
  file_path: z.string().describe("Caminho absoluto do arquivo no sistema local"),
  to_channel: z.string().optional().describe("ID do canal destino"),
  to_contact: z.string().optional().describe("Email do contato destino (para DM)"),
  reply_main_message_id: z.string().optional().describe("ID da mensagem raiz para enviar como reply em thread (opcional)"),
});

export async function sendFile({ file_path, to_channel, to_contact, reply_main_message_id }) {
  if (!to_channel && !to_contact) {
    return "Erro: informe to_channel (ID do canal) ou to_contact (email) como destino.";
  }

  if (!existsSync(file_path)) {
    return `Arquivo não encontrado: ${file_path}`;
  }

  const fileName = basename(file_path);
  const fileBuffer = readFileSync(file_path);
  const fileSize = fileBuffer.length;
  const ext = extname(fileName).toLowerCase();
  const mimeType = MIME_TYPES[ext] || "application/octet-stream";

  const formData = new FormData();
  const blob = new Blob([fileBuffer], { type: mimeType });
  formData.append("files", blob, fileName);
  if (to_channel) formData.append("to_channel", to_channel);
  if (to_contact) formData.append("to_contact", to_contact);
  if (reply_main_message_id) formData.append("reply_main_message_id", reply_main_message_id);

  const accessToken = await getAccessToken();
  const meData = await zoomRequest("GET", "/users/me");
  const userId = meData.id || "me";

  let response;
  try {
    response = await fetch(`${BASE_URL}/chat/users/${userId}/messages/files`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });
  } catch (err) {
    return `Erro de conexão ao enviar arquivo: ${err.message}`;
  }

  if (!response.ok) {
    let errDetail = "";
    try {
      const errJson = await response.json();
      errDetail = errJson.message || errJson.error || JSON.stringify(errJson);
    } catch {
      errDetail = await response.text().catch(() => "");
    }
    return `Erro HTTP ${response.status} ao enviar arquivo: ${errDetail}`;
  }

  const data = await response.json().catch(() => ({}));
  const dest = to_channel ? `canal ${to_channel}` : `contato ${to_contact}`;
  const sizeKB = (fileSize / 1024).toFixed(1);

  return (
    `✅ Arquivo enviado com sucesso!\n\n` +
    `**Arquivo:** ${fileName} (${sizeKB} KB)\n` +
    `**Destino:** ${dest}\n` +
    (data.id ? `**ID da mensagem:** ${data.id}` : "")
  );
}
