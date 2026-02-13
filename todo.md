# TODO - CBM Vice City

## Fase 1: Upgrade e Configuração Inicial
- [x] Upgrade para web-db-user
- [x] Resolver conflito em Home.tsx
- [x] Criar schema do banco de dados

## Fase 2: Banco de Dados e Modelos
- [x] Criar tabela de cursos
- [x] Criar tabela de materiais de curso (instruções + vídeo)
- [x] Criar tabela de solicitações de inscrição
- [x] Executar migrations (pnpm db:push)
- [x] Popular banco com os 15 cursos iniciais
- [x] Criar procedures tRPC para cursos e applications

## Fase 3: Páginas Individuais de Cursos
- [x] Criar rota dinâmica /curso/:id
- [x] Implementar página de curso com material (instruções + vídeo)
- [x] Adicionar controle de acesso para edição (apenas close.jackson2025@gmail.com)
- [x] Adicionar botão "Saiba Mais" nos cards de curso

## Fase 4: Modal de Solicitação de Curso
- [x] Criar componente Modal de solicitação
- [x] Implementar formulário (Nome Completo, ID do Jogador, Telefone, Horário Disponível)
- [x] Salvar solicitações no banco de dados

## Fase 5: Gerenciamento de Solicitações para Instrutores
- [ ] Criar página de gerenciamento de solicitações
- [ ] Implementar controle de acesso (apenas instrutores)
- [ ] Adicionar funcionalidade de aceitar/recusar solicitações
- [ ] Implementar notificações para solicitantes

## Fase 6: Sistema de Gerenciamento de Login e Aprovação de Usuários
- [x] Atualizar schema do banco com status de aprovação (pending/approved/rejected)
- [x] Adicionar novos papéis: membro, instrutor, administrador
- [x] Criar procedures tRPC para listar, aprovar e rejeitar usuários
- [x] Implementar página /admin/usuarios para gerenciamento
- [x] Adicionar middleware de verificação de aprovação
- [x] Criar página de "aguardando aprovação" para novos usuários
- [x] Atualizar lógica de login para definir status inicial como "pending"
- [x] Testar fluxo completo de aprovação

## Fase 7: Painel de Gerenciamento de Solicitações para Instrutores
- [x] Criar página /gerenciar-solicitacoes
- [x] Implementar visualização de solicitações pendentes, aceitas e rejeitadas
- [x] Adicionar botões de aprovar/rejeitar para cada solicitação
- [x] Mostrar informações do curso e candidato
- [x] Adicionar controle de acesso (apenas instrutores e admin)
- [x] Adicionar link no header para instrutores acessarem o painel
- [x] Testar fluxo completo de aprovação/rejeição

## Fase 8: Proteção de Autenticação
- [x] Adicionar redirecionamento para login na Home para usuários não autenticados
- [x] Testar fluxo de login em navegador anônimo

## Fase 9: Controle de Acesso por Perfil de Usuário
- [x] Ocultar "Gerador de Certificados" para membros
- [x] Ocultar "Registrar Resultados de Curso" para membros
- [x] Mostrar "Gerador de Certificados" para instrutores e admins
- [x] Mostrar "Registrar Resultados de Curso" para instrutores e admins
- [x] Restringir edição de Material do Curso apenas para admins
- [x] Manter "Gerenciar Usuários" apenas para admins
- [x] Manter "Gerenciar Solicitações" para instrutores e admins
- [x] Testar permissões para cada perfil

## Fase 10: Edição e Exclusão de Usuários
- [x] Criar procedure tRPC para editar usuário (nome, email, role)
- [x] Criar procedure tRPC para excluir usuário
- [x] Adicionar botões de editar/excluir na tabela de usuários
- [x] Criar modal de edição com formulário
- [x] Criar modal de confirmação de exclusão
- [x] Adicionar validação para impedir exclusão do próprio usuário
- [x] Testar funcionalidades de edição e exclusão

## Fase 11: Correção de Permissões de Membros
- [ ] Verificar visibilidade do header (botões Gerenciar Usuários e Gerenciar Solicitações)
- [ ] Confirmar que Gerador de Certificados está oculto para membros
- [ ] Confirmar que Registrar Resultados está oculto para membros
- [ ] Confirmar que Painel de Instrutores está oculto para membros
- [ ] Testar com usuário membro

## Fase 12: Múltiplos Vídeos com Títulos
- [x] Atualizar schema courseMaterials para incluir video1Title, video1Url, video2Title, video2Url
- [x] Executar migrations (pnpm db:push)
- [x] Atualizar CoursePage.tsx para exibir dois vídeos com títulos
- [x] Adicionar suporte para Medal.tv (link clicável ao invés de embed)
- [x] Testar com vídeos do YouTube e Medal.tv

## Fase 13: Upload de Imagens para Cursos
- [x] Criar tabela courseImages no schema
- [x] Executar migrations (pnpm db:push)
- [x] Criar procedure tRPC para upload de imagem (usando S3)
- [x] Criar procedure tRPC para listar imagens do curso
- [x] Criar procedure tRPC para deletar imagem
- [x] Atualizar CoursePage.tsx com galeria de imagens
- [x] Adicionar interface de upload para admins
- [x] Testar upload e exibição de imagens

## Fase 14: Atualização do Logo
- [x] Fazer upload do brasão CBM RJ para S3
- [x] Atualizar referências do logo no código
- [x] Aumentar tamanho do logo no header
- [x] Testar visualização em diferentes páginas

## Fase 15: Ajuste de Layout Hero Section
- [x] Reestruturar Hero Section com layout em duas colunas
- [x] Adicionar brasão grande (300-350px) à direita
- [x] Ajustar altura da seção Hero
- [x] Testar responsividade em diferentes tamanhos de tela

## Fase 16: Atualização do Brasão (Letras Brancas)
- [x] Fazer upload do novo brasão com letras brancas e contorno mais fino
- [x] Atualizar referências no código (header e Hero Section)
- [x] Testar visualização em todas as páginas

## Fase 17: Brasão com Fundo Transparente
- [x] Fazer upload do brasão com fundo transparente
- [x] Atualizar referências no código
- [x] Testar visualização em todas as páginas

## Fase 18: Contador de Solicitações Pendentes
- [x] Criar procedure tRPC para contar solicitações com status "pending"
- [x] Adicionar badge numérico no botão "Gerenciar Solicitações"
- [x] Implementar atualização automática do contador
- [x] Testar visualização para instrutores e admins

## Fase 19: Aprovação Manual de Usuários
- [ ] Verificar usuários pendentes no banco de dados
- [ ] Criar script para aprovar próximos 3 usuários como administradores
- [ ] Executar script e verificar resultados

## Fase 19: Auto-Aprovação dos Próximos 3 Usuários
- [x] Modificar lógica de upsertUser para auto-aprovar próximos 3 usuários como admin
- [x] Adicionar contador de usuários auto-aprovados
- [x] Testar funcionalidade

## Fase 20: Adicionar Imagens aos Cards de Cursos
- [x] Buscar imagens apropriadas para cada tipo de curso
- [x] Atualizar schema do banco de dados para incluir campo imageUrl
- [x] Executar migration
- [x] Atualizar cursos existentes com URLs de imagens
- [x] Modificar Home.tsx para exibir imagens nos cards
- [x] Testar visualização

## Fase 21: Substituir Imagem do Curso Salva-Vidas
- [x] Fazer upload da nova imagem para S3
- [x] Atualizar URL da imagem no banco de dados para o curso Salva-Vidas
- [x] Verificar resultado

## Fase 22: Substituir Imagem do Curso Resgate-Montanha
- [x] Fazer upload da nova imagem para S3
- [x] Atualizar URL da imagem no banco de dados para o curso Resgate-Montanha
- [x] Verificar resultado

## Fase 23: Substituir Imagem do Curso SPEED
- [x] Fazer upload da nova imagem para S3
- [x] Atualizar URL da imagem no banco de dados para o curso SPEED
- [x] Verificar resultado

## Fase 24: Substituir Imagem do Curso Modulação/Conduta
- [x] Fazer upload da nova imagem para S3
- [x] Atualizar URL da imagem no banco de dados para o curso Modulação/Conduta
- [x] Verificar resultado

## Fase 25: Substituir Imagem do Curso TAF
- [x] Fazer upload da nova imagem para S3
- [x] Atualizar URL da imagem no banco de dados para o curso TAF
- [x] Verificar resultado

## Fase 26: Substituir Imagem do Curso Mergulhador
- [x] Fazer upload da nova imagem para S3
- [x] Atualizar URL da imagem no banco de dados para o curso Mergulhador
- [x] Verificar resultado

## Fase 27: Substituir Imagem do Curso Resgate-Aquático
- [x] Fazer upload da nova imagem para S3
- [x] Atualizar URL da imagem no banco de dados para o curso Resgate-Aquático
- [x] Verificar resultado

## Fase 28: Substituir Imagem do Curso Salva-Vidas
- [x] Fazer upload da nova imagem para S3
- [x] Atualizar URL da imagem no banco de dados para o curso Salva-Vidas
- [x] Verificar resultado

## Fase 29: Substituir Imagens de Três Cursos
- [x] Fazer upload das imagens PQD.avif, Águia.avif e Aguia1.jfif para S3
- [x] Atualizar URL da imagem do curso Paraquedista Especializado
- [x] Atualizar URL da imagem do curso Aero-Vidas Elite
- [x] Atualizar URL da imagem do curso Aero-Vidas 1
- [x] Verificar resultado

## Fase 30: Substituir Imagens dos Cursos de Motolância
- [x] Fazer upload das imagens Motolancia.jpg e Motolancia1.jpeg para S3
- [x] Atualizar URL da imagem do curso Motolância
- [x] Atualizar URL da imagem do curso Motolância Especializado
- [x] Verificar resultado

## Fase 31: Discord OAuth - Login Unificado
- [x] Adicionar campo discordId ao schema de usuários
- [x] Executar migrations (pnpm db:push)
- [x] Criar variáveis de ambiente para Discord OAuth (CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
- [x] Implementar rota /api/auth/discord para iniciar OAuth flow
- [x] Implementar rota /api/auth/discord/callback para processar callback
- [x] Criar lógica de vincular conta Discord com usuário existente
- [x] Criar lógica de criar novo usuário a partir de conta Discord
- [x] Adicionar botão "Login com Discord" na página de login
- [x] Criar página de login dedicada com opções Discord e Manus
- [ ] Adicionar opção de vincular Discord na página de perfil do usuário
- [x] Testar fluxo completo de OAuth
- [x] Criar testes automatizados para rotas Discord

## Fase 32: Correção X-Frame-Options Discord OAuth
- [x] Investigar código do botão "Entrar com Discord"
- [x] Garantir que usa window.location.href para redirecionamento completo
- [x] Testar fluxo OAuth completo no navegador
- [x] Configurar variáveis de ambiente no painel de Secrets
- [x] Reiniciar servidor para carregar variáveis

## Fase 33: Melhorias no Registro de Resultados de Curso
- [x] Adicionar campo "Matrícula" no formulário de aprovados/reprovados
- [x] Criar botão "Confirmar Resultados" no formulário
- [x] Implementar geração automática de certificados para aprovados
- [x] Implementar download em lote de certificados (ZIP)
- [x] Instalar biblioteca JSZip para criar arquivos ZIP

## Fase 34: Campo Cargo do Aplicador
- [x] Adicionar campo "Cargo do Aplicador" no formulário de Registro de Resultados
- [x] Incluir cargo do aplicador nos certificados gerados
- [x] Exibir cargo do aplicador no resumo

## Fase 35: Atualizar Layout dos Certificados em Lote
- [x] Copiar HTML/CSS do certificado do Gerador individual
- [x] Aplicar mesmo layout nos certificados gerados em lote
- [x] Ajustar tamanhos de fonte e espaçamentos para versão em lote

## Fase 36: Corrigir Fonte da Assinatura do Aplicador
- [x] Alterar fonte do nome do aplicador para "Mistral" nos certificados em lote

## Fase 37: Campo Cargo em Editar Usuário
- [x] Adicionar campo "rank" (cargo) ao schema de usuários
- [x] Executar migrations (pnpm db:push)
- [x] Criar lista de seleção com cargos do CBM Vice City
- [x] Implementar backend para salvar cargo do usuário
- [x] Implementar UI de edição de cargo

## Fase 38: Ajustar Estilo do Campo Cargo
- [x] Adicionar fundo branco na lista de seleção do campo Cargo

## Fase 39: Corrigir Bug de Salvamento de Cargo
- [x] Investigar por que cargo não está sendo salvo
- [x] Corrigir função updateUser no backend
- [x] Testar salvamento de cargo

## Fase 40: Coluna Cargo na Tabela de Usuários
- [x] Adicionar badge de cargo para cada usuário aprovado
- [x] Exibir cargo ao lado do badge de papel (role)

## Fase 41: Auto-preencher Cargo do Aplicador
- [x] Preencher automaticamente campo "Cargo do Aplicador" com cargo do usuário logado
- [x] Permitir edição manual caso usuário queira alterar
- [x] Manter auto-preenchimento ao resetar formulário

## Fase 42: Atualizar Design dos Certificados
- [x] Adicionar logo do CBM Vice City à esquerda no certificado
- [x] Mover assinatura do aplicador para centralizada abaixo do curso
- [x] Ajustar layout para seguir modelo fornecido
- [x] Aplicar mudanças tanto no Gerador individual quanto em lote

## Fase 43: Corrigir Certificado Recortado
- [x] Ajustar tamanhos de fonte e espaçamentos para caber todo conteúdo
- [x] Reduzir gaps e paddings para evitar overflow
- [x] Reduzir tamanho de logo e selo de aprovação

## Fase 44: Corrigir Cargo do Aplicador Cortado
- [x] Reduzir ainda mais espaçamentos verticais no centro
- [x] Garantir que cargo do aplicador apareça completo
- [x] Ajustar margem negativa do centro

## Fase 45: Centralizar Assinatura do Aplicador
- [x] Remover flex: 1 que está empurrando para esquerda
- [x] Centralizar nome e cargo do aplicador horizontalmente
- [x] Usar position absolute para ID mantendo assinatura centralizada

## Fase 46: Corrigir Logo Desaparecendo ao Exportar
- [x] Investigar configurações do html2canvas
- [x] Converter logo para base64 para evitar CORS
- [x] Atualizar certificado individual e em lote

## Fase 47: Substituir Campo Cargo por Select no Gerador de Certificados
- [x] Localizar campo "Cargo do Aplicador" no Gerador de Certificados
- [x] Substituir Input por Select com opções de cargos militares
- [x] Adicionar todas as 11 opções de cargos

## Fase 48: Substituir Campo Nome do Curso por Select no Gerador
- [x] Verificar query trpc existente para listar cursos (courses.list)
- [x] Substituir Input por Select no campo "Nome do Curso"
- [x] Implementar carregamento dinâmico dos cursos cadastrados

## Fase 49: Ajustar Layout da Assinatura e Remover Cantos Dourados
- [x] Ajustar assinatura: nome cursivo acima da linha, cargo abaixo
- [x] Remover decorações douradas nos cantos do certificado
- [x] Aplicar alterações em certificado individual e geração em lote

## Fase 50: Padronizar Certificados em Lote com Individual
- [ ] Comparar código do certificado individual e em lote
- [ ] Ajustar tamanhos de fonte e espaçamentos no certificado em lote
- [ ] Centralizar conteúdo verticalmente (remover margem negativa excessiva)

## Fase 50: Padronizar Certificado Individual com Em Lote
- [x] Comparar código dos dois certificados
- [x] Ajustar margem negativa do certificado individual (de -15px para 0)
- [x] Centralizar conteúdo verticalmente no individual

## Fase 51: Melhorar Centralização Vertical do Certificado Individual
- [x] Mudar justifyContent de space-between para center
- [x] Adicionar gap de 20px entre seções
- [x] Conteúdo agora realmente centralizado verticalmente

## Fase 52: Ajustar Tamanhos de Fonte do Certificado Individual
- [x] Aumentar tamanhos de fonte para corresponder ao certificado em lote
- [x] CERTIFICADO: 16px → 22px
- [x] Nome do aluno: 24px → 34px
- [x] Nome do curso: 18px → 24px
- [x] Textos auxiliares: 11px → 14px

## Fase 53: Deslocar Conteúdo Central Para Cima (Mantendo Cabeçalho e Rodapé)
- [x] Reverter tamanhos de fonte para originais
- [x] Adicionar marginTop: -40px apenas na seção central
- [x] Logo e selo permanecem no topo
- [x] Assinatura e ID permanecem no rodapé

## Fase 54: Deslocar Logo, Selo e ID Para Baixo
- [x] Adicionar margem superior de 20px ao cabeçalho (logo + selo)
- [x] Deslocar ID para baixo com bottom: -10px
- [x] Melhor equilíbrio visual do certificado

## Fase 55: Aumentar Margem do Cabeçalho e ID
- [x] Aumentar margem superior do cabeçalho de 20px para 40px
- [x] Aumentar deslocamento do ID de -10px para -20px

## Fase 56: Ajustar Posição da Assinatura nos Certificados em Lote
- [x] Localizar seção da assinatura na geração em lote
- [x] Adicionar margin-bottom de 4px para assinatura ficar acima da linha

## Fase 57: Aumentar Tamanhos de Fonte nos Certificados em Lote
- [x] Aumentar em 4px todas as fontes do certificado em lote
- [x] Aplicado a todos os textos (14px→18px, 22px→26px, 24px→28px, 34px→38px)

## Fase 58: Deslocar Conteúdo Central Para Cima nos Certificados em Lote
- [x] Aumentar margem negativa do conteúdo central de -25px para -50px

## Fase 59: Ajustar Fontes e Posição do Certificado Individual
- [x] Reduzir em 2px todos os tamanhos de fonte do conteúdo central (16px→14px, 11px→9px, 24px→22px, 18px→16px)
- [x] Aumentar margem negativa de -40px para -60px para deslocar conteúdo para cima

## Fase 60: Deslocar Conteúdo Central Para Cima nos Certificados em Lote (Novamente)
- [x] Aumentar margem negativa do conteúdo central de -50px para -70px
- [x] Certificados individuais mantidos inalterados

## Fase 61: Ajustar Espaçamento da Linha de Assinatura no Certificado Individual
- [x] Deslocar linha horizontal abaixo do nome do aplicador para baixo nos certificados individuais

## Fase 62: Sistema de Registro Inicial e Permissões Automáticas por Cargo
- [x] Adicionar campo "studentId" (ID/matrícula) ao schema de usuários
- [x] Atualizar schema para marcar usuários que completaram registro inicial
- [x] Executar migrations (pnpm db:push)
- [x] Criar página /complete-profile para registro inicial
- [x] Implementar formulário com campos: Nome, ID (matrícula), Cargo
- [x] Criar função para mapear cargo → role automaticamente
- [x] Atualizar procedure tRPC para salvar dados do registro inicial
- [x] Atualizar middleware de autenticação para redirecionar usuários incompletos
- [x] Remover sistema de aprovação manual de usuários
- [x] Atualizar página de gerenciamento de usuários
- [x] Testar fluxo completo de registro

## Fase 63: Ajustar Label do Campo Nome na Tela de Registro
- [x] Alterar "Nome Completo" para "Nome completo (no RP)" na página CompleteProfile

## Fase 65: Verificar e Garantir Aprovação Automática no Registro
- [x] Verificar fluxo de registro de usuários (CompleteProfile)
- [x] Confirmar que aprovação é automática baseada no cargo
- [x] Remover qualquer código de aprovação manual remanescente
- [x] Testar fluxo completo de registro

## Fase 66: Corrigir Tela "Aguardando Aprovação" Após Registro
- [x] Investigar por que tela de aprovação aparece após completar perfil
- [x] Verificar lógica de redirecionamento no CompleteProfile
- [x] Corrigir para redirecionar diretamente para home após registro
- [x] Testar fluxo completo de registro

## Fase 67: Remover Página "Aguardando Aprovação"
- [x] Deletar arquivo PendingApproval.tsx
- [x] Remover rota /aguardando-aprovacao do App.tsx
- [x] Remover import de PendingApproval no App.tsx

## Fase 68: Remover Redirecionamentos para /aguardando-aprovacao
- [x] Buscar todos os redirecionamentos para /aguardando-aprovacao no código
- [x] Remover todos os redirecionamentos encontrados
- [x] Testar fluxo completo de registro

## Fase 69: Corrigir Redirecionamento Persistente para /aguardando-aprovacao
- [x] Investigar código frontend que faz redirecionamento
- [x] Verificar hooks useAuth e lógica de verificação de approvalStatus
- [x] Remover ou corrigir lógica de redirecionamento (encontrado em server/discord.ts)
- [x] Testar fluxo completo

## Fase 70: Implementar Upload de Arquivos nos Cursos
- [x] Criar tabela courseFiles no schema para armazenar metadados dos arquivos
- [x] Executar migrations (pnpm db:push)
- [x] Criar procedure tRPC para upload de arquivos (uploadCourseFile)
- [x] Criar procedure tRPC para listar arquivos de um curso (getCourseFiles)
- [x] Criar procedure tRPC para deletar arquivo (deleteCourseFile)
- [x] Adicionar componente de upload de arquivos na página de curso
- [x] Adicionar listagem de arquivos anexados com opção de download
- [x] Testar upload, listagem e exclusão de arquivos

## Fase 71: Implementar Visualização Ampliada de Imagens
- [x] Adicionar modal/lightbox para visualizar imagens em tamanho maior
- [x] Implementar navegação entre imagens no modal (anterior/próxima)
- [x] Adicionar botão de fechar no modal
- [x] Testar funcionalidade de visualização

## Fase 72: Módulo de Agendamento de Cursos com Calendário
- [x] Criar tabela courseEvents no schema do banco
- [x] Executar migrations (pnpm db:push)
- [x] Criar procedures tRPC para listar eventos (getEvents, getEventsByDate)
- [x] Criar procedure tRPC para criar evento (createEvent - apenas instrutores/admins)
- [x] Criar procedure tRPC para editar evento (updateEvent - apenas instrutores/admins)
- [x] Criar procedure tRPC para deletar evento (deleteEvent - apenas instrutores/admins)
- [x] Criar página /agendamento com calendário interativo
- [x] Implementar visualização mensal do calendário
- [x] Implementar painel lateral com programação do dia (estilo Outlook)
- [x] Implementar modal de criação de evento
- [x] Implementar modal de edição de evento
- [x] Adicionar rota no App.tsx
- [x] Testar criação, edição e exclusão de eventos

## Fase 73: Adicionar Botão de Agendamento no Header
- [x] Adicionar botão "Agendamento" no cabeçalho da página Home
- [x] Implementar navegação para /agendamento ao clicar no botão
- [x] Testar navegação

## Fase 74: Melhorias na Página de Agendamento
- [x] Adicionar botão "Voltar" na página de agendamento
- [x] Alterar fundo do modal de criação de evento para branco

## Fase 75: Alterar Fundo dos Dropdowns para Branco
- [x] Alterar fundo das listas dropdown (SelectContent) para branco nos modais

## Fase 76: Adicionar Campo Instrutor nos Eventos
- [x] Adicionar coluna instructor ao schema da tabela courseEvents (já existe instructorId)
- [x] Executar migrations (pnpm db:push)
- [x] Atualizar procedures tRPC para incluir campo instructor
- [x] Adicionar campo Instrutor no formulário de criação de evento
- [x] Adicionar campo Instrutor no formulário de edição de evento
- [x] Exibir nome do instrutor nos cards de eventos
- [x] Testar criação e edição de eventos com instrutor
- [x] Criar testes automatizados para validar funcionalidade de instrutor

## Fase 77: Corrigir Fuso Horário do Agendamento para Brasília
- [x] Investigar como datas estão sendo tratadas atualmente (UTC vs Local)
- [x] Implementar conversão para horário de Brasília (GMT-3)
- [x] Instalar biblioteca date-fns-tz para trabalhar com timezones
- [x] Ajustar função handleCreateEvent para converter de Brasília para UTC
- [x] Ajustar função handleUpdateEvent para converter de Brasília para UTC
- [x] Ajustar função handleEditClick para converter de UTC para Brasília ao carregar evento
- [x] Ajustar exibição de horários nos detalhes dos eventos (converter UTC para Brasília)
- [x] Criar testes automatizados para validar conversão de timezone (6 testes passando)
- [x] Testar criação de eventos com horário correto
- [x] Testar edição de eventos mantendo horário correto

## Fase 78: Sistema de Inscrição em Cursos
- [x] Criar tabela courseEnrollments no schema do banco
- [x] Adicionar campos: userId, courseId, enrolledAt, status (pending/confirmed/cancelled), updatedAt
- [x] Executar migrations (pnpm db:push)
- [x] Criar funções de gerenciamento de inscrições em db.ts (createEnrollment, getUserEnrollmentForCourse, getCourseEnrollments, updateEnrollmentStatus, cancelEnrollment, deleteEnrollment, getEnrollmentCountByCourse)
- [x] Criar procedure tRPC para fazer inscrição (enrollments.enroll)
- [x] Criar procedure tRPC para listar inscritos de um curso com dados dos usuários (enrollments.listByCourse)
- [x] Criar procedure tRPC para cancelar inscrição (enrollments.cancel)
- [x] Criar procedure tRPC para verificar inscrição do usuário (enrollments.myEnrollment)
- [x] Criar procedure tRPC para atualizar status de inscrição - apenas instrutores/admins (enrollments.updateStatus)
- [x] Criar procedure tRPC para contar inscrições (enrollments.count)
- [x] Adicionar botão "Fazer Inscrição" na página de curso
- [x] Implementar modal de confirmação de inscrição
- [x] Mostrar status da inscrição do usuário (inscrito, aguardando confirmação, cancelado)
- [x] Adicionar botão para cancelar inscrição
- [x] Mostrar contador de inscritos no header do curso
- [x] Criar página ManageEnrollmentsPage para instrutores gerenciarem lista de inscritos
- [x] Implementar seletor de curso na página de gerenciamento
- [x] Exibir resumo de inscrições (confirmados, pendentes, cancelados)
- [x] Permitir instrutores/admins confirmarem ou rejeitarem inscrições pendentes
- [x] Adicionar rota /gerenciar-inscricoes no App.tsx
- [x] Adicionar botão "Gerenciar Inscrições" no header da Home (apenas para instrutores/admins)
- [x] Implementar lógica de reativação de inscrição cancelada
- [x] Testar fluxo completo de inscrição
- [x] Criar testes automatizados (12 testes passando: criação, duplicação, reativação, permissões, queries, cancelamento)

## Fase 79: Mover Inscrições para Cards de Eventos Agendados
- [x] Alterar schema courseEnrollments para usar eventId ao invés de courseId
- [x] Executar migration (pnpm db:push) com rename de coluna
- [x] Atualizar funções em db.ts para trabalhar com eventId (createEnrollment, getUserEnrollmentForEvent, getEventEnrollments, etc)
- [x] Modificar procedures tRPC enrollments para usar eventId (enroll, myEnrollment, listByEvent, count, updateStatus, cancel)
- [x] Criar componente EventEnrollmentSection para gerenciar inscrições dentro do card
- [x] Adicionar botão "Fazer Inscrição" nos cards de eventos na CalendarPage
- [x] Mostrar contador de inscritos no card do evento
- [x] Implementar expansão do card para mostrar lista de inscritos com detalhes (nome, matrícula, cargo, data de inscrição)
- [x] Mostrar status da inscrição do usuário com badges coloridos (confirmado/pendente/cancelado)
- [x] Permitir instrutores/admins confirmarem, rejeitarem ou marcarem como pendente inscrições dentro do card
- [x] Adicionar botão para cancelar inscrição do próprio usuário
- [x] Remover página ManageEnrollmentsPage (funcionalidade movida para cards)
- [x] Remover rota /gerenciar-inscricoes do App.tsx
- [x] Remover botão "Gerenciar Inscrições" do header da Home
- [x] Remover funcionalidade de inscrição da CoursePage (agora só em eventos agendados)
- [x] Atualizar testes para refletir mudança de courseId para eventId (12 testes passando)
- [x] Testar fluxo completo na página de Agendamento

## Fase 80: Corrigir Botão Voltar na Página de Agendamento
- [x] Identificar problema no botão Voltar em /agendamento (estava usando window.history.back())
- [x] Corrigir navegação do botão Voltar (alterado para usar setLocation("/") do wouter)
- [x] Adicionar import de useLocation do wouter
- [x] Testar funcionalidade

## Fase 81: Sistema de Aprovação de Inscrições com Notificação por Email - CONCLUÍDO
- [ ] Alterar status padrão de novas inscrições para "pending" (já está implementado)
- [ ] Verificar se schema suporta status "rejected" (atualmente usa "cancelled")
- [ ] Adicionar status "rejected" ao enum do schema se necessário
- [ ] Implementar função de envio de email usando serviço disponível
- [ ] Criar template de email para inscrição aprovada
- [ ] Criar template de email para inscrição rejeitada
- [ ] Adicionar envio de email ao aprovar inscrição (status confirmed)
- [ ] Adicionar envio de email ao rejeitar inscrição (status rejected)
- [ ] Atualizar UI para mostrar badge "Rejeitado" com cor vermelha
- [ ] Atualizar botões de ação do instrutor para usar "Aprovar" e "Rejeitar"
- [ ] Testar fluxo completo: inscrição → pendente → aprovação/rejeição → email enviado
- [ ] Criar testes automatizados para envio de emails

## Fase 81: Sistema de Aprovação de Inscrições com Notificação por Email - CONCLUÍDO
- [x] Alterar status padrão de novas inscrições para "pending"
- [x] Adicionar status "rejected" ao enum do schema
- [x] Executar migration para adicionar rejected e alterar default
- [x] Instalar nodemailer e @types/nodemailer
- [x] Criar módulo server/_core/email.ts com funções de envio
- [x] Criar templates HTML para email de aprovação
- [x] Criar templates HTML para email de rejeição
- [x] Atualizar procedure updateStatus para aceitar status rejected
- [x] Adicionar lógica de envio de email ao aprovar inscrição (status confirmed)
- [x] Adicionar lógica de envio de email ao rejeitar inscrição (status rejected)
- [x] Atualizar função updateEnrollmentStatus em db.ts para aceitar rejected
- [x] Atualizar UI para mostrar badge "Rejeitado" com cor vermelha
- [x] Alterar botões de ação do instrutor para "Aprovar" e "Rejeitar"
- [x] Ocultar botões de ação para inscrições rejeitadas ou canceladas
- [x] Configurar credenciais EMAIL_USER e EMAIL_PASS
- [x] Criar teste de validação de credenciais de email (email.test.ts)
- [x] Validar envio de email de teste (teste passou com sucesso)

## Fase 82: Corrigir Erro myEnrollment Retornando Undefined
- [x] Identificar onde getUserEnrollmentForEvent retorna undefined
- [x] Alterar para retornar null quando não há inscrição (return null e enrollment || null)
- [x] Testar correção na página de agendamento

## Fase 83: Integração Bidirecional Discord ↔ Site
- [x] Instalar discord.js (v14.25.1)
- [x] Configurar credenciais do bot (DISCORD_BOT_TOKEN, DISCORD_APPLICATION_ID, DISCORD_SERVER_ID, DISCORD_CHANNEL_*)
- [x] Criar módulo Discord bot em server/_core/discord.ts
- [x] Implementar registro de comandos slash no servidor Discord
- [x] Implementar comando /cursos (lista cursos do banco de dados)
- [x] Implementar comando /inscrever <evento_id> (cria inscrição no banco, requer conta vinculada)
- [x] Implementar comando /agenda (mostra próximos eventos do banco)
- [x] Implementar comando /meusstatus (exibe inscrições do usuário)
- [x] Implementar notificação Discord ao criar inscrição no site (sendEnrollmentNotification)
- [x] Implementar notificação Discord ao aprovar/rejeitar inscrição (sendApprovalNotification)
- [x] Implementar notificação Discord ao criar evento (sendEventNotification)
- [x] Adicionar notificações Discord nos procedures tRPC (enroll, updateStatus, events.create)
- [x] Implementar sincronização Discord → Site (comandos criam registros no banco via db.ts)
- [x] Vincular usuários Discord com usuários do site via campo discordId
- [x] Inicializar bot Discord automaticamente ao iniciar servidor (server/_core/index.ts)
- [x] Criar teste de validação de conexão do bot (discord.bot.test.ts - passou)
- [x] Testar bot conectado e comandos registrados (Bot: Cadastro Bombeiro Lotus#9636)

## Fase 84: Corrigir Fuso Horário em Notificações Discord e Email
- [x] Identificar onde horários UTC estão sendo enviados ao Discord (routers.ts linhas 424, 522, 340)
- [x] Converter horários para Brasília (GMT-3) ao criar inscrição (usando toZonedTime do date-fns-tz)
- [x] Converter horários para Brasília (GMT-3) ao aprovar/rejeitar inscrição
- [x] Converter horários para Brasília (GMT-3) ao criar evento
- [x] Templates de email automaticamente usam os horários convertidos (eventDate e eventTime já em GMT-3)

## Fase 85: Adicionar Horário de Início ao Comando /agenda
- [x] Atualizar comando /agenda para exibir horário de início dos eventos
- [x] Converter horário UTC para Brasília antes de exibir (usando toZonedTime)
- [x] Formatar exibição como "dd/MM/yyyy às HH:mm"

## Fase 86: Publicar Certificados no Discord
- [ ] Criar função sendCertificateNotification em discord.ts
- [ ] Adicionar procedure tRPC certificates.publishToDiscord
- [ ] Adicionar botão "Publicar no Discord" na página de certificados (individual)
- [ ] Adicionar botão "Publicar Selecionados no Discord" para publicação em lote
- [ ] Testar publicação individual e em lote

## Fase 62: Publicação de Certificados no Discord
- [x] Criar função sendCertificateNotification em discord.ts
- [x] Criar procedure tRPC publishToDiscord para certificado individual
- [x] Criar procedure tRPC publishBatchToDiscord para múltiplos certificados
- [x] Adicionar botão "Publicar no Discord" na UI de certificado individual
- [x] Implementar confirmação automática para publicação em lote após gerar certificados
- [x] Adicionar controle de permissões (apenas instrutores/admins)
- [x] Criar testes automatizados (10 testes passando)

## Fase 63: Enviar Imagem PNG do Certificado ao Discord
- [x] Modificar sendCertificateNotification para aceitar buffer de imagem PNG
- [x] Atualizar função para enviar imagem como attachment no Discord
- [x] Modificar procedure publishToDiscord para receber imageBuffer
- [x] Modificar procedure publishBatchToDiscord para receber array de imageBuffers
- [x] Atualizar UI para gerar PNG com html2canvas antes de chamar mutation
- [x] Enviar buffer da imagem junto com dados do certificado
- [x] Testar publicação com imagem idêntica ao certificado gerado

## Fase 64: Excluir Cursos de Teste
- [x] Identificar IDs dos cursos "Teste Upload Arquivo" e "Curso Teste para Eventos"
- [x] Excluir cursos do banco de dados
- [x] Verificar se há dados relacionados (eventos, inscrições, materiais) e excluir

## Fase 65: Adicionar Cursos de Instrutor e Alterar SPEED
- [x] Adicionar curso "Instrutor Motolância" com valor R$ 500.000
- [x] Adicionar curso "Instrutor Aero-Vidas" com valor R$ 500.000
- [x] Alterar nome do curso "SPEED" para "SW4"
- [x] Alterar valor do curso SW4 de R$ 600.000 para R$ 500.000

## Fase 66: Atualizar Imagem do Curso SW4
- [x] Fazer upload da nova imagem do veículo SW4 para S3
- [x] Atualizar URL da imagem no banco de dados (curso SW4)
- [x] Verificar se imagem está sendo exibida corretamente

## Fase 67: Atualizar Imagem do Curso Instrutor Motolância
- [x] Fazer upload da nova imagem da motolância para S3
- [x] Atualizar URL da imagem no banco de dados (curso Instrutor Motolância)
- [x] Verificar se imagem está sendo exibida corretamente

## Fase 68: Atualizar Imagem do Curso Instrutor Aero-Vidas
- [x] Fazer upload da nova imagem do helicóptero Águia para S3
- [x] Atualizar URL da imagem no banco de dados (curso Instrutor Aero-Vidas)
- [x] Verificar se imagem está sendo exibida corretamente

## Fase 72: Investigar e Corrigir Erros de Execução dos Comandos do Bot Discord
- [x] Acessar logs do Railway para identificar erros específicos
- [x] Analisar stack traces e mensagens de erro
- [x] Identificar problemas no código (conexão MySQL fechada)
- [x] Corrigir erros identificados (implementar connection pooling)
- [x] Gerar arquivo ZIP com código corrigido
- [ ] Fazer deploy da correção no Railway
- [ ] Validar funcionamento no Discord

## Fase 73: Implementar Botão "Emitir Certificado" na Lista de Inscritos
- [x] Criar endpoint tRPC `emitCertificate` para emissão automática de certificado
- [x] Implementar integração com Discord para publicar certificado no canal
- [x] Adicionar botão "Emitir Certificado" na lista de inscritos (UI)
- [x] Implementar lógica de atualização de status após emissão
- [x] Adicionar feedback visual (loading, success, error)
- [x] Adicionar confirmação antes de emitir certificado
- [x] Validar que apenas instrutores/admins podem emitir certificados
- [x] Salvar checkpoint com implementação completa

## Fase 74: Implementar Geração Automática de Certificado em PNG
- [x] Salvar template do certificado como imagem base
- [x] Instalar dependências necessárias (canvas, @napi-rs/canvas)
- [x] Criar função de geração de certificado com dados dinâmicos
- [x] Integrar geração no endpoint emitCertificate
- [x] Atualizar sendCertificateNotification para anexar imagem
- [ ] Testar geração de certificado com dados reais
- [ ] Validar publicação no Discord com imagem anexada

## Fase 75: Corrigir Erro de Módulo canvas.node
- [x] Remover dependência `canvas` do package.json
- [x] Atualizar certificateGenerator.ts para usar apenas @napi-rs/canvas
- [x] Reiniciar servidor
- [ ] Testar geração de certificado

## Fase 76: Corrigir Erro __dirname is not defined
- [x] Substituir __dirname por import.meta.url no certificateGenerator.ts
- [x] Adicionar log de debug para template path
- [ ] Testar geração de certificado

## Fase 77: Criar Template Limpo do Certificado
- [x] Gerar template limpo do certificado sem texto (apenas design visual)
- [x] Atualizar certificateGenerator.ts para adicionar todos os textos dinamicamente
- [x] Ajustar coordenadas e tamanhos de fonte
- [ ] Testar geração de certificado com dados reais

## Fase 78: Ajustar Posicionamento e Tamanho do Texto no Certificado
- [x] Centralizar texto do certificado (ajustar coordenadas Y para melhor espaçamento)
- [x] Aumentar tamanho de todas as fontes em 2px
- [ ] Testar geração de certificado com ajustes

## Fase 79: Adicionar Timestamp ao Nome do Arquivo do Certificado
- [x] Atualizar discord.ts para adicionar timestamp ao nome do arquivo
- [ ] Testar emissão de certificado sem cache do Discord

## Fase 80: Usar Template Original do Certificado
- [x] Criar versão limpa do template original (certificado-DropeHmb.png) removendo apenas texto
- [x] Fazer upload do template limpo para S3
- [x] Atualizar certificateGenerator.ts para usar novo template
- [x] Testar geração de certificado com template original

## Fase 81: Corrigir Posicionamento e Tamanho das Fontes no Certificado
- [x] Analisar certificado original para identificar coordenadas corretas
- [x] Aumentar significativamente os tamanhos de fonte
- [x] Ajustar coordenadas Y para centralizar conteúdo verticalmente
- [x] Testar certificado corrigido

## Fase 82: Usar Template Verdadeiramente Limpo
- [ ] Verificar template atual (ainda contém texto do original)
- [ ] Gerar novo template 100% limpo sem nenhum texto
- [ ] Ajustar tamanhos de fonte para valores intermediários (não tão grandes)
- [ ] Testar certificado com template limpo

## Fase 83: Ajustar Posicionamento Vertical do Texto no Certificado
- [x] Mover todo o conteúdo central mais para baixo
- [x] Ajustar coordenadas Y de todos os elementos de texto
- [x] Testar certificado com novo posicionamento

## Fase 84: Corrigir Comandos do Discord Não Aparecendo
- [x] Verificar arquivo de registro de comandos (deploy-commands.ts ou similar)
- [x] Verificar se todos os comandos estão sendo registrados corretamente
- [x] Re-registrar comandos no Discord
- [x] Testar comandos no Discord

## Fase 85: Corrigir Comandos Discord e Modificar /ranking
- [x] Corrigir erros de sintaxe no comando /ajuda
- [x] Modificar /ranking para mostrar ranking de instrutores (não alunos)
- [x] Reiniciar bot e testar todos os comandos

## Fase 86: Corrigir Erro tRPC Retornando HTML
- [x] Verificar logs do servidor para identificar erro
- [x] Corrigir erro no backend
- [x] Testar correção no navegador

## Fase 87: Testar Todos os Comandos Discord
- [x] Criar teste automatizado para comandos Discord
- [x] Executar testes e verificar logs
- [x] Reportar resultados ao usuário

## Fase 88: Corrigir Erro de Publicação de Certificado no Discord
- [x] Verificar logs do servidor para identificar erro completo
- [x] Corrigir função de publicação de certificado
- [ ] Testar emissão de certificado

## Fase 89: Implementar Funcionalidade Completa do Comando /meuscertificados
- [x] Criar tabela de certificados no schema do banco
- [x] Salvar certificados emitidos no banco de dados
- [x] Implementar comando /meuscertificados para buscar certificados do usuário
- [ ] Testar comando no Discord

## Fase 90: Corrigir Geração de Certificados em Branco
- [x] Investigar por que o texto não está sendo adicionado ao certificado
- [x] Corrigir função de geração de certificados (função está correta)
- [x] Testar geração de certificado (teste local funcionou)

## Fase 91: Corrigir Comando /meuscertificados
- [x] Verificar se certificados estão sendo salvos no banco com discordId correto
- [x] Corrigir salvamento de certificados para incluir discordId
- [ ] Testar comando /meuscertificados novamente

## Fase 92: Corrigir Certificados em Branco (Novamente)
- [x] Verificar logs do servidor para identificar erro na geração
- [x] Corrigir problema identificado (template local ao invés de URL)
- [x] Testar geração de certificado

## Fase 93: Corrigir Erro 500 ao Emitir Certificado
- [x] Verificar logs do servidor para identificar causa do erro 500
- [x] Corrigir problema identificado (revertido para URL do CDN)
- [x] Testar emissão de certificado

## Fase 94: Corrigir Certificados em Branco no Ambiente de Produção (Preview OK)
- [x] Adicionar tratamento de erro robusto e logs detalhados
- [x] Analisar diferenças entre Preview e produção
- [x] Implementar solução que funcione em ambos ambientes (upload S3)
- [x] Testar no ambiente de produção publicado

## Fase 95: Corrigir Erro ao Publicar Certificado no Discord
- [x] Verificar logs do servidor para identificar causa do erro
- [x] Corrigir problema identificado (aguardar bot estar pronto)
- [x] Testar emissão de certificado

## Fase 96: Investigar Por Que Certificados no S3 Estão em Branco
- [x] Verificar URL do certificado no banco de dados
- [x] Baixar e verificar imagem do S3
- [x] Identificar e corrigir problema (registrar fontes Liberation Serif)

## Fase 97: Resolver Problema Persistente de Certificados em Branco (CRÍTICO)
- [x] Verificar certificado mais recente do S3
- [x] Implementar solução alternativa com HTML/CSS + Puppeteer
- [x] Testar e validar solução final

## Fase 98: Ajustar Posicionamento do Texto no Certificado
- [x] Mover texto central 25px para baixo no CSS
- [x] Testar e validar novo posicionamento

## Fase 99: Ajustar Posicionamento do Texto Mais 70px Para Baixo
- [x] Ajustar CSS para mover texto mais 70px para baixo
- [x] Testar e validar novo posicionamento

## Fase 100: Ajustar Assinatura do Instrutor
- [x] Mover assinatura do instrutor 10px para cima
- [x] Aplicar fonte cursiva elegante na assinatura (Tangerine)
- [x] Testar e validar alterações

## Fase 101: Alterar Fonte da Assinatura para Mistral
- [x] Aplicar fonte cursiva elegante Carattere (similar a Mistral)
- [x] Testar e validar nova fonte

## Fase 102: Incorporar Fonte Mistral Original
- [x] Copiar fonte Mistral para diretório de assets
- [x] Incorporar fonte no certificado usando base64
- [x] Testar certificado com fonte Mistral original

## Fase 103: Corrigir Erro __dirname em Módulo ES
- [x] Substituir __dirname por solução compatível com ES modules
- [x] Testar correção

## Fase 104: Alterar Fontes do Certificado
- [x] Aplicar Great Vibes na assinatura do instrutor
- [x] Aplicar Playfair Display Bold no título, nome do aluno e nome do curso
- [x] Aplicar Playfair Display regular no restante do texto
- [x] Testar e validar novo design

## Fase 105: Ajustar Posicionamento de Elementos no Certificado
- [x] Mover assinatura e cargo do instrutor 20px para cima
- [x] Mover textos "concluiu com êxito o curso de" e nome do curso 10px para cima
- [x] Testar e validar novo posicionamento

## Fase 106: Mover Textos do Curso Mais 10px Para Cima
- [x] Ajustar margem dos textos do curso
- [x] Testar e validar

## Fase 107: Ajustar Posicionamento - Mover Elementos Para Cima
- [x] Mover textos do curso para cima
- [x] Mover matrícula e nome do aluno para cima
- [x] Testar posicionamento final

## Fase 108: Subir Nome do Aluno e Matrícula Mais 10px
- [x] Aumentar margem negativa do nome do aluno
- [x] Testar

## Fase 109: Reverter Posição da Assinatura do Instrutor
- [x] Verificar CSS atual da assinatura
- [x] Corrigir para posição do checkpoint anterior (margin-top: -10px)
- [x] Testar

## Fase 110: Descer Assinatura e Cargo do Instrutor 10px
- [x] Ajustar margin-top da assinatura de -10px para 0px
- [x] Testar

## Fase 111: Mover Textos do Curso e Assinatura 10px Para Baixo
- [x] Aumentar margin-top do .course-intro de 0px para 10px
- [x] Testar

## Fase 112: Corrigir Movimento da Seção do Curso
- [x] Adicionar wrapper div para seção do curso
- [x] Aplicar margin-top: 10px no wrapper
- [x] Testar movimento real

## Fase 113: Centralizar Assinatura e Cargo do Instrutor
- [x] Adicionar text-align: center aos elementos do instrutor
- [x] Testar

## Fase 114: Ajustar Palavra CERTIFICADO
- [x] Aumentar margem negativa em 10px (mover para cima)
- [x] Reduzir fonte de 70px para 68px
- [x] Testar

## Fase 115: Corrigir Movimento da Palavra CERTIFICADO
- [x] Usar position: relative e top: -10px ao invés de margin-top negativo
- [x] Testar que SOMENTE CERTIFICADO se move

## Fase 116: Replicar Design Exato do Certificado de Referência
- [x] Copiar código do gerador individual (certificateGenerator.ts) para o gerador em lote
- [x] Substituir gerador Puppeteer pelo gerador @napi-rs/canvas
- [x] Testar geração e validar que está idêntico ao certificado de referência
- [x] Salvar checkpoint

## Fase 117: Garantir Mesmas Fontes do Gerador Individual
- [x] Verificar fontes usadas no gerador individual
- [x] Aplicar fonte Mistral (base64) no gerador Puppeteer
- [x] Testar e validar

## Fase 118: Copiar Código Exato do Gerador Individual
- [x] Copiar certificateGenerator.ts para certificateGeneratorPuppeteer.ts
- [x] Reiniciar servidor
- [x] Salvar checkpoint

## Fase 119: Restaurar Versão @napi-rs/canvas Correta
- [x] Identificar checkpoint ad7c72e que usa @napi-rs/canvas
- [x] Copiar versão correta para certificateGeneratorPuppeteer.ts
- [x] Testar geração
- [x] Salvar checkpoint

## Fase 120: Aplicar Fonte Manuscrita na Assinatura
- [x] Carregar fonte Mistral (MisstralPersonalUse.ttf)
- [x] Aplicar fonte Mistral na assinatura do instrutor
- [x] Testar geração
- [x] Salvar checkpoint

## Fase 121: Aplicar Fonte Optimistral na Assinatura
- [x] Copiar fonte optimistral-graff.otf para assets/fonts
- [x] Registrar fonte Optimistral no gerador
- [x] Aplicar fonte na assinatura do instrutor
- [x] Testar geração
- [x] Salvar checkpoint

## Fase 122: Mover Palavra CERTIFICADO para Cima
- [x] Ajustar posição Y de 180 para 150
- [x] Testar geração
- [x] Salvar checkpoint

## Fase 123: Corrigir Certificados em Branco em Produção
- [ ] Investigar logs de geração
- [ ] Identificar por que texto não está sendo renderizado
- [ ] Corrigir problema no gerador
- [ ] Testar e validar
- [ ] Salvar checkpoint

## Fase 124: Implementar Versionamento de Arquivos para Evitar Cache
- [x] Adicionar hash único (UUID) ao nome dos certificados
- [x] Testar geração de novos certificados
- [x] Validar que não há conflitos de cache
- [x] Salvar checkpoint

## Fase 125: Corrigir Erro de Import Dinâmico
- [x] Remover cache buster do import (causava erro 500)
- [x] Salvar checkpoint

## Fase 126: Configurar Railway para Deploy Correto
- [x] Adicionar .nvmrc para especificar Node.js 22
- [x] Adicionar nixpacks.toml para configuração do build
- [ ] Exportar para GitHub
- [ ] Validar deploy no Railway
- [ ] Testar certificados em produção

## Fase 127: Corrigir Comando /agenda
- [x] Investigar código do comando /agenda
- [x] Identificar por que não está mostrando cursos agendados
- [x] Corrigir bug (deferReply + editReply)
- [x] Testar localmente
- [ ] Fazer deploy
- [x] Corrigir conversão de timezone no comando /agenda (formatInTimeZone) (mostrando UTC ao invés de horário de Brasília)

## Fase 128: Corrigir Bugs Urgentes no Discord Bot
- [ ] Investigar e corrigir inscrições duplicadas no comando /inscrever
- [ ] Verificar por que horário voltou a aparecer em UTC no /agenda
- [ ] Testar correções localmente
- [ ] Fazer deploy
- [x] Corrigir status de reativação (pending ao invés de confirmed)
- [x] Adicionar disabled no botão durante mutation
- [x] Identificar projetos Railway e repositórios conectados

## Fase 129: URGENTE - Corrigir Inscrições Múltiplas
- [x] Investigar por que 4 inscrições foram criadas
- [x] Adicionar invalidateQueries após mutation
- [x] Adicionar constraint UNIQUE no banco de dados
- [x] Limpar inscrições duplicadas

## Fase 130: Corrigir Certificados em Branco em Produção
- [ ] Investigar código de geração de certificados
- [ ] Verificar carregamento da fonte Optimistral
- [x] Testar geração local
- [ ] Fazer deploy
- [ ] Verificar logs de produção Railway
- [ ] Identificar erro de geração de certificados
- [ ] Corrigir problema de ambiente

## Fase 131: Debug Certificados em Branco
- [x] Adicionar logs detalhados ao gerador
- [x] Verificar se fontes estão sendo carregadas
- [x] Testar geração local
- [ ] Analisar logs de produção
