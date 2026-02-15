import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('Listando tabelas...\n');
const [tables] = await connection.execute('SHOW TABLES');
const tableNames = tables.map(row => Object.values(row)[0]);

console.log(`Encontradas ${tableNames.length} tabelas:`, tableNames);
console.log('\nDropando todas as tabelas...\n');

for (const tableName of tableNames) {
  try {
    await connection.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
    console.log(`✅ Dropou ${tableName}`);
  } catch (error) {
    console.error(`❌ ${tableName}: ${error.message}`);
  }
}

console.log('\n✅ Todas as tabelas foram dropadas!');
await connection.end();
