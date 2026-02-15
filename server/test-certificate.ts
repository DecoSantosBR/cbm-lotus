// Script de teste para gerar um certificado de exemplo
import { generateCertificateImage, type CertificateData } from "./certificates";
import { writeFileSync } from "fs";

async function testCertificate() {
  console.log("[Test] Gerando certificado de teste...");
  
  const testData: CertificateData = {
    studentName: "Deco Santos",
    studentId: "4810",
    courseName: "Aerovidas",
    instructorName: "Close Jackson",
    instructorRank: "Subcomandante Geral",
    issuedAt: new Date(),
  };
  
  try {
    const imageBuffer = await generateCertificateImage(testData);
    
    // Salvar imagem de teste
    const outputPath = "/home/ubuntu/site-cbm-lotus/test-certificate.png";
    writeFileSync(outputPath, imageBuffer);
    
    console.log("[Test] ✅ Certificado gerado com sucesso!");
    console.log("[Test] Arquivo salvo em:", outputPath);
    console.log("[Test] Tamanho:", imageBuffer.length, "bytes");
    
    process.exit(0);
  } catch (error) {
    console.error("[Test] ❌ Erro ao gerar certificado:", error);
    process.exit(1);
  }
}

testCertificate();
