import { describe, it, expect, beforeAll, vi } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";

// Mock do módulo Discord
vi.mock("./_core/discord", () => ({
  sendCertificateNotification: vi.fn(async (data) => {
    // Simula sucesso se todos os campos estão presentes
    if (data.userName && data.userStudentId && data.courseName) {
      return true;
    }
    return false;
  }),
}));

describe("Certificates Router - Publicação no Discord", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  let instructorCaller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(async () => {
    // Criar usuário instrutor para testes
    const instructorUser = {
      openId: "test-instructor-123",
      name: "Instrutor Teste",
      email: "instrutor@test.com",
      role: "instructor" as const,
      rank: "Sargento",
      studentId: "INST001",
    };

    // Criar usuário comum para testes de permissão
    const regularUser = {
      openId: "test-user-456",
      name: "Usuário Comum",
      email: "user@test.com",
      role: "user" as const,
      rank: "Soldado",
      studentId: "USER001",
    };

    // Criar callers com contextos diferentes
    instructorCaller = appRouter.createCaller({
      user: instructorUser,
    });

    caller = appRouter.createCaller({
      user: regularUser,
    });
  });

  describe("publishToDiscord", () => {
    it("deve publicar certificado individual com sucesso (instrutor)", async () => {
      const result = await instructorCaller.certificates.publishToDiscord({
        studentName: "João Silva",
        studentId: "12345",
        courseName: "Curso de Salvamento",
        imageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("sucesso");
    });

    it("deve rejeitar publicação de usuário sem permissão", async () => {
      await expect(
        caller.certificates.publishToDiscord({
          studentName: "João Silva",
          studentId: "12345",
          courseName: "Curso de Salvamento",
        })
      ).rejects.toThrow();
    });

    it("deve validar campos obrigatórios", async () => {
      await expect(
        instructorCaller.certificates.publishToDiscord({
          studentName: "",
          studentId: "12345",
          courseName: "Curso de Salvamento",
        })
      ).rejects.toThrow();
    });
  });

  describe("publishBatchToDiscord", () => {
    it("deve publicar múltiplos certificados com sucesso", async () => {
      const mockImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      const certificates = [
        {
          studentName: "João Silva",
          studentId: "12345",
          courseName: "Curso de Salvamento",
          imageBase64: mockImageBase64,
        },
        {
          studentName: "Maria Santos",
          studentId: "67890",
          courseName: "Curso de Salvamento",
          imageBase64: mockImageBase64,
        },
        {
          studentName: "Pedro Oliveira",
          studentId: "11111",
          courseName: "Curso de Salvamento",
          imageBase64: mockImageBase64,
        },
      ];

      const result = await instructorCaller.certificates.publishBatchToDiscord({
        certificates,
      });

      expect(result.success).toBe(true);
      expect(result.successCount).toBe(3);
      expect(result.failCount).toBe(0);
      expect(result.message).toContain("3 certificado(s) publicado(s) com sucesso");
    });

    it("deve rejeitar publicação em lote de usuário sem permissão", async () => {
      const certificates = [
        {
          studentName: "João Silva",
          studentId: "12345",
          courseName: "Curso de Salvamento",
        },
      ];

      await expect(
        caller.certificates.publishBatchToDiscord({ certificates })
      ).rejects.toThrow();
    });

    it("deve processar lote vazio sem erros", async () => {
      const result = await instructorCaller.certificates.publishBatchToDiscord({
        certificates: [],
      });

      expect(result.success).toBe(true);
      expect(result.successCount).toBe(0);
      expect(result.failCount).toBe(0);
    });

    it("deve contar sucessos e falhas corretamente em lote misto", async () => {
      const certificates = [
        {
          studentName: "João Silva",
          studentId: "12345",
          courseName: "Curso de Salvamento",
        },
        {
          studentName: "", // Este deve falhar
          studentId: "67890",
          courseName: "Curso de Salvamento",
        },
      ];

      const result = await instructorCaller.certificates.publishBatchToDiscord({
        certificates,
      });

      expect(result.success).toBe(true);
      // Pelo menos um deve ter sucesso
      expect(result.successCount).toBeGreaterThan(0);
    });
  });

  describe("Permissões de role", () => {
    it("instrutor deve ter permissão para publicar", async () => {
      const result = await instructorCaller.certificates.publishToDiscord({
        studentName: "Teste",
        studentId: "123",
        courseName: "Teste",
        imageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      });

      expect(result.success).toBe(true);
    });

    it("admin deve ter permissão para publicar", async () => {
      const adminCaller = appRouter.createCaller({
        user: {
          openId: "admin-123",
          name: "Admin",
          email: "admin@test.com",
          role: "admin",
          rank: "Comandante",
          studentId: "ADMIN001",
        },
      });

      const result = await adminCaller.certificates.publishToDiscord({
        studentName: "Teste",
        studentId: "123",
        courseName: "Teste",
        imageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      });

      expect(result.success).toBe(true);
    });

    it("usuário comum não deve ter permissão", async () => {
      await expect(
        caller.certificates.publishToDiscord({
          studentName: "Teste",
          studentId: "123",
          courseName: "Teste",
        })
      ).rejects.toThrow();
    });
  });
});
