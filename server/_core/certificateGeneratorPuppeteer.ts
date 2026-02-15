import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

// Registrar fontes do sistema para garantir disponibilidade
try {
  // Registrar fontes Liberation Serif (disponíveis no sistema)
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const fontConfigs = [
    { path: "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf", family: "Liberation Serif" },
    { path: "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf", family: "Liberation Serif" },
    { path: "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf", family: "Liberation Serif" },
    { path: "/usr/share/fonts/truetype/liberation/LiberationSerif-BoldItalic.ttf", family: "Liberation Serif" },
    { path: path.join(__dirname, "../assets/fonts/MisstralPersonalUse.ttf"), family: "Mistral" },
    { path: path.join(__dirname, "../assets/fonts/optimistral-graff.otf"), family: "Optimistral" },
  ];
  
  for (const config of fontConfigs) {
    try {
      if (existsSync(config.path)) {
        GlobalFonts.registerFromPath(config.path, config.family);
        console.log("[CertificateGenerator] Font registered:", config.path);
      }
    } catch (e) {
      console.warn("[CertificateGenerator] Failed to register font:", config.path, e);
    }
  }
  // Listar todas as fontes registradas
  console.log("[CertificateGenerator] All registered fonts:", GlobalFonts.families);
} catch (e) {
  console.error("[CertificateGenerator] Could not register system fonts:", e);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface CertificateData {
  studentName: string;
  studentId: string;
  courseName: string;
  instructorName: string;
  instructorRank: string;
}

/**
 * Gera certificado em PNG com base no template limpo fornecido
 * Template já vem sem texto, apenas com elementos visuais
 * Dimensões: 1042x586px
 * @param data Dados do certificado (nome, matrícula, curso, instrutor)
 * @returns Buffer da imagem PNG gerada
 */
export async function generateCertificate(data: CertificateData): Promise<Buffer> {
  try {
    // Carregar template limpo do certificado (CDN - funciona em dev e produção)
    const templateUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/DHBXbOcJsiCfHbTV.png";
    console.log("[CertificateGenerator] Loading clean template from:", templateUrl);
    console.log("[CertificateGenerator] Certificate data:", JSON.stringify(data));
    
    let template;
    try {
      template = await loadImage(templateUrl);
      console.log("[CertificateGenerator] Template loaded successfully");
      console.log("[CertificateGenerator] Template dimensions:", template.width, "x", template.height);
    } catch (loadError) {
      console.error("[CertificateGenerator] Failed to load template:", loadError);
      throw new Error(`Failed to load template: ${loadError instanceof Error ? loadError.message : String(loadError)}`);
    }

    // Criar canvas com as dimensões do template (1042x586)
    console.log("[CertificateGenerator] Creating canvas...");
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");
    console.log("[CertificateGenerator] Canvas created:", canvas.width, "x", canvas.height);
    
    // Desenhar template de fundo (já limpo, sem texto)
    console.log("[CertificateGenerator] Drawing template background...");
    ctx.drawImage(template, 0, 0);
    console.log("[CertificateGenerator] Template background drawn");

    // Configurar cor do texto (vermelho escuro/maroon)
    console.log("[CertificateGenerator] Configuring text style...");
    ctx.fillStyle = "#8B0000";
    ctx.textAlign = "center";

    // === ÁREA SUPERIOR ===
    console.log("[CertificateGenerator] Adding text to certificate...");
    
    // Título "CERTIFICADO"
    ctx.font = "bold 70px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText("CERTIFICADO", canvas.width / 2, 150);
    console.log("[CertificateGenerator] Title added");

    // Subtítulo "Certificamos que"
    ctx.font = "20px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText("Certificamos que", canvas.width / 2, 210);
    console.log("[CertificateGenerator] Subtitle added");

    // === ÁREA CENTRAL - DADOS DO ALUNO ===
    
    // Nome do aluno (destaque)
    ctx.font = "bold 62px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText(data.studentName, canvas.width / 2, 265);
    console.log("[CertificateGenerator] Student name added:", data.studentName);

    // Matrícula do aluno
    ctx.font = "19px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText(`Matrícula: ${data.studentId}`, canvas.width / 2, 300);
    console.log("[CertificateGenerator] Student ID added:", data.studentId);

    // === ÁREA DO CURSO ===
    
    // Texto "Concluiu com êxito o curso de"
    ctx.font = "20px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText("Concluiu com êxito o curso de", canvas.width / 2, 350);

    // Nome do curso (destaque)
    ctx.font = "bold 48px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText(data.courseName, canvas.width / 2, 395);
    console.log("[CertificateGenerator] Course name added:", data.courseName);

    // === ÁREA DA ASSINATURA ===
    // Nome do instrutor (assinatura manuscrita)
    ctx.font = "36px 'Optimistral', cursive";
    ctx.fillText(data.instructorName, canvas.width / 2, 495);
    console.log("[CertificateGenerator] Instructor name added:", data.instructorName);

    // Cargo do instrutor
    ctx.font = "18px 'DejaVu Serif', 'Liberation Serif', Georgia, serif";
    ctx.fillText(data.instructorRank, canvas.width / 2, 525);
    console.log("[CertificateGenerator] Instructor rank added:", data.instructorRank);

    // Converter canvas para buffer PNG
    const buffer = canvas.toBuffer("image/png");
    console.log("[CertificateGenerator] Certificate generated successfully");
    console.log("[CertificateGenerator] Buffer size:", buffer.length, "bytes");
    console.log("[CertificateGenerator] Canvas dimensions:", canvas.width, "x", canvas.height);
    return buffer;
  } catch (error) {
    console.error("[CertificateGenerator] Erro ao gerar certificado:", error);
    throw new Error("Falha ao gerar certificado");
  }
}

/**
 * Salva certificado em arquivo temporário
 * @param certificateBuffer Buffer da imagem PNG
 * @param fileName Nome do arquivo (sem extensão)
 * @returns Caminho completo do arquivo salvo
 */
export async function saveCertificateToFile(
  certificateBuffer: Buffer,
  fileName: string
): Promise<string> {
  const tempDir = path.join(__dirname, "../../temp");
  await fs.mkdir(tempDir, { recursive: true });

  const filePath = path.join(tempDir, `${fileName}.png`);
  await fs.writeFile(filePath, certificateBuffer);

  return filePath;
}
