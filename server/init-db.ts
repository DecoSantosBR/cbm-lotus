import { db } from "./db";
import { sql } from "drizzle-orm";

async function initDatabase() {
  try {
    console.log("Criando tabelas...");
    
    // Criar tabelas
    await db.execute(sql`CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(191) PRIMARY KEY,
      openId VARCHAR(191) UNIQUE NOT NULL,
      name VARCHAR(191) NOT NULL,
      email VARCHAR(191),
      avatar TEXT,
      role ENUM('admin', 'user') DEFAULT 'user',
      discordId VARCHAR(191) UNIQUE,
      discordUsername VARCHAR(191),
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    )`);

    console.log("Tabelas criadas com sucesso!");
    console.log("Banco de dados inicializado!");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao inicializar banco:", error);
    process.exit(1);
  }
}

initDatabase();
