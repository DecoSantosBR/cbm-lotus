import { getDb } from "./server/db.ts";
import { courses } from "./drizzle/schema.ts";

const db = await getDb();

const allCourses = await db.select().from(courses);

console.log("Total courses:", allCourses.length);
console.log("\nCourse IDs:");
allCourses.forEach(course => {
  console.log(`- ${course.nome}: ID = ${course.id} (type: ${typeof course.id})`);
});

process.exit(0);
