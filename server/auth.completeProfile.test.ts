import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";
import type { User } from "../drizzle/schema";

describe("Complete Profile Flow", () => {
  let testUser: User;

  beforeAll(async () => {
    // Create a test user with incomplete profile
    await db.upsertUser({
      openId: "test-complete-profile-user",
      name: null,
      email: "test@example.com",
      loginMethod: "oauth",
      lastSignedIn: new Date(),
    });

    const user = await db.getUserByOpenId("test-complete-profile-user");
    if (!user) throw new Error("Test user not created");
    testUser = user;
  });

  afterAll(async () => {
    // Cleanup: delete test user
    try {
      await db.deleteUser(testUser.id);
    } catch (error) {
      console.warn("Failed to cleanup test user:", error);
    }
  });

  it("should complete user profile with automatic role assignment", async () => {
    const caller = appRouter.createCaller({
      user: testUser,
      req: {} as any,
      res: {} as any,
    });

    // Test 1: Admin role (Comandante Geral)
    await caller.auth.completeProfile({
      name: "João Silva",
      studentId: "CBM-001",
      rank: "Comandante Geral",
    });

    let updatedUser = await db.getUserByOpenId("test-complete-profile-user");
    expect(updatedUser?.name).toBe("João Silva");
    expect(updatedUser?.studentId).toBe("CBM-001");
    expect(updatedUser?.rank).toBe("Comandante Geral");
    expect(updatedUser?.role).toBe("admin");
    expect(updatedUser?.profileCompleted).toBe(1);
    expect(updatedUser?.approvalStatus).toBe("approved");

    // Test 2: Instructor role (Major)
    await caller.auth.completeProfile({
      name: "Maria Santos",
      studentId: "CBM-002",
      rank: "Major",
    });

    updatedUser = await db.getUserByOpenId("test-complete-profile-user");
    expect(updatedUser?.rank).toBe("Major");
    expect(updatedUser?.role).toBe("instructor");

    // Test 3: Member role (Soldado)
    await caller.auth.completeProfile({
      name: "Pedro Costa",
      studentId: "CBM-003",
      rank: "Soldado",
    });

    updatedUser = await db.getUserByOpenId("test-complete-profile-user");
    expect(updatedUser?.rank).toBe("Soldado");
    expect(updatedUser?.role).toBe("member");
  });

  it("should map all admin ranks correctly", async () => {
    const adminRanks = [
      "Comandante Geral",
      "Subcomandante Geral",
      "Coronel",
      "Tenente-Coronel",
    ];

    for (const rank of adminRanks) {
      const caller = appRouter.createCaller({
        user: testUser,
        req: {} as any,
        res: {} as any,
      });

      await caller.auth.completeProfile({
        name: "Test User",
        studentId: "TEST-ID",
        rank: rank as any,
      });

      const updatedUser = await db.getUserByOpenId("test-complete-profile-user");
      expect(updatedUser?.role).toBe("admin");
    }
  });

  it("should map all instructor ranks correctly", async () => {
    const instructorRanks = ["Major", "Capitão", "1º Tenente", "2º Tenente"];

    for (const rank of instructorRanks) {
      const caller = appRouter.createCaller({
        user: testUser,
        req: {} as any,
        res: {} as any,
      });

      await caller.auth.completeProfile({
        name: "Test User",
        studentId: "TEST-ID",
        rank: rank as any,
      });

      const updatedUser = await db.getUserByOpenId("test-complete-profile-user");
      expect(updatedUser?.role).toBe("instructor");
    }
  });

  it("should map all member ranks correctly", async () => {
    const memberRanks = ["Subtenente", "Cabo", "Soldado"];

    for (const rank of memberRanks) {
      const caller = appRouter.createCaller({
        user: testUser,
        req: {} as any,
        res: {} as any,
      });

      await caller.auth.completeProfile({
        name: "Test User",
        studentId: "TEST-ID",
        rank: rank as any,
      });

      const updatedUser = await db.getUserByOpenId("test-complete-profile-user");
      expect(updatedUser?.role).toBe("member");
    }
  });
});
