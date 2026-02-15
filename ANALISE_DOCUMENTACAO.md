# Análise da Documentação CBM Lotus vs Implementação Atual

## ✅ Funcionalidades Implementadas

### Banco de Dados
- ✅ Tabela `users` (com campos necessários)
- ✅ Tabela `courses`
- ✅ Tabela `courseEvents`
- ✅ Tabela `courseEnrollments`
- ✅ Tabela `certificates`

### Backend (Site)
- ✅ Autenticação OAuth via Manus
- ✅ Sistema de roles (admin, instructor, user)
- ✅ CRUD de cursos
- ✅ Criação de eventos
- ✅ Listagem de inscrições
- ✅ Aprovação/rejeição de inscrições
- ✅ Integração com Discord (notificações)

### Frontend (Site)
- ✅ Página Home com lista de cursos
- ✅ Página de Calendário/Agendamento
- ✅ Página de Gerenciar Solicitações
- ✅ Página de Usuários
- ✅ Autenticação e controle de acesso

### Bot Discord
- ✅ Bot conectado e operacional
- ✅ Notificações automáticas (eventos, inscrições, certificados)

## ❌ Funcionalidades FALTANTES ou INCOMPLETAS

### 1. Campo "auxiliar" e "ID_auxiliar" ❌ CRÍTICO
**Status**: NÃO IMPLEMENTADO
**Impacto**: Alto - Essencial para fluxo de certificados

**O que falta**:
- Adicionar campos `auxiliar` (VARCHAR) e `ID_auxiliar` (VARCHAR) na tabela `courseEvents`
- Adicionar campos `auxiliar` (VARCHAR) e `ID_auxiliar` (VARCHAR) na tabela `certificates`
- Implementar busca automática de nome do auxiliar pela matrícula
- Adicionar campo no formulário de criação de eventos
- Adicionar campo no formulário de emissão de certificados

### 2. Gerador de Certificados Individual ❌ CRÍTICO
**Status**: NÃO IMPLEMENTADO
**Impacto**: Alto - Funcionalidade principal

**O que falta**:
- Criar formulário "Gerador de Certificados" na Home
- Implementar geração de imagem do certificado (HTML Canvas)
- Implementar upload para S3
- Implementar envio para Discord
- Salvar certificado no banco com todos os dados

### 3. Emissão de Certificados em Lote ❌ CRÍTICO
**Status**: NÃO IMPLEMENTADO
**Impacto**: Alto - Funcionalidade principal

**O que falta**:
- Criar formulário "Registrar Resultados de Curso" na Home
- Implementar processamento de lista de aprovados (nome | matrícula)
- Implementar geração em lote de certificados
- Implementar lógica de agrupamento (mesma emissão = mesmo curso)

### 4. Comandos do Bot Discord ❌ CRÍTICO
**Status**: PARCIALMENTE IMPLEMENTADO
**Impacto**: Alto - Interface principal para membros

**Comandos FALTANTES**:
- `/cursos` - Listar todos os cursos disponíveis
- `/inscrever` - Inscrever-se em um evento
- `/agenda` - Ver próximos eventos (30 dias)
- `/meusstatus` - Ver status das inscrições
- `/meuscertificados` - Ver todos os certificados
- `/ranking` - Ver ranking de instrutores
- `/consulta-apoio` - Consultar cursos auxiliados
- `/ajuda` - Exibir lista de comandos

### 5. Extração de Matrícula do Nickname Discord ❌ CRÍTICO
**Status**: NÃO IMPLEMENTADO
**Impacto**: Alto - Essencial para vincular Discord com banco

**O que falta**:
- Implementar parser de nickname: "Cargo | Nome | Matrícula" ou "Cargo • Nome | Matrícula"
- Extrair matrícula (parte após último |)
- Usar matrícula para buscar/vincular usuário

### 6. Lógica de Agrupamento de Cursos (Janela de 20min) ❌ IMPORTANTE
**Status**: NÃO IMPLEMENTADO
**Impacto**: Médio - Necessário para ranking e consulta de apoio

**O que falta**:
- Implementar algoritmo de agrupamento por janela de 20 minutos
- Aplicar no comando `/ranking`
- Aplicar no comando `/consulta-apoio`

### 7. Tratamento de Fuso Horário (UTC-3 Brasília) ⚠️ PARCIAL
**Status**: PARCIALMENTE IMPLEMENTADO
**Impacto**: Médio - Já usa date-fns-tz mas precisa validar

**O que verificar**:
- Confirmar que todas as datas são convertidas corretamente
- Verificar exibição no Discord (formato DD/MM/YYYY HH:MM)

### 8. Página de Certificados no Site ❌
**Status**: NÃO IMPLEMENTADO
**Impacto**: Baixo - Funcionalidade secundária

**O que falta**:
- Criar aba "Certificados" em Gerenciar Solicitações
- Listar todos os certificados emitidos
- Filtros por curso, instrutor, data
- Visualização de imagem do certificado

### 9. Busca Automática de Nome do Auxiliar ❌ CRÍTICO
**Status**: NÃO IMPLEMENTADO
**Impacto**: Alto - Necessário para fluxo completo

**O que falta**:
- Implementar função que busca usuário por `studentId` (matrícula)
- Retornar nome completo do auxiliar
- Preencher automaticamente campo `auxiliar` ao digitar `ID_auxiliar`

## 📋 Resumo de Prioridades

### 🔴 CRÍTICO (Implementar AGORA)
1. Campos auxiliar/ID_auxiliar no schema
2. Gerador de Certificados Individual
3. Emissão de Certificados em Lote
4. Comandos do Bot Discord
5. Extração de matrícula do nickname
6. Busca automática de nome do auxiliar

### 🟡 IMPORTANTE (Implementar DEPOIS)
7. Lógica de agrupamento de cursos (20min)
8. Validar tratamento de fuso horário

### 🟢 DESEJÁVEL (Implementar SE HOUVER TEMPO)
9. Página de Certificados no site

## 📝 Plano de Implementação

### Fase 1: Schema do Banco de Dados
- Adicionar campos auxiliar/ID_auxiliar em courseEvents
- Adicionar campos auxiliar/ID_auxiliar em certificates
- Executar migração SQL

### Fase 2: Backend - Funções de Suporte
- Implementar busca de usuário por studentId
- Implementar geração de imagem de certificado
- Implementar upload para S3
- Implementar envio para Discord

### Fase 3: Frontend - Formulários
- Criar formulário "Gerador de Certificados" na Home
- Criar formulário "Registrar Resultados de Curso" na Home
- Adicionar campo auxiliar no formulário de eventos

### Fase 4: Bot Discord - Comandos
- Implementar todos os comandos slash
- Implementar parser de nickname
- Implementar lógica de agrupamento

### Fase 5: Testes e Validação
- Testar fluxo completo de criação de evento
- Testar fluxo completo de inscrição
- Testar fluxo completo de emissão de certificados
- Testar todos os comandos do Discord
