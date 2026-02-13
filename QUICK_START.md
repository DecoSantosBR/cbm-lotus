# ⚡ Quick Start - CBM Lotus

Checklist rápido para colocar o sistema no ar em 15 minutos.

---

## ✅ Checklist de Deploy

### 1. GitHub (2 minutos)
- [ ] Criar repositório `cbm-lotus` no GitHub
- [ ] Executar comandos para push:
  ```bash
  cd /home/ubuntu/cbm-lotus
  git remote add origin https://github.com/SEU_USUARIO/cbm-lotus.git
  git push -u origin main
  ```

### 2. Discord Bot (5 minutos)
- [ ] Criar aplicação no [Discord Developer Portal](https://discord.com/developers/applications)
- [ ] Criar bot e copiar token (`DISCORD_BOT_TOKEN`)
- [ ] Ativar Privileged Gateway Intents (3 checkboxes)
- [ ] Copiar Client ID e Client Secret
- [ ] Convidar bot para o servidor (OAuth2 → URL Generator)
- [ ] Copiar IDs:
  - [ ] ID do servidor (`DISCORD_SERVER_ID`)
  - [ ] ID do canal #eventos (`DISCORD_CHANNEL_EVENTS`)
  - [ ] ID do canal #certificados (`DISCORD_CHANNEL_CERTIFICATES`)
  - [ ] ID do canal #inscricoes (`DISCORD_CHANNEL_ENROLLMENTS`)

### 3. Railway (5 minutos)
- [ ] Criar novo projeto no Railway
- [ ] Deploy from GitHub → selecionar `cbm-lotus`
- [ ] Adicionar variáveis de ambiente (aba Variables):
  ```
  DISCORD_BOT_TOKEN=...
  DISCORD_SERVER_ID=...
  DISCORD_APPLICATION_ID=... (mesmo valor do Client ID)
  DISCORD_CLIENT_ID=...
  DISCORD_CLIENT_SECRET=...
  DISCORD_CHANNEL_EVENTS=...
  DISCORD_CHANNEL_CERTIFICATES=...
  DISCORD_CHANNEL_ENROLLMENTS=...
  ```
- [ ] Copiar domínio do Railway (Settings → Domains)
- [ ] Atualizar `DISCORD_REDIRECT_URI` com o domínio:
  ```
  DISCORD_REDIRECT_URI=https://SEU-DOMINIO.railway.app/api/oauth/callback
  ```
- [ ] Adicionar mesmo redirect URI no Discord Developer Portal (OAuth2 → Redirects)

### 4. Banco de Dados (3 minutos)
- [ ] Acessar banco de dados no Railway (aba Query)
- [ ] Executar SQL do arquivo `seed-courses-lotus.sql`

### 5. Testar (2 minutos)
- [ ] Verificar bot online no Discord
- [ ] Testar comando `/agenda`
- [ ] Acessar site no navegador
- [ ] Fazer login
- [ ] Promover usuário a admin:
  ```sql
  UPDATE users SET role = 'admin' WHERE openId = 'SEU_OPEN_ID';
  ```

---

## 🎉 Pronto!

Sistema no ar! Para mais detalhes, veja [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)

---

## 📝 Variáveis de Ambiente - Resumo

Copie e preencha:

```env
# Discord Bot
DISCORD_BOT_TOKEN=
DISCORD_SERVER_ID=
DISCORD_APPLICATION_ID=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=https://SEU-DOMINIO.railway.app/api/oauth/callback

# Canais Discord
DISCORD_CHANNEL_EVENTS=
DISCORD_CHANNEL_CERTIFICATES=
DISCORD_CHANNEL_ENROLLMENTS=
```

**Dica:** As outras variáveis (DATABASE_URL, JWT_SECRET, etc.) são geradas automaticamente pelo Railway.

---

## 🆘 Problemas?

Veja [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) seção "Problemas Comuns"
