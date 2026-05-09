import { z } from "zod";
import { zoomRequest } from "../zoom-request.js";

export const inviteChannelMembersSchema = z.object({
  channel_id: z.string().describe("ID do canal"),
  members: z.array(z.string()).describe("Emails dos membros a convidar"),
});

export async function inviteChannelMembers({ channel_id, members }) {
  const body = { members: members.map((email) => ({ email })) };
  await zoomRequest("POST", `/chat/channels/${channel_id}/members`, { body });
  return `${members.length} membro(s) convidado(s) para o canal.`;
}
