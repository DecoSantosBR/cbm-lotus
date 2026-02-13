import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";
import * as db from "./db";

describe("Courses API", () => {
  // Mock context for public procedures
  const mockPublicContext: Context = {
    req: {} as any,
    res: {} as any,
    user: undefined,
  };

  // Mock context for admin user
  const mockAdminContext: Context = {
    req: {} as any,
    res: {} as any,
    user: {
      id: 1,
      openId: "test-admin",
      name: "Admin User",
      email: "close.jackson2025@gmail.com",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      loginMethod: null,
    },
  };

  // Mock context for regular user
  const mockUserContext: Context = {
    req: {} as any,
    res: {} as any,
    user: {
      id: 2,
      openId: "test-user",
      name: "Regular User",
      email: "user@example.com",
      role: "instructor",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      loginMethod: null,
    },
  };

  const caller = appRouter.createCaller(mockPublicContext);
  const adminCaller = appRouter.createCaller(mockAdminContext);
  const userCaller = appRouter.createCaller(mockUserContext);

  it("should list all courses", async () => {
    const courses = await caller.courses.list();
    expect(Array.isArray(courses)).toBe(true);
    expect(courses.length).toBeGreaterThan(0);
    expect(courses[0]).toHaveProperty("nome");
    expect(courses[0]).toHaveProperty("valor");
  });

  it("should get a course by ID", async () => {
    const course = await caller.courses.getById({ id: 1 });
    expect(course).toBeDefined();
    expect(course).toHaveProperty("nome");
    expect(course).toHaveProperty("valor");
  });

  it("should return undefined for non-existent course", async () => {
    const course = await caller.courses.getById({ id: 99999 });
    expect(course).toBeUndefined();
  });

  it("should get course material", async () => {
    const material = await caller.courses.getMaterial({ courseId: 1 });
    // Material may or may not exist, just check it doesn't throw
    expect(material === undefined || material).toBeTruthy();
  });

  it("should allow admin to update course material", async () => {
    const result = await adminCaller.courses.updateMaterial({
      courseId: 1,
      instructions: "Test instructions from vitest",
      videoUrl: "https://youtube.com/watch?v=test",
    });
    expect(result.success).toBe(true);
  });

  it("should prevent non-admin from updating course material", async () => {
    await expect(
      userCaller.courses.updateMaterial({
        courseId: 1,
        instructions: "Unauthorized update attempt",
      })
    ).rejects.toThrow();
  });

  it("should create a course application", async () => {
    const result = await caller.applications.create({
      courseId: 1,
      nomeCompleto: "João Silva",
      idJogador: "12345",
      telefone: "(21) 99999-9999",
      horarioDisponivel: "Segunda a sexta, 18h-22h",
    });
    expect(result.success).toBe(true);
  });

  it("should allow instructors to list applications", async () => {
    const applications = await userCaller.applications.list();
    expect(Array.isArray(applications)).toBe(true);
  });

  it("should allow instructors to update application status", async () => {
    // First create an application
    await caller.applications.create({
      courseId: 1,
      nomeCompleto: "Maria Santos",
      idJogador: "54321",
      telefone: "(21) 88888-8888",
      horarioDisponivel: "Finais de semana",
    });

    // Get all applications to find the ID
    const applications = await userCaller.applications.list();
    const lastApplication = applications[applications.length - 1];

    // Update status
    const result = await userCaller.applications.updateStatus({
      id: lastApplication.id,
      status: "accepted",
    });
    expect(result.success).toBe(true);
  });
});
