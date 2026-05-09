import { z } from "zod";
import { zoomRequest } from "../zoom-request.js";

export const listMessagesSchema = z.object({
  to_channel: z.string().optional().describe("ID do canal para listar mensagens"),
  to_contact: z.string().optional().describe("Email do contato para listar DMs"),
  date: z.string().optional().describe("Data para filtrar (YYYY-MM-DD). Padrão: hoje."),
  page_size: z.number().optional().default(50).describe("Quantidade de mensagens (máx 50)"),
  include_deleted_and_edited_message: z.boolean().optional().describe("Incluir mensagens editadas/deletadas"),
});

export async function listMessages({ to_channel, to_contact, date, page_size, include_deleted_and_edited_message }) {
  if (!to_channel && !to_contact) {
    return "Erro: informe to_channel (ID do canal) ou to_contact (email).";
  }

  const query = { page_size: Math.min(page_size, 50) };
  if (to_channel) query.to_channel = to_channel;
  if (to_contact) query.to_contact = to_contact;
  if (date) query.date = date;
  if (include_deleted_and_edited_message) query.include_deleted_and_edited_message = true;

  const data = await zoomRequest("GET", "/chat/users/me/messages", { query });
  const messages = data.messages || [];

  if (messages.length === 0) return "Nenhuma mensagem encontrada.";

  const formatted = messages.map((m) => {
    const entry = {
      id: m.id,
      sender: m.sender || m.sender_display_name || "N/A",
      message: m.message || "",
      date_time: m.date_time || "",
    };
    if (m.reply_main_message_id) entry.reply_main_message_id = m.reply_main_message_id;
    if (m.message_type && m.message_type !== "text") entry.message_type = m.message_type;
    if (m.files?.length > 0) {
      entry.files = m.files.map((f) => ({ file_id: f.file_id, file_name: f.file_name, file_size: f.file_size }));
    } else if (m.file_id) {
      entry.files = [{ file_id: m.file_id, file_name: m.file_name || "N/A", file_size: m.file_size || 0 }];
    }
    return entry;
  });

  return `${messages.length} mensagem(ns):\n\n${JSON.stringify(formatted, null, 2)}`;
}
