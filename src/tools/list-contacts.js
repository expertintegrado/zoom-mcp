import { z } from "zod";
import { zoomRequestAllPages } from "../zoom-request.js";

export const listContactsSchema = z.object({
  type: z.enum(["company", "external"]).optional().default("company").describe("Tipo: company (mesma org, padrão) ou external"),
  page_size: z.number().optional().default(50).describe("Itens por página (máx 50)"),
});

export async function listContacts({ type, page_size }) {
  const contacts = await zoomRequestAllPages("/chat/users/me/contacts", {
    query: { type, page_size: Math.min(page_size, 50) },
    resultKey: "contacts",
  });

  if (contacts.length === 0) return "Nenhum contato encontrado.";

  const formatted = contacts.map((c) => ({
    id: c.id,
    email: c.email,
    name: c.first_name && c.last_name ? `${c.first_name} ${c.last_name}` : c.name || c.email,
    presence_status: c.presence_status || "N/A",
  }));

  return `${contacts.length} contato(s):\n\n${JSON.stringify(formatted, null, 2)}`;
}
