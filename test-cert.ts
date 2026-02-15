import { generateCertificate } from './server/_core/certificateGenerator.js';
import fs from 'fs/promises';

const testData = {
  studentName: 'TESTE LOCAL',
  studentId: '12345',
  courseName: 'TESTE DE CURSO',
  instructorName: 'Instrutor Teste',
  instructorRank: 'Capitão'
};

console.log('[Test] Gerando certificado...');
const buffer = await generateCertificate(testData);
await fs.writeFile('/home/ubuntu/test-certificate.png', buffer);
console.log('[Test] Certificado gerado em /home/ubuntu/test-certificate.png');
console.log('[Test] Tamanho do buffer:', buffer.length, 'bytes');
