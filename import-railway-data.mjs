import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔄 Importando dados do Railway para o banco Manus...\n');

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Ler o dump SQL
const dumpContent = readFileSync('/home/ubuntu/railway_dump.sql', 'utf-8');

// Remover warnings e comentários do mysqldump
const cleanedDump = dumpContent
  .split('\n')
  .filter(line => !line.startsWith('mysqldump:') && !line.startsWith('--') && line.trim() !== '')
  .join('\n');

// Dividir em statements individuais
const statements = cleanedDump
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log(`📊 Total de statements SQL: ${statements.length}\n`);

let successCount = 0;
let errorCount = 0;

for (let i = 0; i < statements.length; i++) {
  const statement = statements[i];
  
  try {
    await connection.execute(statement);
    successCount++;
    
    if ((i + 1) % 10 === 0) {
      console.log(`✅ Processados: ${i + 1}/${statements.length}`);
    }
  } catch (error) {
    errorCount++;
    if (error.code !== 'ER_TABLE_EXISTS_ERROR' && error.code !== 'ER_DUP_ENTRY') {
      console.error(`❌ Erro no statement ${i + 1}: ${error.message.substring(0, 100)}`);
    }
  }
}

console.log(`\n✅ Importação concluída!`);
console.log(`   Sucesso: ${successCount}`);
console.log(`   Erros: ${errorCount}`);

await connection.end();
