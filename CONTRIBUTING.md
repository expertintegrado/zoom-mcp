# Contribuindo com o Zoom MCP

## Fluxo de desenvolvimento

1. Fork ou clone o repositório
2. Crie uma branch: `git checkout -b feat/nome-da-feature`
3. Faça as mudanças
4. Teste localmente (veja abaixo)
5. Abra um Pull Request para `main`

## Regras obrigatórias

- **Não publicar manualmente.** Publicação é automática via workflow (tag `v*`).
- **Não commitar segredos.** `.env`, `tokens.json` e credenciais não entram no repo.
- **Dependências mínimas.** O pacote é distribuído via `npx` — toda dep nova atrasa startup.
- **Uma tool por arquivo** em `src/tools/`. Exporte `<nome>Schema` e `<nome>` (função).
- **Registrar no `index.js`** via `tool(name, description, schema, handler)`.

## Testando localmente

```bash
npm install
cp .env.example .env
# Preencha .env com suas credenciais de desenvolvimento

npm run auth           # Autorize uma vez
npm start              # Inicia o MCP localmente
```

Para testar via Claude Code:
```bash
claude mcp add zoom-dev -s local \
  -e ZOOM_CLIENT_ID=xxx -e ZOOM_CLIENT_SECRET=yyy \
  -- node /caminho/absoluto/zoom-mcp/index.js
```

## Adicionando uma nova tool

1. Crie `src/tools/minha-tool.js`:

```js
import { z } from "zod";
import { zoomRequest } from "../zoom-request.js";

export const minhaToolSchema = z.object({
  param: z.string().describe("Descrição do parâmetro"),
});

export async function minhaTool({ param }) {
  const data = await zoomRequest("GET", `/endpoint/${param}`);
  return JSON.stringify(data, null, 2);
}
```

2. Importe e registre em `index.js`:

```js
import { minhaTool, minhaToolSchema } from "./src/tools/minha-tool.js";
// ...
tool("zoom_minha_tool", "Descrição da tool", minhaToolSchema, minhaTool);
```

3. Documente em `docs/TOOLS.md`.

## Estilo de commits

- Português brasileiro
- Imperativo: "adiciona tool X", "corrige bug de paginação em Y"
- Prefixos: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`
