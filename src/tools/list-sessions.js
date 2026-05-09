import { z } from "zod";
import { zoomRequest } from "../zoom-request.js";

export const listSessionsSchema = z.object({
  from: z.string().optional().describe("Data inicial (YYYY-MM-DD)"),
  to: z.string().optional().describe("Data final (YYYY-MM-DD)"),
});

export async function listSessions({ from, to }) {
  const query = {};
  if (from) query.from = from;
  if (to) query.to = to;

  const data = await zoomRequest("GET", "/chat/users/me/sessions", { query });
  const sessions = data.sessions || [];

  if (sessions.length === 0) return "Nenhuma sessão recente encontrada.";

  const formatted = sessions.map((s) => ({
    session_id: s.session_id,
    name: s.name || "N/A",
    type: s.type || "N/A",
    last_message_sent_time: s.last_message_sent_time || "N/A",
  }));

  return `${sessions.length} sessão(ões) recente(s):\n\n${JSON.stringify(formatted, null, 2)}`;
}
