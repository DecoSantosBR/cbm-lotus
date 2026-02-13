import { drizzle } from "drizzle-orm/mysql2";
import { sql, eq, and, ne } from "drizzle-orm";
import { InsertUser, users, courses, courseMaterials, courseApplications, courseImages, courseFiles, courseEvents, courseEnrollments, InsertCourse, InsertCourseMaterial, InsertCourseApplication, InsertCourseImage, InsertCourseFile, InsertCourseEvent, InsertCourseEnrollment } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    
    // Auto-approve all users (approval is now automatic based on rank selection)
    values.approvalStatus = 'approved';
    updateSet.approvalStatus = 'approved';
    
    // Owner gets admin role automatically
    if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// User Management
export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users);
}

export async function updateUserApproval(userId: number, approvalStatus: "pending" | "approved" | "rejected", role?: "member" | "instructor" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { approvalStatus, updatedAt: new Date() };
  if (role) {
    updateData.role = role;
  }
  
  await db.update(users)
    .set(updateData)
    .where(eq(users.id, userId));
}

export async function updateUser(userId: number, data: { name?: string; email?: string; role?: "member" | "instructor" | "admin"; rank?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { updatedAt: new Date() };
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.rank !== undefined) updateData.rank = data.rank;
  
  await db.update(users)
    .set(updateData)
    .where(eq(users.id, userId));
}

export async function deleteUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(users).where(eq(users.id, userId));
}

export async function completeUserProfile(data: {
  userId: number;
  name: string;
  studentId: string;
  rank: string;
  role: "admin" | "instructor" | "member";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users)
    .set({
      name: data.name,
      studentId: data.studentId,
      rank: data.rank as any,
      role: data.role,
      profileCompleted: 1,
      approvalStatus: "approved",
      updatedAt: new Date(),
    })
    .where(eq(users.id, data.userId));
}

// Courses
export async function getAllCourses() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courses);
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCourse(course: InsertCourse): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courses).values(course);
  return Number(result[0].insertId);
}

// Course Materials
export async function getCourseMaterial(courseId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courseMaterials).where(eq(courseMaterials.courseId, courseId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertCourseMaterial(material: InsertCourseMaterial & { id?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (material.id) {
    await db.update(courseMaterials)
      .set({ 
        instructions: material.instructions, 
        video1Title: material.video1Title,
        video1Url: material.video1Url,
        video2Title: material.video2Title,
        video2Url: material.video2Url,
        updatedAt: new Date() 
      })
      .where(eq(courseMaterials.id, material.id));
  } else {
    await db.insert(courseMaterials).values(material);
  }
}

// Course Applications
export async function createCourseApplication(application: InsertCourseApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(courseApplications).values(application);
}

export async function getAllCourseApplications() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseApplications);
}

export async function updateApplicationStatus(id: number, status: "pending" | "accepted" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseApplications)
    .set({ status, updatedAt: new Date() })
    .where(eq(courseApplications.id, id));
}

export async function countPendingApplications() {
  const db = await getDb();
  if (!db) return { count: 0 };
  const result = await db.select().from(courseApplications).where(eq(courseApplications.status, "pending"));
  return { count: result.length };
}

// Course Images
export async function createCourseImage(image: InsertCourseImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courseImages).values(image);
  return result;
}

export async function getCourseImages(courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(courseImages).where(eq(courseImages.courseId, courseId));
}

export async function deleteCourseImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(courseImages).where(eq(courseImages.id, id));
}

// Course Files
export async function createCourseFile(file: InsertCourseFile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(courseFiles).values(file);
  return result.insertId;
}

export async function getCourseFiles(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseFiles).where(eq(courseFiles.courseId, courseId));
}

export async function deleteCourseFile(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [file] = await db.select().from(courseFiles).where(eq(courseFiles.id, id));
  await db.delete(courseFiles).where(eq(courseFiles.id, id));
  return file;
}

// Course Events
export async function createCourseEvent(event: InsertCourseEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(courseEvents).values(event);
  return result.insertId;
}

export async function getAllCourseEvents() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseEvents);
}

export async function getCourseEventsByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courseEvents).where(
    and(
      sql`${courseEvents.startDate} >= ${startDate}`,
      sql`${courseEvents.startDate} <= ${endDate}`
    )
  );
}

export async function getCourseEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const [result] = await db.select().from(courseEvents).where(eq(courseEvents.id, id));
  return result;
}

export async function updateCourseEvent(id: number, data: Partial<InsertCourseEvent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseEvents)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(courseEvents.id, id));
}

export async function deleteCourseEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(courseEvents).where(eq(courseEvents.id, id));
}


// ===== Course Enrollments Functions =====

export async function createEnrollment(data: InsertCourseEnrollment): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(courseEnrollments).values(data);
  return result.insertId;
}

export async function getUserEnrollmentForEvent(userId: number, eventId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [enrollment] = await db.select()
    .from(courseEnrollments)
    .where(and(
      eq(courseEnrollments.userId, userId),
      eq(courseEnrollments.eventId, eventId)
    ));
  
  return enrollment || null;
}

export async function getEventEnrollments(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(courseEnrollments)
    .where(eq(courseEnrollments.eventId, eventId))
    .orderBy(courseEnrollments.enrolledAt);
}

export async function updateEnrollmentStatus(enrollmentId: number, status: "pending" | "confirmed" | "cancelled" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(courseEnrollments)
    .set({ status, updatedAt: new Date() })
    .where(eq(courseEnrollments.id, enrollmentId));
}

export async function cancelEnrollment(enrollmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(courseEnrollments)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(courseEnrollments.id, enrollmentId));
}

export async function deleteEnrollment(enrollmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(courseEnrollments).where(eq(courseEnrollments.id, enrollmentId));
}

export async function getEnrollmentCountByEvent(eventId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const [result] = await db.select({ count: sql<number>`count(*)` })
    .from(courseEnrollments)
    .where(and(
      eq(courseEnrollments.eventId, eventId),
      ne(courseEnrollments.status, "cancelled")
    ));
  
  return result?.count || 0;
}
