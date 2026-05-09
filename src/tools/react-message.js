import { z } from "zod";
import { zoomRequest } from "../zoom-request.js";

export const reactMessageSchema = z.object({
  message_id: z.string().describe("ID da mensagem"),
  emoji: z.string().describe("Emoji para reagir (ex: 'thumbsup', 'heart', '+1', ou emoji Unicode)"),
  action: z.enum(["add", "remove"]).optional().default("add").describe("Ação: add (padrão) ou remove"),
  to_channel: z.string().optional().describe("ID do canal"),
  to_contact: z.string().optional().describe("Email do contato (para DMs)"),
});

export async function reactMessage({ message_id, emoji, action, to_channel, to_contact }) {
  const body = { emoji, action };
  if (to_channel) body.to_channel = to_channel;
  if (to_contact) body.to_contact = to_contact;

  try {
    await zoomRequest("PATCH", `/chat/users/me/messages/${message_id}/emoji_reactions`, { body });
    const actionText = action === "add" ? "adicionada" : "removida";
    return `Reação ${emoji} ${actionText} na mensagem ${message_id}.`;
  } catch (err) {
    if (err.message?.includes("5301")) {
      return "Não foi possível reagir à mensagem: erro interno do Zoom (código 5301). Isso ocorre com mensagens de outros usuários em alguns planos.";
    }
    throw err;
  }
}
