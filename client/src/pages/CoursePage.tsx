import { useState, useEffect } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Edit, Save, X, ExternalLink, Upload, Trash2, Image as ImageIcon } from "lucide-react";

export default function CoursePage() {
  const [, params] = useRoute("/curso/:id");
  const courseId = params?.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  
  const { user, isAuthenticated, loading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  // Approval is now automatic based on rank, no need to check approvalStatus
  
  const { data: course, isLoading: courseLoading } = trpc.courses.getById.useQuery({ id: courseId });
  const { data: material, isLoading: materialLoading, refetch: refetchMaterial } = trpc.courses.getMaterial.useQuery({ courseId });
  const { data: images, isLoading: imagesLoading, refetch: refetchImages } = trpc.courses.getImages.useQuery({ courseId });
  const { data: files, isLoading: filesLoading, refetch: refetchFiles } = trpc.courses.getFiles.useQuery({ courseId });
  
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedInstructions, setEditedInstructions] = useState("");
  const [editedVideo1Title, setEditedVideo1Title] = useState("");
  const [editedVideo1Url, setEditedVideo1Url] = useState("");
  const [editedVideo2Title, setEditedVideo2Title] = useState("");
  const [editedVideo2Url, setEditedVideo2Url] = useState("");
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageCaption, setImageCaption] = useState("");
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  const [applicationData, setApplicationData] = useState({
    nomeCompleto: "",
    idJogador: "",
    telefone: "",
    horarioDisponivel: "",
  });

  const updateMaterialMutation = trpc.courses.updateMaterial.useMutation({
    onSuccess: () => {
      refetchMaterial();
      setIsEditing(false);
      alert("Material atualizado com sucesso!");
    },
    onError: (error) => {
      alert(`Erro ao atualizar material: ${error.message}`);
    },
  });

  const createApplicationMutation = trpc.applications.create.useMutation({
    onSuccess: () => {
      setShowApplicationModal(false);
      setApplicationData({
        nomeCompleto: "",
        idJogador: "",
        telefone: "",
        horarioDisponivel: "",
      });
      alert("Solicitação enviada com sucesso!");
    },
    onError: (error) => {
      alert(`Erro ao enviar solicitação: ${error.message}`);
    },
  });

  const uploadImageMutation = trpc.courses.uploadImage.useMutation({
    onSuccess: () => {
      refetchImages();
      setShowImageUploadModal(false);
      setImageCaption("");
      alert("Imagem enviada com sucesso!");
    },
    onError: (error) => {
      alert(`Erro ao enviar imagem: ${error.message}`);
    },
  });

  const deleteImageMutation = trpc.courses.deleteImage.useMutation({
    onSuccess: () => {
      refetchImages();
      alert("Imagem removida com sucesso!");
    },
    onError: (error) => {
      alert(`Erro ao remover imagem: ${error.message}`);
    },
  });

  const uploadFileMutation = trpc.courses.uploadFile.useMutation({
    onSuccess: () => {
      refetchFiles();
      setShowFileUploadModal(false);
      alert("Arquivo enviado com sucesso!");
    },
    onError: (error) => {
      alert(`Erro ao enviar arquivo: ${error.message}`);
    },
  });



  const deleteFileMutation = trpc.courses.deleteFile.useMutation({
    onSuccess: () => {
      refetchFiles();
      alert("Arquivo removido com sucesso!");
    },
    onError: (error) => {
      alert(`Erro ao remover arquivo: ${error.message}`);
    },
  });

  const handleStartEdit = () => {
    setEditedInstructions(material?.instructions || "");
    setEditedVideo1Title(material?.video1Title || "");
    setEditedVideo1Url(material?.video1Url || "");
    setEditedVideo2Title(material?.video2Title || "");
    setEditedVideo2Url(material?.video2Url || "");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateMaterialMutation.mutate({
      id: material?.id,
      courseId,
      instructions: editedInstructions,
      video1Title: editedVideo1Title || undefined,
      video1Url: editedVideo1Url || undefined,
      video2Title: editedVideo2Title || undefined,
      video2Url: editedVideo2Url || undefined,
    });
  };

  const handleSubmitApplication = () => {
    if (!applicationData.nomeCompleto || !applicationData.idJogador || !applicationData.telefone || !applicationData.horarioDisponivel) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    
    createApplicationMutation.mutate({
      courseId,
      ...applicationData,
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.");
      return;
    }

    setUploadingImage(true);

    try {
      // Converter para base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        // Upload para S3 via backend
        const response = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, filename: file.name }),
        });

        if (!response.ok) throw new Error("Erro ao fazer upload");

        const { url } = await response.json();

        // Salvar URL no banco
        uploadImageMutation.mutate({
          courseId,
          imageUrl: url,
          caption: imageCaption || undefined,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert("Erro ao fazer upload da imagem.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = (imageId: number) => {
    if (confirm("Tem certeza que deseja remover esta imagem?")) {
      deleteImageMutation.mutate({ id: imageId });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamanho (max 16MB)
    if (file.size > 16 * 1024 * 1024) {
      alert("O arquivo deve ter no máximo 16MB.");
      return;
    }

    setUploadingFile(true);

    try {
      // Converter para base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        // Upload para S3 via backend
        const response = await fetch("/api/upload-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, filename: file.name, mimeType: file.type }),
        });

        if (!response.ok) throw new Error("Erro ao fazer upload");

        const { url, key } = await response.json();

        // Salvar URL no banco
        uploadFileMutation.mutate({
          courseId,
          fileName: file.name,
          fileUrl: url,
          fileKey: key,
          fileSize: file.size,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert("Erro ao fazer upload do arquivo.");
      setUploadingFile(false);
    }
  };

  const handleDeleteFile = (fileId: number) => {
    if (confirm("Tem certeza que deseja remover este arquivo?")) {
      deleteFileMutation.mutate({ id: fileId });
    }
  };

  // Função para detectar se é um link do Medal.tv
  const isMedalTvLink = (url: string) => {
    return url?.includes("medal.tv");
  };

  // Função para extrair ID do YouTube
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  // Renderizar player de vídeo ou link
  const renderVideo = (url: string | null | undefined, title: string | null | undefined) => {
    if (!url) return null;

    if (isMedalTvLink(url)) {
      // Medal.tv não permite embedding, então mostramos um link clicável
      return (
        <div className="bg-gray-100 p-6 rounded-lg border-2 border-gray-300 text-center">
          <p className="text-gray-700 mb-4">
            {title || "Vídeo do Curso"} (Medal.tv)
          </p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 font-semibold"
          >
            <ExternalLink className="w-5 h-5" />
            Abrir Vídeo no Medal.tv
          </a>
        </div>
      );
    }

    const embedUrl = getYouTubeEmbedUrl(url);
    if (embedUrl) {
      return (
        <div>
          {title && <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>}
          <iframe
            width="100%"
            height="400"
            src={embedUrl}
            title={title || "Vídeo do Curso"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      );
    }

    // Link genérico para outros tipos de vídeo
    return (
      <div className="bg-gray-100 p-6 rounded-lg border-2 border-gray-300 text-center">
        <p className="text-gray-700 mb-4">{title || "Vídeo do Curso"}</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 font-semibold"
        >
          <ExternalLink className="w-5 h-5" />
          Abrir Vídeo
        </a>
      </div>
    );
  };

  // Apenas administradores podem editar material do curso
  const canEdit = user?.role === "admin";

  if (loading || courseLoading || materialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Curso não encontrado</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#b91c1c", color: "#ffffff", padding: "24px 0" }}>
        <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px" }}>
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-red-800 mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>{course.nome}</h1>
          <p style={{ fontSize: "18px", marginTop: "8px" }}>{course.descricao}</p>
          <div style={{ display: "flex", gap: "24px", marginTop: "16px", fontSize: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <p><strong>Valor:</strong> {course.valor}</p>
            <p><strong>Requisitos:</strong> {course.requisitos}</p>

          </div>
        </div>
      </header>

      {/* Material do Curso */}
      <section style={{ paddingTop: "48px", paddingBottom: "48px", backgroundColor: "#f9fafb" }}>
        <div style={{ maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#7f1d1d" }}>Material do Curso</h2>
            {canEdit && !isEditing && (
              <Button onClick={handleStartEdit} style={{ backgroundColor: "#b91c1c", color: "#ffffff" }}>
                <Edit className="w-4 h-4 mr-2" />
                Editar Material
              </Button>
            )}
            {canEdit && isEditing && (
              <div style={{ display: "flex", gap: "8px" }}>
                <Button onClick={handleSaveEdit} style={{ backgroundColor: "#16a34a", color: "#ffffff" }}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>

          <Card style={{ padding: "32px" }}>
            {isEditing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#374151" }}>
                    Instruções:
                  </label>
                  <textarea
                    value={editedInstructions}
                    onChange={(e) => setEditedInstructions(e.target.value)}
                    rows={8}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                    placeholder="Digite as instruções do curso..."
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#374151" }}>
                    Título do Vídeo 1:
                  </label>
                  <input
                    type="text"
                    value={editedVideo1Title}
                    onChange={(e) => setEditedVideo1Title(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                    placeholder="Ex: Demonstração Prática"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#374151" }}>
                    URL do Vídeo 1:
                  </label>
                  <input
                    type="text"
                    value={editedVideo1Url}
                    onChange={(e) => setEditedVideo1Url(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                    placeholder="Cole o link do YouTube ou Medal.tv"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#374151" }}>
                    Título do Vídeo 2:
                  </label>
                  <input
                    type="text"
                    value={editedVideo2Title}
                    onChange={(e) => setEditedVideo2Title(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                    placeholder="Ex: Teoria e Conceitos"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#374151" }}>
                    URL do Vídeo 2:
                  </label>
                  <input
                    type="text"
                    value={editedVideo2Url}
                    onChange={(e) => setEditedVideo2Url(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                    placeholder="Cole o link do YouTube ou Medal.tv"
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#374151", marginBottom: "12px" }}>
                    Instruções:
                  </h3>
                  <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#6b7280", whiteSpace: "pre-wrap" }}>
                    {material?.instructions || "Nenhuma instrução disponível ainda."}
                  </p>
                </div>

                {(material?.video1Url || material?.video2Url) && (
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#374151", marginBottom: "16px" }}>
                      Vídeos do Curso:
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      {material?.video1Url && renderVideo(material.video1Url, material.video1Title)}
                      {material?.video2Url && renderVideo(material.video2Url, material.video2Title)}
                    </div>
                  </div>
                )}

                {!material?.video1Url && !material?.video2Url && (
                  <p style={{ fontSize: "14px", color: "#9ca3af", fontStyle: "italic" }}>
                    Nenhum vídeo disponível ainda.
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Galeria de Imagens */}
          {!imagesLoading && images && images.length > 0 && (
            <Card style={{ padding: "32px", marginTop: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#374151" }}>
                  Galeria de Imagens
                </h3>
                {canEdit && (
                  <Button
                    onClick={() => setShowImageUploadModal(true)}
                    style={{ backgroundColor: "#b91c1c", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <Upload size={16} />
                    Adicionar Imagem
                  </Button>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
                {images.map((image, index) => (
                  <div key={image.id} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <img
                      src={image.imageUrl}
                      alt={image.caption || "Imagem do curso"}
                      style={{ width: "100%", height: "200px", objectFit: "cover", cursor: "pointer" }}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                    {image.caption && (
                      <div style={{ padding: "8px", backgroundColor: "#f9fafb" }}>
                        <p style={{ fontSize: "14px", color: "#374151" }}>{image.caption}</p>
                      </div>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          backgroundColor: "rgba(220, 38, 38, 0.9)",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Botão Adicionar Imagem para Admin (quando não há imagens) */}
          {canEdit && (!images || images.length === 0) && (
            <Card style={{ padding: "32px", marginTop: "32px", textAlign: "center" }}>
              <ImageIcon size={48} style={{ margin: "0 auto 16px", color: "#9ca3af" }} />
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>
                Nenhuma imagem adicionada ainda.
              </p>
              <Button
                onClick={() => setShowImageUploadModal(true)}
                style={{ backgroundColor: "#b91c1c", color: "#ffffff", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Upload size={16} />
                Adicionar Primeira Imagem
              </Button>
            </Card>
          )}

          {/* Seção de Arquivos */}
          {!filesLoading && files && files.length > 0 && (
            <Card style={{ padding: "32px", marginTop: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#374151" }}>
                  Arquivos do Curso
                </h3>
                {canEdit && (
                  <Button
                    onClick={() => setShowFileUploadModal(true)}
                    style={{ backgroundColor: "#b91c1c", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <Upload size={16} />
                    Adicionar Arquivo
                  </Button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {files.map((file) => (
                  <div key={file.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                      <div style={{ padding: "8px", backgroundColor: "#ffffff", borderRadius: "6px" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                          <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>{file.fileName}</p>
                        <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                          {file.fileSize ? `${(file.fileSize / 1024 / 1024).toFixed(2)} MB` : "Tamanho desconhecido"}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: "8px 16px", backgroundColor: "#b91c1c", color: "#ffffff", borderRadius: "6px", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        Download
                      </a>
                      {canEdit && (
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          style={{ padding: "8px", backgroundColor: "#dc2626", color: "#ffffff", border: "none", borderRadius: "6px", cursor: "pointer" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Botão Adicionar Arquivo para Admin (quando não há arquivos) */}
          {canEdit && (!files || files.length === 0) && (
            <Card style={{ padding: "32px", marginTop: "32px", textAlign: "center" }}>
              <Upload size={48} style={{ margin: "0 auto 16px", color: "#9ca3af" }} />
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>
                Nenhum arquivo adicionado ainda.
              </p>
              <Button
                onClick={() => setShowFileUploadModal(true)}
                style={{ backgroundColor: "#b91c1c", color: "#ffffff", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Upload size={16} />
                Adicionar Primeiro Arquivo
              </Button>
            </Card>
          )}

          {/* Botão Solicitar Curso */}
          <div style={{ marginTop: "32px", textAlign: "center" }}>
            <Button
              onClick={() => setShowApplicationModal(true)}
              style={{
                backgroundColor: "#b91c1c",
                color: "#ffffff",
                fontSize: "18px",
                padding: "16px 48px",
                fontWeight: "bold",
              }}
            >
              Solicitar Curso
            </Button>
          </div>
        </div>
      </section>

      {/* Modal de Solicitação */}
      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-700">Solicitar Inscrição</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
              <input
                type="text"
                value={applicationData.nomeCompleto}
                onChange={(e) => setApplicationData({ ...applicationData, nomeCompleto: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Digite seu nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ID do Jogador</label>
              <input
                type="text"
                value={applicationData.idJogador}
                onChange={(e) => setApplicationData({ ...applicationData, idJogador: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Digite seu ID"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
              <input
                type="text"
                value={applicationData.telefone}
                onChange={(e) => setApplicationData({ ...applicationData, telefone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Digite seu telefone"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Horário Disponível</label>
              <textarea
                value={applicationData.horarioDisponivel}
                onChange={(e) => setApplicationData({ ...applicationData, horarioDisponivel: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: Segunda a Sexta, 18h às 22h"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowApplicationModal(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitApplication}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Enviar Solicitação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Upload de Arquivo */}
      <Dialog open={showFileUploadModal} onOpenChange={setShowFileUploadModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-700">Adicionar Arquivo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Selecionar Arquivo</label>
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploadingFile}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">Máximo 16MB. Formatos: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP, RAR</p>
            </div>
            {uploadingFile && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600">Enviando arquivo...</p>
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => {
              setShowFileUploadModal(false);
              setUploadingFile(false);
            }}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Upload de Imagem */}
      <Dialog open={showImageUploadModal} onOpenChange={setShowImageUploadModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-700">Adicionar Imagem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Legenda (opcional)</label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: Equipamento de resgate"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Selecionar Imagem</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">Máximo 5MB. Formatos: JPG, PNG, GIF, WEBP</p>
            </div>
            {uploadingImage && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600">Enviando imagem...</p>
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => {
              setShowImageUploadModal(false);
              setImageCaption("");
            }}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização de Imagem */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
        <DialogContent style={{ maxWidth: "90vw", maxHeight: "90vh", padding: "0", overflow: "hidden" }}>
          {selectedImageIndex !== null && images && images[selectedImageIndex] && (
            <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
              {/* Botão Fechar */}
              <button
                onClick={() => setSelectedImageIndex(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  zIndex: 10,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>

              {/* Botão Anterior */}
              {selectedImageIndex > 0 && (
                <button
                  onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "24px",
                  }}
                >
                  ‹
                </button>
              )}

              {/* Botão Próximo */}
              {selectedImageIndex < images.length - 1 && (
                <button
                  onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "24px",
                  }}
                >
                  ›
                </button>
              )}

              {/* Imagem */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#000" }}>
                <img
                  src={images[selectedImageIndex].imageUrl}
                  alt={images[selectedImageIndex].caption || "Imagem do curso"}
                  style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
                />
              </div>

              {/* Legenda */}
              {images[selectedImageIndex].caption && (
                <div style={{ padding: "16px", backgroundColor: "#fff", textAlign: "center" }}>
                  <p style={{ fontSize: "16px", color: "#374151", margin: 0 }}>
                    {images[selectedImageIndex].caption}
                  </p>
                </div>
              )}

              {/* Contador */}
              <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white", padding: "8px 16px", borderRadius: "20px", fontSize: "14px" }}>
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
