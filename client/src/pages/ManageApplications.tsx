import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Clock, User, Phone, Calendar } from "lucide-react";

export default function ManageApplications() {
  const { user, isAuthenticated } = useAuth();
  const { data: applications, isLoading, refetch } = trpc.applications.list.useQuery();
  const { data: courses } = trpc.courses.list.useQuery();
  
  const updateStatusMutation = trpc.applications.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      alert("Status atualizado com sucesso!");
    },
    onError: (error) => {
      alert(`Erro ao atualizar status: ${error.message}`);
    },
  });

  const handleAccept = (applicationId: number) => {
    if (confirm("Tem certeza que deseja aprovar esta solicitação?")) {
      updateStatusMutation.mutate({ id: applicationId, status: "accepted" });
    }
  };

  const handleReject = (applicationId: number) => {
    if (confirm("Tem certeza que deseja rejeitar esta solicitação?")) {
      updateStatusMutation.mutate({ id: applicationId, status: "rejected" });
    }
  };

  const getCourseName = (courseId: string) => {
    const course = courses?.find((c) => c.id === courseId);
    return course?.nome || "Curso não encontrado";
  };

  // Redirect if not instructor or admin
  if (isAuthenticated && user?.role !== "instructor" && user?.role !== "admin") {
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

  const pendingApplications = applications?.filter((a) => a.status === "pending") || [];
  const acceptedApplications = applications?.filter((a) => a.status === "accepted") || [];
  const rejectedApplications = applications?.filter((a) => a.status === "rejected") || [];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#b91c1c", color: "#ffffff", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px", paddingTop: "16px", paddingBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/GrEReyHfWMeFEfpu.jpg" alt="CBMRJ Logo" style={{ width: "48px", height: "48px" }} />
              <div>
                <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>Gerenciar Solicitações</h1>
                <p style={{ color: "#fee2e2" }}>Painel de Instrutores</p>
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

        {/* Pending Applications */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#f59e0b", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <Clock style={{ width: "32px", height: "32px" }} />
            Solicitações Pendentes ({pendingApplications.length})
          </h2>
          {pendingApplications.length === 0 ? (
            <p style={{ fontSize: "16px", color: "#666", fontStyle: "italic" }}>Nenhuma solicitação pendente.</p>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {pendingApplications.map((app) => (
                <Card key={app.id} style={{ padding: "24px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "24px" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#b91c1c", marginBottom: "12px" }}>
                        {getCourseName(app.courseId)}
                      </h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <User style={{ width: "16px", height: "16px", color: "#666" }} />
                          <div>
                            <p style={{ fontSize: "12px", color: "#999" }}>Nome Completo</p>
                            <p style={{ fontSize: "14px", color: "#1f2937", fontWeight: "500" }}>{app.nomeCompleto}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <User style={{ width: "16px", height: "16px", color: "#666" }} />
                          <div>
                            <p style={{ fontSize: "12px", color: "#999" }}>ID do Jogador</p>
                            <p style={{ fontSize: "14px", color: "#1f2937", fontWeight: "500" }}>{app.idJogador}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Phone style={{ width: "16px", height: "16px", color: "#666" }} />
                          <div>
                            <p style={{ fontSize: "12px", color: "#999" }}>Telefone</p>
                            <p style={{ fontSize: "14px", color: "#1f2937", fontWeight: "500" }}>{app.telefone}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Calendar style={{ width: "16px", height: "16px", color: "#666" }} />
                          <div>
                            <p style={{ fontSize: "12px", color: "#999" }}>Data da Solicitação</p>
                            <p style={{ fontSize: "14px", color: "#1f2937", fontWeight: "500" }}>
                              {new Date(app.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div style={{ backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px" }}>
                        <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>Horário Disponível</p>
                        <p style={{ fontSize: "14px", color: "#1f2937", whiteSpace: "pre-wrap" }}>{app.horarioDisponivel}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <Button
                        onClick={() => handleAccept(app.id)}
                        disabled={updateStatusMutation.isPending}
                        style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#16a34a", color: "#ffffff", minWidth: "140px" }}
                      >
                        <CheckCircle style={{ width: "16px", height: "16px" }} />
                        Aprovar
                      </Button>
                      <Button
                        onClick={() => handleReject(app.id)}
                        disabled={updateStatusMutation.isPending}
                        style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#dc2626", color: "#ffffff", minWidth: "140px" }}
                      >
                        <XCircle style={{ width: "16px", height: "16px" }} />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Accepted Applications */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#16a34a", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <CheckCircle style={{ width: "32px", height: "32px" }} />
            Solicitações Aprovadas ({acceptedApplications.length})
          </h2>
          <div style={{ display: "grid", gap: "16px" }}>
            {acceptedApplications.map((app) => (
              <Card key={app.id} style={{ padding: "20px", border: "1px solid #d1fae5", borderRadius: "8px", backgroundColor: "#f0fdf4" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#16a34a", marginBottom: "4px" }}>
                      {getCourseName(app.courseId)}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#166534" }}>
                      {app.nomeCompleto} • {app.idJogador}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "12px", color: "#166534" }}>Aprovado em</p>
                    <p style={{ fontSize: "14px", color: "#16a34a", fontWeight: "bold" }}>
                      {new Date(app.updatedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Rejected Applications */}
        {rejectedApplications.length > 0 && (
          <section>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#dc2626", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
              <XCircle style={{ width: "32px", height: "32px" }} />
              Solicitações Rejeitadas ({rejectedApplications.length})
            </h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {rejectedApplications.map((app) => (
                <Card key={app.id} style={{ padding: "20px", border: "1px solid #fee2e2", borderRadius: "8px", backgroundColor: "#fef2f2" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#dc2626", marginBottom: "4px" }}>
                        {getCourseName(app.courseId)}
                      </h3>
                      <p style={{ fontSize: "14px", color: "#991b1b" }}>
                        {app.nomeCompleto} • {app.idJogador}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "12px", color: "#991b1b" }}>Rejeitado em</p>
                      <p style={{ fontSize: "14px", color: "#dc2626", fontWeight: "bold" }}>
                        {new Date(app.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#7f1d1d", color: "#ffffff", paddingTop: "32px", paddingBottom: "32px", textAlign: "center" }}>
        <p style={{ fontSize: "14px" }}>© 2026 1º CBM Lotus - Corpo de Bombeiros Militar</p>
        <p style={{ fontSize: "12px", marginTop: "8px", color: "#fee2e2" }}>FORÇA & HONRA</p>
      </footer>
    </div>
  );
}
