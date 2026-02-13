import { useState, useRef } from "react";
import JSZip from "jszip";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, FileImage, FileText, Heart, Shield, Users, Send } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { getLoginUrl } from "@/const";
import { CBM_LOGO_BASE64 } from "@/constants/logoBase64";

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  // Redirect users with incomplete profile
  useEffect(() => {
    if (isAuthenticated && user && user.profileCompleted === 0) {
      setLocation("/complete-profile");
    }
  }, [isAuthenticated, user, setLocation]);

  // Buscar cursos do banco de dados
  const { data: courses, isLoading: coursesLoading } = trpc.courses.list.useQuery();
  
  // Contar solicitações pendentes
  const { data: pendingCount } = trpc.applications.countPending.useQuery(undefined, {
    enabled: user?.role === "instructor" || user?.role === "admin",
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  const [certificateData, setCertificateData] = useState({
    studentName: "",
    studentId: "",
    courseName: "",
    applicatorName: "",
    applicatorRank: "",
  });

  // Mutation para publicar certificado no Discord
  const publishToDiscord = trpc.certificates.publishToDiscord.useMutation({
    onSuccess: () => {
      alert("✅ Certificado publicado no Discord com sucesso!");
    },
    onError: (error) => {
      alert(`❌ Erro ao publicar no Discord: ${error.message}`);
    },
  });

  // Mutation para publicar múltiplos certificados no Discord
  const publishBatchToDiscord = trpc.certificates.publishBatchToDiscord.useMutation({
    onSuccess: (data) => {
      alert(`✅ ${data.message}`);
    },
    onError: (error) => {
      alert(`❌ Erro ao publicar certificados no Discord: ${error.message}`);
    },
  });

  const handlePublishToDiscord = async () => {
    if (!certificateData.studentName || !certificateData.studentId || !certificateData.courseName) {
      alert("⚠️ Preencha todos os campos do certificado antes de publicar.");
      return;
    }

    if (!certificateRef.current) {
      alert("⚠️ Erro ao capturar certificado. Tente novamente.");
      return;
    }

    try {
      // Gerar PNG do certificado
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f5e6d3",
        allowTaint: true,
        logging: false,
        removeContainer: true,
        foreignObjectRendering: false,
      });

      // Converter canvas para base64
      const imageBase64 = canvas.toDataURL("image/png");

      // Publicar no Discord com a imagem
      publishToDiscord.mutate({
        studentName: certificateData.studentName,
        studentId: certificateData.studentId,
        courseName: certificateData.courseName,
        imageBase64,
      });
    } catch (error) {
      console.error("Erro ao gerar imagem do certificado:", error);
      alert("❌ Erro ao gerar imagem do certificado. Tente novamente.");
    }
  };

  const [courseResults, setCourseResults] = useState({
    courseSelected: "",
    applicatorName: "",
    applicatorRank: user?.rank || "",
    auxiliarName: "",
    approved: [] as Array<{ name: string; matricula: string }>,
    disapproved: [] as Array<{ name: string; matricula: string }>,
  });

  // Auto-preencher cargo quando usuário carregar
  useEffect(() => {
    if (user?.rank && !courseResults.applicatorRank) {
      setCourseResults(prev => ({ ...prev, applicatorRank: user.rank || "" }));
    }
  }, [user?.rank]);

  const certificateRef = useRef<HTMLDivElement>(null);

  const exportCertificateAsImage = async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f5e6d3",
        allowTaint: true,
        logging: false,
        removeContainer: true,
        foreignObjectRendering: false,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `certificado-${certificateData.studentName || "aluno"}.png`;
      link.click();
    } catch (error) {
      console.error("Erro ao exportar imagem:", error);
      alert("Erro ao exportar certificado como imagem. Tente novamente.");
    }
  };

  const exportCertificateAsPDF = async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f5e6d3",
        allowTaint: true,
        logging: false,
        removeContainer: true,
        foreignObjectRendering: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`certificado-${certificateData.studentName || "aluno"}.pdf`);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar certificado como PDF. Tente novamente.");
    }
  };

  const [newApproved, setNewApproved] = useState("");
  const [newApprovedMatricula, setNewApprovedMatricula] = useState("");
  const [newDisapproved, setNewDisapproved] = useState("");
  const [newDisapprovedMatricula, setNewDisapprovedMatricula] = useState("");
  const [isGeneratingCertificates, setIsGeneratingCertificates] = useState(false);

  const valores = [
    {
      icon: Heart,
      titulo: "CORAGEM",
      descricao: "Enfrentamos os maiores desafios com determinação e bravura para proteger quem precisar.",
    },
    {
      icon: Shield,
      titulo: "DISCIPLINA",
      descricao: "A base da nossa eficiência e da confiança que a população deposita em nós.",
    },
    {
      icon: Users,
      titulo: "ESPÍRITO DE EQUIPE",
      descricao: "Unidos somos mais fortes. A colaboração é a chave para o sucesso nas missões.",
    },
  ];

  const handleAddApproved = () => {
    if (newApproved.trim() && newApprovedMatricula.trim()) {
      setCourseResults({
        ...courseResults,
        approved: [...courseResults.approved, { name: newApproved, matricula: newApprovedMatricula }],
      });
      setNewApproved("");
      setNewApprovedMatricula("");
    } else {
      alert("Por favor, preencha nome e matrícula do aprovado.");
    }
  };

  const handleAddDisapproved = () => {
    if (newDisapproved.trim() && newDisapprovedMatricula.trim()) {
      setCourseResults({
        ...courseResults,
        disapproved: [...courseResults.disapproved, { name: newDisapproved, matricula: newDisapprovedMatricula }],
      });
      setNewDisapproved("");
      setNewDisapprovedMatricula("");
    } else {
      alert("Por favor, preencha nome e matrícula do reprovado.");
    }
  };

  const handleConfirmResults = async () => {
    // Validar dados
    if (!courseResults.courseSelected) {
      alert("Por favor, selecione um curso.");
      return;
    }
    if (!courseResults.applicatorName) {
      alert("Por favor, informe o nome do aplicador.");
      return;
    }
    if (courseResults.approved.length === 0) {
      alert("Não há alunos aprovados para gerar certificados.");
      return;
    }

    setIsGeneratingCertificates(true);

    try {
      const zip = new JSZip();
      const certificatesFolder = zip.folder("certificados");
      const certificateImages: Array<{ studentName: string; studentId: string; courseName: string; imageBase64: string }> = [];

      // Criar um elemento temporário para renderizar certificados
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      document.body.appendChild(tempContainer);

      // Gerar certificado para cada aprovado
      for (const student of courseResults.approved) {
        // Criar elemento do certificado
        const certElement = document.createElement("div");
        certElement.style.aspectRatio = "16/9";
        certElement.style.background = "linear-gradient(135deg, #f5e6d3 0%, #e8d4c0 100%)";
        certElement.style.width = "1200px";
        certElement.style.borderRadius = "12px";
        certElement.style.overflow = "hidden";
        certElement.style.position = "relative";

        certElement.innerHTML = `
          <div style="position: absolute; inset: 0; border: 8px solid #8b0000;"></div>
          <div style="position: absolute; inset: 8px; border: 2px solid #d4af37;"></div>
          <div style="height: 100%; padding: 32px; display: flex; flex-direction: column; justify-content: space-between; position: relative; color: #8b0000;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <img src="${CBM_LOGO_BASE64}" alt="CBMRJ" style="width: 80px; height: 80px; border-radius: 50%;" />
                <p style="font-size: 18px; font-weight: bold; letter-spacing: 1px; text-align: center; color: #8b0000;">1º CBM</p>
                <p style="font-size: 18px; font-weight: bold; text-align: center; color: #8b0000;">Lotus</p>
              </div>
              <div style="width: 70px; height: 70px; background-color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 3px solid #d4af37;">
                <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#8b0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
            </div>
            <div style="text-align: center; display: flex; flex-direction: column; gap: 6px; margin-top: -70px;">
              <p style="font-size: 26px; font-weight: 900; letter-spacing: 2px; color: #8b0000;">CERTIFICADO</p>
              <p style="font-size: 18px; letter-spacing: 1px; color: #8b0000;">Certificamos que</p>
              <p style="font-size: 38px; font-weight: 900; font-family: 'Playfair Display', serif; color: #7f1d1d;">${student.name}</p>
              <p style="font-size: 18px; color: #7f1d1d;">Matrícula: <span style="font-weight: bold;">${student.matricula}</span></p>
              <div style="border-top: 2px solid #8b0000; border-bottom: 2px solid #8b0000; padding-top: 8px; padding-bottom: 8px; margin-top: 3px;">
                <p style="font-size: 18px; margin-bottom: 8px; color: #8b0000;">Concluiu com êxito o curso de</p>
                <p style="font-size: 28px; font-weight: 900; font-family: 'Playfair Display', serif; color: #7f1d1d;">${courseResults.courseSelected}</p>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end; position: relative;">
              <div style="position: absolute; left: 0; bottom: 0;">
                <!-- Espaço vazio para balancear -->
              </div>
              <div style="text-align: center; width: 100%;">
                <div style="display: inline-block; min-width: 300px;">
                  <p style="font-size: 28px; font-family: 'Mistral', cursive; font-style: italic; color: #7f1d1d; margin-bottom: 4px;">${courseResults.applicatorName}</p>
                  <div style="border-top: 2px solid #8b0000; padding-top: 8px; margin-top: 0;">
                    <p style="font-weight: bold; font-size: 18px; color: #7f1d1d;">${courseResults.applicatorRank || "Aplicador"}</p>
                  </div>
                </div>
              </div>
              <p style="font-size: 18px; color: #7f1d1d; font-weight: bold; position: absolute; right: 0; bottom: 0;">ID: CBM-VICE</p>
            </div>
          </div>
        `;

        tempContainer.appendChild(certElement);

        // Gerar imagem do certificado usando html2canvas
        const canvas = await html2canvas(certElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#f5e6d3",
          allowTaint: true,
          logging: false,
          removeContainer: false,
          foreignObjectRendering: false,
        });

        // Converter canvas para blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), "image/png");
        });

        // Adicionar ao ZIP
        const fileName = `certificado-${student.name.replace(/\s+/g, "-")}-${student.matricula}.png`;
        certificatesFolder?.file(fileName, blob);

        // Salvar imagem base64 para publicação no Discord
        const imageBase64 = canvas.toDataURL("image/png");
        certificateImages.push({
          studentName: student.name,
          studentId: student.matricula,
          courseName: courseResults.courseSelected,
          imageBase64,
        });

        // Remover elemento temporário
        tempContainer.removeChild(certElement);
      }

      // Remover container temporário
      document.body.removeChild(tempContainer);

      // Gerar e fazer download do ZIP
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = `certificados-${courseResults.courseSelected.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.zip`;
      link.click();

      alert(`${courseResults.approved.length} certificado(s) gerado(s) com sucesso!`);

      // Perguntar se deseja publicar no Discord (apenas para instrutores/admins)
      if (user?.role === "instructor" || user?.role === "admin") {
        const shouldPublish = window.confirm(
          `Deseja publicar os ${courseResults.approved.length} certificado(s) no canal Discord #certificados-cursos?`
        );

        if (shouldPublish) {
          // Publicar em lote com imagens
          publishBatchToDiscord.mutate({ certificates: certificateImages });
        }
      }

      // Limpar formulário
      setCourseResults({
        courseSelected: "",
        applicatorName: "",
        applicatorRank: user?.rank || "",
        auxiliarName: "",
        approved: [],
        disapproved: [],
      });
    } catch (error) {
      console.error("Erro ao gerar certificados:", error);
      alert("Erro ao gerar certificados. Tente novamente.");
    } finally {
      setIsGeneratingCertificates(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#b91c1c", color: "#ffffff", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px", paddingTop: "16px", paddingBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/dYCkipOUOFochLwh.png" alt="CBMRJ Logo" style={{ width: "80px", height: "80px" }} />
              <div>
                <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>1º CBM Lotus</h1>
                <p style={{ color: "#fee2e2" }}>Corpo de Bombeiros Militar</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Link href="/agendamento">
                <Button style={{ backgroundColor: "#ffffff", color: "#b91c1c", fontWeight: "bold" }}>Agendamento</Button>
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin/usuarios">
                  <Button style={{ backgroundColor: "#ffffff", color: "#b91c1c", fontWeight: "bold" }}>Gerenciar Usuários</Button>
                </Link>
              )}
              {(user?.role === "instructor" || user?.role === "admin") && (
                <Link href="/gerenciar-solicitacoes">
                  <Button style={{ backgroundColor: "#ffffff", color: "#b91c1c", fontWeight: "bold", position: "relative" }}>
                    Gerenciar Solicitações
                    {pendingCount && pendingCount.count > 0 && (
                      <span style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        backgroundColor: "#ef4444",
                        color: "#ffffff",
                        borderRadius: "9999px",
                        padding: "2px 8px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        minWidth: "20px",
                        textAlign: "center",
                      }}>
                        {pendingCount.count}
                      </span>
                    )}
                  </Button>
                </Link>
              )}

              {isAuthenticated && (
                <Button onClick={() => logout()} style={{ backgroundColor: "#7f1d1d", color: "#ffffff" }}>Sair</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ position: "relative", minHeight: "450px", background: "linear-gradient(to right, #7f1d1d, #b91c1c)", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1613828584639-c51ca9342601?w=1200&h=400&fit=crop" alt="Bombeiros" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "32px", paddingRight: "32px", paddingTop: "64px", paddingBottom: "64px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
            {/* Texto à esquerda */}
            <div style={{ color: "#ffffff" }}>
              <h2 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "24px" }}>FORÇA & HONRA</h2>
              <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
                Sistema de certificação e registro do Corpo de Bombeiros Militar de Lotus.
                <br /><br />
                Dedicação total à proteção e ao serviço da comunidade.
              </p>
            </div>
            {/* Brasão grande à direita */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663187653950/dYCkipOUOFochLwh.png" 
                alt="Brasão CBM RJ" 
                style={{ width: "350px", height: "350px", filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))" }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Cursos */}
      <section style={{ paddingTop: "64px", paddingBottom: "64px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#7f1d1d", marginBottom: "48px", textAlign: "center" }}>NOSSOS CURSOS</h2>
          <p style={{ textAlign: "center", marginBottom: "32px", color: "#666" }}>Capacitação contínua para missões de alto risco. Formamos especialistas prontos para qualquer desafio.</p>
          {coursesLoading ? (
            <p style={{ textAlign: "center", color: "#666" }}>Carregando cursos...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {courses?.map((curso) => (
                <Card key={curso.id} style={{ padding: "0", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                  {curso.imageUrl && (
                    <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
                      <img 
                        src={curso.imageUrl} 
                        alt={curso.nome} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                      />
                    </div>
                  )}
                  <div style={{ padding: "24px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#b91c1c", marginBottom: "8px" }}>{curso.nome}</h3>
                    <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>Valor: {curso.valor}</p>
                    <Link href={`/curso/${curso.id}`}>
                      <Button style={{ width: "100%", backgroundColor: "#b91c1c", color: "#ffffff" }}>Saiba Mais</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Acesso Rápido para Instrutores */}
      {(user?.role === "instructor" || user?.role === "admin") && (
        <section style={{ paddingTop: "64px", paddingBottom: "64px", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px" }}>
            <div style={{ backgroundColor: "#b91c1c", borderRadius: "12px", padding: "48px", textAlign: "center", color: "#ffffff" }}>
              <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "16px" }}>Painel de Instrutores</h2>
              <p style={{ fontSize: "18px", marginBottom: "32px", color: "#fee2e2" }}>
                Gerencie as solicitações de inscrição em cursos e aprove novos candidatos
              </p>
              <Link href="/gerenciar-solicitacoes">
                <Button style={{ backgroundColor: "#ffffff", color: "#b91c1c", fontSize: "18px", padding: "16px 48px", fontWeight: "bold", borderRadius: "8px" }}>
                  Acessar Painel de Solicitações
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Valores */}
      <section style={{ paddingTop: "64px", paddingBottom: "64px", backgroundColor: "#f9fafb" }}>
        <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#7f1d1d", marginBottom: "48px", textAlign: "center" }}>NOSSA MISSÃO</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
            {valores.map((valor, idx) => {
              const Icon = valor.icon;
              return (
                <Card key={idx} style={{ padding: "32px", textAlign: "center", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                    <Icon style={{ width: "48px", height: "48px", color: "#b91c1c" }} />
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#b91c1c", marginBottom: "12px" }}>{valor.titulo}</h3>
                  <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>{valor.descricao}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gerador de Certificados - Apenas Instrutores e Admins */}
      {(user?.role === "instructor" || user?.role === "admin") && (
      <section style={{ paddingTop: "64px", paddingBottom: "64px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#7f1d1d", marginBottom: "48px", textAlign: "center" }}>Gerador de Certificados</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px" }}>
            {/* Formulário */}
            <Card style={{ padding: "32px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#b91c1c", marginBottom: "24px" }}>Dados do Certificado</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label htmlFor="studentName" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Nome do Aluno</label>
                  <input id="studentName" type="text" placeholder="Digite o nome do aluno" value={certificateData.studentName} onChange={(e) => setCertificateData({ ...certificateData, studentName: e.target.value })} style={{ width: "100%", padding: "8px 12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label htmlFor="studentId" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Matrícula</label>
                  <input id="studentId" type="text" placeholder="Digite a matrícula" value={certificateData.studentId} onChange={(e) => setCertificateData({ ...certificateData, studentId: e.target.value })} style={{ width: "100%", padding: "8px 12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label htmlFor="courseName" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Nome do Curso</label>
                  <Select value={certificateData.courseName} onValueChange={(value) => setCertificateData({ ...certificateData, courseName: value })}>
                    <SelectTrigger style={{ width: "100%", backgroundColor: "#ffffff" }}>
                      <SelectValue placeholder="Selecione um curso" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: "#ffffff" }}>
                      {coursesLoading ? (
                        <SelectItem value="loading" disabled>Carregando cursos...</SelectItem>
                      ) : courses && courses.length > 0 ? (
                        courses.map((course) => (
                          <SelectItem key={course.id} value={course.nome}>{course.nome}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-courses" disabled>Nenhum curso cadastrado</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="applicatorName" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Nome do Aplicador</label>
                  <input id="applicatorName" type="text" placeholder="Digite o nome do aplicador" value={certificateData.applicatorName} onChange={(e) => setCertificateData({ ...certificateData, applicatorName: e.target.value })} style={{ width: "100%", padding: "8px 12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label htmlFor="applicatorRank" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Cargo do Aplicador</label>
                  <Select value={certificateData.applicatorRank} onValueChange={(value) => setCertificateData({ ...certificateData, applicatorRank: value })}>
                    <SelectTrigger style={{ width: "100%", backgroundColor: "#ffffff" }}>
                      <SelectValue placeholder="Selecione o cargo" />
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
              </div>
            </Card>

            {/* Pré-visualização */}
            <div>
              <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#b91c1c", marginBottom: "24px" }}>Pré-Visualização do Certificado</h3>
              <div ref={certificateRef} style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #f5e6d3 0%, #e8d4c0 100%)", width: "100%", borderRadius: "12px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", position: "relative" }}>
                {/* Decorative Border */}
                <div style={{ position: "absolute", inset: 0, border: "8px solid #8b0000" }}></div>
                <div style={{ position: "absolute", inset: "8px", border: "2px solid #d4af37" }}></div>



                <div style={{ height: "100%", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", color: "#8b0000", marginTop: "-40px" }}>
                  {/* Top Section */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginTop: "40px" }}>
                    {/* Left - Logo */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                      <img src={CBM_LOGO_BASE64} alt="CBMRJ" style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
                       <p style={{ fontSize: "11px", fontWeight: "bold", letterSpacing: "1px", textAlign: "center", color: "#8b0000" }}>1º CBM</p>
                      <p style={{ fontSize: "11px", fontWeight: "bold", textAlign: "center", color: "#8b0000" }}>Lotus</p>>
                    </div>
                    
                    {/* Right - Seal */}
                    <div style={{ width: "50px", height: "50px", backgroundColor: "#ffffff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", border: "2px solid #d4af37" }}>
                      <CheckCircle2 style={{ width: "38px", height: "38px", color: "#8b0000" }} />
                    </div>
                  </div>

                  {/* Center - Main Content */}
                  <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "4px", marginTop: "-60px" }}>
                    <p style={{ fontSize: "14px", fontWeight: "900", letterSpacing: "2px", color: "#8b0000" }}>CERTIFICADO</p>
                    <p style={{ fontSize: "9px", letterSpacing: "1px", color: "#8b0000" }}>Certificamos que</p>
                    <p style={{ fontSize: "22px", fontWeight: "900", fontFamily: '"Playfair Display", serif', color: "#8b0000" }}>{certificateData.studentName || "NOME DO ALUNO"}</p>
                    <p style={{ fontSize: "9px", color: "#8b0000" }}>
                      Matrícula: <span style={{ fontWeight: "bold" }}>{certificateData.studentId || "000"}</span>
                    </p>
                    <div style={{ borderTop: "2px solid #8b0000", borderBottom: "2px solid #8b0000", paddingTop: "6px", paddingBottom: "6px", marginTop: "2px" }}>
                      <p style={{ fontSize: "9px", marginBottom: "4px", color: "#8b0000" }}>Concluiu com êxito o curso de</p>
                      <p style={{ fontSize: "16px", fontWeight: "900", fontFamily: '"Playfair Display", serif', color: "#8b0000" }}>{certificateData.courseName || "NOME DO CURSO"}</p>
                    </div>
                  </div>

                  {/* Bottom - Signature and ID */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
                    <div style={{ position: "absolute", left: 0, bottom: 0 }}>
                      {/* Espaço vazio para balancear */}
                    </div>
                    <div style={{ textAlign: "center", width: "100%" }}>
                      <div style={{ display: "inline-block", minWidth: "200px" }}>
                        <p style={{ fontSize: "18px", fontFamily: "Mistral, cursive", fontStyle: "italic", color: "#8b0000", marginBottom: "8px" }}>{certificateData.applicatorName || "Nome do Aplicador"}</p>
                        <div style={{ borderTop: "2px solid #8b0000", paddingTop: "6px", marginTop: "0" }}>
                          <p style={{ fontWeight: "bold", fontSize: "11px", color: "#8b0000" }}>{certificateData.applicatorRank || "Cargo"}</p>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: "11px", color: "#8b0000", fontWeight: "bold", position: "absolute", right: 0, bottom: "-20px" }}>ID: CBM-VICE</p>
                  </div>
                </div>
              </div>
              {/* Botões de Exportação */}
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "32px", flexWrap: "wrap" }}>
                <button onClick={exportCertificateAsImage} style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "24px", paddingRight: "24px", paddingTop: "12px", paddingBottom: "12px", backgroundColor: "#b91c1c", color: "#ffffff", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", transition: "background-color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#991b1b")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}>
                  <FileImage style={{ width: "20px", height: "20px" }} />
                  Exportar como PNG
                </button>
                <button onClick={exportCertificateAsPDF} style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "24px", paddingRight: "24px", paddingTop: "12px", paddingBottom: "12px", backgroundColor: "#b91c1c", color: "#ffffff", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", transition: "background-color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#991b1b")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}>
                  <FileText style={{ width: "20px", height: "20px" }} />
                  Exportar como PDF
                </button>
                {(user?.role === "instructor" || user?.role === "admin") && (
                  <button 
                    onClick={handlePublishToDiscord} 
                    disabled={publishToDiscord.isPending}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px", 
                      paddingLeft: "24px", 
                      paddingRight: "24px", 
                      paddingTop: "12px", 
                      paddingBottom: "12px", 
                      backgroundColor: publishToDiscord.isPending ? "#6b7280" : "#5865F2", 
                      color: "#ffffff", 
                      borderRadius: "8px", 
                      border: "none", 
                      cursor: publishToDiscord.isPending ? "not-allowed" : "pointer", 
                      fontWeight: "600", 
                      transition: "background-color 0.2s",
                      opacity: publishToDiscord.isPending ? 0.7 : 1
                    }} 
                    onMouseEnter={(e) => !publishToDiscord.isPending && (e.currentTarget.style.backgroundColor = "#4752C4")} 
                    onMouseLeave={(e) => !publishToDiscord.isPending && (e.currentTarget.style.backgroundColor = "#5865F2")}
                  >
                    <Send style={{ width: "20px", height: "20px" }} />
                    {publishToDiscord.isPending ? "Publicando..." : "Publicar no Discord"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      )}

      {/* Registrar Resultados - Apenas Instrutores e Admins */}
      {(user?.role === "instructor" || user?.role === "admin") && (
      <section style={{ paddingTop: "64px", paddingBottom: "64px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#7f1d1d", marginBottom: "48px", textAlign: "center" }}>Registrar Resultados de Curso</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {/* Formulário */}
            <Card style={{ padding: "32px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#b91c1c", marginBottom: "24px" }}>Informações da Aplicação</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label htmlFor="courseSelect" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Curso Aplicado</label>
                  <select id="courseSelect" value={courseResults.courseSelected} onChange={(e) => setCourseResults({ ...courseResults, courseSelected: e.target.value })} style={{ width: "100%", padding: "8px 12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937" }}>
                    <option value="">Selecione um curso</option>
                    {courses?.map((curso) => (
                      <option key={curso.id} value={curso.nome}>
                        {curso.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="applicatorNameInput" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Nome do Aplicador</label>
                  <input id="applicatorNameInput" type="text" placeholder="Digite o nome do aplicador" value={courseResults.applicatorName} onChange={(e) => setCourseResults({ ...courseResults, applicatorName: e.target.value })} style={{ width: "100%", padding: "8px 12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label htmlFor="applicatorRankInput" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Cargo do Aplicador</label>
                  <input id="applicatorRankInput" type="text" placeholder="Digite o cargo do aplicador" value={courseResults.applicatorRank} onChange={(e) => setCourseResults({ ...courseResults, applicatorRank: e.target.value })} style={{ width: "100%", padding: "8px 12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label htmlFor="auxiliarNameInput" style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#1f2937" }}>Nome do Auxiliar</label>
                  <input id="auxiliarNameInput" type="text" placeholder="Digite o nome do auxiliar" value={courseResults.auxiliarName} onChange={(e) => setCourseResults({ ...courseResults, auxiliarName: e.target.value })} style={{ width: "100%", padding: "8px 12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937", boxSizing: "border-box" }} />
                </div>

                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
                  <h4 style={{ fontWeight: "bold", color: "#16a34a", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 style={{ width: "20px", height: "20px" }} /> Adicionar Aprovado
                  </h4>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <input type="text" placeholder="Nome do aprovado" value={newApproved} onChange={(e) => setNewApproved(e.target.value)} style={{ flex: 2, padding: "8px 12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937", boxSizing: "border-box" }} />
                    <input type="text" placeholder="Matrícula" value={newApprovedMatricula} onChange={(e) => setNewApprovedMatricula(e.target.value)} style={{ flex: 1, padding: "8px 12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937", boxSizing: "border-box" }} />
                    <Button onClick={handleAddApproved} style={{ backgroundColor: "#16a34a", color: "#ffffff" }}>
                      Adicionar
                    </Button>
                  </div>
                  {courseResults.approved.length > 0 && (
                    <div style={{ backgroundColor: "#f0fdf4", padding: "12px", borderRadius: "6px" }}>
                      {courseResults.approved.map((student, idx) => (
                        <p key={idx} style={{ fontSize: "14px", color: "#16a34a", marginBottom: "4px" }}>
                          ✓ {student.name} - Mat: {student.matricula}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
                  <h4 style={{ fontWeight: "bold", color: "#dc2626", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    ✗ Adicionar Reprovado
                  </h4>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <input type="text" placeholder="Nome do reprovado" value={newDisapproved} onChange={(e) => setNewDisapproved(e.target.value)} style={{ flex: 2, padding: "8px 12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937", boxSizing: "border-box" }} />
                    <input type="text" placeholder="Matrícula" value={newDisapprovedMatricula} onChange={(e) => setNewDisapprovedMatricula(e.target.value)} style={{ flex: 1, padding: "8px 12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#1f2937", boxSizing: "border-box" }} />
                    <Button onClick={handleAddDisapproved} style={{ backgroundColor: "#dc2626", color: "#ffffff" }}>
                      Adicionar
                    </Button>
                  </div>
                  {courseResults.disapproved.length > 0 && (
                    <div style={{ backgroundColor: "#fef2f2", padding: "12px", borderRadius: "6px" }}>
                      {courseResults.disapproved.map((student, idx) => (
                        <p key={idx} style={{ fontSize: "14px", color: "#dc2626", marginBottom: "4px" }}>
                          ✗ {student.name} - Mat: {student.matricula}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Resumo */}
            <Card style={{ padding: "32px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#b91c1c", marginBottom: "24px" }}>Resumo da Aplicação</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <p style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Curso:</p>
                  <p style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937" }}>{courseResults.courseSelected || "Não selecionado"}</p>
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Aplicador:</p>
                  <p style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937" }}>{courseResults.applicatorName || "Não informado"}</p>
                  {courseResults.applicatorRank && (
                    <p style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>Cargo: {courseResults.applicatorRank}</p>
                  )}
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Auxiliar:</p>
                  <p style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937" }}>{courseResults.auxiliarName || "Não informado"}</p>
                </div>
                <div style={{ backgroundColor: "#f0fdf4", padding: "16px", borderRadius: "8px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "bold", color: "#16a34a", marginBottom: "8px" }}>Aprovados: {courseResults.approved.length}</p>
                  {courseResults.approved.map((student, idx) => (
                    <p key={idx} style={{ fontSize: "12px", color: "#16a34a", marginLeft: "12px" }}>
                      • {student.name} - Mat: {student.matricula}
                    </p>
                  ))}
                </div>
                <div style={{ backgroundColor: "#fef2f2", padding: "16px", borderRadius: "8px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "bold", color: "#dc2626", marginBottom: "8px" }}>Reprovados: {courseResults.disapproved.length}</p>
                  {courseResults.disapproved.map((student, idx) => (
                    <p key={idx} style={{ fontSize: "12px", color: "#dc2626", marginLeft: "12px" }}>
                      • {student.name} - Mat: {student.matricula}
                    </p>
                  ))}
                </div>
                
                {/* Botão Confirmar Resultados */}
                {courseResults.approved.length > 0 && (
                  <Button 
                    onClick={handleConfirmResults}
                    disabled={isGeneratingCertificates}
                    style={{ 
                      width: "100%", 
                      backgroundColor: isGeneratingCertificates ? "#9ca3af" : "#16a34a", 
                      color: "#ffffff",
                      fontSize: "18px",
                      padding: "16px",
                      fontWeight: "bold",
                      marginTop: "24px"
                    }}
                  >
                    {isGeneratingCertificates ? "Gerando Certificados..." : "Confirmar Resultados e Gerar Certificados"}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: "#7f1d1d", color: "#ffffff", paddingTop: "32px", paddingBottom: "32px", textAlign: "center" }}>
        <p style={{ fontSize: "14px" }}>© 2026 1º CBM Lotus - Corpo de Bombeiros Militar</p>
        <p style={{ fontSize: "12px", marginTop: "8px", color: "#fee2e2" }}>FORÇA & HONRA</p>
      </footer>
    </div>
  );
}
