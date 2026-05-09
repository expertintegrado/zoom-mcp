# Instruções para o Claude Code neste repositório

Este arquivo direciona tarefas comuns para a documentação correspondente.

## Mapa de tarefas

| Quando o usuário pedir... | Leia e siga |
|---|---|
| "Implemente X", "corrija o bug Y", "adicione a feature Z" | [CONTRIBUTING.md](CONTRIBUTING.md) |
| "Faça uma release", "publica uma versão nova", "bump patch/minor/major" | [RELEASING.md](RELEASING.md) |
| "Como instalar/configurar o MCP" | [README.md](README.md) |
| "Não está funcionando", erros em runtime | [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) |
| "O que faz a tool X?", "quais tools existem?" | [docs/TOOLS.md](docs/TOOLS.md) |

---

## Invariantes do repositório

1. **Nunca push direto na `main`.** Toda mudança passa por Pull Request.
2. **Nunca `npm publish` manual.** Publicação é automática via `.github/workflows/release.yml` (tag `v*`).
3. **`package.json.version`, tag git e entrada em `CHANGELOG.md` devem estar sempre sincronizados.**
4. **Sem segredos no código.** `tokens.json` e `.env` estão no `.gitignore` — nunca comitar.
5. **Dependências mínimas.** O pacote é instalado via `npx` — cada dep adicional atrasa startup.
6. **ESM only** (`"type": "module"`), **Node.js 18+**, sem build step.

---

## Estrutura do projeto

```
zoom-mcp/
├── index.js              # Orquestrador — registra todas as tools
├── auth.js               # OAuth 2.0 User-Managed (roda uma vez)
├── src/
│   ├── config.js         # Env vars, constantes, scopes, ONBOARDING_MSG
│   ├── zoom-request.js   # zoomRequest, zoomRequestAllPages, token management
│   └── tools/            # 22 arquivos — uma tool por arquivo
├── docs/TOOLS.md         # Referência completa de todas as tools
├── docs/TROUBLESHOOTING.md
├── CONTRIBUTING.md
├── RELEASING.md
└── .github/workflows/release.yml
```

---

## Padrões de código

- Cada tool exporta: `export const <nome>Schema = z.object({...})` e `export async function <nome>({...})`
- O `index.js` importa tudo e registra via `tool(name, description, schema, handler)`
- Mensagens de retorno: string em PT-BR (ou objeto `{type: "image", ...}` para imagens)
- Erros devem ser lançados — o wrapper em `index.js` trata e retorna `isError: true`
- Nunca duplicar lógica de HTTP — sempre usar `zoomRequest` / `zoomRequestAllPages`

---

## Contexto rápido

- **O que é:** servidor MCP para Zoom Team Chat
- **npm:** `@expertintegrado/zoom-mcp`
- **Instalação:** `npx -y @expertintegrado/zoom-mcp`
- **Auth:** OAuth 2.0 User-Managed — o usuário cria um app no Zoom Marketplace, roda `npm run auth` uma vez
- **22 tools** cobrindo canais, mensagens, arquivos, contatos, bookmarks, mensagens fixadas, espaços

---

## Preferências

- Respostas e commits em **português brasileiro**
- Commits: imperativo, foco no **porquê**
- Prefixos: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`
