import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Trash2, Edit } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { toast } from "sonner";

export default function CalendarPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // Query para buscar todos os eventos
  const { data: allEvents = [], refetch } = trpc.events.list.useQuery();

  // Query para buscar cursos
  const { data: courses = [] } = trpc.courses.list.useQuery();

  // Query para buscar instrutores (usuários com role instructor ou admin)
  const { data: instructors = [] } = trpc.users.list.useQuery();
  const availableInstructors = instructors.filter(u => u.role === 'instructor' || u.role === 'admin');

  // Estado para controlar exibição de inscritos
  const [showEnrollmentsForEvent, setShowEnrollmentsForEvent] = useState<number | null>(null);

  // Mutations
  const createEvent = trpc.events.create.useMutation({
    onSuccess: () => {
      toast.success("Evento criado com sucesso!");
      refetch();
      setShowCreateModal(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar evento");
    },
  });

  const updateEvent = trpc.events.update.useMutation({
    onSuccess: () => {
      toast.success("Evento atualizado com sucesso!");
      refetch();
      setShowEditModal(false);
      setEditingEvent(null);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar evento");
    },
  });

  const deleteEvent = trpc.events.delete.useMutation({
    onSuccess: () => {
      toast.success("Evento excluído com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir evento");
    },
  });

  // Mutations de inscrição
  const utils = trpc.useUtils();
  const enrollMutation = trpc.enrollments.enroll.useMutation({
    onSuccess: () => {
      toast.success("Inscrição realizada com sucesso!");
      // Invalidar queries para atualizar UI imediatamente
      utils.enrollments.myEnrollment.invalidate();
      utils.enrollments.listByEvent.invalidate();
      utils.enrollments.count.invalidate();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao fazer inscrição");
    },
  });

  const cancelEnrollmentMutation = trpc.enrollments.cancel.useMutation({
    onSuccess: () => {
      toast.success("Inscrição cancelada com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao cancelar inscrição");
    },
  });

  const updateEnrollmentStatusMutation = trpc.enrollments.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });

  // Form state
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    instructorId: user?.id || 0,
    location: "",
    maxParticipants: "",
  });

  const resetForm = () => {
    setFormData({
      courseId: "",
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      instructorId: user?.id || 0,
      location: "",
      maxParticipants: "",
    });
  };

  // Calcular dias do calendário
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Eventos do dia selecionado
  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return allEvents.filter((event: any) => 
      isSameDay(new Date(event.startDate), selectedDate)
    );
  }, [selectedDate, allEvents]);

  // Verificar se um dia tem eventos
  const hasEvents = (day: Date) => {
    return allEvents.some((event: any) => 
      isSameDay(new Date(event.startDate), day)
    );
  };

  const handleCreateEvent = () => {
    if (!formData.courseId || !formData.title || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Criar datas no timezone de Brasília e converter para UTC para enviar ao servidor
    const timeZone = 'America/Sao_Paulo';
    const startDateLocal = new Date(`${formData.startDate}T${formData.startTime}:00`);
    const endDateLocal = new Date(`${formData.endDate}T${formData.endTime}:00`);
    
    // Converter de horário local de Brasília para UTC
    const startDateTime = fromZonedTime(startDateLocal, timeZone).toISOString();
    const endDateTime = fromZonedTime(endDateLocal, timeZone).toISOString();

    createEvent.mutate({
      courseId: parseInt(formData.courseId),
      title: formData.title,
      description: formData.description,
      startDate: startDateTime,
      endDate: endDateTime,
      instructorId: formData.instructorId,
      location: formData.location,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
    });
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;

    const timeZone = 'America/Sao_Paulo';
    let startDateTime: string | undefined = undefined;
    let endDateTime: string | undefined = undefined;

    if (formData.startDate && formData.startTime) {
      const startDateLocal = new Date(`${formData.startDate}T${formData.startTime}:00`);
      startDateTime = fromZonedTime(startDateLocal, timeZone).toISOString();
    }

    if (formData.endDate && formData.endTime) {
      const endDateLocal = new Date(`${formData.endDate}T${formData.endTime}:00`);
      endDateTime = fromZonedTime(endDateLocal, timeZone).toISOString();
    }

    updateEvent.mutate({
      id: editingEvent.id,
      courseId: formData.courseId ? parseInt(formData.courseId) : undefined,
      title: formData.title || undefined,
      description: formData.description || undefined,
      startDate: startDateTime,
      endDate: endDateTime,
      instructorId: formData.instructorId || undefined,
      location: formData.location || undefined,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
    });
  };

  const handleEditClick = (event: any) => {
    setEditingEvent(event);
    
    // Converter datas UTC do servidor para horário de Brasília
    const timeZone = 'America/Sao_Paulo';
    const startDateUTC = new Date(event.startDate);
    const endDateUTC = new Date(event.endDate);
    const startDateBrasilia = toZonedTime(startDateUTC, timeZone);
    const endDateBrasilia = toZonedTime(endDateUTC, timeZone);
    
    setFormData({
      courseId: event.courseId.toString(),
      title: event.title,
      description: event.description || "",
      startDate: format(startDateBrasilia, "yyyy-MM-dd"),
      startTime: format(startDateBrasilia, "HH:mm"),
      endDate: format(endDateBrasilia, "yyyy-MM-dd"),
      endTime: format(endDateBrasilia, "HH:mm"),
      instructorId: event.instructorId,
      location: event.location || "",
      maxParticipants: event.maxParticipants?.toString() || "",
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (eventId: number) => {
    if (confirm("Tem certeza que deseja deletar este evento?")) {
      deleteEvent.mutate({ id: eventId });
    }
  };

  const canManageEvents = user?.role === "instructor" || user?.role === "admin";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#b91c1c", color: "#ffffff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
          <Button
            onClick={() => setLocation("/")}
            style={{ backgroundColor: "#ffffff", color: "#b91c1c", fontWeight: "bold", padding: "8px 16px" }}
          >
            Voltar
          </Button>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Agendamento de Cursos</h1>
        </div>
      </header>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "24px" }}>
          {/* Calendário */}
          <Card style={{ padding: "24px" }}>
            {/* Controles do mês */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date())}
                >
                  Hoje
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>

            {/* Grid do calendário */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
              {/* Cabeçalho dos dias da semana */}
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div
                  key={day}
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  {day}
                </div>
              ))}

              {/* Dias do mês */}
              {calendarDays.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const dayHasEvents = hasEvents(day);

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: "8px",
                      backgroundColor: isSelected
                        ? "#b91c1c"
                        : isToday
                        ? "#fee2e2"
                        : "#ffffff",
                      color: isSelected
                        ? "#ffffff"
                        : isCurrentMonth
                        ? "#1f2937"
                        : "#d1d5db",
                      fontWeight: isToday ? "bold" : "normal",
                      border: isToday && !isSelected ? "2px solid #b91c1c" : "1px solid #e5e7eb",
                      position: "relative",
                    }}
                  >
                    {format(day, "d")}
                    {dayHasEvents && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: isSelected ? "#ffffff" : "#b91c1c",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Painel lateral - Eventos do dia */}
          <Card style={{ padding: "24px", maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937" }}>
                {selectedDate
                  ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
                  : "Selecione uma data"}
              </h3>
              {canManageEvents && selectedDate && (
                <Button
                  size="sm"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      startDate: format(selectedDate, "yyyy-MM-dd"),
                      endDate: format(selectedDate, "yyyy-MM-dd"),
                    });
                    setShowCreateModal(true);
                  }}
                  style={{ backgroundColor: "#b91c1c" }}
                >
                  <Plus size={16} style={{ marginRight: "4px" }} />
                  Novo Evento
                </Button>
              )}
            </div>

            {selectedDate && selectedDayEvents.length === 0 && (
              <p style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0" }}>
                Nenhum evento agendado para este dia
              </p>
            )}

            {selectedDate && selectedDayEvents.map((event: any) => {
              const course = courses.find((c: any) => c.id === event.courseId);
              return (
                <div
                  key={event.id}
                  style={{
                    padding: "16px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    borderLeft: "4px solid #b91c1c",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>
                      {event.title}
                    </h4>
                    {canManageEvents && (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(event)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(event.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </div>

                  {course && (
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      <strong>Curso:</strong> {course.nome}
                    </p>
                  )}

                  {(() => {
                    const instructor = instructors.find(i => i.id === event.instructorId);
                    return instructor ? (
                      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                        <strong>Instrutor:</strong> {instructor.name} | {instructor.studentId}
                      </p>
                    ) : null;
                  })()}

                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>
                    <Clock size={14} />
                    {(() => {
                      const timeZone = 'America/Sao_Paulo';
                      const startBrasilia = toZonedTime(new Date(event.startDate), timeZone);
                      const endBrasilia = toZonedTime(new Date(event.endDate), timeZone);
                      return `${format(startBrasilia, "HH:mm")} - ${format(endBrasilia, "HH:mm")}`;
                    })()}
                  </div>

                  {event.location && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>
                      <MapPin size={14} />
                      {event.location}
                    </div>
                  )}

                  {event.maxParticipants && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>
                      <Users size={14} />
                      Máximo: {event.maxParticipants} participantes
                    </div>
                  )}

                  {event.description && (
                    <p style={{ fontSize: "14px", color: "#4b5563", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #e5e7eb" }}>
                      {event.description}
                    </p>
                  )}

                  {/* Seção de inscrições */}
                  <EventEnrollmentSection 
                    event={event}
                    user={user}
                    canManageEvents={canManageEvents}
                    showEnrollments={showEnrollmentsForEvent === event.id}
                    onToggleEnrollments={() => setShowEnrollmentsForEvent(showEnrollmentsForEvent === event.id ? null : event.id)}
                    onEnroll={() => enrollMutation.mutate({ eventId: event.id })}
                    isEnrolling={enrollMutation.isPending}
                    onCancelEnrollment={(enrollmentId: number) => cancelEnrollmentMutation.mutate({ enrollmentId })}
                    onUpdateStatus={(enrollmentId: number, status: "pending" | "confirmed" | "cancelled" | "rejected") => 
                      updateEnrollmentStatusMutation.mutate({ enrollmentId, status })
                    }
                  />
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* Modal de Criação de Evento */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent style={{ maxWidth: "600px", backgroundColor: "#ffffff" }}>
          <DialogHeader>
            <DialogTitle>Criar Novo Evento</DialogTitle>
          </DialogHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <Label htmlFor="courseId">Curso *</Label>
              <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#ffffff" }}>
                  {courses.map((course: any) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Título do Evento *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Aula Prática de Resgate"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes sobre o evento"
                rows={3}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <Label htmlFor="startDate">Data Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Hora Início *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <Label htmlFor="endDate">Data Término *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Hora Término *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="instructorId">Instrutor *</Label>
              <Select value={formData.instructorId.toString()} onValueChange={(value) => setFormData({ ...formData, instructorId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o instrutor" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#ffffff" }}>
                  {availableInstructors.map((instructor: any) => (
                    <SelectItem key={instructor.id} value={instructor.id.toString()}>
                      {instructor.name} | {instructor.studentId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Local</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Quartel Central"
              />
            </div>

            <div>
              <Label htmlFor="maxParticipants">Máximo de Participantes</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                placeholder="Ex: 20"
              />
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Button variant="outline" onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button onClick={handleCreateEvent} style={{ backgroundColor: "#b91c1c" }}>
                Criar Evento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Evento */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent style={{ maxWidth: "600px", backgroundColor: "#ffffff" }}>
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
          </DialogHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <Label htmlFor="edit-courseId">Curso</Label>
              <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#ffffff" }}>
                  {courses.map((course: any) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-title">Título do Evento</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <Label htmlFor="edit-startDate">Data Início</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-startTime">Hora Início</Label>
                <Input
                  id="edit-startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <Label htmlFor="edit-endDate">Data Término</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-endTime">Hora Término</Label>
                <Input
                  id="edit-endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-instructorId">Instrutor</Label>
              <Select value={formData.instructorId.toString()} onValueChange={(value) => setFormData({ ...formData, instructorId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o instrutor" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#ffffff" }}>
                  {availableInstructors.map((instructor: any) => (
                    <SelectItem key={instructor.id} value={instructor.id.toString()}>
                      {instructor.name} | {instructor.studentId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-location">Local</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-maxParticipants">Máximo de Participantes</Label>
              <Input
                id="edit-maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Button variant="outline" onClick={() => {
                setShowEditModal(false);
                setEditingEvent(null);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateEvent} style={{ backgroundColor: "#b91c1c" }}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente para botão de emitir certificado
function EmitCertificateButton({ enrollmentId }: { enrollmentId: number }) {
  const utils = trpc.useUtils();
  const [isEmitting, setIsEmitting] = useState(false);

  const emitCertificate = trpc.enrollments.emitCertificate.useMutation({
    onSuccess: () => {
      toast.success("🎓 Certificado emitido e publicado no Discord com sucesso!");
      utils.enrollments.listByEvent.invalidate();
      setIsEmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao emitir certificado");
      setIsEmitting(false);
    },
  });

  const handleEmitCertificate = () => {
    if (confirm("🎓 Confirma a emissão do certificado?\n\nO certificado será publicado automaticamente no canal Discord.")) {
      setIsEmitting(true);
      emitCertificate.mutate({ enrollmentId });
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleEmitCertificate}
      disabled={isEmitting}
      style={{ backgroundColor: "#fbbf24", color: "#000000", fontWeight: "600" }}
    >
      {isEmitting ? "Emitindo..." : "🎓 Emitir Certificado"}
    </Button>
  );
}

// Componente para seção de inscrições no card do evento
function EventEnrollmentSection({ 
  event, 
  user, 
  canManageEvents,
  showEnrollments,
  onToggleEnrollments,
  onEnroll,
  isEnrolling,
  onCancelEnrollment,
  onUpdateStatus 
}: any) {
  const { data: myEnrollment } = trpc.enrollments.myEnrollment.useQuery(
    { eventId: event.id },
    { enabled: !!user }
  );
  
  const { data: enrollments = [] } = trpc.enrollments.listByEvent.useQuery(
    { eventId: event.id },
    { enabled: showEnrollments }
  );
  
  const { data: enrollmentCount = 0 } = trpc.enrollments.count.useQuery({ eventId: event.id });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, any> = {
      confirmed: { bg: "#dcfce7", color: "#166534", text: "Confirmado" },
      pending: { bg: "#fef3c7", color: "#92400e", text: "Pendente" },
      cancelled: { bg: "#fee2e2", color: "#991b1b", text: "Cancelado" },
      rejected: { bg: "#fee2e2", color: "#991b1b", text: "Rejeitado" },
    };
    const style = styles[status] || styles.pending;
    return (
      <span style={{
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "500",
        backgroundColor: style.bg,
        color: style.color,
      }}>
        {style.text}
      </span>
    );
  };

  return (
    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e5e7eb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Users size={16} color="#6b7280" />
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            {enrollmentCount} inscrito{enrollmentCount !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div style={{ display: "flex", gap: "8px" }}>
          {user && !myEnrollment && (
            <Button
              size="sm"
              onClick={onEnroll}
              disabled={isEnrolling}
              style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
            >
              {isEnrolling ? "Inscrevendo..." : "Fazer Inscrição"}
            </Button>
          )}
          
          {user && myEnrollment && myEnrollment.status !== "cancelled" && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {getStatusBadge(myEnrollment.status)}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCancelEnrollment(myEnrollment.id)}
              >
                Cancelar Inscrição
              </Button>
            </div>
          )}
          
          {(canManageEvents || enrollmentCount > 0) && (
            <Button
              size="sm"
              variant="outline"
              onClick={onToggleEnrollments}
            >
              {showEnrollments ? "Ocultar" : "Ver"} Inscritos
            </Button>
          )}
        </div>
      </div>

      {showEnrollments && (
        <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#f9fafb", borderRadius: "6px" }}>
          <h5 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#1f2937" }}>
            Lista de Inscritos ({enrollments.length})
          </h5>
          
          {enrollments.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#6b7280", textAlign: "center", padding: "16px" }}>
              Nenhuma inscrição ainda
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {enrollments.map((enrollment: any) => (
                <div
                  key={enrollment.id}
                  style={{
                    padding: "12px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: "500", color: "#1f2937" }}>
                        {enrollment.user?.name || "Usuário desconhecido"}
                      </p>
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>
                        Matrícula: {enrollment.user?.studentId} | {enrollment.user?.rank}
                      </p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                        Inscrito em: {new Date(enrollment.enrolledAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {getStatusBadge(enrollment.status)}
                      
                       {canManageEvents && enrollment.status !== "cancelled" && enrollment.status !== "rejected" && (
                        <div style={{ display: "flex", gap: "4px" }}>
                          {enrollment.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => onUpdateStatus(enrollment.id, "confirmed")}
                                style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
                              >
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => onUpdateStatus(enrollment.id, "rejected")}
                                style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                              >
                                Rejeitar
                              </Button>
                            </>
                          )}
                          {enrollment.status === "confirmed" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onUpdateStatus(enrollment.id, "pending")}
                              >
                                Marcar Pendente
                              </Button>
                              <EmitCertificateButton enrollmentId={enrollment.id} />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
