# Zoom MCP — Expert Integrado

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/@expertintegrado/zoom-mcp.svg)](https://www.npmjs.com/package/@expertintegrado/zoom-mcp)

Conecta o seu **Zoom Team Chat** ao **Claude Code**. Depois de instalar, você pede coisas como *"envia uma mensagem no canal #geral"*, *"lista os meus canais do Zoom"*, *"quem são os membros do canal X?"* — e ele faz, direto no seu Zoom.

> A instalação é guiada pelo próprio Claude Code. Você só cola um prompt e ele cuida do resto. Não precisa editar arquivo, não precisa mexer em JSON.

---

## Passo 1 — Instale o que precisa

Baixe e instale (uma vez só, na sua máquina):

- [Node.js 18 ou superior](https://nodejs.org/) — baixe e clique "Avançar" até o fim. **Reinicie o computador** depois.
- [Claude Code](https://claude.ai/download) — o aplicativo oficial da Anthropic.

## Passo 2 — Peça pro Claude Code instalar

Abra o **Claude Code** e cole o prompt abaixo no chat (use o botão de copiar no canto do bloco):

````text
Você é um instalador automático do MCP do Zoom da Expert Integrado.
Siga esta sequência sem pular etapas:

1. Me pergunte: "Você tem a extensão Claude in Chrome instalada no seu
   navegador e quer que eu crie o app no Zoom Marketplace por você
   automaticamente? Ou prefere fazer manualmente com minha orientação?"
   Aguarde minha resposta antes de continuar.

2. Com base na minha resposta, siga o guia detalhado em:
   https://github.com/expertintegrado/zoom-mcp/blob/main/docs/ZOOM_APP_SETUP.md

   OPÇÃO AUTOMÁTICA (Claude in Chrome):
   - Leia o guia acima e execute cada passo no navegador
   - Ao final, informe o Client ID e o Client Secret que aparecerem na
     tela App Credentials

   OPÇÃO MANUAL (orientação passo a passo):
   - Leia o guia acima e me instrua a seguir cada passo
   - Aguarde eu confirmar que tenho o Client ID e o Client Secret
     antes de continuar

3. Com o Client ID e o Client Secret em mãos (de qualquer opção acima),
   rode no terminal exatamente:

   claude mcp add zoom -s user \
     -e ZOOM_CLIENT_ID=<CLIENT_ID> \
     -e ZOOM_CLIENT_SECRET=<CLIENT_SECRET> \
     -- npx -y @expertintegrado/zoom-mcp

   Substituindo pelos valores reais.

4. Em seguida rode o comando de autorização OAuth:

   ZOOM_CLIENT_ID=<CLIENT_ID> ZOOM_CLIENT_SECRET=<CLIENT_SECRET> npx -y @expertintegrado/zoom-mcp auth

   Isso vai abrir o navegador. Avise-me quando o navegador abrir e
   aguarde eu confirmar que autorizei minha conta Zoom.

5. Confirme que a autorização funcionou e me avise para encerrar
   e reabrir o Claude Code para ativar o MCP.
````

> **Cuidado:** as credenciais do Zoom dão acesso ao SEU Zoom. Não compartilhe, não poste em grupo. Cada pessoa deve criar o próprio app.

Quando ele pedir, **feche e abra o Claude Code** (feche o app inteiro, não só a aba).

## Passo 3 — Teste

Com o Claude Code reaberto, pergunte:

> Liste meus canais do Zoom.

Se ele responder com os canais, tá funcionando. 🎉

---

## Atualizando o MCP

Quando sair versão nova, o `npx` pega automaticamente na próxima inicialização — não precisa fazer nada. Se quiser forçar agora, peça ao Claude Code:

> Limpa o cache do npx do Zoom MCP (roda `npm cache clean --force`) e me avisa pra reiniciar o Claude Code.

## Não funcionou?

Cole isso no Claude Code:

> O MCP do Zoom da Expert Integrado não está funcionando. Roda `/mcp` pra verificar se ele tá listado, confere se o Node.js 18+ está instalado, e me ajuda a diagnosticar. Se precisar, consulta o guia em `https://github.com/expertintegrado/zoom-mcp/blob/main/docs/TROUBLESHOOTING.md`.

Se mesmo assim não rolar, [abra uma issue](https://github.com/expertintegrado/zoom-mcp/issues/new/choose) contando o que aconteceu.

## O que dá pra fazer

Exemplos depois de instalado:

- *"Envia uma mensagem no canal #marketing dizendo que a reunião foi remarcada"*
- *"Lista todos os canais que faço parte"*
- *"Quem são os membros do canal #vendas?"*
- *"Mostra as últimas mensagens do canal #geral"*
- *"Reage com 👍 na última mensagem do canal #produto"*
- *"Busca o canal chamado 'projetos'"*

Lista completa de comandos: [docs/TOOLS.md](docs/TOOLS.md)

## Instalação técnica (avançada)

Ver [INSTALL.md](INSTALL.md) para modos alternativos: clone local, instalação global com `npm -g`.

## Segurança

- Seus tokens ficam salvos **localmente** em `tokens.json` na sua máquina
- Nenhuma credencial é enviada para servidores da Expert Integrado
- O arquivo `tokens.json` está no `.gitignore` — nunca é commitado

## Contribuindo

Quer reportar um bug, sugerir uma melhoria ou contribuir com código? Veja [CONTRIBUTING.md](CONTRIBUTING.md) e, para o procedimento de release, [RELEASING.md](RELEASING.md).

## Licença

[MIT](LICENSE) © Expert Integrado
