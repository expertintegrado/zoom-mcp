# Zoom MCP — Expert Integrado

Servidor MCP oficial da Expert Integrado para o **Zoom Team Chat**.

Conecta o Claude Code ao seu Zoom: envie mensagens, gerencie canais, busque contatos, acesse threads e muito mais — tudo por linguagem natural.

## O que você pode fazer

- **Canais:** listar, criar, buscar, gerenciar membros
- **Mensagens:** enviar, editar, deletar, reagir, responder em thread
- **Arquivos:** enviar e baixar arquivos/imagens
- **Contatos:** listar e buscar contatos da empresa
- **Bookmarks e mensagens fixadas:** acessar favoritos e pins de canais
- **Espaços:** listar Zoom Spaces

22 tools no total. Veja a lista completa em [docs/TOOLS.md](docs/TOOLS.md).

---

## Instalação

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [Claude Code](https://claude.ai/code) instalado

### Passo 1 — Crie o app no Zoom Marketplace

Cole este prompt no Claude Code para receber um guia passo a passo interativo:

```
Me ajude a criar um app OAuth no Zoom Marketplace para usar o zoom-mcp da Expert Integrado.
```

O Claude vai te guiar: acesse [marketplace.zoom.us](https://marketplace.zoom.us), crie um app **User-managed OAuth**, configure o Redirect URI e copie as credenciais.

> **Redirect URI a configurar:** `http://localhost:4488/callback`

### Passo 2 — Adicione o MCP ao Claude Code

Cole este prompt no Claude Code (substituindo pelos valores reais):

```
Adicione o MCP do Zoom com o comando:
claude mcp add zoom -s user -e ZOOM_CLIENT_ID=<seu_client_id> -e ZOOM_CLIENT_SECRET=<seu_client_secret> -- npx -y @expertintegrado/zoom-mcp
```

### Passo 3 — Autorize sua conta Zoom

Após adicionar o MCP, execute no terminal na pasta onde o MCP foi instalado:

```bash
ZOOM_CLIENT_ID=<seu_client_id> ZOOM_CLIENT_SECRET=<seu_client_secret> npx -y @expertintegrado/zoom-mcp auth
```

O browser vai abrir — faça login na sua conta Zoom e autorize. Isso é feito **uma única vez**.

### Passo 4 — Teste

Abra o Claude Code e pergunte:

```
zoom_status — verifique se meu Zoom está conectado
```

---

## Instalação técnica (avançada)

Ver [INSTALL.md](INSTALL.md) para modos alternativos: clone local, instalação global com `npm -g`.

---

## Segurança

- Seus tokens ficam salvos **localmente** em `tokens.json` na sua máquina
- Nenhuma credencial é enviada para servidores da Expert Integrado
- O arquivo `tokens.json` está no `.gitignore` — nunca é commitado

---

## Suporte

Abra uma [issue no GitHub](https://github.com/expertintegrado/zoom-mcp/issues).
