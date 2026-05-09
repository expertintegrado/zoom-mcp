import { z } from "zod";
import { zoomRequestAllPages } from "../zoom-request.js";

export const searchChannelsSchema = z.object({
  search_key: z.string().describe("Termo de busca (nome ou parte do nome do canal)"),
  page_size: z.number().optional().default(20).describe("Quantidade máxima de resultados"),
});

export async function searchChannels({ search_key, page_size }) {
  const allChannels = await zoomRequestAllPages("/chat/users/me/channels", {
    resultKey: "channels",
  });

  const term = search_key.toLowerCase();
  const filtered = allChannels
    .filter((ch) => (ch.name || "").toLowerCase().includes(term))
    .slice(0, page_size);

  if (filtered.length === 0) return `Nenhum canal encontrado para "${search_key}".`;

  const formatted = filtered.map((ch) => ({
    id: ch.id,
    name: ch.name,
    type: ch.type === 1 ? "Público" : ch.type === 2 ? "Privado" : ch.type === 3 ? "DM" : `Tipo ${ch.type}`,
    members: ch.channel_settings?.members_count ?? "N/A",
  }));

  return `${filtered.length} canal(is) encontrado(s) para "${search_key}":\n\n${JSON.stringify(formatted, null, 2)}`;
}
