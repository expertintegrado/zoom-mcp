import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
export const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
export const REDIRECT_URI = process.env.ZOOM_REDIRECT_URI || "http://localhost:4488/callback";
export const BASE_URL = "https://api.zoom.us/v2";
export const TOKENS_PATH = join(__dirname, "..", "tokens.json");

export const SCOPES = [
  "team_chat:read:list_user_channels",
  "team_chat:read:channel",
  "team_chat:read:list_members",
  "team_chat:write:user_channel",
  "team_chat:write:members",
  "team_chat:read:list_user_messages",
  "team_chat:read:user_message",
  "team_chat:read:thread_message",
  "team_chat:write:user_message",
  "team_chat:update:user_message",
  "team_chat:delete:user_message",
  "team_chat:update:message_emoji",
  "team_chat:read:list_contacts",
  "team_chat:read:contact",
  "team_chat:read:list_user_sessions",
  "team_chat:read:list_custom_emojis",
  "team_chat:write:files",
  "team_chat:write:message_files",
  "user:read:user",
  "user:read:email",
];

export const ONBOARDING_MSG =
  "⚠️ Zoom não autorizado. Você precisa fazer login na sua conta Zoom.\n\n" +
  "**Para autorizar, execute no terminal:**\n" +
  "```\n" +
  "npm run auth\n" +
  "```\n\n" +
  "O browser vai abrir — faça login na sua conta Zoom e autorize o acesso.\n" +
  "Após autorizar, volte aqui e tente novamente.\n\n" +
  "Obs: isso é feito **uma única vez**. O token renova automaticamente depois.\n\n" +
  "Se ainda não configurou as credenciais, veja o README: https://github.com/expertintegrado/zoom-mcp#readme";
