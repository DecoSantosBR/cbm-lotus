import { describe, it, expect } from "vitest";
import { sendEmail } from "./_core/email";

describe("Email System", () => {
  it("should validate email credentials by sending a test email", async () => {
    // Teste simples: tentar enviar email para o próprio remetente
    const emailUser = process.env.EMAIL_USER;
    
    if (!emailUser) {
      throw new Error("EMAIL_USER not configured");
    }

    const result = await sendEmail({
      to: emailUser,
      subject: "Teste - CBM Vice City",
      html: "<p>Este é um email de teste do sistema CBM Vice City. Se você recebeu esta mensagem, as credenciais estão configuradas corretamente!</p>",
    });

    expect(result).toBe(true);
  }, 30000); // 30 segundos de timeout para envio de email
});
