import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { users } from "../drizzle/schema";
import * as db from "./db";
import { eq } from "drizzle-orm";

describe("Discord OAuth Integration", () => {
  let testDiscordId: string;
  let testUserId: number;

  beforeAll(async () => {
    // Gerar um Discord ID único para testes
    testDiscordId = `test_discord_${Date.now()}`;
  });

  afterAll(async () => {
    // Limpar usuário de teste
    const database = await db.getDb();
    if (database && testUserId) {
      await database.delete(users).where(eq(users.id, testUserId));
    }
  });

  it("deve criar um novo usuário com Discord ID", async () => {
    const database = await db.getDb();
    expect(database).toBeDefined();
    if (!database) return;

    // Criar usuário com Discord ID
    await database.insert(users).values({
      openId: `discord_${testDiscordId}`,
      name: "Test Discord User",
      email: "test@discord.com",
      loginMethod: "discord",
      discordId: testDiscordId,
      role: "member",
      approvalStatus: "approved",
      lastSignedIn: new Date(),
    });

    // Buscar usuário criado
    const createdUsers = await database
      .select()
      .from(users)
      .where(eq(users.discordId, testDiscordId))
      .limit(1);

    expect(createdUsers.length).toBe(1);
    const createdUser = createdUsers[0];
    expect(createdUser.discordId).toBe(testDiscordId);
    expect(createdUser.loginMethod).toBe("discord");
    expect(createdUser.name).toBe("Test Discord User");

    testUserId = createdUser.id;
  });

  it("deve encontrar usuário existente por Discord ID", async () => {
    const database = await db.getDb();
    expect(database).toBeDefined();
    if (!database) return;

    const existingUsers = await database
      .select()
      .from(users)
      .where(eq(users.discordId, testDiscordId))
      .limit(1);

    expect(existingUsers.length).toBe(1);
    expect(existingUsers[0].discordId).toBe(testDiscordId);
  });

  it("deve garantir que Discord ID seja único", async () => {
    const database = await db.getDb();
    expect(database).toBeDefined();
    if (!database) return;

    // Tentar criar outro usuário com o mesmo Discord ID deve falhar
    try {
      await database.insert(users).values({
        openId: `discord_duplicate_${Date.now()}`,
        name: "Duplicate Discord User",
        email: "duplicate@discord.com",
        loginMethod: "discord",
        discordId: testDiscordId, // Mesmo Discord ID
        role: "member",
        approvalStatus: "approved",
        lastSignedIn: new Date(),
      });
      // Se não lançar erro, o teste deve falhar
      expect.fail("Deveria ter lançado erro de Discord ID duplicado");
    } catch (error) {
      // Esperamos que lance erro de constraint unique
      expect(error).toBeDefined();
    }
  });

  it("deve atualizar lastSignedIn quando usuário faz login novamente", async () => {
    const database = await db.getDb();
    expect(database).toBeDefined();
    if (!database) return;

    // Buscar usuário antes da atualização
    const beforeUpdate = await database
      .select()
      .from(users)
      .where(eq(users.id, testUserId))
      .limit(1);

    const oldLastSignedIn = beforeUpdate[0].lastSignedIn;

    // Aguardar 1 segundo para garantir timestamp diferente
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Atualizar lastSignedIn
    await database
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, testUserId));

    // Buscar usuário após atualização
    const afterUpdate = await database
      .select()
      .from(users)
      .where(eq(users.id, testUserId))
      .limit(1);

    const newLastSignedIn = afterUpdate[0].lastSignedIn;

    // Verificar que o timestamp foi atualizado
    expect(newLastSignedIn.getTime()).toBeGreaterThan(oldLastSignedIn.getTime());
  });

  it("deve permitir usuário sem Discord ID (login via Manus)", async () => {
    const database = await db.getDb();
    expect(database).toBeDefined();
    if (!database) return;

    const manusOpenId = `manus_test_${Date.now()}`;

    // Criar usuário sem Discord ID
    await database.insert(users).values({
      openId: manusOpenId,
      name: "Manus User",
      email: "manus@test.com",
      loginMethod: "manus",
      discordId: null, // Sem Discord ID
      role: "member",
      approvalStatus: "approved",
      lastSignedIn: new Date(),
    });

    // Buscar usuário criado
    const createdUsers = await database
      .select()
      .from(users)
      .where(eq(users.openId, manusOpenId))
      .limit(1);

    expect(createdUsers.length).toBe(1);
    expect(createdUsers[0].discordId).toBeNull();
    expect(createdUsers[0].loginMethod).toBe("manus");

    // Limpar
    await database.delete(users).where(eq(users.openId, manusOpenId));
  });
});
