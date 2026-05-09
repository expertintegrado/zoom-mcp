import { z } from "zod";
import { zoomRequestAllPages } from "../zoom-request.js";

export const listChannelsSchema = z.object({
  page_size: z.number().optional().default(50).describe("Itens por página (máx 50)"),
});

export async function listChannels({ page_size }) {
  const channels = await zoomRequestAllPages("/chat/users/me/channels", {
    query: { page_size: Math.min(page_size, 50) },
    resultKey: "channels",
  });

  if (channels.length === 0) return "Nenhum canal encontrado.";

  const formatted = channels.map((ch) => ({
    id: ch.id,
    name: ch.name,
    type: ch.type === 1 ? "Público" : ch.type === 2 ? "Privado" : ch.type === 3 ? "DM" : `Tipo ${ch.type}`,
    members: ch.channel_settings?.members_count ?? "N/A",
  }));

  return `${channels.length} canal(is) encontrado(s):\n\n${JSON.stringify(formatted, null, 2)}`;
}
