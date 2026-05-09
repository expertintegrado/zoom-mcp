import { z } from "zod";
import { zoomRequest } from "../zoom-request.js";

export const searchCompanyContactsSchema = z.object({
  search_key: z.string().describe("Termo de busca (nome ou email do contato)"),
  page_size: z.number().optional().default(20).describe("Quantidade máxima de resultados"),
});

export async function searchCompanyContacts({ search_key, page_size }) {
  const data = await zoomRequest("GET", "/contacts/search", {
    query: { search_key, query_presence_status: false, page_size: Math.min(page_size, 50) },
  });

  const contacts = data.contacts || [];

  if (contacts.length === 0) return `Nenhum contato encontrado para "${search_key}".`;

  const formatted = contacts.map((c) => ({
    id: c.id,
    email: c.email,
    name: c.first_name && c.last_name ? `${c.first_name} ${c.last_name}` : c.name || c.display_name || c.email,
    phone_number: c.phone_number || "N/A",
    job_title: c.job_title || "N/A",
    presence_status: c.presence_status || "N/A",
  }));

  return `${formatted.length} resultado(s) para "${search_key}":\n\n${JSON.stringify(formatted, null, 2)}`;
}
