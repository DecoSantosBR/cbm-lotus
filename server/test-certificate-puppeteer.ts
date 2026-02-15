import { generateCertificateImage } from "./certificates";
import fs from "fs";

async function testCertificate() {
  console.log("[Test] Gerando certificado de teste com Puppeteer...");

  const testData = {
    studentName: "Deco Santos",
    studentId: "4810",
    courseName: "Aerovidas",
    instructorName: "Clone Jackson",
    instructorRank: "Subcomandante Geral",
    issuedAt: new Date(),
  };

  try {
    const imageBuffer = await generateCertificateImage(testData);
    console.log(`[Test] Certificado gerado! Tamanho: ${imageBuffer.length} bytes`);

    // Salvar arquivo de teste
    const outputPath = "/home/ubuntu/site-cbm-lotus/test-certificate-puppeteer.png";
    fs.writeFileSync(outputPath, imageBuffer);
    console.log(`[Test] Certificado salvo em: ${outputPath}`);
  } catch (error) {
    console.error("[Test] Erro ao gerar certificado:", error);
    process.exit(1);
  }
}

testCertificate();
