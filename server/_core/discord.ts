import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, TextChannel } from "discord.js";
import * as db from "../db";
import { users, courseEvents } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID;
const DISCORD_CHANNEL_ENROLLMENTS = process.env.DISCORD_CHANNEL_ENROLLMENTS;
const DISCORD_CHANNEL_EVENTS = process.env.DISCORD_CHANNEL_EVENTS;
const DISCORD_CHANNEL_CERTIFICATES = process.env.DISCORD_CHANNEL_CERTIFICATES;

let client: Client | null = null;

export async function initDiscordBot() {
  if (!DISCORD_BOT_TOKEN) {
    console.log("[Discord] Bot token not configured, skipping initialization");
    return null;
  }

  // Se o bot já está inicializado, retornar a instância existente
  if (client) {
    console.log("[Discord] Bot already initialized, reusing existing instance");
    return client;
  }

  try {
    client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    client.on("ready", () => {
      console.log(`[Discord] Bot logged in as ${client?.user?.tag}`);
    });

    // Register slash commands
    await registerCommands();

    // Handle slash commands
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      await handleCommand(interaction);
    });

    await client.login(DISCORD_BOT_TOKEN);
    return client;
  } catch (error) {
    console.error("[Discord] Failed to initialize bot:", error);
    return null;
  }
}

async function registerCommands() {
  if (!DISCORD_APPLICATION_ID || !DISCORD_SERVER_ID || !DISCORD_BOT_TOKEN) {
    console.log("[Discord] Missing credentials for command registration");
    return;
  }

  const commands = [
    new SlashCommandBuilder()
      .setName("cursos")
      .setDescription("Lista todos os cursos disponíveis"),
    
    new SlashCommandBuilder()
      .setName("inscrever")
      .setDescription("Inscrever-se em um evento/curso")
      .addIntegerOption(option =>
        option
          .setName("evento_id")
          .setDescription("ID do evento para se inscrever")
          .setRequired(true)
      ),
    
    new SlashCommandBuilder()
      .setName("agenda")
      .setDescription("Ver próximos eventos agendados"),
    
    new SlashCommandBuilder()
      .setName("meusstatus")
      .setDescription("Ver status das suas inscrições"),
    
    new SlashCommandBuilder()
      .setName("meuscertificados")
      .setDescription("Ver todos os seus certificados emitidos"),
    
    new SlashCommandBuilder()
      .setName("ranking")
      .setDescription("Ver ranking de alunos por número de certificados"),
    
    new SlashCommandBuilder()
      .setName("ajuda")
      .setDescription("Exibir lista de comandos disponíveis"),
    
    new SlashCommandBuilder()
      .setName("emitircertificado")
      .setDescription("[INSTRUTOR] Emitir certificado para um aluno")
      .addIntegerOption(option =>
        option
          .setName("agendamento_id")
          .setDescription("ID do agendamento")
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName("matricula")
          .setDescription("Matrícula do aluno")
          .setRequired(true)
      ),
    
    new SlashCommandBuilder()
      .setName("lembrete")
      .setDescription("[INSTRUTOR] Enviar lembrete de evento aos inscritos")
      .addIntegerOption(option =>
        option
          .setName("evento_id")
          .setDescription("ID do evento")
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName("mensagem")
          .setDescription("Mensagem do lembrete")
          .setRequired(true)
      ),
    
    new SlashCommandBuilder()
      .setName("avisar")
      .setDescription("[INSTRUTOR] Enviar aviso geral no canal de eventos")
      .addStringOption(option =>
        option
          .setName("mensagem")
          .setDescription("Mensagem do aviso")
          .setRequired(true)
      ),
  ].map(command => command.toJSON());

  const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

  try {
    console.log("[Discord] Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(DISCORD_APPLICATION_ID, DISCORD_SERVER_ID),
      { body: commands }
    );
    console.log("[Discord] Slash commands registered successfully");
  } catch (error) {
    console.error("[Discord] Failed to register commands:", error);
  }
}

async function handleCommand(interaction: ChatInputCommandInteraction) {
  const { commandName } = interaction;
  const startTime = Date.now();
  console.log(`[Discord] Handling command: ${commandName} | Interaction ID: ${interaction.id} | Replied: ${interaction.replied}`);

  try {
    switch (commandName) {
      case "cursos":
        // Buscar cursos do banco de dados
        const courses = await db.getAllCourses();
        if (courses.length === 0) {
          await interaction.reply("📚 **Cursos Disponíveis**\n\nNenhum curso cadastrado no momento.");
        } else {
          const courseList = courses.map((c, idx) => `${idx + 1}. **${c.nome}** - ${c.valor || "Valor a consultar"}`).join("\n");
          await interaction.reply(`📚 **Cursos Disponíveis**\n\n${courseList}\n\nPara mais detalhes, acesse: https://cbm-vice-city.manus.space`);
        }
        break;
      
      case "inscrever":
        const eventoId = interaction.options.getInteger("evento_id", true);
        
        // Buscar usuário pelo Discord ID
        const dbInstance = await db.getDb();
        if (!dbInstance) {
          await interaction.reply("❌ Erro ao conectar com o banco de dados. Tente novamente mais tarde.");
          break;
        }

        const userResults = await dbInstance.select().from(users).where(eq(users.discordId, interaction.user.id));
        const user = userResults[0];

        if (!user) {
          await interaction.reply("❌ Você precisa vincular sua conta Discord ao site primeiro. Acesse: https://cbm-vice-city.manus.space e faça login com Discord.");
          break;
        }

        // Verificar se evento existe
        const event = await db.getCourseEventById(eventoId);
        if (!event) {
          await interaction.reply(`❌ Evento ID ${eventoId} não encontrado.`);
          break;
        }

        // Verificar se já está inscrito
        const existing = await db.getUserEnrollmentForEvent(user.id, eventoId);
        if (existing && existing.status !== "cancelled") {
          await interaction.reply(`⚠️ Você já está inscrito neste evento. Status: **${existing.status}**`);
          break;
        }

        // Criar inscrição
        if (existing && existing.status === "cancelled") {
          await db.updateEnrollmentStatus(existing.id, "pending");
          await interaction.reply(`✅ Inscrição reativada para o evento ID ${eventoId}! Aguarde aprovação do instrutor.`);
        } else {
          await db.createEnrollment({
            userId: user.id,
            eventId: eventoId,
            status: "pending",
          });
          await interaction.reply(`✅ Inscrição realizada com sucesso para o evento ID ${eventoId}! Aguarde aprovação do instrutor.`);
        }
        break;
      
      case "agenda":
        // Defer reply para evitar timeout
        await interaction.deferReply();
        
        // Buscar próximos eventos
        const now = new Date();
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + 1);
        const events = await db.getCourseEventsByDateRange(now, futureDate);
        
        if (events.length === 0) {
          await interaction.editReply("📅 **Próximos Eventos**\n\nNenhum evento agendado para o próximo mês.");
        } else {
          // Converter UTC para horário de Brasília
          const { formatInTimeZone } = await import("date-fns-tz");
          const brasiliaTimezone = "America/Sao_Paulo";

          const eventList = events.slice(0, 5).map((e, idx) => {
            const dateStr = formatInTimeZone(new Date(e.startDate), brasiliaTimezone, "dd/MM/yyyy");
            const timeStr = formatInTimeZone(new Date(e.startDate), brasiliaTimezone, "HH:mm");
            return `${idx + 1}. **${e.title}** - ${dateStr} às ${timeStr} (ID: ${e.id})`;
          }).join("\n");
          await interaction.editReply(`📅 **Próximos Eventos**\n\n${eventList}\n\nPara se inscrever, use: \`/inscrever <evento_id>\`\nAgenda completa: https://cbm-vice-city.manus.space/agendamento`);
        }
        break;
      
      case "meusstatus":
        // Buscar usuário pelo Discord ID
        const dbInst = await db.getDb();
        if (!dbInst) {
          await interaction.reply("❌ Erro ao conectar com o banco de dados.");
          break;
        }

        const userRes = await dbInst.select().from(users).where(eq(users.discordId, interaction.user.id));
        const currentUser = userRes[0];

        if (!currentUser) {
          await interaction.reply("❌ Você precisa vincular sua conta Discord ao site primeiro. Acesse: https://cbm-vice-city.manus.space");
          break;
        }

        // Buscar inscrições do usuário
        const { courseEnrollments } = await import("../../drizzle/schema");
        const enrollments = await dbInst.select().from(courseEnrollments).where(eq(courseEnrollments.userId, currentUser.id));
        
        if (enrollments.length === 0) {
          await interaction.reply("📊 **Suas Inscrições**\n\nVocê ainda não tem inscrições.");
        } else {
          const statusList = await Promise.all(enrollments.slice(0, 5).map(async (enr) => {
            const evt = await db.getCourseEventById(enr.eventId);
            const statusEmoji = enr.status === "confirmed" ? "✅" : enr.status === "pending" ? "⏳" : enr.status === "rejected" ? "❌" : "🚫";
            return `${statusEmoji} **${evt?.title || "Evento"}** - ${enr.status}`;
          }));
          await interaction.reply(`📊 **Suas Inscrições**\n\n${statusList.join("\n")}\n\nDetalhes completos: https://cbm-vice-city.manus.space/agendamento`);
        }
        break;
      
      case "meuscertificados":
        // Buscar certificados do usuário pelo Discord ID
        const discordUserId = interaction.user.id;
        const dbCerts = await db.getDb();
        if (!dbCerts) {
          await interaction.reply("❌ Erro ao conectar com o banco de dados.");
          break;
        }

        const { certificates } = await import("../../drizzle/schema");
        const userCerts = await dbCerts.select().from(certificates).where(eq(certificates.discordId, discordUserId));

        if (userCerts.length === 0) {
          await interaction.reply("🎓 **Seus Certificados**\n\nVocê ainda não possui certificados emitidos.\n\nQuando você concluir um curso, seu certificado aparecerá aqui!");
          break;
        }

        // Criar embed com lista de certificados
        const certEmbed = new EmbedBuilder()
          .setColor(0xfbbf24)
          .setTitle("🎓 Seus Certificados")
          .setDescription(`Você possui **${userCerts.length}** certificado(s) emitido(s).`);

        userCerts.forEach((cert, index) => {
          const issuedDate = new Date(cert.issuedAt).toLocaleDateString("pt-BR");
          certEmbed.addFields({
            name: `${index + 1}. ${cert.courseName}`,
            value: `👤 Aluno: ${cert.studentName} (ID: ${cert.studentId})\n👨‍🏫 Instrutor: ${cert.instructorRank} ${cert.instructorName}\n📅 Emitido em: ${issuedDate}`,
            inline: false
          });
        });

        await interaction.reply({ embeds: [certEmbed] });
        break;
      
      case "ranking":
        // Defer reply porque este comando pode demorar
        await interaction.deferReply();
        
        // Buscar ranking de instrutores por quantidade de cursos aplicados
        const dbInstRank = await db.getDb();
        if (!dbInstRank) {
          await interaction.editReply("❌ Erro ao conectar com o banco de dados.");
          break;
        }

        // Buscar todos os eventos e agrupar por instrutor
        const { courseEvents } = await import("../../drizzle/schema");
        const allEvents = await dbInstRank.select().from(courseEvents);
        const eventCounts = new Map<number, number>();
        allEvents.forEach(event => {
          if (event.instructorId) {
            eventCounts.set(event.instructorId, (eventCounts.get(event.instructorId) || 0) + 1);
          }
        });

        // Buscar informações dos instrutores
        const topInstructors = await Promise.all(
          Array.from(eventCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(async ([instructorId, count]) => {
              const instructorResults = await dbInstRank.select().from(users).where(eq(users.id, instructorId));
              const instructor = instructorResults[0];
              return { name: instructor?.name || "Desconhecido", rank: instructor?.rank || "N/A", count };
            })
        );

        if (topInstructors.length === 0) {
          await interaction.reply("🏆 **Ranking de Instrutores**\n\nNenhum curso aplicado ainda.");
        } else {
          const rankingList = topInstructors.map((inst, idx) => {
            const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`;
            return `${medal} **${inst.name}** (${inst.rank}) - ${inst.count} curso${inst.count > 1 ? 's' : ''} aplicado${inst.count > 1 ? 's' : ''}`;
          }).join("\n");
          await interaction.reply(`🏆 **Ranking de Instrutores**\n\n${rankingList}`);
        }
        break;
      
      case "ajuda":
        const helpText = `📚 **Comandos Disponíveis**\n\n` +
          `**Comandos Gerais:**\n` +
          `• \`/cursos\` - Lista todos os cursos disponíveis\n` +
          `• \`/agenda\` - Ver próximos eventos agendados\n` +
          `• \`/inscrever <evento_id>\` - Inscrever-se em um evento\n` +
          `• \`/meusstatus\` - Ver status das suas inscrições\n` +
          `• \`/meuscertificados\` - Ver seus certificados emitidos\n` +
          `• \`/ranking\` - Ver ranking de instrutores\n` +
          `• \`/ajuda\` - Exibir esta mensagem\n\n` +
          `**Comandos de Instrutor:**\n` +
          `• \`/emitircertificado\` - Emitir certificado para um aluno\n` +
          `• \`/lembrete\` - Enviar lembrete aos inscritos\n` +
          `• \`/avisar\` - Enviar aviso geral\n\n` +
          `**Site:** https://cbm-vice-city.manus.space`;
        await interaction.reply(helpText);
        break;
      
      case "emitircertificado":
        // Verificar se é instrutor (implementar verificação de permissão)
        await interaction.reply("⚠️ Este comando deve ser usado através do site: https://cbm-vice-city.manus.space/agendamento\n\nAcesse a página de agendamentos e clique em 'Emitir Certificado' para o aluno aprovado.");
        break;
      
      case "lembrete":
        await interaction.reply("⚠️ Este comando deve ser usado através do site: https://cbm-vice-city.manus.space/gerenciar-usuarios\n\nAcesse a página de gerenciamento para enviar lembretes.");
        break;
      
      case "avisar":
        await interaction.reply("⚠️ Este comando deve ser usado através do site: https://cbm-vice-city.manus.space/gerenciar-usuarios\n\nAcesse a página de gerenciamento para enviar avisos.");
        break;
      
      default:
        await interaction.reply("❌ Comando não reconhecido. Use `/ajuda` para ver comandos disponíveis.");
    }
  } catch (error) {
    console.error("[Discord] Error handling command:", error);
    // Verificar se a interação já foi respondida antes de tentar responder
    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply("❌ Erro ao processar comando. Tente novamente mais tarde.");
      } catch (replyError) {
        console.error("[Discord] Failed to send error message:", replyError);
      }
    }
  }
}

// Funções para enviar notificações do Site → Discord

export async function sendEnrollmentNotification(data: {
  userName: string;
  userStudentId: string;
  courseName: string;
  eventDate: string;
  eventTime: string;
}) {
  if (!client || !DISCORD_CHANNEL_ENROLLMENTS) return false;

  try {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_ENROLLMENTS) as TextChannel;
    
    const embed = new EmbedBuilder()
      .setColor(0xb91c1c)
      .setTitle("🎓 Nova Inscrição em Curso")
      .addFields(
        { name: "Aluno", value: `${data.userName} | ID: ${data.userStudentId}`, inline: true },
        { name: "Curso", value: data.courseName, inline: true },
        { name: "Data", value: data.eventDate, inline: true },
        { name: "Horário", value: data.eventTime, inline: true },
        { name: "Status", value: "⏳ Pendente de Aprovação", inline: false }
      )
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    console.log("[Discord] Enrollment notification sent");
    return true;
  } catch (error) {
    console.error("[Discord] Failed to send enrollment notification:", error);
    return false;
  }
}

export async function sendApprovalNotification(data: {
  userName: string;
  userStudentId: string;
  courseName: string;
  eventDate: string;
  eventTime: string;
  status: "confirmed" | "rejected";
}) {
  if (!client || !DISCORD_CHANNEL_ENROLLMENTS) return false;

  try {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_ENROLLMENTS) as TextChannel;
    
    const isApproved = data.status === "confirmed";
    const embed = new EmbedBuilder()
      .setColor(isApproved ? 0x22c55e : 0xef4444)
      .setTitle(isApproved ? "✅ Inscrição Aprovada" : "❌ Inscrição Rejeitada")
      .addFields(
        { name: "Aluno", value: `${data.userName} | ID: ${data.userStudentId}`, inline: true },
        { name: "Curso", value: data.courseName, inline: true },
        { name: "Data", value: data.eventDate, inline: true },
        { name: "Horário", value: data.eventTime, inline: true },
        { name: "Status", value: isApproved ? "✅ Confirmado" : "❌ Rejeitado", inline: false }
      )
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    console.log("[Discord] Approval notification sent");
    return true;
  } catch (error) {
    console.error("[Discord] Failed to send approval notification:", error);
    return false;
  }
}

export async function sendEventNotification(data: {
  courseName: string;
  eventDate: string;
  eventTime: string;
  location: string;
  instructorName: string;
}) {
  if (!client || !DISCORD_CHANNEL_EVENTS) return false;

  try {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_EVENTS) as TextChannel;
    
    const embed = new EmbedBuilder()
      .setColor(0xb91c1c)
      .setTitle("📅 Novo Evento Agendado")
      .addFields(
        { name: "Curso", value: data.courseName, inline: false },
        { name: "Data", value: data.eventDate, inline: true },
        { name: "Horário", value: data.eventTime, inline: true },
        { name: "Local", value: data.location, inline: true },
        { name: "Instrutor", value: data.instructorName, inline: false }
      )
      .setFooter({ text: "Faça sua inscrição pelo site ou use /inscrever <evento_id>" })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    console.log("[Discord] Event notification sent");
    return true;
  } catch (error) {
    console.error("[Discord] Failed to send event notification:", error);
    return false;
  }
}

export async function sendCertificateNotification(data: {
  userName: string;
  userStudentId: string;
  courseName: string;
  imageBuffer?: Buffer; // Buffer da imagem PNG do certificado (deprecated)
  certificateUrl?: string; // URL da imagem do certificado no S3
}) {
  if (!client) {
    console.error("[Discord] Bot client not initialized");
    return false;
  }
  
  if (!DISCORD_CHANNEL_CERTIFICATES) {
    console.error("[Discord] DISCORD_CHANNEL_CERTIFICATES not configured");
    return false;
  }
  
  if (!client.isReady()) {
    console.log("[Discord] Bot client is not ready yet, waiting...");
    // Aguardar até 30 segundos para o bot ficar pronto
    const maxWaitTime = 30000; // 30 segundos
    const startTime = Date.now();
    
    while (!client.isReady() && (Date.now() - startTime) < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Aguardar 500ms
    }
    
    if (!client.isReady()) {
      console.error("[Discord] Bot client is still not ready after waiting");
      return false;
    }
    
    console.log("[Discord] Bot client is now ready");
  }

  try {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_CERTIFICATES) as TextChannel;
    
    const embed = new EmbedBuilder()
      .setColor(0xfbbf24)
      .setTitle("🎖️ Certificado Emitido")
      .addFields(
        { name: "Aluno", value: `${data.userName} | ID: ${data.userStudentId}`, inline: true },
        { name: "Curso", value: data.courseName, inline: true }
      )
      .setFooter({ text: "Parabéns pela conclusão do curso!" })
      .setTimestamp();

    // Se houver imagem, anexar ao Discord
    const messagePayload: any = { embeds: [embed] };
    
    // Priorizar certificateUrl (S3) sobre imageBuffer
    if (data.certificateUrl) {
      console.log("[Discord] Using certificate URL from S3:", data.certificateUrl);
      embed.setImage(data.certificateUrl);
      console.log("[Discord] Certificate URL added to embed");
    } else if (data.imageBuffer) {
      console.log("[Discord] Preparing certificate image attachment from buffer");
      console.log("[Discord] Buffer size:", data.imageBuffer.length, "bytes");
      console.log("[Discord] Buffer type:", typeof data.imageBuffer);
      console.log("[Discord] Is Buffer:", Buffer.isBuffer(data.imageBuffer));
      
      const timestamp = Date.now();
      const fileName = `certificado-${data.userName.replace(/\s+/g, "-")}-${data.userStudentId}-${timestamp}.png`;
      console.log("[Discord] File name:", fileName);
      
      const { AttachmentBuilder } = await import("discord.js");
      const attachment = new AttachmentBuilder(data.imageBuffer, { name: fileName });
      messagePayload.files = [attachment];
      
      // Adicionar imagem ao embed
      embed.setImage(`attachment://${fileName}`);
      console.log("[Discord] Attachment created and added to message payload");
    } else {
      console.log("[Discord] No image buffer or URL provided");
    }

    await channel.send(messagePayload);
    console.log("[Discord] Certificate notification sent", data.certificateUrl || data.imageBuffer ? "with image" : "without image");
    return true;
  } catch (error) {
    console.error("[Discord] Failed to send certificate notification:", error);
    return false;
  }
}

export function getDiscordClient() {
  return client;
}
