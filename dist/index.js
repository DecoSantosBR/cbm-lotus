var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  certificates: () => certificates,
  courseApplications: () => courseApplications,
  courseEnrollments: () => courseEnrollments,
  courseEvents: () => courseEvents,
  courseFiles: () => courseFiles,
  courseImages: () => courseImages,
  courseMaterials: () => courseMaterials,
  courses: () => courses,
  users: () => users
});
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, unique } from "drizzle-orm/mysql-core";
var users, courses, courseMaterials, courseImages, courseApplications, courseFiles, courseEvents, courseEnrollments, certificates;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      /**
       * Surrogate primary key. Auto-incremented numeric value managed by the database.
       * Use this for relations between tables.
       */
      id: int("id").autoincrement().primaryKey(),
      /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      discordId: varchar("discordId", { length: 64 }).unique(),
      studentId: varchar("studentId", { length: 100 }),
      profileCompleted: int("profileCompleted").default(0).notNull(),
      rank: mysqlEnum("rank", [
        "Comandante Geral",
        "Subcomandante Geral",
        "Coronel",
        "Tenente-Coronel",
        "Major",
        "Capit\xE3o",
        "1\xBA Tenente",
        "2\xBA Tenente",
        "Subtenente",
        "Cabo",
        "Soldado"
      ]),
      role: mysqlEnum("role", ["member", "instructor", "admin"]).default("member").notNull(),
      approvalStatus: mysqlEnum("approvalStatus", ["pending", "approved", "rejected"]).default("pending").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    courses = mysqlTable("courses", {
      id: varchar("id", { length: 36 }).primaryKey(),
      nome: varchar("nome", { length: 255 }).notNull(),
      descricao: text("descricao"),
      valor: varchar("valor", { length: 50 }),
      requisitos: text("requisitos"),
      imageUrl: text("imageUrl"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    courseMaterials = mysqlTable("course_materials", {
      id: int("id").autoincrement().primaryKey(),
      courseId: varchar("courseId", { length: 36 }).notNull(),
      instructions: text("instructions"),
      video1Title: varchar("video1Title", { length: 255 }),
      video1Url: text("video1Url"),
      video2Title: varchar("video2Title", { length: 255 }),
      video2Url: text("video2Url"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    courseImages = mysqlTable("course_images", {
      id: int("id").autoincrement().primaryKey(),
      courseId: varchar("courseId", { length: 36 }).notNull(),
      imageUrl: text("imageUrl").notNull(),
      caption: varchar("caption", { length: 255 }),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    courseApplications = mysqlTable("course_applications", {
      id: int("id").autoincrement().primaryKey(),
      courseId: varchar("courseId", { length: 36 }).notNull(),
      nomeCompleto: varchar("nomeCompleto", { length: 255 }).notNull(),
      idJogador: varchar("idJogador", { length: 100 }).notNull(),
      telefone: varchar("telefone", { length: 50 }).notNull(),
      horarioDisponivel: text("horarioDisponivel").notNull(),
      status: mysqlEnum("status", ["pending", "accepted", "rejected"]).default("pending").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    courseFiles = mysqlTable("course_files", {
      id: int("id").autoincrement().primaryKey(),
      courseId: varchar("courseId", { length: 36 }).notNull(),
      fileName: varchar("fileName", { length: 255 }).notNull(),
      fileUrl: text("fileUrl").notNull(),
      fileKey: varchar("fileKey", { length: 500 }).notNull(),
      fileSize: int("fileSize"),
      mimeType: varchar("mimeType", { length: 100 }),
      uploadedBy: int("uploadedBy").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    courseEvents = mysqlTable("course_events", {
      id: int("id").autoincrement().primaryKey(),
      courseId: varchar("courseId", { length: 36 }).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      startDate: timestamp("startDate").notNull(),
      endDate: timestamp("endDate").notNull(),
      instructorId: int("instructorId").notNull(),
      location: varchar("location", { length: 255 }),
      maxParticipants: int("maxParticipants"),
      auxiliar: varchar("auxiliar", { length: 255 }),
      // Nome do auxiliar
      ID_auxiliar: varchar("ID_auxiliar", { length: 100 }),
      // Matrícula do auxiliar
      createdBy: int("createdBy").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    courseEnrollments = mysqlTable("course_enrollments", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      eventId: int("eventId").notNull(),
      // Vinculado a courseEvents ao invés de courses
      status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "rejected"]).default("pending").notNull(),
      enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    }, (table) => ({
      // Constraint UNIQUE para prevenir inscrições duplicadas
      // Permite apenas uma inscrição ativa por usuário/evento
      uniqueUserEvent: unique().on(table.userId, table.eventId)
    }));
    certificates = mysqlTable("certificates", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      // ID do usuário no sistema
      discordId: varchar("discordId", { length: 64 }),
      // ID do Discord do usuário (pode ser null se ainda não vinculado)
      studentName: varchar("studentName", { length: 255 }).notNull(),
      studentId: varchar("studentId", { length: 100 }).notNull(),
      // Matrícula do aluno
      courseId: varchar("courseId", { length: 36 }),
      // ID do curso (pode ser null se curso foi deletado)
      courseName: varchar("courseName", { length: 255 }).notNull(),
      instructorName: varchar("instructorName", { length: 255 }).notNull(),
      instructorRank: varchar("instructorRank", { length: 100 }).notNull(),
      auxiliar: varchar("auxiliar", { length: 255 }),
      // Nome do auxiliar
      ID_auxiliar: varchar("ID_auxiliar", { length: 100 }),
      // Matrícula do auxiliar
      issuedAt: timestamp("issuedAt").defaultNow().notNull(),
      issuedBy: int("issuedBy").notNull(),
      // ID do usuário que emitiu o certificado
      certificateUrl: text("certificateUrl")
      // URL da imagem do certificado no S3 (opcional)
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
      discordBotToken: process.env.DISCORD_BOT_TOKEN ?? "",
      discordChannelEvents: process.env.DISCORD_CHANNEL_EVENTS ?? "",
      discordChannelEnrollments: process.env.DISCORD_CHANNEL_ENROLLMENTS ?? "",
      discordChannelCertificates: process.env.DISCORD_CHANNEL_CERTIFICATES ?? ""
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  cancelEnrollment: () => cancelEnrollment,
  completeUserProfile: () => completeUserProfile,
  countPendingApplications: () => countPendingApplications,
  createCourse: () => createCourse,
  createCourseApplication: () => createCourseApplication,
  createCourseEvent: () => createCourseEvent,
  createCourseFile: () => createCourseFile,
  createCourseImage: () => createCourseImage,
  createEnrollment: () => createEnrollment,
  deleteCourseEvent: () => deleteCourseEvent,
  deleteCourseFile: () => deleteCourseFile,
  deleteCourseImage: () => deleteCourseImage,
  deleteEnrollment: () => deleteEnrollment,
  deleteUser: () => deleteUser,
  getAllCourseApplications: () => getAllCourseApplications,
  getAllCourseEvents: () => getAllCourseEvents,
  getAllCourses: () => getAllCourses,
  getAllUsers: () => getAllUsers,
  getCourseById: () => getCourseById,
  getCourseEventById: () => getCourseEventById,
  getCourseEventsByDateRange: () => getCourseEventsByDateRange,
  getCourseFiles: () => getCourseFiles,
  getCourseImages: () => getCourseImages,
  getCourseMaterial: () => getCourseMaterial,
  getDb: () => getDb,
  getEnrollmentCountByEvent: () => getEnrollmentCountByEvent,
  getEventEnrollments: () => getEventEnrollments,
  getUserByOpenId: () => getUserByOpenId,
  getUserByStudentId: () => getUserByStudentId,
  getUserEnrollmentForEvent: () => getUserEnrollmentForEvent,
  updateApplicationStatus: () => updateApplicationStatus,
  updateCourseEvent: () => updateCourseEvent,
  updateEnrollmentStatus: () => updateEnrollmentStatus,
  updateUser: () => updateUser,
  updateUserApproval: () => updateUserApproval,
  upsertCourseMaterial: () => upsertCourseMaterial,
  upsertUser: () => upsertUser
});
import { drizzle } from "drizzle-orm/mysql2";
import { sql, eq, and, ne } from "drizzle-orm";
async function getDb() {
  const isSandbox = process.env.HOSTNAME?.includes("manus.computer") || process.env.HOSTNAME?.includes("sandbox") || process.env.NODE_ENV === "development";
  const databaseUrl = isSandbox ? process.env.DATABASE_URL : process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL;
  if (!_db && databaseUrl) {
    try {
      _db = drizzle(databaseUrl);
      const dbType = databaseUrl?.includes("railway") ? "Railway MySQL" : "Local database";
      const env = isSandbox ? "sandbox" : "production";
      console.log(`[Database] Connected to: ${dbType} (${env})`);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    values.approvalStatus = "approved";
    updateSet.approvalStatus = "approved";
    if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users);
}
async function updateUserApproval(userId, approvalStatus, role) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData = { approvalStatus, updatedAt: /* @__PURE__ */ new Date() };
  if (role) {
    updateData.role = role;
  }
  await db.update(users).set(updateData).where(eq(users.id, userId));
}
async function updateUser(userId, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData = { updatedAt: /* @__PURE__ */ new Date() };
  if (data.name !== void 0) updateData.name = data.name;
  if (data.email !== void 0) updateData.email = data.email;
  if (data.role !== void 0) updateData.role = data.role;
  if (data.rank !== void 0) updateData.rank = data.rank;
  await db.update(users).set(updateData).where(eq(users.id, userId));
}
async function deleteUser(userId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(users).where(eq(users.id, userId));
}
async function completeUserProfile(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({
    name: data.name,
    studentId: data.studentId,
    rank: data.rank,
    role: data.role,
    profileCompleted: 1,
    approvalStatus: "approved",
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(users.id, data.userId));
}
async function getAllCourses() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courses);
}
async function getCourseById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createCourse(course) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courses).values(course);
  return Number(result[0].insertId);
}
async function getCourseMaterial(courseId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(courseMaterials).where(eq(courseMaterials.courseId, courseId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function upsertCourseMaterial(material) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (material.id) {
    await db.update(courseMaterials).set({
      instructions: material.instructions,
      video1Title: material.video1Title,
      video1Url: material.video1Url,
      video2Title: material.video2Title,
      video2Url: material.video2Url,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(courseMaterials.id, material.id));
  } else {
    await db.insert(courseMaterials).values(material);
  }
}
async function createCourseApplication(application) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(courseApplications).values(application);
}
async function getAllCourseApplications() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseApplications);
}
async function updateApplicationStatus(id, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseApplications).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(courseApplications.id, id));
}
async function countPendingApplications() {
  const db = await getDb();
  if (!db) return { count: 0 };
  const result = await db.select().from(courseApplications).where(eq(courseApplications.status, "pending"));
  return { count: result.length };
}
async function createCourseImage(image) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courseImages).values(image);
  return result;
}
async function getCourseImages(courseId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(courseImages).where(eq(courseImages.courseId, courseId));
}
async function deleteCourseImage(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(courseImages).where(eq(courseImages.id, id));
}
async function createCourseFile(file) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(courseFiles).values(file);
  return result.insertId;
}
async function getCourseFiles(courseId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseFiles).where(eq(courseFiles.courseId, courseId));
}
async function deleteCourseFile(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [file] = await db.select().from(courseFiles).where(eq(courseFiles.id, id));
  await db.delete(courseFiles).where(eq(courseFiles.id, id));
  return file;
}
async function createCourseEvent(event) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(courseEvents).values(event);
  return result.insertId;
}
async function getAllCourseEvents() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseEvents);
}
async function getCourseEventsByDateRange(startDate, endDate) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseEvents).where(
    and(
      sql`${courseEvents.startDate} >= ${startDate}`,
      sql`${courseEvents.startDate} <= ${endDate}`
    )
  );
}
async function getCourseEventById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const [result] = await db.select().from(courseEvents).where(eq(courseEvents.id, id));
  return result;
}
async function updateCourseEvent(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseEvents).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(courseEvents.id, id));
}
async function deleteCourseEvent(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(courseEvents).where(eq(courseEvents.id, id));
}
async function createEnrollment(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(courseEnrollments).values(data);
  return result.insertId;
}
async function getUserEnrollmentForEvent(userId, eventId) {
  const db = await getDb();
  if (!db) return null;
  const [enrollment] = await db.select().from(courseEnrollments).where(and(
    eq(courseEnrollments.userId, userId),
    eq(courseEnrollments.eventId, eventId)
  ));
  return enrollment || null;
}
async function getEventEnrollments(eventId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseEnrollments).where(eq(courseEnrollments.eventId, eventId)).orderBy(courseEnrollments.enrolledAt);
}
async function updateEnrollmentStatus(enrollmentId, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseEnrollments).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(courseEnrollments.id, enrollmentId));
}
async function cancelEnrollment(enrollmentId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseEnrollments).set({ status: "cancelled", updatedAt: /* @__PURE__ */ new Date() }).where(eq(courseEnrollments.id, enrollmentId));
}
async function deleteEnrollment(enrollmentId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(courseEnrollments).where(eq(courseEnrollments.id, enrollmentId));
}
async function getEnrollmentCountByEvent(eventId) {
  const db = await getDb();
  if (!db) return 0;
  const [result] = await db.select({ count: sql`count(*)` }).from(courseEnrollments).where(and(
    eq(courseEnrollments.eventId, eventId),
    ne(courseEnrollments.status, "cancelled")
  ));
  return result?.count || 0;
}
async function getUserByStudentId(studentId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.studentId, studentId)).limit(1);
  return result.length > 0 ? result[0] : null;
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/_core/discord.ts
var discord_exports = {};
__export(discord_exports, {
  getDiscordClient: () => getDiscordClient,
  initDiscordBot: () => initDiscordBot,
  sendApprovalNotification: () => sendApprovalNotification,
  sendCertificateNotification: () => sendCertificateNotification,
  sendEnrollmentNotification: () => sendEnrollmentNotification,
  sendEventNotification: () => sendEventNotification
});
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { eq as eq2 } from "drizzle-orm";
async function initDiscordBot() {
  if (!DISCORD_BOT_TOKEN) {
    console.log("[Discord] Bot token not configured, skipping initialization");
    return null;
  }
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
        GatewayIntentBits.GuildMembers
      ]
    });
    client.on("ready", () => {
      console.log(`[Discord] Bot logged in as ${client?.user?.tag}`);
    });
    await registerCommands();
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
    new SlashCommandBuilder().setName("cursos").setDescription("Lista todos os cursos dispon\xEDveis"),
    new SlashCommandBuilder().setName("inscrever").setDescription("Inscrever-se em um evento/curso").addIntegerOption(
      (option) => option.setName("evento_id").setDescription("ID do evento para se inscrever").setRequired(true)
    ),
    new SlashCommandBuilder().setName("agenda").setDescription("Ver pr\xF3ximos eventos agendados"),
    new SlashCommandBuilder().setName("meusstatus").setDescription("Ver status das suas inscri\xE7\xF5es"),
    new SlashCommandBuilder().setName("meuscertificados").setDescription("Ver todos os seus certificados emitidos"),
    new SlashCommandBuilder().setName("ranking").setDescription("Ver ranking de instrutores por cursos aplicados").addStringOption(
      (option) => option.setName("data_inicial").setDescription("Data inicial no formato DD/MM/AAAA").setRequired(true)
    ).addStringOption(
      (option) => option.setName("data_final").setDescription("Data final no formato DD/MM/AAAA").setRequired(true)
    ),
    new SlashCommandBuilder().setName("ajuda").setDescription("Exibir lista de comandos dispon\xEDveis"),
    new SlashCommandBuilder().setName("emitircertificado").setDescription("[INSTRUTOR] Emitir certificado para um aluno").addIntegerOption(
      (option) => option.setName("agendamento_id").setDescription("ID do agendamento").setRequired(true)
    ).addStringOption(
      (option) => option.setName("matricula").setDescription("Matr\xEDcula do aluno").setRequired(true)
    ),
    new SlashCommandBuilder().setName("lembrete").setDescription("[INSTRUTOR] Enviar lembrete de evento aos inscritos").addIntegerOption(
      (option) => option.setName("evento_id").setDescription("ID do evento").setRequired(true)
    ).addStringOption(
      (option) => option.setName("mensagem").setDescription("Mensagem do lembrete").setRequired(true)
    ),
    new SlashCommandBuilder().setName("avisar").setDescription("[INSTRUTOR] Enviar aviso geral no canal de eventos").addStringOption(
      (option) => option.setName("mensagem").setDescription("Mensagem do aviso").setRequired(true)
    )
  ].map((command) => command.toJSON());
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
async function handleCommand(interaction) {
  const { commandName } = interaction;
  const startTime = Date.now();
  console.log(`[Discord] Handling command: ${commandName} | Interaction ID: ${interaction.id} | Replied: ${interaction.replied}`);
  try {
    switch (commandName) {
      case "cursos":
        const courses2 = await getAllCourses();
        if (courses2.length === 0) {
          await interaction.reply("\u{1F4DA} **Cursos Dispon\xEDveis**\n\nNenhum curso cadastrado no momento.");
        } else {
          const courseList = courses2.map((c, idx) => `${idx + 1}. **${c.nome}** - ${c.valor || "Valor a consultar"}`).join("\n");
          await interaction.reply(`\u{1F4DA} **Cursos Dispon\xEDveis**

${courseList}

Para mais detalhes, acesse: https://cbm-vice-city.manus.space`);
        }
        break;
      case "inscrever":
        const eventoId = interaction.options.getInteger("evento_id", true);
        const dbInstance = await getDb();
        if (!dbInstance) {
          await interaction.reply("\u274C Erro ao conectar com o banco de dados. Tente novamente mais tarde.");
          break;
        }
        const userResults = await dbInstance.select().from(users).where(eq2(users.discordId, interaction.user.id));
        const user = userResults[0];
        if (!user) {
          await interaction.reply("\u274C Voc\xEA precisa vincular sua conta Discord ao site primeiro. Acesse: https://cbm-vice-city.manus.space e fa\xE7a login com Discord.");
          break;
        }
        const event = await getCourseEventById(eventoId);
        if (!event) {
          await interaction.reply(`\u274C Evento ID ${eventoId} n\xE3o encontrado.`);
          break;
        }
        const existing = await getUserEnrollmentForEvent(user.id, eventoId);
        if (existing && existing.status !== "cancelled") {
          await interaction.reply(`\u26A0\uFE0F Voc\xEA j\xE1 est\xE1 inscrito neste evento. Status: **${existing.status}**`);
          break;
        }
        if (existing && existing.status === "cancelled") {
          await updateEnrollmentStatus(existing.id, "pending");
          await interaction.reply(`\u2705 Inscri\xE7\xE3o reativada para o evento ID ${eventoId}! Aguarde aprova\xE7\xE3o do instrutor.`);
        } else {
          await createEnrollment({
            userId: user.id,
            eventId: eventoId,
            status: "pending"
          });
          await interaction.reply(`\u2705 Inscri\xE7\xE3o realizada com sucesso para o evento ID ${eventoId}! Aguarde aprova\xE7\xE3o do instrutor.`);
        }
        break;
      case "agenda":
        await interaction.deferReply();
        const now = /* @__PURE__ */ new Date();
        const futureDate = /* @__PURE__ */ new Date();
        futureDate.setMonth(futureDate.getMonth() + 1);
        const events = await getCourseEventsByDateRange(now, futureDate);
        if (events.length === 0) {
          await interaction.editReply("\u{1F4C5} **Pr\xF3ximos Eventos**\n\nNenhum evento agendado para o pr\xF3ximo m\xEAs.");
        } else {
          const { formatInTimeZone } = await import("date-fns-tz");
          const brasiliaTimezone = "America/Sao_Paulo";
          const eventList = events.slice(0, 5).map((e, idx) => {
            const dateStr = formatInTimeZone(new Date(e.startDate), brasiliaTimezone, "dd/MM/yyyy");
            const timeStr = formatInTimeZone(new Date(e.startDate), brasiliaTimezone, "HH:mm");
            return `${idx + 1}. **${e.title}** - ${dateStr} \xE0s ${timeStr} (ID: ${e.id})`;
          }).join("\n");
          await interaction.editReply(`\u{1F4C5} **Pr\xF3ximos Eventos**

${eventList}

Para se inscrever, use: \`/inscrever <evento_id>\`
Agenda completa: https://cbm-vice-city.manus.space/agendamento`);
        }
        break;
      case "meusstatus":
        const dbInst = await getDb();
        if (!dbInst) {
          await interaction.reply("\u274C Erro ao conectar com o banco de dados.");
          break;
        }
        const userRes = await dbInst.select().from(users).where(eq2(users.discordId, interaction.user.id));
        const currentUser = userRes[0];
        if (!currentUser) {
          await interaction.reply("\u274C Voc\xEA precisa vincular sua conta Discord ao site primeiro. Acesse: https://cbm-vice-city.manus.space");
          break;
        }
        const { courseEnrollments: courseEnrollments2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
        const enrollments = await dbInst.select().from(courseEnrollments2).where(eq2(courseEnrollments2.userId, currentUser.id));
        if (enrollments.length === 0) {
          await interaction.reply("\u{1F4CA} **Suas Inscri\xE7\xF5es**\n\nVoc\xEA ainda n\xE3o tem inscri\xE7\xF5es.");
        } else {
          const statusList = await Promise.all(enrollments.slice(0, 5).map(async (enr) => {
            const evt = await getCourseEventById(enr.eventId);
            const statusEmoji = enr.status === "confirmed" ? "\u2705" : enr.status === "pending" ? "\u23F3" : enr.status === "rejected" ? "\u274C" : "\u{1F6AB}";
            return `${statusEmoji} **${evt?.title || "Evento"}** - ${enr.status}`;
          }));
          await interaction.reply(`\u{1F4CA} **Suas Inscri\xE7\xF5es**

${statusList.join("\n")}

Detalhes completos: https://cbm-vice-city.manus.space/agendamento`);
        }
        break;
      case "meuscertificados":
        try {
          const member = interaction.member;
          if (!member) {
            await interaction.reply("\u274C N\xE3o foi poss\xEDvel identificar voc\xEA no servidor.");
            break;
          }
          const guild = interaction.guild;
          if (!guild) {
            await interaction.reply("\u274C Este comando s\xF3 pode ser usado dentro do servidor.");
            break;
          }
          const guildMember = await guild.members.fetch(interaction.user.id);
          const nickname = guildMember.nickname || interaction.user.username;
          console.log(`[Discord] /meuscertificados - Nickname capturado: "${nickname}"`);
          const parts = nickname.split(/[|•]/).map((p) => p.trim());
          console.log(`[Discord] /meuscertificados - Parts extra\xEDdas:`, parts);
          if (parts.length < 2) {
            await interaction.reply(
              `\u274C Seu nickname n\xE3o est\xE1 no formato correto.

Nickname atual: \`${nickname}\`
Formato esperado: \`Cargo | Nome | Matr\xEDcula\` ou \`Cargo \u2022 Nome | Matr\xEDcula\``
            );
            break;
          }
          const matricula = parts[parts.length - 1].trim();
          console.log(`[Discord] /meuscertificados - Matr\xEDcula extra\xEDda: "${matricula}"`);
          if (!matricula) {
            await interaction.reply("\u274C N\xE3o foi poss\xEDvel extrair sua matr\xEDcula do nickname. Verifique se seu nickname est\xE1 no formato correto.");
            break;
          }
          const dbCerts = await getDb();
          if (!dbCerts) {
            await interaction.reply("\u274C Erro ao conectar com o banco de dados.");
            break;
          }
          const { certificates: certsTable } = await Promise.resolve().then(() => (init_schema(), schema_exports));
          const userCerts = await dbCerts.select().from(certsTable).where(eq2(certsTable.studentId, matricula));
          console.log(`[Discord] /meuscertificados - Certificados encontrados: ${userCerts.length}`);
          if (userCerts.length > 0) {
            console.log(`[Discord] /meuscertificados - Primeiro certificado:`, {
              courseName: userCerts[0].courseName,
              studentId: userCerts[0].studentId,
              studentName: userCerts[0].studentName
            });
          }
          if (userCerts.length === 0) {
            await interaction.reply(
              `\u{1F393} **Seus Certificados**

Voc\xEA ainda n\xE3o possui certificados emitidos.

Quando voc\xEA concluir um curso, seu certificado aparecer\xE1 aqui!`
            );
            break;
          }
          const certList = userCerts.map((cert) => {
            const issuedDate = new Date(cert.issuedAt).toLocaleDateString("pt-BR");
            return `\u2022 **${cert.courseName}**
  Instrutor: ${cert.instructorRank} ${cert.instructorName}
  Data: ${issuedDate}`;
          }).join("\n\n");
          const message = `\u{1F393} **Seus Certificados**

Voc\xEA possui **${userCerts.length}** certificado(s):

${certList}`;
          if (message.length > 2e3) {
            const recentCerts = userCerts.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()).slice(0, 10);
            const limitedCertList = recentCerts.map((cert) => {
              const issuedDate = new Date(cert.issuedAt).toLocaleDateString("pt-BR");
              return `\u2022 **${cert.courseName}**
  Instrutor: ${cert.instructorRank} ${cert.instructorName}
  Data: ${issuedDate}`;
            }).join("\n\n");
            await interaction.reply(
              `\u{1F393} **Seus Certificados**

Voc\xEA possui **${userCerts.length}** certificado(s). Mostrando os 10 mais recentes:

${limitedCertList}`
            );
          } else {
            await interaction.reply(message);
          }
        } catch (error) {
          console.error("[Discord] Error in meuscertificados command:", error);
          if (!interaction.replied && !interaction.deferred) {
            try {
              await interaction.reply("\u274C Erro ao buscar certificados. Tente novamente.");
            } catch (replyError) {
              console.error("[Discord] Failed to send error message:", replyError);
            }
          }
        }
        break;
      case "ranking":
        await interaction.deferReply();
        try {
          const dataInicialStr = interaction.options.getString("data_inicial", true);
          const dataFinalStr = interaction.options.getString("data_final", true);
          const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
          const matchInicial = dataInicialStr.match(dateRegex);
          const matchFinal = dataFinalStr.match(dateRegex);
          if (!matchInicial || !matchFinal) {
            await interaction.editReply("\u274C Formato de data inv\xE1lido. Use DD/MM/AAAA (exemplo: 01/01/2024)");
            break;
          }
          const [, diaIni, mesIni, anoIni] = matchInicial;
          const [, diaFim, mesFim, anoFim] = matchFinal;
          const dataInicial = /* @__PURE__ */ new Date(`${anoIni}-${mesIni}-${diaIni}T00:00:00-03:00`);
          const dataFinal = /* @__PURE__ */ new Date(`${anoFim}-${mesFim}-${diaFim}T23:59:59-03:00`);
          if (isNaN(dataInicial.getTime()) || isNaN(dataFinal.getTime())) {
            await interaction.editReply("\u274C Data inv\xE1lida. Verifique os valores informados.");
            break;
          }
          if (dataInicial > dataFinal) {
            await interaction.editReply("\u274C Data inicial deve ser anterior \xE0 data final.");
            break;
          }
          const dbRanking = await getDb();
          if (!dbRanking) {
            await interaction.editReply("\u274C Erro ao conectar com o banco de dados.");
            break;
          }
          const { certificates: certsTable } = await Promise.resolve().then(() => (init_schema(), schema_exports));
          const { gte, lte, and: and2 } = await import("drizzle-orm");
          const certificatesInPeriod = await dbRanking.select().from(certsTable).where(
            and2(
              gte(certsTable.issuedAt, dataInicial),
              lte(certsTable.issuedAt, dataFinal)
            )
          );
          if (certificatesInPeriod.length === 0) {
            await interaction.editReply(
              `\u{1F3C6} **RANKING DE INSTRUTORES**
Per\xEDodo: ${dataInicialStr} - ${dataFinalStr}

Nenhum certificado emitido neste per\xEDodo.`
            );
            break;
          }
          const certsByInstructor = /* @__PURE__ */ new Map();
          certificatesInPeriod.forEach((cert) => {
            if (cert.instructorName && cert.courseName) {
              const key = cert.instructorName;
              if (!certsByInstructor.has(key)) {
                certsByInstructor.set(key, []);
              }
              certsByInstructor.get(key).push({
                instructorName: cert.instructorName,
                instructorRank: cert.instructorRank || "N/A",
                courseName: cert.courseName,
                issuedAt: new Date(cert.issuedAt)
              });
            }
          });
          const instructorCounts = /* @__PURE__ */ new Map();
          certsByInstructor.forEach((certs, instructorName) => {
            certs.sort((a, b) => a.issuedAt.getTime() - b.issuedAt.getTime());
            let coursesApplied = 0;
            let lastCourseEnd = null;
            let lastCourseName = null;
            certs.forEach((cert) => {
              if (!lastCourseEnd || cert.courseName !== lastCourseName || cert.issuedAt.getTime() - lastCourseEnd.getTime() > 20 * 60 * 1e3) {
                coursesApplied++;
                lastCourseName = cert.courseName;
              }
              lastCourseEnd = cert.issuedAt;
            });
            instructorCounts.set(instructorName, {
              name: instructorName,
              rank: certs[0].instructorRank,
              count: coursesApplied
            });
          });
          const topInstructors = Array.from(instructorCounts.values()).sort((a, b) => b.count - a.count).slice(0, 10);
          const rankingList = topInstructors.map((inst, idx) => {
            const medal = idx === 0 ? "\u{1F947}" : idx === 1 ? "\u{1F948}" : idx === 2 ? "\u{1F949}" : `${idx + 1}.`;
            return `${medal} ${inst.rank} ${inst.name} - ${inst.count} curso${inst.count > 1 ? "s" : ""} aplicado${inst.count > 1 ? "s" : ""}`;
          }).join("\n");
          await interaction.editReply(
            `\u{1F3C6} **RANKING DE INSTRUTORES**
Per\xEDodo: ${dataInicialStr} - ${dataFinalStr}

${rankingList}`
          );
        } catch (error) {
          console.error("[Discord] Error in ranking command:", error);
          await interaction.editReply("\u274C Erro ao processar ranking. Tente novamente.");
        }
        break;
      case "ajuda":
        const helpText = `\u{1F4DA} **Comandos Dispon\xEDveis**

**Comandos Gerais:**
\u2022 \`/cursos\` - Lista todos os cursos dispon\xEDveis
\u2022 \`/agenda\` - Ver pr\xF3ximos eventos agendados
\u2022 \`/inscrever <evento_id>\` - Inscrever-se em um evento
\u2022 \`/meusstatus\` - Ver status das suas inscri\xE7\xF5es
\u2022 \`/meuscertificados\` - Ver seus certificados emitidos
\u2022 \`/ranking <data_inicial> <data_final>\` - Ver ranking de instrutores
\u2022 \`/ajuda\` - Exibir esta mensagem

**Comandos de Instrutor:**
\u2022 \`/emitircertificado\` - Emitir certificado para um aluno
\u2022 \`/lembrete\` - Enviar lembrete aos inscritos
\u2022 \`/avisar\` - Enviar aviso geral

**Site:** https://cbm-vice-city.manus.space`;
        await interaction.reply(helpText);
        break;
      case "emitircertificado":
        await interaction.reply("\u26A0\uFE0F Este comando deve ser usado atrav\xE9s do site: https://cbm-vice-city.manus.space/agendamento\n\nAcesse a p\xE1gina de agendamentos e clique em 'Emitir Certificado' para o aluno aprovado.");
        break;
      case "lembrete":
        await interaction.reply("\u26A0\uFE0F Este comando deve ser usado atrav\xE9s do site: https://cbm-vice-city.manus.space/gerenciar-usuarios\n\nAcesse a p\xE1gina de gerenciamento para enviar lembretes.");
        break;
      case "avisar":
        await interaction.reply("\u26A0\uFE0F Este comando deve ser usado atrav\xE9s do site: https://cbm-vice-city.manus.space/gerenciar-usuarios\n\nAcesse a p\xE1gina de gerenciamento para enviar avisos.");
        break;
      default:
        await interaction.reply("\u274C Comando n\xE3o reconhecido. Use `/ajuda` para ver comandos dispon\xEDveis.");
    }
  } catch (error) {
    console.error("[Discord] Error handling command:", error);
    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply("\u274C Erro ao processar comando. Tente novamente mais tarde.");
      } catch (replyError) {
        console.error("[Discord] Failed to send error message:", replyError);
      }
    }
  }
}
async function sendEnrollmentNotification(data) {
  if (!client || !DISCORD_CHANNEL_ENROLLMENTS) return false;
  try {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_ENROLLMENTS);
    const embed = new EmbedBuilder().setColor(12131356).setTitle("\u{1F393} Nova Inscri\xE7\xE3o em Curso").addFields(
      { name: "Aluno", value: `${data.userName} | ID: ${data.userStudentId}`, inline: true },
      { name: "Curso", value: data.courseName, inline: true },
      { name: "Data", value: data.eventDate, inline: true },
      { name: "Hor\xE1rio", value: data.eventTime, inline: true },
      { name: "Status", value: "\u23F3 Pendente de Aprova\xE7\xE3o", inline: false }
    ).setTimestamp();
    await channel.send({ embeds: [embed] });
    console.log("[Discord] Enrollment notification sent");
    return true;
  } catch (error) {
    console.error("[Discord] Failed to send enrollment notification:", error);
    return false;
  }
}
async function sendApprovalNotification(data) {
  if (!client || !DISCORD_CHANNEL_ENROLLMENTS) return false;
  try {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_ENROLLMENTS);
    const isApproved = data.status === "confirmed";
    const embed = new EmbedBuilder().setColor(isApproved ? 2278750 : 15680580).setTitle(isApproved ? "\u2705 Inscri\xE7\xE3o Aprovada" : "\u274C Inscri\xE7\xE3o Rejeitada").addFields(
      { name: "Aluno", value: `${data.userName} | ID: ${data.userStudentId}`, inline: true },
      { name: "Curso", value: data.courseName, inline: true },
      { name: "Data", value: data.eventDate, inline: true },
      { name: "Hor\xE1rio", value: data.eventTime, inline: true },
      { name: "Status", value: isApproved ? "\u2705 Confirmado" : "\u274C Rejeitado", inline: false }
    ).setTimestamp();
    await channel.send({ embeds: [embed] });
    console.log("[Discord] Approval notification sent");
    return true;
  } catch (error) {
    console.error("[Discord] Failed to send approval notification:", error);
    return false;
  }
}
async function sendEventNotification(data) {
  if (!client || !DISCORD_CHANNEL_EVENTS) return false;
  try {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_EVENTS);
    const embed = new EmbedBuilder().setColor(12131356).setTitle("\u{1F4C5} Novo Evento Agendado").addFields(
      { name: "Curso", value: data.courseName, inline: false },
      { name: "Data", value: data.eventDate, inline: true },
      { name: "Hor\xE1rio", value: data.eventTime, inline: true },
      { name: "Local", value: data.location, inline: true },
      { name: "Instrutor", value: data.instructorName, inline: false }
    ).setFooter({ text: "Fa\xE7a sua inscri\xE7\xE3o pelo site ou use /inscrever <evento_id>" }).setTimestamp();
    await channel.send({ embeds: [embed] });
    console.log("[Discord] Event notification sent");
    return true;
  } catch (error) {
    console.error("[Discord] Failed to send event notification:", error);
    return false;
  }
}
async function sendCertificateNotification(data) {
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
    const maxWaitTime = 3e4;
    const startTime = Date.now();
    while (!client.isReady() && Date.now() - startTime < maxWaitTime) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!client.isReady()) {
      console.error("[Discord] Bot client is still not ready after waiting");
      return false;
    }
    console.log("[Discord] Bot client is now ready");
  }
  try {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_CERTIFICATES);
    const embed = new EmbedBuilder().setColor(16498468).setTitle("\u{1F396}\uFE0F Certificado Emitido").addFields(
      { name: "Aluno", value: `${data.userName} | ID: ${data.userStudentId}`, inline: true },
      { name: "Curso", value: data.courseName, inline: true }
    ).setFooter({ text: "Parab\xE9ns pela conclus\xE3o do curso!" }).setTimestamp();
    const messagePayload = { embeds: [embed] };
    if (data.certificateUrl) {
      console.log("[Discord] Using certificate URL from S3:", data.certificateUrl);
      embed.setImage(data.certificateUrl);
      console.log("[Discord] Certificate URL added to embed");
    } else if (data.imageBuffer) {
      console.log("[Discord] Preparing certificate image attachment from buffer");
      console.log("[Discord] Buffer size:", data.imageBuffer.length, "bytes");
      console.log("[Discord] Buffer type:", typeof data.imageBuffer);
      console.log("[Discord] Is Buffer:", Buffer.isBuffer(data.imageBuffer));
      const timestamp2 = Date.now();
      const fileName = `certificado-${data.userName.replace(/\s+/g, "-")}-${data.userStudentId}-${timestamp2}.png`;
      console.log("[Discord] File name:", fileName);
      const { AttachmentBuilder } = await import("discord.js");
      const attachment = new AttachmentBuilder(data.imageBuffer, { name: fileName });
      messagePayload.files = [attachment];
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
function getDiscordClient() {
  return client;
}
var DISCORD_BOT_TOKEN, DISCORD_APPLICATION_ID, DISCORD_SERVER_ID, DISCORD_CHANNEL_ENROLLMENTS, DISCORD_CHANNEL_EVENTS, DISCORD_CHANNEL_CERTIFICATES, client;
var init_discord = __esm({
  "server/_core/discord.ts"() {
    "use strict";
    init_db();
    init_schema();
    DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
    DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID;
    DISCORD_CHANNEL_ENROLLMENTS = process.env.DISCORD_CHANNEL_ENROLLMENTS;
    DISCORD_CHANNEL_EVENTS = process.env.DISCORD_CHANNEL_EVENTS;
    DISCORD_CHANNEL_CERTIFICATES = process.env.DISCORD_CHANNEL_CERTIFICATES;
    client = null;
  }
});

// server/_core/certificateGeneratorPuppeteer.ts
var certificateGeneratorPuppeteer_exports = {};
__export(certificateGeneratorPuppeteer_exports, {
  generateCertificate: () => generateCertificate,
  saveCertificateToFile: () => saveCertificateToFile
});
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
async function generateCertificate(data) {
  try {
    const templateUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/DHBXbOcJsiCfHbTV.png";
    console.log("[CertificateGenerator] Loading clean template from:", templateUrl);
    console.log("[CertificateGenerator] Certificate data:", JSON.stringify(data));
    let template;
    try {
      template = await loadImage(templateUrl);
      console.log("[CertificateGenerator] Template loaded successfully");
      console.log("[CertificateGenerator] Template dimensions:", template.width, "x", template.height);
    } catch (loadError) {
      console.error("[CertificateGenerator] Failed to load template:", loadError);
      throw new Error(`Failed to load template: ${loadError instanceof Error ? loadError.message : String(loadError)}`);
    }
    console.log("[CertificateGenerator] Creating canvas...");
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");
    console.log("[CertificateGenerator] Canvas created:", canvas.width, "x", canvas.height);
    console.log("[CertificateGenerator] Drawing template background...");
    ctx.drawImage(template, 0, 0);
    console.log("[CertificateGenerator] Template background drawn");
    console.log("[CertificateGenerator] Configuring text style...");
    ctx.fillStyle = "#8B0000";
    ctx.textAlign = "center";
    console.log("[CertificateGenerator] Adding text to certificate...");
    ctx.font = "bold 70px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText("CERTIFICADO", canvas.width / 2, 150);
    console.log("[CertificateGenerator] Title added");
    ctx.font = "20px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText("Certificamos que", canvas.width / 2, 210);
    console.log("[CertificateGenerator] Subtitle added");
    ctx.font = "bold 62px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText(data.studentName, canvas.width / 2, 265);
    console.log("[CertificateGenerator] Student name added:", data.studentName);
    ctx.font = "19px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText(`Matr\xEDcula: ${data.studentId}`, canvas.width / 2, 300);
    console.log("[CertificateGenerator] Student ID added:", data.studentId);
    ctx.font = "20px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText("Concluiu com \xEAxito o curso de", canvas.width / 2, 350);
    ctx.font = "bold 48px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText(data.courseName, canvas.width / 2, 395);
    console.log("[CertificateGenerator] Course name added:", data.courseName);
    ctx.font = "36px 'Optimistral', cursive";
    ctx.fillText(data.instructorName, canvas.width / 2, 495);
    console.log("[CertificateGenerator] Instructor name added:", data.instructorName);
    ctx.font = "18px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText(data.instructorRank, canvas.width / 2, 525);
    console.log("[CertificateGenerator] Instructor rank added:", data.instructorRank);
    const buffer = canvas.toBuffer("image/png");
    console.log("[CertificateGenerator] Certificate generated successfully");
    console.log("[CertificateGenerator] Buffer size:", buffer.length, "bytes");
    console.log("[CertificateGenerator] Canvas dimensions:", canvas.width, "x", canvas.height);
    return buffer;
  } catch (error) {
    console.error("[CertificateGenerator] Erro ao gerar certificado:", error);
    throw new Error("Falha ao gerar certificado");
  }
}
async function saveCertificateToFile(certificateBuffer, fileName) {
  const tempDir = path.join(__dirname, "../../temp");
  await fs.mkdir(tempDir, { recursive: true });
  const filePath = path.join(tempDir, `${fileName}.png`);
  await fs.writeFile(filePath, certificateBuffer);
  return filePath;
}
var __filename, __dirname;
var init_certificateGeneratorPuppeteer = __esm({
  "server/_core/certificateGeneratorPuppeteer.ts"() {
    "use strict";
    try {
      const __dirname2 = dirname(fileURLToPath(import.meta.url));
      const fontConfigs = [
        { path: "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf", family: "Liberation Serif" },
        { path: "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf", family: "Liberation Serif" },
        { path: "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf", family: "Liberation Serif" },
        { path: "/usr/share/fonts/truetype/liberation/LiberationSerif-BoldItalic.ttf", family: "Liberation Serif" },
        { path: path.join(__dirname2, "../assets/fonts/MisstralPersonalUse.ttf"), family: "Mistral" },
        { path: path.join(__dirname2, "../assets/fonts/optimistral-graff.otf"), family: "Optimistral" }
      ];
      for (const config of fontConfigs) {
        try {
          if (existsSync(config.path)) {
            GlobalFonts.registerFromPath(config.path, config.family);
            console.log("[CertificateGenerator] Font registered:", config.path);
          }
        } catch (e) {
          console.warn("[CertificateGenerator] Failed to register font:", config.path, e);
        }
      }
      console.log("[CertificateGenerator] All registered fonts:", GlobalFonts.families);
    } catch (e) {
      console.error("[CertificateGenerator] Could not register system fonts:", e);
    }
    __filename = fileURLToPath(import.meta.url);
    __dirname = dirname(__filename);
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  storageGet: () => storageGet,
  storagePut: () => storagePut
});
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
async function buildDownloadUrl(baseUrl, relKey, apiKey) {
  const downloadApiUrl = new URL(
    "v1/storage/downloadUrl",
    ensureTrailingSlash(baseUrl)
  );
  downloadApiUrl.searchParams.set("path", normalizeKey(relKey));
  const response = await fetch(downloadApiUrl, {
    method: "GET",
    headers: buildAuthHeaders(apiKey)
  });
  return (await response.json()).url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}
async function storageGet(relKey) {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  return {
    key,
    url: await buildDownloadUrl(baseUrl, key, apiKey)
  };
}
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_env();
  }
});

// server/certificates.ts
var certificates_exports = {};
__export(certificates_exports, {
  generateCertificateImage: () => generateCertificateImage,
  issueCertificate: () => issueCertificate,
  sendCertificateToDiscord: () => sendCertificateToDiscord,
  uploadCertificateToS3: () => uploadCertificateToS3
});
import puppeteer from "puppeteer";
import fs2 from "fs";
async function generateCertificateImage(data) {
  const { fileURLToPath: fileURLToPath2 } = await import("url");
  const { dirname: dirname2, join } = await import("path");
  const __filename2 = fileURLToPath2(import.meta.url);
  const __dirname2 = dirname2(__filename2);
  const logoPath = join(__dirname2, "assets", "LOTUSBOMBEIROS.png");
  const logoBuffer = fs2.readFileSync(logoPath);
  const logoBase64 = logoBuffer.toString("base64");
  const fontPath = join(__dirname2, "assets", "fonts", "optimistral-graff.otf");
  const fontBuffer = fs2.readFileSync(fontPath);
  const fontBase64 = fontBuffer.toString("base64");
  const certificateId = `CBM-${data.studentId.substring(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @font-face {
          font-family: 'Optimistral';
          src: url('data:font/opentype;base64,${fontBase64}') format('opentype');
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          width: 1200px;
          height: 750px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }
        
        .certificate {
          width: 1200px;
          height: 680px;
          background: linear-gradient(135deg, #F5E6D3 0%, #EDE4D3 100%);
          border: 16px solid #A52A2A;
          border-radius: 20px;
          box-shadow: inset 0 0 0 3px #D4AF37;
          position: relative;
          padding: 50px 60px 80px 60px;
          font-family: Georgia, serif;
        }
        
        .logo {
          position: absolute;
          top: 50px;
          left: 50px;
          width: 100px;
          height: 100px;
        }
        
        .check-icon {
          position: absolute;
          top: 55px;
          right: 90px;
          width: 70px;
          height: 70px;
          border: 4px solid #D4AF37;
          border-radius: 50%;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .check-inner {
          width: 50px;
          height: 50px;
          border: 3px solid #8B1A1A;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .check-inner::after {
          content: '\u2713';
          font-size: 32px;
          color: #8B1A1A;
          font-weight: bold;
        }
        
        
        .title {
          text-align: center;
          margin-top: 100px;
          margin-bottom: 10px;
        }
        
        .title h1 {
          font-size: 56px;
          color: #8B1A1A;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 0;
        }
        
        .subtitle {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .subtitle p {
          font-size: 24px;
          color: #8B1A1A;
          font-style: italic;
        }
        
        .student-name {
          text-align: center;
          margin: 20px 0;
        }
        
        .student-name h2 {
          font-size: 48px;
          color: #8B1A1A;
          font-weight: bold;
          margin: 0;
        }
        
        .student-id {
          text-align: center;
          margin-bottom: 15px;
        }
        
        .student-id p {
          font-size: 20px;
          color: #8B1A1A;
          font-weight: bold;
        }
        
        .divider {
          width: calc(100% - 120px);
          height: 2px;
          background: #8B1A1A;
          margin: 15px auto;
        }
        
        .course-intro {
          text-align: center;
          margin: 15px 0;
        }
        
        .course-intro p {
          font-size: 22px;
          color: #8B1A1A;
          font-style: italic;
        }
        
        .course-name {
          text-align: center;
          margin: 20px 0;
        }
        
        .course-name h2 {
          font-size: 42px;
          color: #8B1A1A;
          font-weight: bold;
          margin: 0;
        }
        
        .signature-section {
          margin-top: 20px;
          text-align: center;
        }
        
        .signature {
          font-family: 'Optimistral', Georgia, cursive;
          font-size: 36px;
          color: #8B1A1A;
          margin-bottom: 5px;
        }
        
        .signature-line {
          width: 400px;
          height: 1.5px;
          background: #8B1A1A;
          margin: 0 auto 10px auto;
        }
        
        .instructor-rank {
          font-size: 22px;
          color: #8B1A1A;
          font-weight: bold;
          margin-top: 5px;
        }
        
        .certificate-id {
          position: absolute;
          bottom: 50px;
          right: 60px;
          font-size: 18px;
          color: #8B1A1A;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <img src="data:image/png;base64,${logoBase64}" class="logo" alt="CBM Lotus Logo">
        
        <div class="check-icon">
          <div class="check-inner"></div>
        </div>
        
        
        <div class="title">
          <h1>CERTIFICADO</h1>
        </div>
        
        <div class="subtitle">
          <p>Certificamos que</p>
        </div>
        
        <div class="student-name">
          <h2>${data.studentName}</h2>
        </div>
        
        <div class="student-id">
          <p>Matr\xEDcula: ${data.studentId}</p>
        </div>
        
        <div class="divider"></div>
        
        <div class="course-intro">
          <p>Concluiu com \xEAxito o curso de</p>
        </div>
        
        <div class="course-name">
          <h2>${data.courseName}</h2>
        </div>
        
        <div class="divider"></div>
        
        <div class="signature-section">
          <div class="signature">${data.instructorName}</div>
          <div class="signature-line"></div>
          <div class="instructor-rank">${data.instructorRank}</div>
        </div>
        
        <div class="certificate-id">ID: ${certificateId}</div>
      </div>
    </body>
    </html>
  `;
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ]
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 750 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    const certificateElement = await page.$(".certificate");
    const screenshot = certificateElement ? await certificateElement.screenshot({ type: "png" }) : await page.screenshot({
      type: "png",
      fullPage: false
    });
    return Buffer.from(screenshot);
  } finally {
    await browser.close();
  }
}
async function uploadCertificateToS3(imageBuffer, fileName) {
  try {
    const result = await storagePut(
      `certificates/${fileName}`,
      imageBuffer,
      "image/png"
    );
    return result.url;
  } catch (error) {
    console.error("[Certificates] Failed to upload to S3:", error);
    throw new Error("Falha ao fazer upload do certificado");
  }
}
async function sendCertificateToDiscord(certificateUrl, data) {
  try {
    const { EmbedBuilder: EmbedBuilder2 } = await import("discord.js");
    const { getDiscordClient: getDiscordClient2 } = await Promise.resolve().then(() => (init_discord(), discord_exports));
    const client2 = getDiscordClient2();
    if (!client2) {
      console.warn("[Certificates] Discord client not available");
      return;
    }
    const channelId = ENV.discordChannelCertificates;
    if (!channelId) {
      console.warn("[Certificates] DISCORD_CHANNEL_CERTIFICATES not configured");
      return;
    }
    const channel = await client2.channels.fetch(channelId);
    if (!channel || !channel.isTextBased() || channel.isDMBased()) {
      console.warn("[Certificates] Invalid channel");
      return;
    }
    const dateStr = data.issuedAt.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo"
    });
    const embed = new EmbedBuilder2().setTitle("\u{1F393} CERTIFICADO EMITIDO").setColor(12131356).addFields(
      {
        name: "Aluno",
        value: `${data.studentName} | ${data.studentId}`,
        inline: false
      },
      { name: "Curso", value: data.courseName, inline: false },
      {
        name: "Instrutor",
        value: `${data.instructorName} | ${data.instructorRank}`,
        inline: false
      }
    );
    if (data.auxiliar && data.ID_auxiliar) {
      embed.addFields({
        name: "Auxiliar",
        value: `${data.auxiliar} | ${data.ID_auxiliar}`,
        inline: false
      });
    }
    embed.addFields({ name: "Data", value: dateStr, inline: false });
    embed.setImage(certificateUrl);
    embed.setTimestamp();
    await channel.send({ embeds: [embed] });
    console.log("[Certificates] Certificate sent to Discord");
  } catch (error) {
    console.error("[Certificates] Failed to send to Discord:", error);
  }
}
async function issueCertificate(data) {
  const imageBuffer = await generateCertificateImage(data);
  const timestamp2 = Date.now();
  const fileName = `${data.studentId}_${timestamp2}.png`;
  const certificateUrl = await uploadCertificateToS3(imageBuffer, fileName);
  await sendCertificateToDiscord(certificateUrl, data);
  return certificateUrl;
}
var init_certificates = __esm({
  "server/certificates.ts"() {
    "use strict";
    init_storage();
    init_env();
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client2) {
    this.client = client2;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client2 = createOAuthHttpClient()) {
    this.client = client2;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
init_db();
import { z as z2 } from "zod";

// server/_core/email.ts
import nodemailer from "nodemailer";
var transporter = null;
function getTransporter() {
  if (!transporter) {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
    const emailPort = parseInt(process.env.EMAIL_PORT || "587");
    if (!emailUser || !emailPass) {
      throw new Error("EMAIL_USER and EMAIL_PASS environment variables are required");
    }
    transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailPort === 465,
      // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
  }
  return transporter;
}
async function sendEmail({ to, subject, html, text: text2 }) {
  try {
    const transport = getTransporter();
    const emailUser = process.env.EMAIL_USER;
    await transport.sendMail({
      from: `"CBM Vice City" <${emailUser}>`,
      to,
      subject,
      text: text2 || html.replace(/<[^>]*>/g, ""),
      // Fallback to stripped HTML if no text provided
      html
    });
    console.log(`[Email] Sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error(`[Email] Failed to send to ${to}:`, error);
    return false;
  }
}
function getEnrollmentApprovedEmailTemplate(params) {
  const { studentName, courseName, eventDate, eventTime, location } = params;
  return {
    subject: `\u2705 Inscri\xE7\xE3o Aprovada - ${courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #16a34a; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">\u2705 Inscri\xE7\xE3o Aprovada!</h1>
          </div>
          <div class="content">
            <p>Ol\xE1, <strong>${studentName}</strong>!</p>
            <p>Sua inscri\xE7\xE3o no curso <strong>${courseName}</strong> foi <strong>aprovada</strong> pelo instrutor.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #16a34a;">Detalhes do Evento:</h3>
              <p><strong>Curso:</strong> ${courseName}</p>
              <p><strong>Data:</strong> ${eventDate}</p>
              <p><strong>Hor\xE1rio:</strong> ${eventTime}</p>
              <p><strong>Local:</strong> ${location}</p>
            </div>

            <p>Compare\xE7a no hor\xE1rio indicado. Sua presen\xE7a \xE9 fundamental!</p>
            <p><strong>For\xE7a & Honra!</strong></p>
          </div>
          <div class="footer">
            <p>1\xBA CBM Vice City - Corpo de Bombeiros Militar</p>
            <p>Este \xE9 um email autom\xE1tico, n\xE3o responda.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}
function getEnrollmentRejectedEmailTemplate(params) {
  const { studentName, courseName, eventDate } = params;
  return {
    subject: `\u274C Inscri\xE7\xE3o N\xE3o Aprovada - ${courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #dc2626; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Inscri\xE7\xE3o N\xE3o Aprovada</h1>
          </div>
          <div class="content">
            <p>Ol\xE1, <strong>${studentName}</strong>!</p>
            <p>Informamos que sua inscri\xE7\xE3o no curso <strong>${courseName}</strong> (${eventDate}) <strong>n\xE3o foi aprovada</strong> pelo instrutor.</p>
            
            <div class="info-box">
              <p>Poss\xEDveis motivos:</p>
              <ul>
                <li>N\xE3o atendimento aos pr\xE9-requisitos do curso</li>
                <li>Vagas preenchidas por ordem de prioridade</li>
                <li>Pend\xEAncias administrativas</li>
              </ul>
            </div>

            <p>Entre em contato com o instrutor respons\xE1vel para mais informa\xE7\xF5es.</p>
            <p>Voc\xEA pode se inscrever em outras turmas dispon\xEDveis no sistema de agendamento.</p>
          </div>
          <div class="footer">
            <p>1\xBA CBM Vice City - Corpo de Bombeiros Militar</p>
            <p>Este \xE9 um email autom\xE1tico, n\xE3o responda.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

// server/routers.ts
init_discord();
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TRPCError as TRPCError3 } from "@trpc/server";
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    }),
    completeProfile: protectedProcedure.input(z2.object({
      name: z2.string(),
      studentId: z2.string(),
      rank: z2.enum([
        "Comandante Geral",
        "Subcomandante Geral",
        "Coronel",
        "Tenente-Coronel",
        "Major",
        "Capit\xE3o",
        "1\xBA Tenente",
        "2\xBA Tenente",
        "Subtenente",
        "Cabo",
        "Soldado"
      ])
    })).mutation(async ({ input, ctx }) => {
      let role;
      if (["Comandante Geral", "Subcomandante Geral", "Coronel", "Tenente-Coronel"].includes(input.rank)) {
        role = "admin";
      } else if (["Major", "Capit\xE3o", "1\xBA Tenente", "2\xBA Tenente"].includes(input.rank)) {
        role = "instructor";
      } else {
        role = "member";
      }
      await completeUserProfile({
        userId: ctx.user.id,
        name: input.name,
        studentId: input.studentId,
        rank: input.rank,
        role
      });
      return { success: true };
    })
  }),
  courses: router({
    list: publicProcedure.query(async () => {
      return await getAllCourses();
    }),
    getById: publicProcedure.input(z2.object({ id: z2.string() })).query(async ({ input }) => {
      return await getCourseById(input.id);
    }),
    getMaterial: publicProcedure.input(z2.object({ courseId: z2.string() })).query(async ({ input }) => {
      return await getCourseMaterial(input.courseId);
    }),
    updateMaterial: protectedProcedure.input(z2.object({
      id: z2.number().optional(),
      courseId: z2.string(),
      instructions: z2.string(),
      video1Title: z2.string().optional(),
      video1Url: z2.string().optional(),
      video2Title: z2.string().optional(),
      video2Url: z2.string().optional()
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      await upsertCourseMaterial(input);
      return { success: true };
    }),
    // Course Images
    uploadImage: protectedProcedure.input(z2.object({
      courseId: z2.string(),
      imageUrl: z2.string(),
      caption: z2.string().optional()
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      await createCourseImage(input);
      return { success: true };
    }),
    getImages: publicProcedure.input(z2.object({ courseId: z2.string() })).query(async ({ input }) => {
      return await getCourseImages(input.courseId);
    }),
    deleteImage: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      await deleteCourseImage(input.id);
      return { success: true };
    }),
    // Course Files
    uploadFile: protectedProcedure.input(z2.object({
      courseId: z2.string(),
      fileName: z2.string(),
      fileUrl: z2.string(),
      fileKey: z2.string(),
      fileSize: z2.number().optional(),
      mimeType: z2.string().optional()
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role === "member") {
        throw new TRPCError3({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem fazer upload de arquivos" });
      }
      const fileId = await createCourseFile({
        ...input,
        uploadedBy: ctx.user.id
      });
      return { success: true, fileId };
    }),
    getFiles: publicProcedure.input(z2.object({ courseId: z2.string() })).query(async ({ input }) => {
      return await getCourseFiles(input.courseId);
    }),
    deleteFile: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role === "member") {
        throw new TRPCError3({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem deletar arquivos" });
      }
      const file = await deleteCourseFile(input.id);
      return { success: true, file };
    })
  }),
  users: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      return await getAllUsers();
    }),
    approve: protectedProcedure.input(z2.object({
      userId: z2.number(),
      role: z2.enum(["member", "instructor", "admin"])
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      await updateUserApproval(input.userId, "approved", input.role);
      return { success: true };
    }),
    reject: protectedProcedure.input(z2.object({
      userId: z2.number()
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      await updateUserApproval(input.userId, "rejected");
      return { success: true };
    }),
    update: protectedProcedure.input(z2.object({
      userId: z2.number(),
      name: z2.string().optional(),
      email: z2.string().email().optional(),
      role: z2.enum(["member", "instructor", "admin"]).optional(),
      rank: z2.enum([
        "Comandante Geral",
        "Subcomandante Geral",
        "Coronel",
        "Tenente-Coronel",
        "Major",
        "Capit\xE3o",
        "1\xBA Tenente",
        "2\xBA Tenente",
        "Subtenente",
        "Cabo",
        "Soldado"
      ]).optional()
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      const { userId, ...data } = input;
      await updateUser(userId, data);
      return { success: true };
    }),
    delete: protectedProcedure.input(z2.object({ userId: z2.number() })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      if (ctx.user.id === input.userId) {
        throw new TRPCError3({ code: "BAD_REQUEST", message: "Cannot delete your own account" });
      }
      await deleteUser(input.userId);
      return { success: true };
    })
  }),
  applications: router({
    create: publicProcedure.input(z2.object({
      courseId: z2.string(),
      nomeCompleto: z2.string(),
      idJogador: z2.string(),
      telefone: z2.string(),
      horarioDisponivel: z2.string()
    })).mutation(async ({ input }) => {
      await createCourseApplication(input);
      return { success: true };
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "instructor") {
        throw new TRPCError3({ code: "FORBIDDEN" });
      }
      return await getAllCourseApplications();
    }),
    updateStatus: protectedProcedure.input(z2.object({
      id: z2.number(),
      status: z2.enum(["pending", "accepted", "rejected"])
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "instructor") {
        throw new TRPCError3({ code: "FORBIDDEN" });
      }
      await updateApplicationStatus(input.id, input.status);
      return { success: true };
    }),
    countPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "instructor") {
        return { count: 0 };
      }
      return await countPendingApplications();
    })
  }),
  events: router({
    list: publicProcedure.query(async () => {
      return await getAllCourseEvents();
    }),
    getByDateRange: publicProcedure.input(z2.object({
      startDate: z2.string(),
      endDate: z2.string()
    })).query(async ({ input }) => {
      const start = new Date(input.startDate);
      const end = new Date(input.endDate);
      return await getCourseEventsByDateRange(start, end);
    }),
    create: protectedProcedure.input(z2.object({
      courseId: z2.string(),
      title: z2.string(),
      description: z2.string().optional(),
      startDate: z2.string(),
      endDate: z2.string(),
      instructorId: z2.number(),
      location: z2.string().optional(),
      maxParticipants: z2.number().optional()
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem criar eventos" });
      }
      console.log("[Event Create] Input:", JSON.stringify(input, null, 2));
      const course = await getCourseById(input.courseId);
      if (!course) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Curso n\xE3o encontrado" });
      }
      const eventId = await createCourseEvent({
        ...input,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        createdBy: ctx.user.id
      });
      try {
        const course2 = await getCourseById(input.courseId);
        const dbInstance = await getDb();
        if (course2 && dbInstance) {
          const { users: usersTable } = await Promise.resolve().then(() => (init_schema(), schema_exports));
          const { eq: eqOp } = await import("drizzle-orm");
          const instructorResults = await dbInstance.select().from(usersTable).where(eqOp(usersTable.id, input.instructorId));
          const instructor = instructorResults[0];
          if (instructor) {
            const { toZonedTime } = await import("date-fns-tz");
            const brasiliaTimezone = "America/Sao_Paulo";
            const startDateBrasilia = toZonedTime(new Date(input.startDate), brasiliaTimezone);
            const endDateBrasilia = toZonedTime(new Date(input.endDate), brasiliaTimezone);
            await sendEventNotification({
              courseName: course2.nome,
              eventDate: format(startDateBrasilia, "dd/MM/yyyy", { locale: ptBR }),
              eventTime: `${format(startDateBrasilia, "HH:mm")} - ${format(endDateBrasilia, "HH:mm")}`,
              location: input.location || "A definir",
              instructorName: instructor.name || "Instrutor"
            });
          }
        }
      } catch (error) {
        console.error("[Event] Failed to send Discord notification:", error);
      }
      return { id: eventId, success: true };
    }),
    update: protectedProcedure.input(z2.object({
      id: z2.number(),
      courseId: z2.string().optional(),
      title: z2.string().optional(),
      description: z2.string().optional(),
      startDate: z2.string().optional(),
      endDate: z2.string().optional(),
      instructorId: z2.number().optional(),
      location: z2.string().optional(),
      maxParticipants: z2.number().optional()
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem editar eventos" });
      }
      const { id, ...data } = input;
      const updateData = { ...data };
      if (data.startDate) updateData.startDate = new Date(data.startDate);
      if (data.endDate) updateData.endDate = new Date(data.endDate);
      await updateCourseEvent(id, updateData);
      return { success: true };
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem deletar eventos" });
      }
      await deleteCourseEvent(input.id);
      return { success: true };
    })
  }),
  enrollments: router({
    // Fazer inscrição em um evento
    enroll: protectedProcedure.input(z2.object({ eventId: z2.number() })).mutation(async ({ input, ctx }) => {
      const existing = await getUserEnrollmentForEvent(ctx.user.id, input.eventId);
      if (existing) {
        if (existing.status === "cancelled" || existing.status === "rejected") {
          await updateEnrollmentStatus(existing.id, "pending");
          return { success: true, enrollmentId: existing.id, message: "Inscri\xE7\xE3o reativada. Aguarde aprova\xE7\xE3o do instrutor." };
        }
        throw new TRPCError3({ code: "BAD_REQUEST", message: "Voc\xEA j\xE1 est\xE1 inscrito neste evento" });
      }
      const enrollmentId = await createEnrollment({
        userId: ctx.user.id,
        eventId: input.eventId,
        status: "pending"
        // Inscrição pendente aguardando aprovação do instrutor
      });
      const event = await getCourseEventById(input.eventId);
      if (event) {
        const course = await getCourseById(event.courseId);
        if (course) {
          const { toZonedTime } = await import("date-fns-tz");
          const brasiliaTimezone = "America/Sao_Paulo";
          const startDateBrasilia = toZonedTime(new Date(event.startDate), brasiliaTimezone);
          const endDateBrasilia = toZonedTime(new Date(event.endDate), brasiliaTimezone);
          await sendEnrollmentNotification({
            userName: ctx.user.name || "Usu\xE1rio",
            userStudentId: ctx.user.studentId || "N/A",
            courseName: course.nome,
            eventDate: format(startDateBrasilia, "dd/MM/yyyy", { locale: ptBR }),
            eventTime: `${format(startDateBrasilia, "HH:mm")} - ${format(endDateBrasilia, "HH:mm")}`
          });
        }
      }
      return { success: true, enrollmentId, message: "Inscri\xE7\xE3o realizada com sucesso" };
    }),
    // Cancelar inscrição
    cancel: protectedProcedure.input(z2.object({ enrollmentId: z2.number() })).mutation(async ({ input, ctx }) => {
      await cancelEnrollment(input.enrollmentId);
      return { success: true };
    }),
    // Listar inscrições de um evento (com dados dos usuários)
    listByEvent: publicProcedure.input(z2.object({ eventId: z2.number() })).query(async ({ input }) => {
      const enrollments = await getEventEnrollments(input.eventId);
      const dbInstance = await getDb();
      if (!dbInstance) return [];
      const { users: usersTable } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eqOp } = await import("drizzle-orm");
      const enrollmentsWithUsers = await Promise.all(
        enrollments.map(async (enrollment) => {
          const userResults = await dbInstance.select().from(usersTable).where(eqOp(usersTable.id, enrollment.userId));
          const user = userResults[0];
          return {
            ...enrollment,
            user: user ? {
              id: user.id,
              name: user.name,
              studentId: user.studentId,
              rank: user.rank
            } : null
          };
        })
      );
      return enrollmentsWithUsers;
    }),
    // Verificar inscrição do usuário em um evento
    myEnrollment: protectedProcedure.input(z2.object({ eventId: z2.number() })).query(async ({ input, ctx }) => {
      return await getUserEnrollmentForEvent(ctx.user.id, input.eventId);
    }),
    // Atualizar status de inscrição (apenas instrutores/admins)
    updateStatus: protectedProcedure.input(z2.object({
      enrollmentId: z2.number(),
      status: z2.enum(["pending", "confirmed", "cancelled", "rejected"])
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem gerenciar inscri\xE7\xF5es" });
      }
      await updateEnrollmentStatus(input.enrollmentId, input.status);
      if (input.status === "confirmed" || input.status === "rejected") {
        try {
          const dbInstance = await getDb();
          if (dbInstance) {
            const { courseEnrollments: courseEnrollments2, courseEvents: courseEvents3, courses: courses2, users: usersTable } = await Promise.resolve().then(() => (init_schema(), schema_exports));
            const { eq: eqOp } = await import("drizzle-orm");
            const enrollmentResults = await dbInstance.select().from(courseEnrollments2).where(eqOp(courseEnrollments2.id, input.enrollmentId));
            const enrollment = enrollmentResults[0];
            if (enrollment) {
              const eventResults = await dbInstance.select().from(courseEvents3).where(eqOp(courseEvents3.id, enrollment.eventId));
              const event = eventResults[0];
              const userResults = await dbInstance.select().from(usersTable).where(eqOp(usersTable.id, enrollment.userId));
              const user = userResults[0];
              if (event && user && user.email) {
                const courseResults = await dbInstance.select().from(courses2).where(eqOp(courses2.id, event.courseId));
                const course = courseResults[0];
                if (course) {
                  const { toZonedTime } = await import("date-fns-tz");
                  const brasiliaTimezone = "America/Sao_Paulo";
                  const startDateBrasilia = toZonedTime(new Date(event.startDate), brasiliaTimezone);
                  const endDateBrasilia = toZonedTime(new Date(event.endDate), brasiliaTimezone);
                  const eventDate = format(startDateBrasilia, "dd/MM/yyyy", { locale: ptBR });
                  const eventTime = `${format(startDateBrasilia, "HH:mm")} - ${format(endDateBrasilia, "HH:mm")}`;
                  if (input.status === "confirmed") {
                    const emailTemplate = getEnrollmentApprovedEmailTemplate({
                      studentName: user.name || "Aluno",
                      courseName: course.nome,
                      eventDate,
                      eventTime,
                      location: event.location || "A definir"
                    });
                    await sendEmail({
                      to: user.email,
                      subject: emailTemplate.subject,
                      html: emailTemplate.html
                    });
                  } else if (input.status === "rejected") {
                    const emailTemplate = getEnrollmentRejectedEmailTemplate({
                      studentName: user.name || "Aluno",
                      courseName: course.nome,
                      eventDate
                    });
                    await sendEmail({
                      to: user.email,
                      subject: emailTemplate.subject,
                      html: emailTemplate.html
                    });
                  }
                  await sendApprovalNotification({
                    userName: user.name || "Usu\xE1rio",
                    userStudentId: user.studentId || "N/A",
                    courseName: course.nome,
                    eventDate,
                    eventTime,
                    status: input.status
                  });
                }
              }
            }
          }
        } catch (emailError) {
          console.error("[Enrollment] Failed to send email/notification:", emailError);
        }
      }
      return { success: true };
    }),
    // Contar inscrições de um evento
    count: publicProcedure.input(z2.object({ eventId: z2.number() })).query(async ({ input }) => {
      return await getEnrollmentCountByEvent(input.eventId);
    }),
    // Emitir certificado para um inscrito
    emitCertificate: protectedProcedure.input(z2.object({
      enrollmentId: z2.number()
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem emitir certificados" });
      }
      const dbInstance = await getDb();
      if (!dbInstance) {
        throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao conectar com banco de dados" });
      }
      const { courseEnrollments: courseEnrollments2, courseEvents: courseEvents3, courses: courses2, users: usersTable } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eqOp } = await import("drizzle-orm");
      const enrollmentResults = await dbInstance.select().from(courseEnrollments2).where(eqOp(courseEnrollments2.id, input.enrollmentId));
      const enrollment = enrollmentResults[0];
      if (!enrollment) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Inscri\xE7\xE3o n\xE3o encontrada" });
      }
      const eventResults = await dbInstance.select().from(courseEvents3).where(eqOp(courseEvents3.id, enrollment.eventId));
      const event = eventResults[0];
      if (!event) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Evento n\xE3o encontrado" });
      }
      const courseResults = await dbInstance.select().from(courses2).where(eqOp(courses2.id, event.courseId));
      const course = courseResults[0];
      if (!course) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Curso n\xE3o encontrado" });
      }
      const userResults = await dbInstance.select().from(usersTable).where(eqOp(usersTable.id, enrollment.userId));
      const student = userResults[0];
      if (!student) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const instructorResults = await dbInstance.select().from(usersTable).where(eqOp(usersTable.id, event.instructorId));
      const instructor = instructorResults[0];
      if (!instructor) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Instrutor n\xE3o encontrado" });
      }
      const { generateCertificate: generateCertificate2 } = await Promise.resolve().then(() => (init_certificateGeneratorPuppeteer(), certificateGeneratorPuppeteer_exports));
      console.log("[EmitCertificate] Generating certificate for:", student.name, student.studentId, course.nome);
      const certificateBuffer = await generateCertificate2({
        studentName: student.name || "Aluno",
        studentId: student.studentId || "N/A",
        courseName: course.nome,
        instructorName: instructor.name || "Instrutor",
        instructorRank: instructor.rank || "Tenente-Coronel"
      });
      console.log("[EmitCertificate] Certificate buffer generated, size:", certificateBuffer.length, "bytes");
      const { storagePut: storagePut2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      const timestamp2 = Date.now();
      const randomHash = Math.random().toString(36).substring(2, 10);
      const fileName = `certificado-${student.studentId}-${course.nome.replace(/\s+/g, "-")}-${timestamp2}-${randomHash}.png`;
      const s3Key = `certificates/${fileName}`;
      console.log("[EmitCertificate] Uploading certificate to S3:", s3Key);
      const { url: certificateUrl } = await storagePut2(s3Key, certificateBuffer, "image/png");
      console.log("[EmitCertificate] Certificate uploaded to S3:", certificateUrl);
      const { sendCertificateNotification: sendCertificateNotification2 } = await Promise.resolve().then(() => (init_discord(), discord_exports));
      const success = await sendCertificateNotification2({
        userName: student.name || "Aluno",
        userStudentId: student.studentId || "N/A",
        courseName: course.nome,
        certificateUrl
        // Enviar URL ao invés do buffer
      });
      if (!success) {
        throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Falha ao publicar certificado no Discord" });
      }
      const { certificates: certificates2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      await dbInstance.insert(certificates2).values({
        userId: student.id,
        discordId: student.discordId || null,
        studentName: student.name || "Aluno",
        studentId: student.studentId || "N/A",
        courseId: course.id,
        courseName: course.nome,
        instructorName: instructor.name || "Instrutor",
        instructorRank: instructor.rank || "Tenente-Coronel",
        issuedBy: ctx.user.id,
        certificateUrl
        // Salvar URL no banco
      });
      if (enrollment.status !== "confirmed") {
        await updateEnrollmentStatus(input.enrollmentId, "confirmed");
      }
      return { success: true, message: "Certificado emitido e publicado no Discord com sucesso!" };
    })
  }),
  // Router de certificados
  certificates: router({
    // Publicar certificado no Discord
    publishToDiscord: protectedProcedure.input(z2.object({
      studentName: z2.string(),
      studentId: z2.string(),
      courseName: z2.string(),
      imageBase64: z2.string().optional()
      // Imagem PNG em base64
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      const { sendCertificateNotification: sendCertificateNotification2 } = await Promise.resolve().then(() => (init_discord(), discord_exports));
      let imageBuffer;
      if (input.imageBase64) {
        const base64Data = input.imageBase64.replace(/^data:image\/png;base64,/, "");
        imageBuffer = Buffer.from(base64Data, "base64");
      }
      const success = await sendCertificateNotification2({
        userName: input.studentName,
        userStudentId: input.studentId,
        courseName: input.courseName,
        imageBuffer
      });
      if (!success) {
        throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Falha ao publicar no Discord" });
      }
      const { certificates: certificates2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const dbInstance = await getDb();
      if (dbInstance) {
        const { users: users2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
        const { eq: eq4 } = await import("drizzle-orm");
        const [user] = await dbInstance.select().from(users2).where(eq4(users2.studentId, input.studentId));
        const { courses: courses2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
        const [course] = await dbInstance.select().from(courses2).where(eq4(courses2.nome, input.courseName));
        await dbInstance.insert(certificates2).values({
          userId: user?.id || 0,
          // 0 se usuário não encontrado
          discordId: user?.discordId || null,
          studentName: input.studentName,
          studentId: input.studentId,
          courseId: course?.id || null,
          courseName: input.courseName,
          instructorName: ctx.user.name || "Instrutor",
          instructorRank: ctx.user.rank || "Tenente-Coronel",
          issuedBy: ctx.user.id
        });
      }
      return { success: true, message: "Certificado publicado no Discord com sucesso!" };
    }),
    // Publicar múltiplos certificados no Discord (em lote)
    publishBatchToDiscord: protectedProcedure.input(z2.object({
      certificates: z2.array(z2.object({
        studentName: z2.string(),
        studentId: z2.string(),
        courseName: z2.string(),
        imageBase64: z2.string().optional()
        // Imagem PNG em base64
      }))
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      const { sendCertificateNotification: sendCertificateNotification2 } = await Promise.resolve().then(() => (init_discord(), discord_exports));
      const { storagePut: storagePut2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      const { certificates: certificates2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const dbInstance = await getDb();
      let successCount = 0;
      let failCount = 0;
      for (const cert of input.certificates) {
        try {
          let certificateBuffer;
          if (cert.imageBase64) {
            const base64Data = cert.imageBase64.replace(/^data:image\/png;base64,/, "");
            certificateBuffer = Buffer.from(base64Data, "base64");
          }
          if (!certificateBuffer) {
            console.error("[PublishBatch] No certificate buffer for", cert.studentName);
            failCount++;
            continue;
          }
          const timestamp2 = Date.now();
          const randomHash = Math.random().toString(36).substring(2, 10);
          const fileName = `certificado-${cert.studentId}-${cert.courseName.replace(/\s+/g, "-")}-${timestamp2}-${randomHash}.png`;
          const s3Key = `certificates/${fileName}`;
          console.log("[PublishBatch] Uploading certificate to S3:", s3Key);
          const { url: certificateUrl } = await storagePut2(s3Key, certificateBuffer, "image/png");
          console.log("[PublishBatch] Certificate uploaded:", certificateUrl);
          const success = await sendCertificateNotification2({
            userName: cert.studentName,
            userStudentId: cert.studentId,
            courseName: cert.courseName,
            certificateUrl
          });
          if (success) {
            successCount++;
            if (dbInstance) {
              await dbInstance.insert(certificates2).values({
                userId: ctx.user.id,
                // Usar ID do usuário que está gerando
                discordId: null,
                studentName: cert.studentName,
                studentId: cert.studentId,
                courseId: "",
                // Não temos courseId aqui
                courseName: cert.courseName,
                instructorName: ctx.user.name || "Instrutor",
                instructorRank: ctx.user.rank || "Tenente-Coronel",
                issuedBy: ctx.user.id,
                certificateUrl
              });
            }
          } else {
            failCount++;
          }
        } catch (error) {
          console.error("[PublishBatch] Error processing certificate:", error);
          failCount++;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      return {
        success: true,
        message: `${successCount} certificado(s) publicado(s) com sucesso. ${failCount > 0 ? `${failCount} falharam.` : ""}`,
        successCount,
        failCount
      };
    }),
    // Emissão individual de certificado (novo)
    // Emissão individual de certificado
    issueIndividual: protectedProcedure.input(z2.object({
      studentName: z2.string(),
      studentId: z2.string(),
      // Matrícula do aluno
      courseId: z2.string(),
      // ID do curso (UUID)
      courseName: z2.string(),
      instructorName: z2.string(),
      instructorRank: z2.string(),
      auxiliarMatricula: z2.string().optional()
      // Matrícula do auxiliar (opcional)
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem emitir certificados" });
      }
      const { issueCertificate: issueCertificate2 } = await Promise.resolve().then(() => (init_certificates(), certificates_exports));
      const { getUserByStudentId: getUserByStudentId2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { certificates: certificates2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const dbInstance = await getDb();
      let auxiliarNome;
      if (input.auxiliarMatricula) {
        const auxiliar = await getUserByStudentId2(input.auxiliarMatricula);
        if (auxiliar) {
          auxiliarNome = auxiliar.name || void 0;
        }
      }
      const certificateUrl = await issueCertificate2({
        studentName: input.studentName,
        studentId: input.studentId,
        courseName: input.courseName,
        instructorName: input.instructorName,
        instructorRank: input.instructorRank,
        auxiliar: auxiliarNome,
        ID_auxiliar: input.auxiliarMatricula,
        issuedAt: /* @__PURE__ */ new Date()
      });
      if (dbInstance) {
        await dbInstance.insert(certificates2).values({
          userId: ctx.user.id,
          discordId: null,
          // Não temos discordId do aluno aqui
          studentName: input.studentName,
          studentId: input.studentId,
          courseId: input.courseId,
          courseName: input.courseName,
          instructorName: input.instructorName,
          instructorRank: input.instructorRank,
          auxiliar: auxiliarNome,
          ID_auxiliar: input.auxiliarMatricula,
          issuedBy: ctx.user.id,
          certificateUrl
        });
      }
      return {
        success: true,
        message: "Certificado emitido e publicado no Discord com sucesso!",
        certificateUrl
      };
    }),
    // Emissão em lote de certificados
    issueBatch: protectedProcedure.input(z2.object({
      courseId: z2.string(),
      // ID do curso
      instructorName: z2.string(),
      auxiliarMatricula: z2.string().optional(),
      approvedList: z2.string()
      // Lista de aprovados: "nome | matrícula" (um por linha)
    })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem emitir certificados" });
      }
      const { issueCertificate: issueCertificate2 } = await Promise.resolve().then(() => (init_certificates(), certificates_exports));
      const { getUserByStudentId: getUserByStudentId2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { certificates: certificates2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const dbInstance = await getDb();
      const course = await getCourseById(input.courseId);
      if (!course) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Curso n\xE3o encontrado" });
      }
      let auxiliarNome;
      if (input.auxiliarMatricula) {
        const auxiliar = await getUserByStudentId2(input.auxiliarMatricula);
        if (auxiliar) {
          auxiliarNome = auxiliar.name || void 0;
        }
      }
      const lines = input.approvedList.split("\n").filter((line) => line.trim());
      const students = [];
      for (const line of lines) {
        const parts = line.split("|").map((p) => p.trim());
        if (parts.length >= 2) {
          students.push({
            name: parts[0],
            studentId: parts[1]
          });
        }
      }
      if (students.length === 0) {
        throw new TRPCError3({ code: "BAD_REQUEST", message: "Nenhum aluno v\xE1lido encontrado na lista" });
      }
      let successCount = 0;
      let failCount = 0;
      for (const student of students) {
        try {
          const certificateUrl = await issueCertificate2({
            studentName: student.name,
            studentId: student.studentId,
            courseName: course.nome,
            instructorName: input.instructorName,
            instructorRank: ctx.user.rank || "Instrutor",
            auxiliar: auxiliarNome,
            ID_auxiliar: input.auxiliarMatricula,
            issuedAt: /* @__PURE__ */ new Date()
          });
          if (dbInstance) {
            await dbInstance.insert(certificates2).values({
              userId: ctx.user.id,
              discordId: null,
              studentName: student.name,
              studentId: student.studentId,
              courseId: course.id,
              courseName: course.nome,
              instructorName: input.instructorName,
              instructorRank: ctx.user.rank || "Instrutor",
              auxiliar: auxiliarNome,
              ID_auxiliar: input.auxiliarMatricula,
              issuedBy: ctx.user.id,
              certificateUrl
            });
          }
          successCount++;
          await new Promise((resolve) => setTimeout(resolve, 1e3));
        } catch (error) {
          console.error("[IssueBatch] Error issuing certificate for", student.name, error);
          failCount++;
        }
      }
      return {
        success: true,
        message: `${successCount} certificado(s) emitido(s) com sucesso. ${failCount > 0 ? `${failCount} falharam.` : ""}`,
        successCount,
        failCount
      };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs4 from "fs";
import { nanoid } from "nanoid";
import path3 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs3 from "node:fs";
import path2 from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path2.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs3.existsSync(LOG_DIR)) {
    fs3.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs3.existsSync(logPath) || fs3.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs3.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs3.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path2.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs3.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path2.resolve(import.meta.dirname),
  root: path2.resolve(import.meta.dirname, "client"),
  publicDir: path2.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs4.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path3.resolve(import.meta.dirname, "../..", "dist", "public") : path3.resolve(import.meta.dirname, "public");
  if (!fs4.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/uploadImage.ts
init_storage();
import { Router } from "express";
var router2 = Router();
router2.post("/upload-image", async (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image || !filename) {
      return res.status(400).json({ error: "Image and filename are required" });
    }
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const timestamp2 = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const extension = filename.split(".").pop();
    const uniqueFilename = `course-images/${timestamp2}-${randomSuffix}.${extension}`;
    const { url } = await storagePut(uniqueFilename, buffer, `image/${extension}`);
    res.json({ url });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});
var uploadImage_default = router2;

// server/uploadFile.ts
init_storage();
import { Router as Router2 } from "express";
var router3 = Router2();
router3.post("/upload-file", async (req, res) => {
  try {
    const { file, filename, mimeType } = req.body;
    if (!file || !filename) {
      return res.status(400).json({ error: "File and filename are required" });
    }
    const base64Data = file.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const timestamp2 = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const extension = filename.split(".").pop() || "bin";
    const uniqueFilename = `course-files/${timestamp2}-${randomSuffix}.${extension}`;
    const { url, key } = await storagePut(uniqueFilename, buffer, mimeType || "application/octet-stream");
    res.json({ url, key: uniqueFilename });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});
var uploadFile_default = router3;

// server/discord.ts
init_db();
init_schema();
init_env();
import { eq as eq3 } from "drizzle-orm";
var DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
var DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
var DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || "";
var DISCORD_API_ENDPOINT = "https://discord.com/api/v10";
var DISCORD_OAUTH_URL = "https://discord.com/oauth2/authorize";
var DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
function initiateDiscordOAuth(req, res) {
  if (!DISCORD_CLIENT_ID || !DISCORD_REDIRECT_URI) {
    return res.status(500).json({
      error: "Discord OAuth n\xE3o est\xE1 configurado. Configure DISCORD_CLIENT_ID e DISCORD_REDIRECT_URI."
    });
  }
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify email"
  });
  const authUrl = `${DISCORD_OAUTH_URL}?${params.toString()}`;
  res.redirect(authUrl);
}
async function handleDiscordCallback(req, res) {
  const { code } = req.query;
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "C\xF3digo de autoriza\xE7\xE3o n\xE3o fornecido" });
  }
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI) {
    return res.status(500).json({
      error: "Discord OAuth n\xE3o est\xE1 configurado corretamente."
    });
  }
  try {
    const tokenResponse = await fetch(DISCORD_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI
      })
    });
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Erro ao obter token do Discord:", errorData);
      return res.status(500).json({ error: "Falha ao obter token do Discord" });
    }
    const tokenData = await tokenResponse.json();
    const userResponse = await fetch(`${DISCORD_API_ENDPOINT}/users/@me`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });
    if (!userResponse.ok) {
      const errorData = await userResponse.text();
      console.error("Erro ao buscar usu\xE1rio do Discord:", errorData);
      return res.status(500).json({ error: "Falha ao buscar informa\xE7\xF5es do usu\xE1rio" });
    }
    const discordUser = await userResponse.json();
    const database = await getDb();
    if (!database) {
      return res.status(500).json({ error: "Database not available" });
    }
    const existingUsers = await database.select().from(users).where(eq3(users.discordId, discordUser.id)).limit(1);
    const existingUser = existingUsers.length > 0 ? existingUsers[0] : null;
    let user;
    if (existingUser) {
      await database.update(users).set({ lastSignedIn: /* @__PURE__ */ new Date() }).where(eq3(users.id, existingUser.id));
      user = existingUser;
    } else {
      const displayName = `${discordUser.username}#${discordUser.discriminator}`;
      const approvedUsers = await database.select().from(users).where(eq3(users.approvalStatus, "approved"));
      const nonOwnerApprovedUsers = approvedUsers.filter(
        (u) => u.openId !== ENV.ownerOpenId
      );
      const shouldAutoApprove = nonOwnerApprovedUsers.length < 3;
      await database.insert(users).values({
        openId: `discord_${discordUser.id}`,
        // Criar um openId único para Discord
        name: displayName,
        email: discordUser.email || null,
        loginMethod: "discord",
        discordId: discordUser.id,
        role: shouldAutoApprove ? "admin" : "member",
        approvalStatus: shouldAutoApprove ? "approved" : "pending",
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const newUsers = await database.select().from(users).where(eq3(users.discordId, discordUser.id)).limit(1);
      user = newUsers.length > 0 ? newUsers[0] : null;
    }
    if (!user) {
      return res.status(500).json({ error: "Falha ao criar ou recuperar usu\xE1rio" });
    }
    const sessionToken = await sdk.createSessionToken(user.openId, {
      name: user.name || "",
      expiresInMs: ONE_YEAR_MS
    });
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
    res.redirect("/");
  } catch (error) {
    console.error("Erro no callback do Discord:", error);
    res.status(500).json({ error: "Erro interno ao processar login do Discord" });
  }
}

// server/_core/index.ts
init_discord();
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.get("/api/auth/discord", initiateDiscordOAuth);
  app.get("/api/auth/discord/callback", handleDiscordCallback);
  app.use("/api", uploadImage_default);
  app.use("/api", uploadFile_default);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}/`);
    await initDiscordBot();
  });
}
startServer().catch(console.error);
