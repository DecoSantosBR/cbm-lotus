# 🚒 CBM Lotus - Sistema de Gestão de Cursos

Sistema completo de gestão de cursos, certificados e eventos para o **1º Corpo de Bombeiros Militar de Lotus** (FiveM Roleplay).

## 🎯 Funcionalidades

- ✅ **Sistema de Autenticação** via Manus OAuth
- 📋 **Gestão de Cursos** (obrigatórios e facultativos)
- 📅 **Agendamento de Eventos** com inscrições
- 📜 **Gerador de Certificados** (individual e em lote)
- 🤖 **Bot Discord** integrado
- 👥 **Gestão de Usuários** (perfis e permissões)
- 📊 **Painel Administrativo** completo

## 🚀 Deploy no Railway

### 1. Criar Novo Projeto no Railway

1. Acesse [Railway](https://railway.app/)
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório `cbm-lotus`

### 2. Configurar Variáveis de Ambiente

No Railway, vá em **Settings → Variables** e adicione:

#### Discord Bot (obrigatório)
```
DISCORD_BOT_TOKEN=seu_token_aqui
DISCORD_SERVER_ID=id_do_servidor
DISCORD_APPLICATION_ID=id_da_aplicacao
DISCORD_CLIENT_ID=id_do_cliente
DISCORD_CLIENT_SECRET=secret_do_cliente

# Canais do Discord
DISCORD_CHANNEL_EVENTS=id_canal_eventos
DISCORD_CHANNEL_CERTIFICATES=id_canal_certificados
DISCORD_CHANNEL_ENROLLMENTS=id_canal_inscricoes
```

#### Manus OAuth (gerado automaticamente pelo Railway)
```
DATABASE_URL=mysql://...
JWT_SECRET=...
VITE_APP_ID=...
OAUTH_SERVER_URL=...
VITE_OAUTH_PORTAL_URL=...
```

### 3. Popular Banco de Dados

Após o primeiro deploy, execute o script SQL:

```bash
# Conecte ao banco de dados do Railway e execute:
mysql -h [host] -u [user] -p [database] < seed-courses-lotus.sql
```

Ou use a interface do Railway para executar o SQL manualmente.

## 🤖 Configurar Bot Discord

### 1. Criar Aplicação no Discord

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em **"New Application"**
3. Nomeie como "CBM Lotus Bot"

### 2. Criar Bot

1. Na aba **"Bot"**, clique em **"Add Bot"**
2. Copie o **Token** (será o `DISCORD_BOT_TOKEN`)
3. Ative as **Privileged Gateway Intents**:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent

### 3. Configurar OAuth2

1. Na aba **"OAuth2"**, adicione Redirect URI:
   ```
   https://seu-dominio.railway.app/api/oauth/callback
   ```
2. Copie **Client ID** e **Client Secret**

### 4. Convidar Bot para o Servidor

1. Na aba **"OAuth2 → URL Generator"**
2. Selecione scopes:
   - ✅ bot
   - ✅ applications.commands
3. Selecione permissões:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Attach Files
   - ✅ Read Message History
   - ✅ Use Slash Commands
4. Copie a URL gerada e abra no navegador
5. Selecione seu servidor e autorize

## 📋 Cursos Disponíveis

### Obrigatórios
- TAF (Gratuito)
- Modulação e Conduta (Gratuito)
- MOB (R$ 200.000)
- Aerovidas (R$ 300.000)
- Mergulho (Gratuito)
- Paraquedismo (R$ 250.000)
- Resgate Montanha (R$ 300.000)
- Formação de Oficiais (Gratuito)

### Facultativos
- Águia Avançado (R$ 400.000)
- Instrutor Águia (R$ 600.000)
- Paraquedismo Avançado (R$ 500.000)
- Resgate Montanha Avançado (R$ 500.000)
- Instrutor MOB (R$ 600.000)

## 🛠️ Tecnologias

- **Frontend:** React 19 + Vite + Tailwind CSS 4
- **Backend:** Node.js + Express + tRPC
- **Banco de Dados:** MySQL (TiDB)
- **Bot:** Discord.js
- **Autenticação:** Manus OAuth
- **Hospedagem:** Railway

## 📝 Licença

MIT License - Projeto duplicado do CBM Vice City
