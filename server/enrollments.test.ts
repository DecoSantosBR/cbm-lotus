import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

describe("Enrollments System", () => {
  // Mock contexts
  const mockUserContext: Context = {
    user: {
      id: 1,
      openId: "test-user",
      name: "Test User",
      studentId: "12345",
      rank: "Soldado",
      role: "user",
      profileCompleted: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    req: {} as any,
    res: {} as any,
  };

  const mockInstructorContext: Context = {
    user: {
      id: 2,
      openId: "test-instructor",
      name: "Test Instructor",
      studentId: "67890",
      rank: "Capitão",
      role: "instructor",
      profileCompleted: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    req: {} as any,
    res: {} as any,
  };

  const mockAdminContext: Context = {
    user: {
      id: 3,
      openId: "test-admin",
      name: "Test Admin",
      studentId: "99999",
      rank: "Comandante Geral",
      role: "admin",
      profileCompleted: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    req: {} as any,
    res: {} as any,
  };

  describe("Enrollment Creation", () => {
    it("should allow authenticated user to enroll in a course", async () => {
      const caller = appRouter.createCaller(mockUserContext);
      const eventId = 1001; // Unique event ID for this test
      
      const result = await caller.enrollments.enroll({ eventId });
      
      expect(result.success).toBe(true);
      expect(result.enrollmentId).toBeDefined();
      expect(result.message).toBeTruthy();
    });

    it("should prevent duplicate enrollments", async () => {
      const caller = appRouter.createCaller(mockUserContext);
      const eventId = 1002; // Unique event ID for this test
      
      // First enrollment
      await caller.enrollments.enroll({ eventId });
      
      // Try to enroll again
      await expect(
        caller.enrollments.enroll({ eventId })
      ).rejects.toThrow("Você já está inscrito neste evento");
    });

    it("should allow re-enrollment after cancellation", async () => {
      const caller = appRouter.createCaller(mockUserContext);
      const eventId = 1003; // Unique event ID for this test
      
      // First enrollment
      const firstEnrollment = await caller.enrollments.enroll({ eventId });
      
      // Cancel enrollment
      await caller.enrollments.cancel({ enrollmentId: firstEnrollment.enrollmentId });
      
      // Re-enroll
      const reEnrollment = await caller.enrollments.enroll({ eventId });
      
      expect(reEnrollment.success).toBe(true);
      expect(reEnrollment.message).toContain("reativada");
    });
  });

  describe("Enrollment Status Management", () => {
    it("should allow instructor to update enrollment status", async () => {
      const userCaller = appRouter.createCaller(mockUserContext);
      const instructorCaller = appRouter.createCaller(mockInstructorContext);
      const eventId = 1004; // Unique event ID for this test
      
      // User enrolls
      const enrollment = await userCaller.enrollments.enroll({ eventId });
      
      // Instructor updates status
      const result = await instructorCaller.enrollments.updateStatus({
        enrollmentId: enrollment.enrollmentId,
        status: "confirmed",
      });
      
      expect(result.success).toBe(true);
    });

    it("should allow admin to update enrollment status", async () => {
      const userCaller = appRouter.createCaller(mockUserContext);
      const adminCaller = appRouter.createCaller(mockAdminContext);
      const eventId = 1005; // Unique event ID for this test
      
      // User enrolls
      const enrollment = await userCaller.enrollments.enroll({ eventId });
      
      // Admin updates status
      const result = await adminCaller.enrollments.updateStatus({
        enrollmentId: enrollment.enrollmentId,
        status: "pending",
      });
      
      expect(result.success).toBe(true);
    });

    it("should prevent regular user from updating enrollment status", async () => {
      const userCaller = appRouter.createCaller(mockUserContext);
      const eventId = 1006; // Unique event ID for this test
      
      // User enrolls
      const enrollment = await userCaller.enrollments.enroll({ eventId });
      
      // Try to update own enrollment status
      await expect(
        userCaller.enrollments.updateStatus({
          enrollmentId: enrollment.enrollmentId,
          status: "confirmed",
        })
      ).rejects.toThrow("Apenas instrutores e administradores");
    });
  });

  describe("Enrollment Queries", () => {
    it("should return user's enrollment for a course", async () => {
      const caller = appRouter.createCaller(mockUserContext);
      const eventId = 1007; // Unique event ID for this test
      
      // Enroll
      await caller.enrollments.enroll({ eventId });
      
      // Query enrollment
      const enrollment = await caller.enrollments.myEnrollment({ eventId });
      
      expect(enrollment).toBeDefined();
      expect(enrollment?.userId).toBe(mockUserContext.user!.id);
      expect(enrollment?.eventId).toBe(eventId);
    });

    it("should return null when user is not enrolled", async () => {
      const caller = appRouter.createCaller(mockUserContext);
      
      const enrollment = await caller.enrollments.myEnrollment({ eventId: 999 });
      
      expect(enrollment).toBeUndefined();
    });

    it("should list all enrollments for a course", async () => {
      const caller = appRouter.createCaller(mockUserContext);
      const eventId = 1008; // Unique event ID for this test
      
      // Enroll
      await caller.enrollments.enroll({ eventId });
      
      // List enrollments
      const enrollments = await caller.enrollments.listByEvent({ eventId });
      
      expect(Array.isArray(enrollments)).toBe(true);
      expect(enrollments.length).toBeGreaterThan(0);
      expect(enrollments[0].user).toBeDefined();
    });

    it("should count enrollments correctly", async () => {
      const caller = appRouter.createCaller(mockUserContext);
      const eventId = 1009; // Unique event ID for this test
      
      // Enroll
      await caller.enrollments.enroll({ eventId });
      
      // Count enrollments
      const count = await caller.enrollments.count({ eventId });
      
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThan(0);
    });

    it("should not count cancelled enrollments", async () => {
      const caller = appRouter.createCaller(mockUserContext);
      const eventId = 1010; // Unique event ID for this test
      
      // Enroll
      const enrollment = await caller.enrollments.enroll({ eventId });
      
      // Get initial count
      const countBefore = await caller.enrollments.count({ eventId });
      
      // Cancel enrollment
      await caller.enrollments.cancel({ enrollmentId: enrollment.enrollmentId });
      
      // Get count after cancellation
      const countAfter = await caller.enrollments.count({ eventId });
      
      expect(countAfter).toBe(countBefore - 1);
    });
  });

  describe("Enrollment Cancellation", () => {
    it("should allow user to cancel their own enrollment", async () => {
      const caller = appRouter.createCaller(mockUserContext);
      const eventId = 1011; // Unique event ID for this test
      
      // Enroll
      const enrollment = await caller.enrollments.enroll({ eventId });
      
      // Cancel
      const result = await caller.enrollments.cancel({ enrollmentId: enrollment.enrollmentId });
      
      expect(result.success).toBe(true);
      
      // Verify status changed
      const updatedEnrollment = await caller.enrollments.myEnrollment({ eventId });
      expect(updatedEnrollment?.status).toBe("cancelled");
    });
  });
});
