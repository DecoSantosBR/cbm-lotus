import { describe, it, expect, beforeAll } from "vitest";
import { eq } from "drizzle-orm";
import * as db from "./db";

describe("Certificate courseId Saving", () => {
  let testCourseId: string;

  beforeAll(async () => {
    // Buscar um curso existente para usar no teste
    const courses = await db.getAllCourses();
    if (!courses || courses.length === 0) {
      throw new Error("Nenhum curso encontrado no banco de dados para teste");
    }
    testCourseId = courses[0].id;
  });

  it("deve salvar courseId ao emitir certificado individual", async () => {
    const dbInstance = await db.getDb();
    if (!dbInstance) {
      throw new Error("Falha ao conectar ao banco de dados");
    }

    const { certificates } = await import("../drizzle/schema");

    // Simular emissão de certificado
    const [result] = await dbInstance.insert(certificates).values({
      userId: 1,
      discordId: null,
      studentName: "Teste Aluno",
      studentId: "99999",
      courseId: testCourseId, // Deve ser salvo
      courseName: "Curso de Teste",
      instructorName: "Instrutor Teste",
      instructorRank: "Capitão",
      auxiliar: null,
      ID_auxiliar: null,
      issuedBy: 1,
      certificateUrl: "https://example.com/cert.png",
    });

    expect(result.insertId).toBeDefined();

    // Verificar se o courseId foi salvo corretamente
    const [savedCertificate] = await dbInstance
      .select()
      .from(certificates)
      .where(eq(certificates.id, result.insertId))
      .limit(1);

    expect(savedCertificate).toBeDefined();
    expect(savedCertificate.courseId).toBe(testCourseId);
    expect(savedCertificate.courseName).toBe("Curso de Teste");

    // Limpar dados de teste
    await dbInstance.delete(certificates).where(eq(certificates.id, result.insertId));
  });

  it("deve aceitar courseId null para cursos deletados", async () => {
    const dbInstance = await db.getDb();
    if (!dbInstance) {
      throw new Error("Falha ao conectar ao banco de dados");
    }

    const { certificates } = await import("../drizzle/schema");

    // Simular certificado de curso deletado
    const [result] = await dbInstance.insert(certificates).values({
      userId: 1,
      discordId: null,
      studentName: "Teste Aluno 2",
      studentId: "88888",
      courseId: null, // Curso foi deletado
      courseName: "Curso Deletado",
      instructorName: "Instrutor Teste",
      instructorRank: "Major",
      auxiliar: null,
      ID_auxiliar: null,
      issuedBy: 1,
      certificateUrl: "https://example.com/cert2.png",
    });

    expect(result.insertId).toBeDefined();

    // Verificar se o certificado foi salvo com courseId null
    const [savedCertificate] = await dbInstance
      .select()
      .from(certificates)
      .where(eq(certificates.id, result.insertId))
      .limit(1);

    expect(savedCertificate).toBeDefined();
    expect(savedCertificate.courseId).toBeNull();
    expect(savedCertificate.courseName).toBe("Curso Deletado");

    // Limpar dados de teste
    await dbInstance.delete(certificates).where(eq(certificates.id, result.insertId));
  });
});
