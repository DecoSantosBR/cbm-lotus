# 🚀 Guia Completo de Deploy - CBM Lotus

Este guia te levará passo a passo pelo processo de deploy do sistema CBM Lotus no Railway.

---

## 📋 Pré-requisitos

Antes de começar, você precisará:

1. ✅ Conta no [GitHub](https://github.com)
2. ✅ Conta no [Railway](https://railway.app)
3. ✅ Servidor Discord criado
4. ✅ Conta no [Discord Developer Portal](https://discord.com/developers/applications)

---

## 🔧 Parte 1: Configurar Repositório GitHub

### 1.1 Criar Novo Repositório

1. Acesse [GitHub](https://github.com/new)
2. Preencha:
   - **Repository name:** `cbm-lotus`
   - **Description:** "Sistema de Gestão de Cursos - CBM Lotus"
   - **Visibility:** Private (recomendado) ou Public
3. **NÃO** marque "Initialize with README" (já temos um)
4. Clique em **"Create repository"**

### 1.2 Conectar Repositório Local

Após criar o repositório, copie os comandos que o GitHub mostra e execute:

```bash
cd /home/ubuntu/cbm-lotus
git remote add origin https://github.com/SEU_USUARIO/cbm-lotus.git
git branch -M main
git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub!**

---

## 🤖 Parte 2: Configurar Bot Discord

### 2.1 Criar Aplicação Discord

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em **"New Application"**
3. Nome: **"CBM Lotus Bot"**
4. Clique em **"Create"**

### 2.2 Configurar Bot

1. No menu lateral, clique em **"Bot"**
2. Clique em **"Add Bot"** → **"Yes, do it!"**
3. **IMPORTANTE:** Clique em **"Reset Token"** e copie o token
   - ⚠️ **Guarde este token! Você precisará dele no Railway**
   - Este é o `DISCORD_BOT_TOKEN`

4. **Ative as Privileged Gateway Intents:**
   - ✅ **Presence Intent**
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**

5. Clique em **"Save Changes"**

### 2.3 Configurar OAuth2

1. No menu lateral, clique em **"OAuth2"** → **"General"**
2. Copie e guarde:
   - **Client ID** (este é o `DISCORD_CLIENT_ID` e `DISCORD_APPLICATION_ID`)
   - **Client Secret** (clique em "Reset Secret" para gerar, este é o `DISCORD_CLIENT_SECRET`)

3. Em **"Redirects"**, clique em **"Add Redirect"**
   - **Por enquanto, deixe em branco** (voltaremos aqui depois do deploy no Railway)

### 2.4 Convidar Bot para o Servidor

1. No menu lateral, clique em **"OAuth2"** → **"URL Generator"**
2. Em **"Scopes"**, selecione:
   - ✅ `bot`
   - ✅ `applications.commands`

3. Em **"Bot Permissions"**, selecione:
   - ✅ **Send Messages**
   - ✅ **Embed Links**
   - ✅ **Attach Files**
   - ✅ **Read Message History**
   - ✅ **Use Slash Commands**
   - ✅ **Manage Messages** (opcional, para limpar mensagens)

4. Copie a **URL gerada** no final da página
5. Cole a URL no navegador e selecione seu servidor Discord
6. Clique em **"Autorizar"**

### 2.5 Obter IDs do Discord

Você precisará dos IDs do servidor e dos canais:

1. **Ativar Modo Desenvolvedor no Discord:**
   - Abra Discord → Configurações → Avançado
   - Ative **"Modo Desenvolvedor"**

2. **Copiar ID do Servidor:**
   - Clique com botão direito no nome do servidor
   - Clique em **"Copiar ID do servidor"**
   - Este é o `DISCORD_SERVER_ID`

3. **Criar e Copiar IDs dos Canais:**
   - Crie 3 canais de texto no seu servidor:
     - `#eventos` (para anúncios de eventos)
     - `#certificados` (para publicar certificados)
     - `#inscricoes` (para notificações de inscrições)
   
   - Para cada canal, clique com botão direito → **"Copiar ID do canal"**
   - Guarde os IDs:
     - `DISCORD_CHANNEL_EVENTS` = ID do canal #eventos
     - `DISCORD_CHANNEL_CERTIFICATES` = ID do canal #certificados
     - `DISCORD_CHANNEL_ENROLLMENTS` = ID do canal #inscricoes

---

## 🚂 Parte 3: Deploy no Railway

### 3.1 Criar Projeto no Railway

1. Acesse [Railway](https://railway.app)
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Se for a primeira vez, autorize o Railway a acessar seu GitHub
5. Selecione o repositório **`cbm-lotus`**
6. Railway começará o deploy automaticamente

### 3.2 Configurar Variáveis de Ambiente

1. No painel do Railway, clique no serviço **`cbm-lotus`**
2. Clique na aba **"Variables"**
3. Clique em **"New Variable"** e adicione **TODAS** as variáveis abaixo:

#### Discord Bot (use os valores que você copiou)
```
DISCORD_BOT_TOKEN=seu_token_do_bot_aqui
DISCORD_SERVER_ID=id_do_seu_servidor
DISCORD_APPLICATION_ID=mesmo_valor_do_client_id
DISCORD_CLIENT_ID=client_id_copiado
DISCORD_CLIENT_SECRET=client_secret_copiado
DISCORD_CHANNEL_EVENTS=id_do_canal_eventos
DISCORD_CHANNEL_CERTIFICATES=id_do_canal_certificados
DISCORD_CHANNEL_ENROLLMENTS=id_do_canal_inscricoes
```

#### Redirect URI (voltaremos aqui depois)
```
DISCORD_REDIRECT_URI=https://seu-dominio.railway.app/api/oauth/callback
```
**⚠️ Por enquanto, deixe vazio. Atualizaremos após obter o domínio do Railway.**

4. Clique em **"Deploy"** para aplicar as variáveis

### 3.3 Obter Domínio do Railway

1. Após o deploy concluir, vá na aba **"Settings"**
2. Em **"Domains"**, você verá algo como:
   ```
   cbm-lotus-production.up.railway.app
   ```
3. **Copie este domínio!**

### 3.4 Atualizar Redirect URI

1. **No Discord Developer Portal:**
   - Volte em **OAuth2** → **General** → **Redirects**
   - Adicione: `https://SEU-DOMINIO.railway.app/api/oauth/callback`
   - Substitua `SEU-DOMINIO` pelo domínio que você copiou
   - Clique em **"Save Changes"**

2. **No Railway:**
   - Volte em **Variables**
   - Atualize `DISCORD_REDIRECT_URI` com o valor completo:
     ```
     DISCORD_REDIRECT_URI=https://SEU-DOMINIO.railway.app/api/oauth/callback
     ```
   - Clique em **"Deploy"** novamente

---

## 🗄️ Parte 4: Configurar Banco de Dados

### 4.1 Acessar Banco de Dados

1. No painel do Railway, clique no serviço de banco de dados (MySQL/TiDB)
2. Clique na aba **"Connect"**
3. Copie as credenciais de conexão

### 4.2 Popular Cursos

Você tem duas opções:

#### Opção A: Via Interface do Railway

1. No Railway, clique no banco de dados → aba **"Query"**
2. Cole o conteúdo do arquivo `seed-courses-lotus.sql`
3. Clique em **"Execute"**

#### Opção B: Via MySQL Client

```bash
mysql -h [host] -u [user] -p [database] < seed-courses-lotus.sql
```

---

## ✅ Parte 5: Testar o Sistema

### 5.1 Verificar Bot Online

1. Abra seu servidor Discord
2. Verifique se o bot **"CBM Lotus Bot"** está online (bolinha verde)
3. Digite `/` e veja se os comandos aparecem:
   - `/agenda` - Ver eventos agendados
   - `/ajuda` - Ver comandos disponíveis

### 5.2 Acessar Site

1. Abra o domínio do Railway no navegador:
   ```
   https://seu-dominio.railway.app
   ```

2. Você deverá ver a página inicial do CBM Lotus

3. Clique em **"Fazer Login"** e teste a autenticação

### 5.3 Criar Primeiro Administrador

1. Faça login no sistema
2. No Railway, vá no banco de dados → aba **"Query"**
3. Execute:
   ```sql
   UPDATE users SET role = 'admin' WHERE openId = 'SEU_OPEN_ID';
   ```
   (Substitua `SEU_OPEN_ID` pelo seu ID de usuário)

4. Recarregue a página e você terá acesso ao painel administrativo

---

## 🎉 Pronto!

Seu sistema CBM Lotus está no ar! 🚒

### Próximos Passos:

- 📋 Criar eventos e cursos
- 👥 Convidar membros para se inscreverem
- 📜 Gerar certificados
- 🤖 Testar comandos do bot Discord

---

## 🆘 Problemas Comuns

### Bot não fica online
- Verifique se o `DISCORD_BOT_TOKEN` está correto
- Verifique se as Privileged Gateway Intents estão ativadas
- Veja os logs do Railway para erros

### Erro de autenticação
- Verifique se o `DISCORD_REDIRECT_URI` está correto
- Verifique se o redirect URI foi adicionado no Discord Developer Portal

### Certificados em branco
- Verifique se as fontes estão no diretório `server/assets/fonts/`
- Veja os logs do Railway procurando por `[CertificateGenerator]`

---

## 📞 Suporte

Se precisar de ajuda, verifique:
- Logs do Railway (aba "Logs")
- Console do navegador (F12)
- Logs do Discord bot

---

**Boa sorte com o CBM Lotus! 🚒🔥**
