# Instalação Técnica — Zoom MCP

Para usuários técnicos que preferem controle manual.

## Modo 1 — npx (recomendado)

Sem instalação permanente. O npm baixa e executa na hora:

```bash
claude mcp add zoom -s user \
  -e ZOOM_CLIENT_ID=sua_client_id \
  -e ZOOM_CLIENT_SECRET=sua_client_secret \
  -- npx -y @expertintegrado/zoom-mcp
```

## Modo 2 — Instalação global

```bash
npm install -g @expertintegrado/zoom-mcp

claude mcp add zoom -s user \
  -e ZOOM_CLIENT_ID=sua_client_id \
  -e ZOOM_CLIENT_SECRET=sua_client_secret \
  -- zoom-mcp
```

## Modo 3 — Clone local

```bash
git clone https://github.com/expertintegrado/zoom-mcp.git
cd zoom-mcp
npm install

# Copie as credenciais
cp .env.example .env
# Edite .env com seu ZOOM_CLIENT_ID e ZOOM_CLIENT_SECRET

# Autorize (uma vez)
npm run auth

# Adicione ao Claude Code
claude mcp add zoom -s user \
  -e ZOOM_CLIENT_ID=sua_client_id \
  -e ZOOM_CLIENT_SECRET=sua_client_secret \
  -- node /caminho/absoluto/para/zoom-mcp/index.js
```

## Claude Desktop

Adicione ao `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "zoom": {
      "command": "npx",
      "args": ["-y", "@expertintegrado/zoom-mcp"],
      "env": {
        "ZOOM_CLIENT_ID": "sua_client_id",
        "ZOOM_CLIENT_SECRET": "sua_client_secret"
      }
    }
  }
}
```

> Para autenticar no Claude Desktop, execute `npm run auth` separadamente com as env vars definidas no terminal.

## Escopos necessários no Zoom Marketplace

Veja a lista completa em [docs/TOOLS.md](docs/TOOLS.md#escopos-oauth-necessários).
