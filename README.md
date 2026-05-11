# Zoom MCP — Expert Integrado

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/@expertintegrado/zoom-mcp.svg)](https://www.npmjs.com/package/@expertintegrado/zoom-mcp)

Conecta o seu **Zoom Team Chat** ao **Claude Code**. Depois de instalar, você pede coisas como *"envia uma mensagem no canal #geral"*, *"lista os meus canais do Zoom"*, *"quem são os membros do canal X?"* — e ele faz, direto no seu Zoom.

> A instalação é guiada pelo próprio Claude Code. Você só cola um prompt e passa suas credenciais quando ele pedir. Não precisa editar arquivo, não precisa mexer em JSON.

---

## Passo 1 — Instale o que precisa

Baixe e instale (uma vez só, na sua máquina):

- [Node.js 18 ou superior](https://nodejs.org/) — baixe e clique "Avançar" até o fim. **Reinicie o computador** depois.
- [Claude Code](https://claude.ai/download) — o aplicativo oficial da Anthropic.

## Passo 2 — Crie o app no Zoom Marketplace

Você precisa de um **Client ID** e um **Client Secret** do Zoom. Cole este prompt no Claude Code para receber um guia passo a passo interativo:

````text
Me guie para criar um app OAuth no Zoom Marketplace para usar o zoom-mcp
da Expert Integrado. Abra o https://marketplace.zoom.us no meu navegador
e me instrua sobre: criar app tipo "User-managed OAuth", configurar o
Redirect URI como http://localhost:4488/callback, adicionar os escopos
necessários e copiar o Client ID e o Client Secret.
````

O Claude vai abrir o Marketplace e te guiar até você ter as duas credenciais em mãos.

> **Cuidado:** essas credenciais dão acesso ao SEU Zoom. Não compartilhe, não poste em grupo. Cada pessoa deve criar o próprio app.

## Passo 3 — Peça pro Claude Code instalar

Com o **Client ID** e o **Client Secret** em mãos, abra o **Claude Code** e cole o prompt abaixo no chat (use o botão de copiar no canto do bloco):

````text
Você é um instalador automático do MCP do Zoom da Expert Integrado.
Siga esta sequência sem pular etapas:

1. Me pergunte no chat qual é o meu ZOOM_CLIENT_ID e qual é o meu
   ZOOM_CLIENT_SECRET (os dois separados), e aguarde minha resposta
   antes de continuar. Não use valores de exemplo — precisam ser as
   credenciais reais que eu vou colar.

2. Com as credenciais em mãos, rode no terminal exatamente:

   claude mcp add zoom -s user \
     -e ZOOM_CLIENT_ID=<CLIENT_ID_QUE_EU_PASSEI> \
     -e ZOOM_CLIENT_SECRET=<CLIENT_SECRET_QUE_EU_PASSEI> \
     -- npx -y @expertintegrado/zoom-mcp

   Substituindo pelos valores que eu respondi no passo 1.

3. Em seguida rode o comando de autorização OAuth:

   ZOOM_CLIENT_ID=<CLIENT_ID_QUE_EU_PASSEI> ZOOM_CLIENT_SECRET=<CLIENT_SECRET_QUE_EU_PASSEI> npx -y @expertintegrado/zoom-mcp auth

   Isso vai abrir o navegador. Avise-me quando o navegador abrir e
   aguarde eu confirmar que autorizei minha conta Zoom.

4. Confirme que a autorização funcionou e me avise para encerrar
   e reabrir o Claude Code para ativar o MCP.
````

O Claude Code vai:

1. Te perguntar o Client ID e o Client Secret → você cola os que pegou no Passo 2
2. Rodar o comando de configuração automaticamente
3. Abrir o navegador para você autorizar sua conta Zoom
4. Te avisar pra reiniciar

Quando ele pedir, **feche e abra o Claude Code** (feche o app inteiro, não só a aba).

## Passo 4 — Teste

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
