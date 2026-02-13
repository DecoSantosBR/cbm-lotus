import { generateCertificate } from "./server/_core/certificateGeneratorPuppeteer.ts";
import { writeFileSync } from "fs";

const buffer = await generateCertificate({
  studentName: "Teste Manual",
  studentId: "99999",
  courseName: "Teste Cache",
  instructorName: "Instrutor Teste",
  instructorRank: "Coronel"
});

writeFileSync("/home/ubuntu/cert-test-manual.png", buffer);
console.log("Certificado gerado:", buffer.length, "bytes");
