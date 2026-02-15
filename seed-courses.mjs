import { drizzle } from "drizzle-orm/mysql2";
import { courses } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const cursosMembros = [
  { nome: "Modulação/Conduta", valor: "R$ 300.000", descricao: "Curso básico de conduta e modulação para bombeiros", requisitos: "Nenhum" },
  { nome: "TAF", valor: "R$ 150.000", descricao: "Teste de Aptidão Física", requisitos: "Nenhum" },
  { nome: "Paraquedista", valor: "R$ 300.000", descricao: "Formação em paraquedismo", requisitos: "TAF aprovado" },
  { nome: "Paraquedista Especializado", valor: "R$ 300.000", descricao: "Especialização em paraquedismo", requisitos: "Paraquedista" },
  { nome: "Mergulhador", valor: "R$ 300.000", descricao: "Formação em mergulho de resgate", requisitos: "TAF aprovado" },
  { nome: "Salva-Vidas", valor: "R$ 300.000", descricao: "Formação em salvamento aquático", requisitos: "TAF aprovado" },
  { nome: "Aero-Vidas 1", valor: "R$ 500.000", descricao: "Resgate aéreo nível 1", requisitos: "Salva-Vidas" },
  { nome: "Aero-Vidas 2", valor: "R$ 500.000", descricao: "Resgate aéreo nível 2", requisitos: "Aero-Vidas 1" },
  { nome: "Aero-Vidas Elite", valor: "R$ 500.000", descricao: "Resgate aéreo elite", requisitos: "Aero-Vidas 2" },
  { nome: "Resgate-Montanha", valor: "R$ 300.000", descricao: "Resgate em áreas montanhosas", requisitos: "TAF aprovado" },
  { nome: "Resgate-Aquático", valor: "R$ 300.000", descricao: "Resgate em ambientes aquáticos", requisitos: "Salva-Vidas" },
  { nome: "Motolância", valor: "R$ 500.000", descricao: "Operação de motolância", requisitos: "Modulação/Conduta" },
  { nome: "Motolância Especializado", valor: "R$ 300.000", descricao: "Especialização em motolância", requisitos: "Motolância" },
  { nome: "Batedor", valor: "R$ 300.000", descricao: "Formação de batedor", requisitos: "Modulação/Conduta" },
  { nome: "SPEED", valor: "R$ 600.000", descricao: "Equipe especial de resgate", requisitos: "Múltiplos cursos" },
];

async function seed() {
  console.log("Populando banco de dados com cursos...");
  
  for (const curso of cursosMembros) {
    await db.insert(courses).values(curso);
    console.log(`✓ ${curso.nome}`);
  }
  
  console.log("\nCursos inseridos com sucesso!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Erro ao popular banco:", error);
  process.exit(1);
});
