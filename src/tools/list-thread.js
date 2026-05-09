import { z } from "zod";
import { zoomRequest, toZoomDate } from "../zoom-request.js";

export const listThreadSchema = z.object({
  message_id: z.string().describe("ID da mensagem principal da thread"),
  to_channel: z.string().optional().describe("ID do canal"),
  to_contact: z.string().optional().describe("Email do contato (para DMs)"),
  from: z.string().optional().describe("Data inicial das respostas (YYYY-MM-DD). Padrão: 30 dias atrás."),
  page_size: z.number().optional().default(50).describe("Quantidade de respostas (máx 50)"),
});

export async function listThread({ message_id, to_channel, to_contact, from, page_size }) {
  const defaultFrom = toZoomDate(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const fromValue = from
    ? (from.includes("T") ? toZoomDate(from) : toZoomDate(from + "T00:00:00Z"))
    : defaultFrom;

  const query = { page_size: Math.min(page_size, 50), from: fromValue };
  if (to_channel) query.to_channel = to_channel;
  if (to_contact) query.to_contact = to_contact;

  const data = await zoomRequest("GET", `/chat/users/me/messages/${message_id}/thread`, { query });
  const replies = data.messages || [];

  if (replies.length === 0) return "Nenhuma resposta encontrada nesta thread.";

  const formatted = replies.map((m) => {
    const entry = {
      id: m.id,
      sender: m.sender || m.sender_display_name || "N/A",
      message: m.message || "",
      date_time: m.date_time || "",
    };
    if (m.message_type && m.message_type !== "text") entry.message_type = m.message_type;
    if (m.files?.length > 0) {
      entry.files = m.files.map((f) => ({ file_id: f.file_id, file_name: f.file_name, file_size: f.file_size }));
    }
    return entry;
  });

  return `${replies.length} resposta(s) na thread:\n\n${JSON.stringify(formatted, null, 2)}`;
}
