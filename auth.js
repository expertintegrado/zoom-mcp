/**
 * auth.js — Autorização OAuth 2.0 do Zoom MCP
 *
 * Execute uma vez para autorizar o MCP a acessar sua conta Zoom:
 *   npm run auth
 *
 * O browser vai abrir, faça login no Zoom e autorize.
 * Os tokens são salvos em tokens.json e renovados automaticamente.
 */

import { createServer } from "http";
import { writeFileSync } from "fs";
import open from "open";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, TOKENS_PATH, SCOPES } from "./src/config.js";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "ERRO: Variáveis de ambiente obrigatórias não definidas.\n" +
    "Defina: ZOOM_CLIENT_ID e ZOOM_CLIENT_SECRET\n\n" +
    "Exemplo:\n" +
    "  ZOOM_CLIENT_ID=xxx ZOOM_CLIENT_SECRET=yyy npm run auth"
  );
  process.exit(1);
}

const AUTH_URL =
  `https://zoom.us/oauth/authorize?response_type=code&client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES.join(" "))}`;

console.log("Abrindo browser para autorização do Zoom...\n");
console.log(`Se o browser não abrir, acesse manualmente:\n${AUTH_URL}\n`);

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:4488");

  if (url.pathname !== "/callback") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<h1>Erro na autorização</h1><p>${error}</p>`);
    console.error(`Erro: ${error}`);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Erro</h1><p>Código de autorização não recebido.</p>");
    server.close();
    process.exit(1);
  }

  console.log("Código recebido. Trocando por tokens...");

  try {
    const tokenResponse = await fetch("https://zoom.us/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      throw new Error(`HTTP ${tokenResponse.status}: ${errText}`);
    }

    const tokenData = await tokenResponse.json();
    const tokens = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      scope: tokenData.scope,
      created_at: Date.now(),
    };

    writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));

    console.log("\n✅ Tokens salvos com sucesso!");
    console.log(`   Expira em: ${tokens.expires_in}s`);
    console.log(`   Scopes: ${tokens.scope}`);
    console.log("\nAutorização concluída! O MCP está pronto para usar.");

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      "<html><body style='font-family:sans-serif;text-align:center;padding:60px'>" +
      "<h1 style='color:#2D8CFF'>&#10004; Zoom MCP Autorizado!</h1>" +
      "<p>Tokens salvos com sucesso. Você pode fechar esta aba.</p>" +
      "</body></html>"
    );
  } catch (err) {
    console.error("Erro ao trocar código por tokens:", err.message);
    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<h1>Erro</h1><p>${err.message}</p>`);
  }

  setTimeout(() => { server.close(); process.exit(0); }, 1000);
});

server.listen(4488, () => {
  console.log("Aguardando callback em http://localhost:4488/callback\n");
  open(AUTH_URL);
});
