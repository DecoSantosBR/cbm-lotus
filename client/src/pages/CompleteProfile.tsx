import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";


const RANKS = [
  "Comandante Geral",
  "Subcomandante Geral",
  "Coronel",
  "Tenente-Coronel",
  "Major",
  "Capitão",
  "1º Tenente",
  "2º Tenente",
  "Subtenente",
  "Cabo",
  "Soldado"
] as const;

export default function CompleteProfile() {
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    rank: "" as typeof RANKS[number] | "",
  });

  const completeProfileMutation = trpc.auth.completeProfile.useMutation({
    onSuccess: () => {
      // Redirecionar para home após completar perfil
      window.location.href = "/";
    },
    onError: (error: any) => {
      alert(`Erro ao completar perfil: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.studentId || !formData.rank) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    completeProfileMutation.mutate({
      name: formData.name,
      studentId: formData.studentId,
      rank: formData.rank,
    });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#b91c1c", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <Card style={{ maxWidth: "500px", width: "100%", padding: "48px", backgroundColor: "#ffffff" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img 
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/5hDWGdmvPPDJMmU8.png" 
            alt="CBM Lotus" 
            style={{ width: "80px", height: "80px", margin: "0 auto 16px" }}
          />
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#7f1d1d", marginBottom: "8px" }}>
            Bem-vindo ao CBM Lotus
          </h1>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Complete seu perfil para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <Label htmlFor="name">Nome completo (no RP)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="studentId">ID (Matrícula)</Label>
            <Input
              id="studentId"
              type="text"
              placeholder="Digite seu ID ou matrícula"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="rank">Cargo</Label>
            <Select
              value={formData.rank}
              onValueChange={(value) => setFormData({ ...formData, rank: value as typeof RANKS[number] })}
            >
              <SelectTrigger id="rank">
                <SelectValue placeholder="Selecione seu cargo" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: "#ffffff" }}>
                {RANKS.map((rank) => (
                  <SelectItem key={rank} value={rank}>
                    {rank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={completeProfileMutation.isPending}
            style={{
              width: "100%",
              backgroundColor: "#b91c1c",
              color: "#ffffff",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "600",
              marginTop: "8px"
            }}
          >
            {completeProfileMutation.isPending ? "Salvando..." : "Completar Perfil"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
