import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('Dropando tabelas...\n');

const tables = [
  'course_enrollments',
  'course_events', 
  'course_files',
  'course_images',
  'course_materials',
  'course_applications',
  'certificates',
  'courses'
];

for (const table of tables) {
  try {
    await connection.execute(`DROP TABLE IF EXISTS ${table}`);
    console.log(`✅ Dropou ${table}`);
  } catch (error) {
    console.error(`❌ ${table}: ${error.message}`);
  }
}

console.log('\n✅ Tabelas dropadas!');
await connection.end();
