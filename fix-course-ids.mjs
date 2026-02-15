import { getDb } from "./server/db.ts";
import { courses } from "./drizzle/schema.ts";
import { randomUUID } from "crypto";

const db = await getDb();

// Get all courses first
const allCourses = await db.select().from(courses);
console.log("Found", allCourses.length, "courses");

// Delete all courses
await db.delete(courses);
console.log("Deleted all courses");

// Recreate with valid UUIDs
const coursesData = allCourses.map(course => ({
  id: randomUUID(),
  nome: course.nome,
  descricao: course.descricao,
  valor: course.valor,
  requisitos: course.requisitos,
  imageUrl: course.imageUrl
}));

await db.insert(courses).values(coursesData);
console.log("Recreated", coursesData.length, "courses with valid UUIDs");

// Verify
const newCourses = await db.select().from(courses);
console.log("\nNew course IDs:");
newCourses.forEach(course => {
  console.log(`- ${course.nome}: ${course.id}`);
});

process.exit(0);
