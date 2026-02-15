import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

describe("User Management API", () => {
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
      approvalStatus: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      loginMethod: null,
    },
  };

  // Mock context for regular user (member)
  const mockMemberContext: Context = {
    req: {} as any,
    res: {} as any,
    user: {
      id: 2,
      openId: "test-member",
      name: "Member User",
      email: "member@example.com",
      role: "member",
      approvalStatus: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      loginMethod: null,
    },
  };

  // Mock context for instructor
  const mockInstructorContext: Context = {
    req: {} as any,
    res: {} as any,
    user: {
      id: 3,
      openId: "test-instructor",
      name: "Instructor User",
      email: "instructor@example.com",
      role: "instructor",
      approvalStatus: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      loginMethod: null,
    },
  };

  const adminCaller = appRouter.createCaller(mockAdminContext);
  const memberCaller = appRouter.createCaller(mockMemberContext);
  const instructorCaller = appRouter.createCaller(mockInstructorContext);

  it("should allow admin to list all users", async () => {
    const users = await adminCaller.users.list();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  it("should prevent non-admin from listing users", async () => {
    await expect(memberCaller.users.list()).rejects.toThrow();
  });

  it("should allow admin to approve user with role", async () => {
    // Get all users to find a pending one or use any user
    const users = await adminCaller.users.list();
    const testUser = users.find((u) => u.id !== 1) || users[0];

    const result = await adminCaller.users.approve({
      userId: testUser.id,
      role: "member",
    });
    expect(result.success).toBe(true);
  });

  it("should prevent non-admin from approving users", async () => {
    await expect(
      memberCaller.users.approve({
        userId: 2,
        role: "member",
      })
    ).rejects.toThrow();
  });

  it("should allow admin to reject user", async () => {
    const users = await adminCaller.users.list();
    const testUser = users.find((u) => u.id !== 1) || users[0];

    const result = await adminCaller.users.reject({
      userId: testUser.id,
    });
    expect(result.success).toBe(true);
  });

  it("should prevent non-admin from rejecting users", async () => {
    await expect(
      memberCaller.users.reject({
        userId: 2,
      })
    ).rejects.toThrow();
  });

  it("should verify role-based access for applications", async () => {
    // Instructors should be able to list applications
    const applications = await instructorCaller.applications.list();
    expect(Array.isArray(applications)).toBe(true);
  });

  it("should prevent members from listing applications", async () => {
    await expect(memberCaller.applications.list()).rejects.toThrow();
  });

  it("should allow admin to update user", async () => {
    const users = await adminCaller.users.list();
    const testUser = users.find((u) => u.id !== 1) || users[0];

    const result = await adminCaller.users.update({
      userId: testUser.id,
      name: "Updated Name",
      email: "updated@example.com",
      role: "instructor",
    });
    expect(result.success).toBe(true);
  });

  it("should prevent non-admin from updating users", async () => {
    await expect(
      memberCaller.users.update({
        userId: 1,
        name: "Hacked",
      })
    ).rejects.toThrow();
  });

  it("should allow admin to delete user", async () => {
    const users = await adminCaller.users.list();
    // Find a user that is not the admin
    const testUser = users.find((u) => u.id !== 1 && u.role !== "admin");
    
    if (testUser) {
      const result = await adminCaller.users.delete({
        userId: testUser.id,
      });
      expect(result.success).toBe(true);
    }
  });

  it("should prevent admin from deleting themselves", async () => {
    await expect(
      adminCaller.users.delete({
        userId: 1,
      })
    ).rejects.toThrow("Cannot delete your own account");
  });

  it("should prevent non-admin from deleting users", async () => {
    await expect(
      memberCaller.users.delete({
        userId: 1,
      })
    ).rejects.toThrow();
  });
});
