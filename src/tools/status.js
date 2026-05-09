import { zoomRequest } from "../zoom-request.js";
import { ONBOARDING_MSG } from "../config.js";
import { isAuthorized } from "../zoom-request.js";

export const statusSchema = {};

export async function status() {
  if (!isAuthorized()) return ONBOARDING_MSG;

  try {
    const data = await zoomRequest("GET", "/users/me");
    return (
      "✅ Zoom conectado!\n\n" +
      `**Usuário:** ${data.first_name || ""} ${data.last_name || ""}\n` +
      `**Email:** ${data.email || "N/A"}\n` +
      `**Conta:** ${data.account_id || "N/A"}\n` +
      `**Tipo:** ${data.type === 1 ? "Basic" : data.type === 2 ? "Licensed" : `Tipo ${data.type}`}\n` +
      `**Status:** ${data.status || "N/A"}`
    );
  } catch (err) {
    return `⚠️ Tokens encontrados mas a conexão falhou: ${err.message}\n\nTente rodar \`npm run auth\` novamente.`;
  }
}
