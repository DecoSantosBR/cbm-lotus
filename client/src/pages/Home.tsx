import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Award, LogOut } from "lucide-react";
import { CertificateGenerator } from "@/components/CertificateGenerator";

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  const { data: courses, isLoading: coursesLoading } = trpc.courses.list.useQuery();

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  if (loading || coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Carregando...</h1>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700">
      {/* Header */}
      <header className="bg-red-950/50 backdrop-blur-sm border-b border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-white">1º CBM Lotus</h1>
              {user && (
                <span className="text-red-200">
                  Bem-vindo, {user.name}
                  {user.rank && ` - ${user.rank}`}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/calendario">
                <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendário
                </Button>
              </Link>
              {isAdmin && (
                <>
                  <Link href="/admin/usuarios">
                    <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                      <Users className="mr-2 h-4 w-4" />
                      Usuários
                    </Button>
                  </Link>
                  <Link href="/admin/inscricoes">
                    <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                      <Award className="mr-2 h-4 w-4" />
                      Inscrições
                    </Button>
                  </Link>
                </>
              )}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Gerador de Certificados - Apenas para Instrutores e Admins */}
        {(user?.role === "instructor" || user?.role === "admin") && (
          <CertificateGenerator />
        )}

        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Cursos Disponíveis
          </h2>
          <p className="text-xl text-red-100">
            Escolha um curso para ver detalhes e se inscrever
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.filter(course => course.id).map((course) => (
            <Link key={course.id} href={`/curso/${course.id}`}>
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                {course.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.imageUrl}
                      alt={course.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                    {course.nome}
                  </h3>
                  {course.descricao && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.descricao}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-red-600">
                      {course.valor === "0" || course.valor === "Gratuito"
                        ? "Gratuito"
                        : `R$ ${Number(course.valor).toLocaleString("pt-BR")}`}
                    </span>
                    <Button variant="outline" size="sm" className="group-hover:bg-red-600 group-hover:text-white transition-colors">
                      Ver Detalhes
                    </Button>
                  </div>
                  {course.requisitos && course.requisitos !== "Nenhum" && (
                    <p className="text-sm text-gray-500 mt-3 pt-3 border-t">
                      <strong>Requisitos:</strong> {course.requisitos}
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {courses?.length === 0 && (
          <div className="text-center text-white py-12">
            <p className="text-xl">Nenhum curso disponível no momento.</p>
          </div>
        )}
      </main>
    </div>
  );
}
