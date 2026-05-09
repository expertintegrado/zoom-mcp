import { z } from "zod";
import { zoomRequest } from "../zoom-request.js";

export const sendMessageSchema = z.object({
  message: z.string().describe("Texto da mensagem"),
  to_channel: z.string().optional().describe("ID do canal destino (usar para mensagens em canal)"),
  to_contact: z.string().optional().describe("Email do contato destino (usar para DM)"),
  reply_main_message_id: z.string().optional().describe("ID da mensagem principal para responder em thread (opcional)"),
});

export async function sendMessage({ message, to_channel, to_contact, reply_main_message_id }) {
  if (!to_channel && !to_contact) {
    return "Erro: informe to_channel (ID do canal) ou to_contact (email) como destino.";
  }

  const body = { message };
  if (to_channel) body.to_channel = to_channel;
  if (to_contact) body.to_contact = to_contact;
  if (reply_main_message_id) body.reply_main_message_id = reply_main_message_id;

  try {
    const data = await zoomRequest("POST", "/chat/users/me/messages", { body });
    const dest = to_channel ? `canal ${to_channel}` : `contato ${to_contact}`;
    let msg = `Mensagem enviada para ${dest}.`;
    if (data.id) msg += ` ID: ${data.id}`;
    if (reply_main_message_id) msg += ` (reply na thread de ${reply_main_message_id})`;
    return msg;
  } catch (err) {
    if (reply_main_message_id && err.message?.includes("main message")) {
      return (
        `Erro ao responder na thread: o ID "${reply_main_message_id}" não é uma mensagem principal.\n\n` +
        "**Dica:** Use o ID da PRIMEIRA mensagem do tópico. Se a mensagem que você tem tem o campo " +
        "`reply_main_message_id`, use ESSE valor como destino do reply — ele é o ID raiz da thread."
      );
    }
    throw err;
  }
}
