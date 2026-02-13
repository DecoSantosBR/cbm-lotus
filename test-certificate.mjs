import { generateCertificate } from "./server/_core/certificateGenerator.ts";
import fs from "fs/promises";

async function testCertificate() {
  console.log("🧪 Testando geração de certificado com template original...\n");

  const testData = {
    studentName: "Drope Hmb",
    studentId: "27528",
    courseName: "Motolância",
    instructorName: "Clon Jackson",
    instructorRank: "Tenente-Coronel",
  };

  console.log("📋 Dados do certificado:");
  console.log(JSON.stringify(testData, null, 2));
  console.log("\n🎨 Gerando certificado...");

  try {
    const certificateBuffer = await generateCertificate(testData);
    
    const outputPath = "/home/ubuntu/certificado-teste-original.png";
    await fs.writeFile(outputPath, certificateBuffer);
    
    console.log("\n✅ Certificado gerado com sucesso!");
    console.log(`📁 Arquivo salvo em: ${outputPath}`);
    console.log(`📊 Tamanho: ${(certificateBuffer.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error("\n❌ Erro ao gerar certificado:", error);
    process.exit(1);
  }
}

testCertificate();
