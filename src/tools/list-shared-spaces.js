import { z } from "zod";
import { zoomRequestAllPages } from "../zoom-request.js";

export const listSharedSpacesSchema = z.object({
  page_size: z.number().optional().default(50).describe("Itens por página (máx 50)"),
});

export async function listSharedSpaces({ page_size }) {
  const spaces = await zoomRequestAllPages("/chat/users/me/spaces", {
    query: { page_size: Math.min(page_size, 50) },
    resultKey: "spaces",
  });

  if (spaces.length === 0) return "Nenhum espaço compartilhado encontrado.";

  const formatted = spaces.map((s) => ({
    id: s.id,
    name: s.name || "N/A",
    type: s.type || "N/A",
    description: s.description || "",
    members_count: s.members_count ?? "N/A",
    created_at: s.created_at || "N/A",
  }));

  return `${spaces.length} espaço(s) compartilhado(s):\n\n${JSON.stringify(formatted, null, 2)}`;
}
