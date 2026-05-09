# Referência de Tools — Zoom MCP

22 tools organizadas por área.

## Status / Onboarding

| Tool | Descrição |
|------|-----------|
| `zoom_status` | Verifica a conexão e exibe dados da conta autenticada |

## Canais

| Tool | Descrição |
|------|-----------|
| `zoom_list_channels` | Lista todos os canais do usuário |
| `zoom_get_channel` | Detalhes de um canal específico |
| `zoom_create_channel` | Cria canal (público, privado ou DM) |
| `zoom_list_channel_members` | Lista membros de um canal |
| `zoom_invite_channel_members` | Convida membros por email |
| `zoom_search_channels` | Busca canal pelo nome |

## Mensagens

| Tool | Descrição |
|------|-----------|
| `zoom_send_message` | Envia mensagem para canal ou DM, com suporte a thread |
| `zoom_send_file` | Envia arquivo (imagem, PDF, PPTX, etc) |
| `zoom_list_messages` | Lista mensagens de um canal ou DM por data |
| `zoom_get_message` | Detalhes completos de uma mensagem |
| `zoom_update_message` | Edita texto de uma mensagem própria |
| `zoom_delete_message` | Deleta uma mensagem |
| `zoom_react_message` | Adiciona ou remove reação emoji |
| `zoom_list_thread` | Lista respostas de uma thread |
| `zoom_download_file` | Baixa arquivo/imagem de mensagem |

## Contatos e Sessões

| Tool | Descrição |
|------|-----------|
| `zoom_list_contacts` | Lista contatos (empresa ou externos) |
| `zoom_search_company_contacts` | Busca contatos por nome/email via API server-side |
| `zoom_list_sessions` | Lista conversas recentes (canais + DMs) |

## Bookmarks, Mensagens Fixadas e Espaços

| Tool | Descrição |
|------|-----------|
| `zoom_list_bookmarks` | Lista bookmarks do usuário (ou de um canal) |
| `zoom_list_pinned_messages` | Lista mensagens fixadas de um canal |
| `zoom_list_shared_spaces` | Lista Zoom Spaces do usuário |

---

## Escopos OAuth necessários

Os seguintes escopos devem estar ativados no app do Zoom Marketplace:

```
team_chat:read:list_user_channels
team_chat:read:channel
team_chat:read:list_members
team_chat:write:user_channel
team_chat:write:members
team_chat:read:list_user_messages
team_chat:read:user_message
team_chat:read:thread_message
team_chat:write:user_message
team_chat:update:user_message
team_chat:delete:user_message
team_chat:update:message_emoji
team_chat:read:list_contacts
team_chat:read:contact
team_chat:read:list_user_sessions
team_chat:read:list_custom_emojis
team_chat:write:files
team_chat:write:message_files
team_chat:read:bookmark
team_chat:write:bookmark
team_chat:read:list_pinned_messages
user:read:user
user:read:email
contact:read:list_contacts
```
