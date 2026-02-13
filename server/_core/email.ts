import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// Configuração do transporter (será configurado via env vars)
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
    const emailPort = parseInt(process.env.EMAIL_PORT || "587");

    if (!emailUser || !emailPass) {
      throw new Error("EMAIL_USER and EMAIL_PASS environment variables are required");
    }

    transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailPort === 465, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  return transporter!;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<boolean> {
  try {
    const transport = getTransporter();
    const emailUser = process.env.EMAIL_USER;

    await transport.sendMail({
      from: `"CBM Vice City" <${emailUser}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ""), // Fallback to stripped HTML if no text provided
      html,
    });

    console.log(`[Email] Sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error(`[Email] Failed to send to ${to}:`, error);
    return false;
  }
}

// Template para inscrição aprovada
export function getEnrollmentApprovedEmailTemplate(params: {
  studentName: string;
  courseName: string;
  eventDate: string;
  eventTime: string;
  location: string;
}): { subject: string; html: string } {
  const { studentName, courseName, eventDate, eventTime, location } = params;

  return {
    subject: `✅ Inscrição Aprovada - ${courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #16a34a; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✅ Inscrição Aprovada!</h1>
          </div>
          <div class="content">
            <p>Olá, <strong>${studentName}</strong>!</p>
            <p>Sua inscrição no curso <strong>${courseName}</strong> foi <strong>aprovada</strong> pelo instrutor.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #16a34a;">Detalhes do Evento:</h3>
              <p><strong>Curso:</strong> ${courseName}</p>
              <p><strong>Data:</strong> ${eventDate}</p>
              <p><strong>Horário:</strong> ${eventTime}</p>
              <p><strong>Local:</strong> ${location}</p>
            </div>

            <p>Compareça no horário indicado. Sua presença é fundamental!</p>
            <p><strong>Força & Honra!</strong></p>
          </div>
          <div class="footer">
            <p>1º CBM Vice City - Corpo de Bombeiros Militar</p>
            <p>Este é um email automático, não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

// Template para inscrição rejeitada
export function getEnrollmentRejectedEmailTemplate(params: {
  studentName: string;
  courseName: string;
  eventDate: string;
}): { subject: string; html: string } {
  const { studentName, courseName, eventDate } = params;

  return {
    subject: `❌ Inscrição Não Aprovada - ${courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #dc2626; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Inscrição Não Aprovada</h1>
          </div>
          <div class="content">
            <p>Olá, <strong>${studentName}</strong>!</p>
            <p>Informamos que sua inscrição no curso <strong>${courseName}</strong> (${eventDate}) <strong>não foi aprovada</strong> pelo instrutor.</p>
            
            <div class="info-box">
              <p>Possíveis motivos:</p>
              <ul>
                <li>Não atendimento aos pré-requisitos do curso</li>
                <li>Vagas preenchidas por ordem de prioridade</li>
                <li>Pendências administrativas</li>
              </ul>
            </div>

            <p>Entre em contato com o instrutor responsável para mais informações.</p>
            <p>Você pode se inscrever em outras turmas disponíveis no sistema de agendamento.</p>
          </div>
          <div class="footer">
            <p>1º CBM Vice City - Corpo de Bombeiros Militar</p>
            <p>Este é um email automático, não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
