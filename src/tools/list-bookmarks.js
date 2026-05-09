import { z } from "zod";
import { zoomRequest, zoomRequestAllPages } from "../zoom-request.js";

export const listBookmarksSchema = z.object({
  channel_id: z.string().optional().describe("ID do canal para listar bookmarks. Se não informado, lista todos os bookmarks do usuário."),
  page_size: z.number().optional().default(50).describe("Itens por página (máx 50)"),
});

export async function listBookmarks({ channel_id, page_size }) {
  let bookmarks;

  if (channel_id) {
    bookmarks = await zoomRequestAllPages(`/chat/channels/${channel_id}/bookmarks`, {
      query: { page_size: Math.min(page_size, 50) },
      resultKey: "bookmarks",
    });
  } else {
    const data = await zoomRequest("GET", "/chat/bookmarks", {
      query: { page_size: Math.min(page_size, 50) },
    });
    bookmarks = data.bookmarks || [];
  }

  if (bookmarks.length === 0) return "Nenhum bookmark encontrado.";

  const formatted = bookmarks.map((b) => ({
    id: b.id,
    message_id: b.message_id || "N/A",
    message: b.message || b.text || "N/A",
    sender: b.sender || b.sender_display_name || "N/A",
    date_time: b.date_time || b.created_at || "N/A",
    channel_id: b.channel_id || "N/A",
  }));

  return `${bookmarks.length} bookmark(s):\n\n${JSON.stringify(formatted, null, 2)}`;
}
