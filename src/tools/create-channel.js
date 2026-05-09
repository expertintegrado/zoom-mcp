import { z } from "zod";
import { zoomRequest } from "../zoom-request.js";

export const createChannelSchema = z.object({
  name: z.string().describe("Nome do canal"),
  type: z.number().optional().default(1).describe("Tipo: 1=Público (padrão), 2=Privado, 3=DM"),
  members: z.array(z.string()).optional().describe("Emails dos membros a adicionar (opcional)"),
});

export async function createChannel({ name, type, members }) {
  const body = { name, type };
  if (members?.length > 0) {
    body.members = members.map((email) => ({ email }));
  }

  const data = await zoomRequest("POST", "/chat/users/me/channels", { body });
  return `Canal criado!\nID: ${data.id}\nNome: ${data.name}`;
}
