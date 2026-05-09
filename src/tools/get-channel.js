import { z } from "zod";
import { zoomRequest } from "../zoom-request.js";

export const getChannelSchema = z.object({
  channel_id: z.string().describe("ID do canal (obtido via zoom_list_channels)"),
});

export async function getChannel({ channel_id }) {
  const data = await zoomRequest("GET", `/chat/channels/${channel_id}`);
  return JSON.stringify(data, null, 2);
}
