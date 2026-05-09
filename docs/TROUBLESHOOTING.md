# Solução de Problemas — Zoom MCP

## "Zoom não autorizado" / ONBOARDING_MSG

**Causa:** `tokens.json` não existe — autenticação não foi feita ainda.

**Solução:**
```bash
npm run auth
```

O browser vai abrir. Faça login na sua conta Zoom e autorize. Os tokens são salvos automaticamente.

---

## "Token expirado ou inválido"

**Causa:** O `refresh_token` expirou (validade máxima: 90 dias sem uso).

**Solução:** Reautorize completamente:
```bash
rm tokens.json
npm run auth
```

---

## "Sem permissão. Verifique os escopos do app no Zoom Marketplace"

**Causa:** O app OAuth não tem os escopos necessários habilitados.

**Solução:**
1. Acesse [marketplace.zoom.us](https://marketplace.zoom.us) → Manage → seu app
2. Vá em **Scopes** e adicione todos os escopos listados em [docs/TOOLS.md](TOOLS.md)
3. Reautorize: `npm run auth`

---

## "Recurso não encontrado no Zoom" (404)

**Causa:** O ID informado (canal, mensagem, contato) não existe ou você não tem acesso.

**Solução:** Verifique o ID. Use `zoom_list_channels` ou `zoom_list_sessions` para listar IDs válidos.

---

## Browser não abre ao rodar `npm run auth`

**Causa:** Pacote `open` pode não funcionar em alguns ambientes headless.

**Solução:** Copie a URL exibida no terminal e abra manualmente no browser.

---

## Erro ao enviar arquivo: FormData

**Causa:** Node.js < 18. A tool `zoom_send_file` usa `FormData` nativo disponível apenas no Node 18+.

**Solução:** Atualize o Node.js para a versão 18 ou superior.
```bash
node --version   # deve ser >= 18.0.0
```

---

## `zoom_search_company_contacts` retorna 404 ou 403

**Causa:** O endpoint `/contacts/search` requer o escopo `contact:read:list_contacts` e pode não estar disponível em todos os planos Zoom.

**Solução alternativa:** Use `zoom_list_contacts` (type="company") que retorna todos os contatos e faz busca local.

---

## Erro 429 — Rate limit

**Causa:** Muitas requisições em pouco tempo.

**Comportamento:** O MCP faz retry automático com backoff exponencial (máx 3 tentativas).

**Solução:** Aguarde alguns segundos e tente novamente.
