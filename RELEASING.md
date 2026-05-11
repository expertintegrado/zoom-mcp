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

Em seguida, faça o push do commit e da tag específica:

```bash
git push
git push origin "v$(node -p 'require("./package.json").version')"
```

> **Por que não `git push --tags`?** Esse comando envia **todas** as tags locais, o que pode disparar workflows indesejados se houver tags antigas não publicadas. O comando acima envia só a tag da versão atual.

O workflow `.github/workflows/release.yml` dispara automaticamente:
1. Publica no npm (`@expertintegrado/zoom-mcp`)
2. Cria GitHub Release com notas geradas

## Verificação pós-release

```bash
# Acompanhar o workflow em tempo real (aguarda e mostra se passou ou falhou)
gh run watch --exit-status -R expertintegrado/zoom-mcp

# Conferir publicação no npm
npm view @expertintegrado/zoom-mcp version
```

## Falhas comuns

### "403 Forbidden" no npm publish

O secret `NPM_TOKEN` expirou ou foi revogado. Gere novo Granular Access Token no npm com **Bypass 2FA** marcado, escopo Read/Write em `@expertintegrado/zoom-mcp`, e atualize o secret:

```bash
gh secret set NPM_TOKEN -R expertintegrado/zoom-mcp
```

Depois dispare o workflow manualmente sem precisar recriar a tag:

```bash
gh workflow run release.yml -R expertintegrado/zoom-mcp
```

### "Version already published"

A tag foi recriada para a mesma versão. Não duplique publicações — bump a versão com `npm version patch` e faça nova tag.

### Workflow não dispara

Certifique-se que o push da tag foi feito com o comando exato acima. Um `git push` simples não envia tags.

### Push da tag rejeitado ("tag already exists")

A tag já existe no remote (foi criada por outro push ou manualmente). Não force-push tags — bump a versão e crie uma nova.

## Atualizar NPM_TOKEN (rotação)

1. Gere Granular Access Token no npm com escopo `@expertintegrado/zoom-mcp`, flag **Bypass 2FA** marcada
2. `gh secret set NPM_TOKEN -R expertintegrado/zoom-mcp`
3. Revogue o token anterior no npm após confirmar que o secret está ativo
