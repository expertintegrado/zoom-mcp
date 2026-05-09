import { z } from "zod";
import { zoomRequest } from "../zoom-request.js";

export const updateMessageSchema = z.object({
  message_id: z.string().describe("ID da mensagem a editar"),
  message: z.string().describe("Novo texto da mensagem"),
  to_channel: z.string().optional().describe("ID do canal onde está a mensagem"),
  to_contact: z.string().optional().describe("Email do contato (para DMs)"),
});

export async function updateMessage({ message_id, message, to_channel, to_contact }) {
  const body = { message };
  if (to_channel) body.to_channel = to_channel;
  if (to_contact) body.to_contact = to_contact;

  try {
    await zoomRequest("PUT", `/chat/users/me/messages/${message_id}`, { body });
    return `Mensagem ${message_id} editada com sucesso.`;
  } catch (err) {
    if (err.message?.includes("Only the sender")) {
      return "Não é possível editar esta mensagem: apenas quem enviou pode editar.";
    }
    throw err;
  }
}
