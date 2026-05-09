# Runbook de Release — Zoom MCP

> **Se você é humano:** peça ao Claude Code: "siga o RELEASING.md para fazer uma release patch/minor/major"

## Pré-requisitos

Verifique antes de começar:

```bash
# Branch main atualizada
git checkout main && git pull

# Sem alterações não commitadas
git status   # deve mostrar "nothing to commit"

# Secret NPM_TOKEN configurado no repo
gh secret list -R expertintegrado/zoom-mcp | grep NPM_TOKEN
```

## Fazer a release

```bash
# Escolha o tipo:
npm version patch   # bug fix:     1.0.0 → 1.0.1
npm version minor   # nova feature: 1.0.0 → 1.1.0
npm version major   # breaking:    1.0.0 → 2.0.0
```

O comando acima:
- Cria commit com o novo número de versão no `package.json`
- Cria tag git `vX.Y.Z`

Em seguida, faça o push da tag:

```bash
git push && git push --tags
```

O workflow `.github/workflows/release.yml` dispara automaticamente:
1. Publica no npm (`@expertintegrado/zoom-mcp`)
2. Cria GitHub Release com notas geradas

## Verificação pós-release

```bash
# Ver status do workflow
gh run list -R expertintegrado/zoom-mcp --limit 3

# Conferir publicação no npm
npm view @expertintegrado/zoom-mcp version
```

## Falhas comuns

### "403 Forbidden" no npm publish
O secret `NPM_TOKEN` expirou ou foi revogado. Gere novo token no npm com **Bypass 2FA** marcado e atualize o secret:
```bash
gh secret set NPM_TOKEN -R expertintegrado/zoom-mcp
```

### "Version already published"
A tag foi recriada. Não duplique publicações — bump a versão e faça nova tag.

### Workflow não dispara
Certifique-se que o push foi com `--tags`. Um `git push` sem a flag não envia as tags.

## Atualizar NPM_TOKEN (rotação)

1. Gere Granular Access Token no npm com escopo `@expertintegrado/zoom-mcp`, flag **Bypass 2FA** marcada
2. `gh secret set NPM_TOKEN -R expertintegrado/zoom-mcp`
3. Revogue o token anterior no npm após confirmar que o secret está ativo
