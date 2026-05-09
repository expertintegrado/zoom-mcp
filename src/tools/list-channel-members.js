import { z } from "zod";
import { zoomRequestAllPages } from "../zoom-request.js";

export const listChannelMembersSchema = z.object({
  channel_id: z.string().describe("ID do canal"),
});

export async function listChannelMembers({ channel_id }) {
  const members = await zoomRequestAllPages(`/chat/channels/${channel_id}/members`, {
    resultKey: "members",
  });

  if (members.length === 0) return "Nenhum membro encontrado neste canal.";

  const formatted = members.map((m) => ({
    id: m.id,
    email: m.email,
    name: m.first_name && m.last_name ? `${m.first_name} ${m.last_name}` : m.name || m.email,
    role: m.role,
  }));

  return `${members.length} membro(s):\n\n${JSON.stringify(formatted, null, 2)}`;
}
