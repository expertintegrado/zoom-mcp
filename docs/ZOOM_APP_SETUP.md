# Criando o app no Zoom Marketplace

Este guia detalha como criar o app OAuth necessário para o Zoom MCP.
É usado pelo Claude tanto para criação automática (via Claude in Chrome) quanto para orientação manual passo a passo.

---

## Pré-requisitos

- Conta Zoom ativa (qualquer plano)
- Acesso ao [marketplace.zoom.us](https://marketplace.zoom.us) — basta fazer login com a mesma conta Zoom

---

## Passo a passo

### 1. Acessar o Marketplace

1. Abra [marketplace.zoom.us](https://marketplace.zoom.us)
2. Clique em **Sign In** (canto superior direito) e entre com sua conta Zoom

### 2. Criar o app

1. Clique em **Develop** (menu superior) → **Build App**
2. Na lista de tipos de app, localize **User-managed app** e clique em **Create**
3. Preencha o nome do app — pode ser qualquer nome, ex: `Zoom MCP Expert`
4. Clique em **Create**

### 3. Copiar as credenciais

Na tela seguinte, você verá o **Client ID** e o **Client Secret** na seção **App Credentials**.

- Copie e guarde os dois valores — você vai precisar deles logo
- Não compartilhe essas credenciais com ninguém

### 4. Configurar o Redirect URI

1. No menu lateral esquerdo, clique em **OAuth** (ou **Redirect URLs**)
2. No campo **OAuth Redirect URL**, cole exatamente:
   ```
   http://localhost:4488/callback
   ```
3. Clique em **Continue** ou **Save**

> Se houver um campo separado para "OAuth Allow List", adicione o mesmo URL lá também.

### 5. Adicionar os escopos

1. No menu lateral, clique em **Scopes**
2. Clique em **Add Scopes**
3. Procure e adicione **cada um** dos escopos abaixo (use a busca para agilizar):

| Escopo | Para que serve |
|--------|---------------|
| `team_chat:read:list_user_channels` | Listar canais |
| `team_chat:read:channel` | Ver detalhes de um canal |
| `team_chat:read:list_members` | Ver membros de canal |
| `team_chat:write:user_channel` | Criar canais |
| `team_chat:write:members` | Convidar membros para canais |
| `team_chat:read:list_user_messages` | Listar mensagens |
| `team_chat:read:user_message` | Ler uma mensagem |
| `team_chat:read:thread_message` | Ler mensagens de thread |
| `team_chat:write:user_message` | Enviar mensagens |
| `team_chat:update:user_message` | Editar mensagens |
| `team_chat:delete:user_message` | Deletar mensagens |
| `team_chat:update:message_emoji` | Reagir a mensagens |
| `team_chat:read:list_contacts` | Listar contatos |
| `team_chat:read:contact` | Ver detalhes de contato |
| `team_chat:read:list_user_sessions` | Listar sessões de chat |
| `team_chat:read:list_custom_emojis` | Listar emojis personalizados |
| `team_chat:write:files` | Enviar arquivos |
| `team_chat:write:message_files` | Enviar arquivos em mensagens |
| `team_chat:read:bookmark` | Ver bookmarks de canal |
| `team_chat:write:bookmark` | Gerenciar bookmarks |
| `team_chat:read:list_pinned_messages` | Ver mensagens fixadas |
| `user:read:user` | Ler dados do usuário autenticado |
| `user:read:email` | Ler e-mail do usuário |
| `contact:read:list_contacts` | Buscar contatos da empresa |

4. Após adicionar todos, clique em **Continue** ou **Done**

### 6. Finalizar

1. Navegue até a aba **Activation** (ou **Local Test** / **Submit**)
2. O app não precisa ser submetido para revisão — apps User-managed funcionam em modo de teste para o próprio criador
3. Volte para a aba **App Credentials** e confirme que o **Client ID** e o **Client Secret** ainda estão visíveis

---

## Resumo dos valores necessários

Ao final, você deve ter em mãos:

- **Client ID** — sequência alfanumérica de ~22 caracteres (ex: `aBcDeFgHiJkLmNoPqRsTuV`)
- **Client Secret** — sequência alfanumérica de ~32 caracteres
- **Redirect URI configurado** — `http://localhost:4488/callback`

Esses dois valores (Client ID e Client Secret) são o que o instalador vai pedir.

---

## Problemas comuns

**"Invalid redirect URI"** durante a autorização
→ O Redirect URI no app não está exatamente igual a `http://localhost:4488/callback`. Corrija no passo 4.

**"Missing scopes"** ao usar uma tool
→ Algum escopo não foi adicionado. Volte ao Marketplace → seu app → Scopes e confira a lista completa acima.

**"Invalid client_id or client_secret"**
→ As credenciais foram copiadas com espaço ou caractere extra. Copie novamente direto do campo no Marketplace.
