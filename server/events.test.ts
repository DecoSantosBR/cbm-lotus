import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";

describe("Events Management", () => {
  let testCourseId: number;
  let testEventId: number;

  const adminContext = {
    user: { id: 1, role: "admin" as const, name: "Admin Test", email: "admin@test.com" },
    req: {} as any,
    res: {} as any,
  };

  const instructorContext = {
    user: { id: 2, role: "instructor" as const, name: "Instructor Test", email: "instructor@test.com" },
    req: {} as any,
    res: {} as any,
  };

  const memberContext = {
    user: { id: 3, role: "member" as const, name: "Member Test", email: "member@test.com" },
    req: {} as any,
    res: {} as any,
  };

  beforeAll(async () => {
    // Criar um curso de teste
    testCourseId = await db.createCourse({
      nome: "Curso Teste para Eventos",
      descricao: "Curso de teste",
      valor: 100000,
      duracao: "2 horas",
      requisitos: "Nenhum",
      conteudo: "Conteúdo teste",
    });
  });

  it("should allow admin to create event", async () => {
    const caller = appRouter.createCaller(adminContext);
    const result = await caller.events.create({
      courseId: testCourseId,
      title: "Aula Prática de Resgate",
      description: "Aula prática com simulação real",
      startDate: "2026-03-15T09:00:00",
      endDate: "2026-03-15T12:00:00",
      instructorId: 1,
      location: "Quartel Central",
      maxParticipants: 20,
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeTypeOf("number");
    testEventId = result.id;
  });

  it("should allow instructor to create event", async () => {
    const caller = appRouter.createCaller(instructorContext);
    const result = await caller.events.create({
      courseId: testCourseId,
      title: "Treinamento de Mergulho",
      description: "Treinamento básico de mergulho",
      startDate: "2026-03-20T14:00:00",
      endDate: "2026-03-20T17:00:00",
      instructorId: 2,
      location: "Piscina Olímpica",
      maxParticipants: 15,
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeTypeOf("number");
  });

  it("should NOT allow member to create event", async () => {
    const caller = appRouter.createCaller(memberContext);
    
    await expect(
      caller.events.create({
        courseId: testCourseId,
        title: "Evento Não Autorizado",
        description: "Este evento não deveria ser criado",
        startDate: "2026-03-25T10:00:00",
        endDate: "2026-03-25T11:00:00",
        instructorId: 3,
      })
    ).rejects.toThrow();
  });

  it("should list all events", async () => {
    const caller = appRouter.createCaller(adminContext);
    const events = await caller.events.list();

    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThanOrEqual(2);
  });

  it("should get events by date range", async () => {
    const caller = appRouter.createCaller(adminContext);
    const events = await caller.events.getByDateRange({
      startDate: "2026-03-01",
      endDate: "2026-03-31",
    });

    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThanOrEqual(2);
  });

  it("should allow admin to update event", async () => {
    const caller = appRouter.createCaller(adminContext);
    const result = await caller.events.update({
      id: testEventId,
      title: "Aula Prática de Resgate - ATUALIZADA",
      maxParticipants: 25,
    });

    expect(result.success).toBe(true);

    // Verificar se foi atualizado
    const event = await db.getCourseEventById(testEventId);
    expect(event?.title).toBe("Aula Prática de Resgate - ATUALIZADA");
    expect(event?.maxParticipants).toBe(25);
  });

  it("should NOT allow member to update event", async () => {
    const caller = appRouter.createCaller(memberContext);
    
    await expect(
      caller.events.update({
        id: testEventId,
        title: "Tentativa de Atualização Não Autorizada",
      })
    ).rejects.toThrow();
  });

  it("should NOT allow member to delete event", async () => {
    const caller = appRouter.createCaller(memberContext);
    
    await expect(
      caller.events.delete({ id: testEventId })
    ).rejects.toThrow();
  });

  it("should allow admin to delete event", async () => {
    const caller = appRouter.createCaller(adminContext);
    const result = await caller.events.delete({ id: testEventId });

    expect(result.success).toBe(true);

    // Verificar se foi deletado
    const event = await db.getCourseEventById(testEventId);
    expect(event).toBeUndefined();
  });
});
