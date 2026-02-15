import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';

dotenv.config();

const imageUrls = {
  "Aerovidas": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/NVRPPaBNLCrIdSnp.jfif",
  "Águia Avançado": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/DaxsEueLupkVNVUU.avif",
  "Formação de Oficiais": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/TREJdxhAQINqlQlY.jpeg",
  "Instrutor Águia": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/SvcwGRBnNbnNGfKH.jpg",
  "Instrutor MOB": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/ioowrRznySRVFjZu.jpg",
  "Mergulho": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/UkWGMHHmoppDRNmr.jpg",
  "Resgate Montanha Avançado": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/LLGPGOEHOOtEVbqR.jpg",
  "Resgate Montanha": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/wIlDUllYiSXZEPrN.jpg",
  "TAF": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/VdQPQZDJyeHrpBIi.jfif",
  "Paraquedismo Avançado": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/aqFKHIpUmPopwrHO.jpg",
  "Paraquedismo": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/WGfuYcibrhaLZwAI.jpg",
  "Modulação e Conduta": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/DljeINXyuArxlMxW.jpeg",
  "MOB": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/MIMOdIBfZwjIabfa.png"
};

const courses = [
  { nome: 'TAF', descricao: 'Teste de Aptidão Física', valor: 0, requisitos: 'Nenhum' },
  { nome: 'Modulação e Conduta', descricao: 'Curso de Modulação e Conduta', valor: 0, requisitos: 'Nenhum' },
  { nome: 'MOB', descricao: 'Curso de Operações Básicas', valor: 200000, requisitos: 'TAF, Modulação e Conduta' },
  { nome: 'Aerovidas', descricao: 'Curso de Aerovidas', valor: 300000, requisitos: 'MOB' },
  { nome: 'Mergulho', descricao: 'Curso de Mergulho', valor: 0, requisitos: 'MOB' },
  { nome: 'Paraquedismo', descricao: 'Curso de Paraquedismo', valor: 250000, requisitos: 'MOB' },
  { nome: 'Resgate Montanha', descricao: 'Curso de Resgate em Montanha', valor: 300000, requisitos: 'MOB' },
  { nome: 'Formação de Oficiais', descricao: 'Curso de Formação de Oficiais', valor: 0, requisitos: 'MOB' },
  { nome: 'Águia Avançado', descricao: 'Curso Águia Avançado', valor: 400000, requisitos: 'Aerovidas' },
  { nome: 'Instrutor Águia', descricao: 'Curso de Instrutor Águia', valor: 600000, requisitos: 'Águia Avançado' },
  { nome: 'Paraquedismo Avançado', descricao: 'Curso de Paraquedismo Avançado', valor: 500000, requisitos: 'Paraquedismo' },
  { nome: 'Resgate Montanha Avançado', descricao: 'Curso de Resgate em Montanha Avançado', valor: 500000, requisitos: 'Resgate Montanha' },
  { nome: 'Instrutor MOB', descricao: 'Curso de Instrutor MOB', valor: 600000, requisitos: 'MOB' },
];

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('Populando cursos do CBM Lotus...\n');

for (const course of courses) {
  const id = nanoid(36);
  const imageUrl = imageUrls[course.nome] || null;
  
  try {
    await connection.execute(
      'INSERT INTO courses (id, nome, descricao, valor, requisitos, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
      [id, course.nome, course.descricao, course.valor, course.requisitos, imageUrl]
    );
    console.log(`✅ ${course.nome} (${imageUrl ? 'com imagem' : 'sem imagem'})`);
  } catch (error) {
    console.error(`❌ ${course.nome}: ${error.message}`);
  }
}

console.log('\n✅ Cursos populados com sucesso!');
await connection.end();
