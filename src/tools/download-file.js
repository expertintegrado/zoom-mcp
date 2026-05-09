import { z } from "zod";
import { tmpdir } from "os";
import { writeFileSync } from "fs";
import { join } from "path";
import { zoomRequest, getAccessToken } from "../zoom-request.js";

export const downloadFileSchema = z.object({
  message_id: z.string().describe("ID da mensagem que contém o arquivo"),
  to_channel: z.string().optional().describe("ID do canal onde está a mensagem"),
  to_contact: z.string().optional().describe("Email do contato (para DMs)"),
  file_index: z.number().optional().default(0).describe("Índice do arquivo (0 = primeiro) quando há múltiplos arquivos na mensagem"),
});

export async function downloadFile({ message_id, to_channel, to_contact, file_index }) {
  const query = {};
  if (to_channel) query.to_channel = to_channel;
  if (to_contact) query.to_contact = to_contact;

  const msgData = await zoomRequest("GET", `/chat/users/me/messages/${message_id}`, { query });

  let file = null;
  if (msgData.files?.length > 0) {
    if (file_index >= msgData.files.length) {
      return `A mensagem tem ${msgData.files.length} arquivo(s), mas você pediu o índice ${file_index}. Use um índice entre 0 e ${msgData.files.length - 1}.`;
    }
    file = msgData.files[file_index];
  } else if (msgData.download_url) {
    file = {
      file_id: msgData.file_id || "unknown",
      file_name: msgData.file_name || "arquivo",
      file_size: msgData.file_size || 0,
      download_url: msgData.download_url,
    };
  }

  if (!file?.download_url) {
    return "Esta mensagem não contém arquivos para download.\n\nCampos encontrados: " + JSON.stringify(Object.keys(msgData));
  }

  let response;
  try {
    response = await fetch(file.download_url, {
      headers: { Authorization: `Bearer ${await getAccessToken()}` },
      redirect: "follow",
    });
  } catch (err) {
    return `Erro ao baixar o arquivo: ${err.message}`;
  }

  if (!response.ok) {
    return `Erro HTTP ${response.status} ao baixar o arquivo "${file.file_name}".`;
  }

  const contentType = response.headers.get("content-type") || "";
  const buffer = Buffer.from(await response.arrayBuffer());

  const isImage = contentType.startsWith("image/") || /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(file.file_name);

  if (isImage) {
    const mimeType = contentType.startsWith("image/") ? contentType.split(";")[0] : "image/png";
    return {
      type: "image",
      data: buffer.toString("base64"),
      mimeType,
      caption: `📎 **${file.file_name}** (${(file.file_size / 1024).toFixed(1)} KB)\nDe: ${msgData.sender_display_name || msgData.sender || "N/A"}\nData: ${msgData.date_time || "N/A"}`,
    };
  }

  const safeName = file.file_name.replace(/[<>:"/\\|?*]/g, "_");
  const tempPath = join(tmpdir(), `zoom_${file.file_id}_${safeName}`);
  writeFileSync(tempPath, buffer);

  return (
    `📎 Arquivo baixado com sucesso!\n\n` +
    `**Nome:** ${file.file_name}\n` +
    `**Tamanho:** ${(file.file_size / 1024).toFixed(1)} KB\n` +
    `**Tipo:** ${contentType || "desconhecido"}\n` +
    `**Salvo em:** ${tempPath}\n` +
    `**De:** ${msgData.sender_display_name || msgData.sender || "N/A"}\n` +
    `**Data:** ${msgData.date_time || "N/A"}`
  );
}
