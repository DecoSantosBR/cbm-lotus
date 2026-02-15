import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";

describe("courses.uploadFile", () => {
  let testCourseId: number;
  let testUserId: number;
  let testFileId: number;

  beforeAll(async () => {
    // Create test course
    testCourseId = await db.createCourse({
      nome: "Teste Upload Arquivo",
      descricao: "Curso para testar upload de arquivos",
      valor: "R$ 100.000",
      requisitos: "Nenhum",
    });

    // Create test user (instructor)
    const users = await db.getAllUsers();
    if (users.length > 0) {
      testUserId = users[0].id;
      // Update user to instructor role
      await db.updateUser(testUserId, { role: "instructor" });
    }
  });

  it("should allow instructors to upload files", async () => {
    const caller = appRouter.createCaller({
      user: { id: testUserId, role: "instructor", openId: "test", name: "Test User", email: "test@test.com" },
    });

    const result = await caller.courses.uploadFile({
      courseId: testCourseId,
      fileName: "manual-curso.pdf",
      fileUrl: "https://example.com/files/manual.pdf",
      fileKey: "course-files/123456-abc.pdf",
      fileSize: 1024000,
      mimeType: "application/pdf",
    });

    expect(result.success).toBe(true);
    expect(result.fileId).toBeDefined();
    testFileId = result.fileId!;
  });

  it("should list files for a course", async () => {
    const caller = appRouter.createCaller({
      user: { id: testUserId, role: "member", openId: "test", name: "Test User", email: "test@test.com" },
    });

    const files = await caller.courses.getFiles({ courseId: testCourseId });
    
    expect(files.length).toBeGreaterThan(0);
    expect(files[0].fileName).toBe("manual-curso.pdf");
    expect(files[0].fileUrl).toBe("https://example.com/files/manual.pdf");
  });

  it("should prevent members from uploading files", async () => {
    const caller = appRouter.createCaller({
      user: { id: testUserId, role: "member", openId: "test", name: "Test User", email: "test@test.com" },
    });

    await expect(
      caller.courses.uploadFile({
        courseId: testCourseId,
        fileName: "test.pdf",
        fileUrl: "https://example.com/test.pdf",
        fileKey: "course-files/test.pdf",
      })
    ).rejects.toThrow("Apenas instrutores e administradores podem fazer upload de arquivos");
  });

  it("should allow instructors to delete files", async () => {
    const caller = appRouter.createCaller({
      user: { id: testUserId, role: "instructor", openId: "test", name: "Test User", email: "test@test.com" },
    });

    const result = await caller.courses.deleteFile({ id: testFileId });
    
    expect(result.success).toBe(true);
  });

  it("should prevent members from deleting files", async () => {
    // Create another file first
    const instructorCaller = appRouter.createCaller({
      user: { id: testUserId, role: "instructor", openId: "test", name: "Test User", email: "test@test.com" },
    });

    const uploadResult = await instructorCaller.courses.uploadFile({
      courseId: testCourseId,
      fileName: "test-delete.pdf",
      fileUrl: "https://example.com/test.pdf",
      fileKey: "course-files/test-delete.pdf",
    });

    const memberCaller = appRouter.createCaller({
      user: { id: testUserId, role: "member", openId: "test", name: "Test User", email: "test@test.com" },
    });

    await expect(
      memberCaller.courses.deleteFile({ id: uploadResult.fileId! })
    ).rejects.toThrow("Apenas instrutores e administradores podem deletar arquivos");
  });
});
