import { z } from "zod";
import { zoomRequest } from "../zoom-request.js";

export const deleteMessageSchema = z.object({
  message_id: z.string().describe("ID da mensagem a deletar"),
  to_channel: z.string().optional().describe("ID do canal onde está a mensagem"),
  to_contact: z.string().optional().describe("Email do contato (para DMs)"),
});

export async function deleteMessage({ message_id, to_channel, to_contact }) {
  const query = {};
  if (to_channel) query.to_channel = to_channel;
  if (to_contact) query.to_contact = to_contact;

  await zoomRequest("DELETE", `/chat/users/me/messages/${message_id}`, { query });
  return `Mensagem ${message_id} deletada.`;
}
