import { z } from "zod";
import { zoomRequestAllPages } from "../zoom-request.js";

export const listPinnedMessagesSchema = z.object({
  channel_id: z.string().describe("ID do canal para listar mensagens fixadas"),
  page_size: z.number().optional().default(50).describe("Itens por página (máx 50)"),
});

export async function listPinnedMessages({ channel_id, page_size }) {
  const messages = await zoomRequestAllPages(`/chat/channels/${channel_id}/pinned_messages`, {
    query: { page_size: Math.min(page_size, 50) },
    resultKey: "messages",
  });

  if (messages.length === 0) return "Nenhuma mensagem fixada encontrada neste canal.";

  const formatted = messages.map((m) => ({
    id: m.id,
    message: m.message || m.text || "",
    sender: m.sender || m.sender_display_name || "N/A",
    date_time: m.date_time || "N/A",
    pinned_at: m.pinned_at || "N/A",
    pinned_by: m.pinned_by || "N/A",
  }));

  return `${messages.length} mensagem(ns) fixada(s):\n\n${JSON.stringify(formatted, null, 2)}`;
}
