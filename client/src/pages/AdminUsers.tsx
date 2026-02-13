import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, CheckCircle, XCircle, Clock, Edit, Trash2, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminUsers() {
  const { user, isAuthenticated } = useAuth();
  const { data: users, isLoading, refetch } = trpc.users.list.useQuery();
  

  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "", rank: "" });
  

  
  const updateMutation = trpc.users.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingUser(null);
      alert("Usuário atualizado com sucesso!");
    },
    onError: (error) => {
      alert(`Erro ao atualizar usuário: ${error.message}`);
    },
  });
  
  const deleteMutation = trpc.users.delete.useMutation({
    onSuccess: () => {
      refetch();
      alert("Usuário excluído com sucesso!");
    },
    onError: (error) => {
      alert(`Erro ao excluir usuário: ${error.message}`);
    },
  });


  
  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "member",
      rank: user.rank || "",
    });
  };
  
  const handleEditSubmit = () => {
    if (!editForm.name || !editForm.email || !editForm.role) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    updateMutation.mutate({
      userId: editingUser.id,
      name: editForm.name,
      email: editForm.email,
      role: editForm.role as "member" | "instructor" | "admin",
      rank: editForm.rank as any,
    });
  };
  
  const handleDelete = (userId: number, userName: string) => {
    if (confirm(`Tem certeza que deseja excluir o usuário "${userName}"? Esta ação não pode ser desfeita.`)) {
      deleteMutation.mutate({ userId });
    }
  };

  // Redirect if not admin
  if (isAuthenticated && user?.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "18px", color: "#dc2626", fontWeight: "bold" }}>Acesso Negado</p>
        <p style={{ fontSize: "16px", color: "#666" }}>Você não tem permissão para acessar esta página.</p>
        <Link href="/">
          <Button style={{ backgroundColor: "#b91c1c", color: "#ffffff" }}>Voltar para Home</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "18px", color: "#666" }}>Carregando...</p>
      </div>
    );
  }

  const allUsers = users || [];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "#dc2626";
      case "instructor":
        return "#2563eb";
      case "member":
        return "#16a34a";
      default:
        return "#6b7280";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "instructor":
        return "Instrutor";
      case "member":
        return "Membro";
      default:
        return role;
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#b91c1c", color: "#ffffff", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px", paddingTop: "16px", paddingBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/GrEReyHfWMeFEfpu.jpg" alt="CBMRJ Logo" style={{ width: "48px", height: "48px" }} />
              <div>
                <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>Gerenciar Usuários</h1>
                <p style={{ color: "#fee2e2" }}>Painel de Administração</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px", paddingTop: "32px", paddingBottom: "64px" }}>
        <Link href="/">
          <Button style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#b91c1c", color: "#ffffff" }}>
            <ArrowLeft style={{ width: "16px", height: "16px" }} />
            Voltar
          </Button>
        </Link>

        {/* All Users */}
        <Card style={{ padding: "32px", border: "1px solid #e5e7eb", borderRadius: "8px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <Users style={{ width: "24px", height: "24px", color: "#b91c1c" }} />
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#7f1d1d" }}>Todos os Usuários ({allUsers.length})</h2>
          </div>
          {allUsers.length === 0 ? (
            <p style={{ color: "#666" }}>Nenhum usuário cadastrado.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {allUsers.map((u: any) => (
                <div key={u.id} style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px", border: "1px solid #86efac" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: "16px", fontWeight: "bold", color: "#1f2937" }}>{u.name || "Sem nome"}</p>
                      <p style={{ fontSize: "14px", color: "#666" }}>{u.email || "Sem email"}</p>
                      <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                        <span style={{ display: "inline-block", padding: "4px 12px", backgroundColor: getRoleBadgeColor(u.role || "member"), color: "#ffffff", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                          {getRoleLabel(u.role || "member")}
                        </span>
                        {u.rank && (
                          <span style={{ display: "inline-block", padding: "4px 12px", backgroundColor: "#7f1d1d", color: "#ffffff", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                            {u.rank}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Button onClick={() => handleEditClick(u)} style={{ backgroundColor: "#2563eb", color: "#ffffff", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Edit style={{ width: "16px", height: "16px" }} />
                        Editar
                      </Button>
                      <Button 
                        onClick={() => handleDelete(u.id, u.name || "este usuário")} 
                        disabled={u.id === user?.id}
                        style={{ backgroundColor: u.id === user?.id ? "#9ca3af" : "#dc2626", color: "#ffffff", display: "flex", alignItems: "center", gap: "4px", cursor: u.id === user?.id ? "not-allowed" : "pointer" }}
                      >
                        <Trash2 style={{ width: "16px", height: "16px" }} />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Edit User Modal */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent style={{ backgroundColor: "#ffffff", maxWidth: "500px" }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "24px", fontWeight: "bold", color: "#b91c1c" }}>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
            <div>
              <label htmlFor="editName" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Nome</label>
              <input
                id="editName"
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                style={{ width: "100%", padding: "12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label htmlFor="editEmail" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Email</label>
              <input
                id="editEmail"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                style={{ width: "100%", padding: "12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label htmlFor="editRole" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Papel</label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                <SelectTrigger style={{ width: "100%" }}>
                  <SelectValue placeholder="Selecione papel" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#ffffff" }}>
                  <SelectItem value="member">Membro</SelectItem>
                  <SelectItem value="instructor">Instrutor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="editRank" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Cargo</label>
              <Select value={editForm.rank} onValueChange={(value) => setEditForm({ ...editForm, rank: value })}>
                <SelectTrigger style={{ width: "100%" }}>
                  <SelectValue placeholder="Selecione cargo" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#ffffff" }}>
                  <SelectItem value="Comandante Geral">Comandante Geral</SelectItem>
                  <SelectItem value="Subcomandante Geral">Subcomandante Geral</SelectItem>
                  <SelectItem value="Coronel">Coronel</SelectItem>
                  <SelectItem value="Tenente-Coronel">Tenente-Coronel</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
                  <SelectItem value="Capitão">Capitão</SelectItem>
                  <SelectItem value="1º Tenente">1º Tenente</SelectItem>
                  <SelectItem value="2º Tenente">2º Tenente</SelectItem>
                  <SelectItem value="Subtenente">Subtenente</SelectItem>
                  <SelectItem value="Cabo">Cabo</SelectItem>
                  <SelectItem value="Soldado">Soldado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <Button 
                onClick={handleEditSubmit}
                disabled={updateMutation.isPending}
                style={{ flex: 1, backgroundColor: "#16a34a", color: "#ffffff" }}
              >
                {updateMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
              <Button 
                onClick={() => setEditingUser(null)}
                style={{ flex: 1, backgroundColor: "#dc2626", color: "#ffffff" }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer style={{ backgroundColor: "#7f1d1d", color: "#ffffff", paddingTop: "32px", paddingBottom: "32px", textAlign: "center" }}>
        <p style={{ fontSize: "14px" }}>© 2026 1º CBM Lotus - Corpo de Bombeiros Militar</p>
        <p style={{ fontSize: "12px", marginTop: "8px", color: "#fee2e2" }}>FORÇA & HONRA</p>
      </footer>
    </div>
  );
}
