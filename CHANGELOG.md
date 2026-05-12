# Changelog

Todas as mudanças notáveis deste projeto são documentadas aqui.

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
Versionamento: [Semantic Versioning](https://semver.org/lang/pt-BR/)

## [1.1.0] — 2026-05-11

### Removido

- `zoom_list_bookmarks`, `zoom_list_pinned_messages`, `zoom_list_shared_spaces`, `zoom_search_company_contacts` — endpoints não suportados pela API pública do Zoom (retornavam erro 404/403)

### Corrigido

- Prompt instalador solicita credenciais via chat (evita confusão entre letra l e número 1)
- README com suporte explícito ao Windows (PowerShell e CMD) no comando de autorização OAuth
- Guia `docs/ZOOM_APP_SETUP.md` atualizado para nova interface do Zoom Marketplace ("General App" em vez de "User-managed OAuth")

## [1.0.0] — 2026-05-09

### Adicionado

- 22 tools cobrindo Zoom Team Chat:
  - **Canais:** `zoom_list_channels`, `zoom_get_channel`, `zoom_create_channel`, `zoom_list_channel_members`, `zoom_invite_channel_members`, `zoom_search_channels`
  - **Mensagens:** `zoom_send_message`, `zoom_send_file`, `zoom_list_messages`, `zoom_get_message`, `zoom_update_message`, `zoom_delete_message`, `zoom_react_message`, `zoom_list_thread`, `zoom_download_file`
  - **Contatos e sessões:** `zoom_list_contacts`, `zoom_search_company_contacts`, `zoom_list_sessions`
  - **Bookmarks, fixadas e espaços:** `zoom_list_bookmarks`, `zoom_list_pinned_messages`, `zoom_list_shared_spaces`
  - **Status:** `zoom_status`
- Autenticação via OAuth 2.0 User-Managed com refresh automático de token
- Retry exponencial com backoff em todas as chamadas à API
- Paginação automática para endpoints paginados
- Mensagens de erro amigáveis em português
- Estrutura modular (um arquivo por tool, seguindo o padrão Expert Integrado)
