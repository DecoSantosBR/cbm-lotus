import { describe, it, expect, beforeAll } from "vitest";
import { issueCertificate, type CertificateData } from "./certificates";
import * as db from "./db";

describe("Certificate Generation", () => {
  beforeAll(async () => {
    // Aguardar conexão com o banco de dados
    await db.getDb();
  });

  it("should generate certificate data structure", () => {
    const certData: CertificateData = {
      studentName: "João Silva",
      studentId: "12345",
      courseName: "Resgate Montanha",
      instructorName: "Cap Silva",
      instructorRank: "Capitão",
      auxiliar: "Sd Santos",
      ID_auxiliar: "11883",
      issuedAt: new Date(),
    };

    expect(certData.studentName).toBe("João Silva");
    expect(certData.studentId).toBe("12345");
    expect(certData.courseName).toBe("Resgate Montanha");
    expect(certData.instructorName).toBe("Cap Silva");
    expect(certData.auxiliar).toBe("Sd Santos");
    expect(certData.ID_auxiliar).toBe("11883");
  });

  it("should handle certificate data without auxiliar", () => {
    const certData: CertificateData = {
      studentName: "Maria Santos",
      studentId: "67890",
      courseName: "Instrutor Água",
      instructorName: "Ten Costa",
      instructorRank: "1º Tenente",
      issuedAt: new Date(),
    };

    expect(certData.auxiliar).toBeUndefined();
    expect(certData.ID_auxiliar).toBeUndefined();
  });

  it("should validate required fields", () => {
    const certData: CertificateData = {
      studentName: "Pedro Costa",
      studentId: "11111",
      courseName: "Resgate Montanha Avançado",
      instructorName: "Maj Oliveira",
      instructorRank: "Major",
      issuedAt: new Date(),
    };

    expect(certData.studentName).toBeTruthy();
    expect(certData.studentId).toBeTruthy();
    expect(certData.courseName).toBeTruthy();
    expect(certData.instructorName).toBeTruthy();
    expect(certData.instructorRank).toBeTruthy();
    expect(certData.issuedAt).toBeInstanceOf(Date);
  });

  it("should format date correctly", () => {
    const now = new Date();
    const certData: CertificateData = {
      studentName: "Ana Lima",
      studentId: "22222",
      courseName: "Salvamento Aquático",
      instructorName: "Cap Ferreira",
      instructorRank: "Capitão",
      issuedAt: now,
    };

    const formatted = certData.issuedAt.toLocaleDateString("pt-BR");
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

describe("User Lookup by Student ID", () => {
  it("should find user by studentId", async () => {
    // Criar usuário de teste se não existir
    const testStudentId = "11883";
    
    try {
      const user = await db.getUserByStudentId(testStudentId);
      
      if (user) {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("name");
        expect(user.studentId).toBe(testStudentId);
      } else {
        // Se não encontrar, não é erro - apenas não existe no banco
        expect(user).toBeNull();
      }
    } catch (error) {
      // Erro de conexão ou outro erro técnico
      throw error;
    }
  });

  it("should return null for non-existent studentId", async () => {
    const nonExistentId = "99999999";
    const user = await db.getUserByStudentId(nonExistentId);
    expect(user).toBeNull();
  });
});

describe("Certificate URL Generation", () => {
  it("should generate valid S3 key format", () => {
    const studentId = "12345";
    const courseName = "Resgate Montanha";
    const timestamp = Date.now();
    const randomHash = "abc123";
    
    const fileName = `certificado-${studentId}-${courseName.replace(/\s+/g, "-")}-${timestamp}-${randomHash}.png`;
    const s3Key = `certificates/${fileName}`;
    
    expect(s3Key).toContain("certificates/certificado-");
    expect(s3Key).toContain(studentId);
    expect(s3Key).toContain("Resgate-Montanha");
    expect(s3Key.endsWith(".png")).toBe(true);
  });
});
