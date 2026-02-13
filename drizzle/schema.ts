import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, unique } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
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
    "Capitão",
    "1º Tenente",
    "2º Tenente",
    "Subtenente",
    "Cabo",
    "Soldado"
  ]),
  role: mysqlEnum("role", ["member", "instructor", "admin"]).default("member").notNull(),
  approvalStatus: mysqlEnum("approvalStatus", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de cursos
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  valor: varchar("valor", { length: 50 }),
  requisitos: text("requisitos"),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

// Tabela de materiais de curso (instruções + vídeos)
export const courseMaterials = mysqlTable("course_materials", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  instructions: text("instructions"),
  video1Title: varchar("video1Title", { length: 255 }),
  video1Url: text("video1Url"),
  video2Title: varchar("video2Title", { length: 255 }),
  video2Url: text("video2Url"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseMaterial = typeof courseMaterials.$inferSelect;
export type InsertCourseMaterial = typeof courseMaterials.$inferInsert;

// Tabela de imagens do curso
export const courseImages = mysqlTable("course_images", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  caption: varchar("caption", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CourseImage = typeof courseImages.$inferSelect;
export type InsertCourseImage = typeof courseImages.$inferInsert;

// Tabela de solicitações de inscrição
export const courseApplications = mysqlTable("course_applications", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  nomeCompleto: varchar("nomeCompleto", { length: 255 }).notNull(),
  idJogador: varchar("idJogador", { length: 100 }).notNull(),
  telefone: varchar("telefone", { length: 50 }).notNull(),
  horarioDisponivel: text("horarioDisponivel").notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseApplication = typeof courseApplications.$inferSelect;
export type InsertCourseApplication = typeof courseApplications.$inferInsert;

// Tabela de arquivos anexados aos cursos
export const courseFiles = mysqlTable("course_files", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  fileSize: int("fileSize"),
  mimeType: varchar("mimeType", { length: 100 }),
  uploadedBy: int("uploadedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CourseFile = typeof courseFiles.$inferSelect;
export type InsertCourseFile = typeof courseFiles.$inferInsert;
// Tabela de eventos/agendamentos de cursos
export const courseEvents = mysqlTable("course_events", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  instructorId: int("instructorId").notNull(),
  location: varchar("location", { length: 255 }),
  maxParticipants: int("maxParticipants"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseEvent = typeof courseEvents.$inferSelect;
export type InsertCourseEvent = typeof courseEvents.$inferInsert;

// Tabela de inscrições em eventos agendados
export const courseEnrollments = mysqlTable("course_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventId: int("eventId").notNull(), // Vinculado a courseEvents ao invés de courses
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "rejected"]).default("pending").notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // Constraint UNIQUE para prevenir inscrições duplicadas
  // Permite apenas uma inscrição ativa por usuário/evento
  uniqueUserEvent: unique().on(table.userId, table.eventId),
}));

export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = typeof courseEnrollments.$inferInsert;

// Tabela de certificados emitidos
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // ID do usuário no sistema
  discordId: varchar("discordId", { length: 64 }), // ID do Discord do usuário (pode ser null se ainda não vinculado)
  studentName: varchar("studentName", { length: 255 }).notNull(),
  studentId: varchar("studentId", { length: 100 }).notNull(), // Matrícula do aluno
  courseId: int("courseId"), // ID do curso (pode ser null se curso foi deletado)
  courseName: varchar("courseName", { length: 255 }).notNull(),
  instructorName: varchar("instructorName", { length: 255 }).notNull(),
  instructorRank: varchar("instructorRank", { length: 100 }).notNull(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  issuedBy: int("issuedBy").notNull(), // ID do usuário que emitiu o certificado
  certificateUrl: text("certificateUrl"), // URL da imagem do certificado no S3 (opcional)
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;
