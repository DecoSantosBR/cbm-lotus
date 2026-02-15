import { useState } from "react";
import { trpc } from "../lib/trpc";

export function CertificateGenerator() {
  const [mode, setMode] = useState<"individual" | "batch">("individual");
  
  // Estado para emissão individual
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [individualCourseId, setIndividualCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [instructorRank, setInstructorRank] = useState("");
  const [auxiliarMatricula, setAuxiliarMatricula] = useState("");
  
  // Estado para emissão em lote
  const [courseId, setCourseId] = useState("");
  const [batchInstructorName, setBatchInstructorName] = useState("");
  const [batchAuxiliarMatricula, setBatchAuxiliarMatricula] = useState("");
  const [approvedList, setApprovedList] = useState("");
  
  const issueIndividualMutation = trpc.certificates.issueIndividual.useMutation();
  const issueBatchMutation = trpc.certificates.issueBatch.useMutation();
  const { data: courses } = trpc.courses.list.useQuery();
  
  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await issueIndividualMutation.mutateAsync({
        studentName,
        studentId,
        courseId: individualCourseId,
        courseName,
        instructorName,
        instructorRank,
        auxiliarMatricula: auxiliarMatricula || undefined,
      });
      
      alert(result.message);
      
      // Limpar formulário
      setStudentName("");
      setStudentId("");
      setIndividualCourseId("");
      setCourseName("");
      setInstructorName("");
      setInstructorRank("");
      setAuxiliarMatricula("");
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };
  
  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseId) {
      alert("Por favor, selecione um curso");
      return;
    }
    
    if (!approvedList.trim()) {
      alert("Por favor, informe a lista de aprovados");
      return;
    }
    
    try {
      const result = await issueBatchMutation.mutateAsync({
        courseId,
        instructorName: batchInstructorName,
        auxiliarMatricula: batchAuxiliarMatricula || undefined,
        approvedList,
      });
      
      alert(result.message);
      
      // Limpar formulário
      setCourseId("");
      setBatchInstructorName("");
      setBatchAuxiliarMatricula("");
      setApprovedList("");
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🎓 Gerador de Certificados
      </h2>
      
      {/* Seletor de modo */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode("individual")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === "individual"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Emissão Individual
        </button>
        <button
          onClick={() => setMode("batch")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === "batch"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Emissão em Lote
        </button>
      </div>
      
      {/* Formulário de Emissão Individual */}
      {mode === "individual" && (
        <form onSubmit={handleIndividualSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Aluno *
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: João Silva"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matrícula do Aluno *
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: 12345"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Curso *
              </label>
              <select
                value={individualCourseId}
                onChange={(e) => {
                  const selectedCourse = courses?.find(c => c.id === e.target.value);
                  setIndividualCourseId(e.target.value);
                  setCourseName(selectedCourse?.nome || "");
                }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              >
                <option value="">Selecione...</option>
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Instrutor *
              </label>
              <input
                type="text"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: Cap Silva"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo do Instrutor *
              </label>
              <select
                value={instructorRank}
                onChange={(e) => setInstructorRank(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="Comandante Geral">Comandante Geral</option>
                <option value="Subcomandante Geral">Subcomandante Geral</option>
                <option value="Coronel">Coronel</option>
                <option value="Tenente-Coronel">Tenente-Coronel</option>
                <option value="Major">Major</option>
                <option value="Capitão">Capitão</option>
                <option value="1º Tenente">1º Tenente</option>
                <option value="2º Tenente">2º Tenente</option>
                <option value="Subtenente">Subtenente</option>
                <option value="Cabo">Cabo</option>
                <option value="Soldado">Soldado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matrícula do Auxiliar (opcional)
              </label>
              <input
                type="text"
                value={auxiliarMatricula}
                onChange={(e) => setAuxiliarMatricula(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: 11883"
              />
              <p className="text-xs text-gray-500 mt-1">
                O nome será buscado automaticamente
              </p>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={issueIndividualMutation.isPending}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {issueIndividualMutation.isPending ? "Emitindo..." : "Emitir e Publicar no Discord"}
          </button>
        </form>
      )}
      
      {/* Formulário de Emissão em Lote */}
      {mode === "batch" && (
        <form onSubmit={handleBatchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Curso Aplicado *
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Selecione um curso...</option>
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Aplicador *
              </label>
              <input
                type="text"
                value={batchInstructorName}
                onChange={(e) => setBatchInstructorName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: Cap Silva"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matrícula do Auxiliar (opcional)
              </label>
              <input
                type="text"
                value={batchAuxiliarMatricula}
                onChange={(e) => setBatchAuxiliarMatricula(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: 11883"
              />
              <p className="text-xs text-gray-500 mt-1">
                O nome será buscado automaticamente
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lista de Aprovados *
            </label>
            <textarea
              value={approvedList}
              onChange={(e) => setApprovedList(e.target.value)}
              required
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
              placeholder="Digite um aluno por linha no formato: Nome | Matrícula&#10;&#10;Exemplo:&#10;João Silva | 12345&#10;Maria Santos | 67890&#10;Pedro Costa | 11111"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: Nome | Matrícula (um por linha)
            </p>
          </div>
          
          <button
            type="submit"
            disabled={issueBatchMutation.isPending}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {issueBatchMutation.isPending ? "Emitindo..." : "Emitir Certificados e Publicar no Discord"}
          </button>
          
          {issueBatchMutation.isPending && (
            <p className="text-sm text-gray-600 text-center">
              ⏳ Processando certificados... Isso pode levar alguns minutos.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
