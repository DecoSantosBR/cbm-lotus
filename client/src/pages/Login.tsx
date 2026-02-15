import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DiscordLoginButton } from "@/components/DiscordLoginButton";
import { getLoginUrl } from "@/const";

export default function Login() {
  const handleManusLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#b91c1c", color: "#ffffff", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px", paddingTop: "16px", paddingBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/GrEReyHfWMeFEfpu.jpg" 
              alt="CBMRJ Logo" 
              style={{ width: "48px", height: "48px" }} 
            />
            <div>
              <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>1º CBM Lotus</h1>
              <p style={{ color: "#fee2e2" }}>Corpo de Bombeiros Militar</p>
            </div>
          </div>
        </div>
      </header>

      {/* Login Section */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "calc(100vh - 96px)",
        padding: "32px 16px"
      }}>
        <Card style={{ 
          width: "100%", 
          maxWidth: "450px", 
          padding: "48px 32px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#7f1d1d", marginBottom: "8px" }}>
              Bem-vindo
            </h2>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Escolha uma opção para fazer login
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Discord Login */}
            <DiscordLoginButton 
              size="lg" 
              className="w-full"
            />

            {/* Divider */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "16px",
              margin: "8px 0"
            }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
              <span style={{ color: "#999", fontSize: "12px", textTransform: "uppercase" }}>ou</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
            </div>

            {/* Manus Login */}
            <Button
              onClick={handleManusLogin}
              variant="outline"
              size="lg"
              className="w-full"
              style={{
                borderColor: "#b91c1c",
                color: "#b91c1c"
              }}
            >
              Entrar com Manus
            </Button>
          </div>

          <div style={{ 
            marginTop: "32px", 
            paddingTop: "24px", 
            borderTop: "1px solid #e5e7eb",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "12px", color: "#999" }}>
              Ao fazer login, você concorda com os termos de uso do CBM Lotus
            </p>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: "#7f1d1d", 
        color: "#ffffff", 
        paddingTop: "24px", 
        paddingBottom: "24px", 
        textAlign: "center",
        marginTop: "auto"
      }}>
        <p style={{ fontSize: "14px" }}>© 2026 1º CBM Lotus - Corpo de Bombeiros Militar</p>
        <p style={{ fontSize: "12px", marginTop: "8px", color: "#fee2e2" }}>FORÇA & HONRA</p>
      </footer>
    </div>
  );
}
