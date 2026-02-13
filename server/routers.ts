import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { sendEmail, getEnrollmentApprovedEmailTemplate, getEnrollmentRejectedEmailTemplate } from "./_core/email";
import { sendEnrollmentNotification, sendApprovalNotification, sendEventNotification } from "./_core/discord";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NOT_ADMIN_ERR_MSG } from "@shared/const";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    completeProfile: protectedProcedure
      .input(z.object({
        name: z.string(),
        studentId: z.string(),
        rank: z.enum([
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
        ]),
      }))
      .mutation(async ({ input, ctx }) => {
        // Mapear cargo para role automaticamente
        let role: "admin" | "instructor" | "member";
        
        if (["Comandante Geral", "Subcomandante Geral", "Coronel", "Tenente-Coronel"].includes(input.rank)) {
          role = "admin";
        } else if (["Major", "Capitão", "1º Tenente", "2º Tenente"].includes(input.rank)) {
          role = "instructor";
        } else {
          role = "member";
        }

        await db.completeUserProfile({
          userId: ctx.user.id,
          name: input.name,
          studentId: input.studentId,
          rank: input.rank,
          role,
        });

        return { success: true };
      }),
  }),

  courses: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCourses();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCourseById(input.id);
      }),
    getMaterial: publicProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCourseMaterial(input.courseId);
      }),
    updateMaterial: protectedProcedure
      .input(z.object({
        id: z.number().optional(),
        courseId: z.number(),
        instructions: z.string(),
        video1Title: z.string().optional(),
        video1Url: z.string().optional(),
        video2Title: z.string().optional(),
        video2Url: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only admin can edit
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }
        await db.upsertCourseMaterial(input);
        return { success: true };
      }),
    // Course Images
    uploadImage: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        imageUrl: z.string(),
        caption: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only admin can upload images
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }
        await db.createCourseImage(input);
        return { success: true };
      }),
    getImages: publicProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCourseImages(input.courseId);
      }),
    deleteImage: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Only admin can delete images
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }
        await db.deleteCourseImage(input.id);
        return { success: true };
      }),
    // Course Files
    uploadFile: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        fileName: z.string(),
        fileUrl: z.string(),
        fileKey: z.string(),
        fileSize: z.number().optional(),
        mimeType: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only admin and instructors can upload files
        if (ctx.user.role === "member") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem fazer upload de arquivos" });
        }
        const fileId = await db.createCourseFile({
          ...input,
          uploadedBy: ctx.user.id,
        });
        return { success: true, fileId };
      }),
    getFiles: publicProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCourseFiles(input.courseId);
      }),
    deleteFile: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Only admin and instructors can delete files
        if (ctx.user.role === "member") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem deletar arquivos" });
        }
        const file = await db.deleteCourseFile(input.id);
        return { success: true, file };
      }),
  }),
  
  users: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      // Only admin can list users
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      return await db.getAllUsers();
    }),
    approve: protectedProcedure
      .input(z.object({
        userId: z.number(),
        role: z.enum(["member", "instructor", "admin"]),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only admin can approve users
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }
        await db.updateUserApproval(input.userId, "approved", input.role);
        return { success: true };
      }),
    reject: protectedProcedure
      .input(z.object({
        userId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only admin can reject users
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }
        await db.updateUserApproval(input.userId, "rejected");
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        userId: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        role: z.enum(["member", "instructor", "admin"]).optional(),
        rank: z.enum([
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
        ]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only admin can update users
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }
        const { userId, ...data } = input;
        await db.updateUser(userId, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Only admin can delete users
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }
        // Prevent deleting yourself
        if (ctx.user.id === input.userId) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot delete your own account" });
        }
        await db.deleteUser(input.userId);
        return { success: true };
      }),
  }),
  
  applications: router({
    create: publicProcedure
      .input(z.object({
        courseId: z.number(),
        nomeCompleto: z.string(),
        idJogador: z.string(),
        telefone: z.string(),
        horarioDisponivel: z.string(),
      }))
      .mutation(async ({ input }) => {
        await db.createCourseApplication(input);
        return { success: true };
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      // Only instructors and admins can see applications
      if (ctx.user.role !== "admin" && ctx.user.role !== "instructor") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return await db.getAllCourseApplications();
    }),
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "accepted", "rejected"]),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only instructors and admins can update status
        if (ctx.user.role !== "admin" && ctx.user.role !== "instructor") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.updateApplicationStatus(input.id, input.status);
        return { success: true };
      }),
    countPending: protectedProcedure.query(async ({ ctx }) => {
      // Only instructors and admins can see pending count
      if (ctx.user.role !== "admin" && ctx.user.role !== "instructor") {
        return { count: 0 };
      }
      return await db.countPendingApplications();
    }),
  }),

  events: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCourseEvents();
    }),
    getByDateRange: publicProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string(),
      }))
      .query(async ({ input }) => {
        const start = new Date(input.startDate);
        const end = new Date(input.endDate);
        return await db.getCourseEventsByDateRange(start, end);
      }),
    create: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        startDate: z.string(),
        endDate: z.string(),
        instructorId: z.number(),
        location: z.string().optional(),
        maxParticipants: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Apenas instrutores e admins podem criar eventos
        if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem criar eventos" });
        }

        const eventId = await db.createCourseEvent({
          ...input,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          createdBy: ctx.user.id,
        });

        // Enviar notificação para Discord
        try {
          const course = await db.getCourseById(input.courseId);
          const dbInstance = await db.getDb();
          if (course && dbInstance) {
            const { users: usersTable } = await import("../drizzle/schema");
            const { eq: eqOp } = await import("drizzle-orm");
            const instructorResults = await dbInstance.select().from(usersTable).where(eqOp(usersTable.id, input.instructorId));
            const instructor = instructorResults[0];

            if (instructor) {
              // Converter UTC para horário de Brasília
              const { toZonedTime } = await import("date-fns-tz");
              const brasiliaTimezone = "America/Sao_Paulo";
              const startDateBrasilia = toZonedTime(new Date(input.startDate), brasiliaTimezone);
              const endDateBrasilia = toZonedTime(new Date(input.endDate), brasiliaTimezone);

              await sendEventNotification({
                courseName: course.nome,
                eventDate: format(startDateBrasilia, "dd/MM/yyyy", { locale: ptBR }),
                eventTime: `${format(startDateBrasilia, "HH:mm")} - ${format(endDateBrasilia, "HH:mm")}`,
                location: input.location || "A definir",
                instructorName: instructor.name || "Instrutor",
              });
            }
          }
        } catch (error) {
          console.error("[Event] Failed to send Discord notification:", error);
        }

        return { id: eventId, success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        courseId: z.number().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        instructorId: z.number().optional(),
        location: z.string().optional(),
        maxParticipants: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Apenas instrutores e admins podem editar eventos
        if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem editar eventos" });
        }

        const { id, ...data } = input;
        const updateData: any = { ...data };
        
        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.endDate) updateData.endDate = new Date(data.endDate);

        await db.updateCourseEvent(id, updateData);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Apenas instrutores e admins podem deletar eventos
        if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem deletar eventos" });
        }

        await db.deleteCourseEvent(input.id);
        return { success: true };
      }),
  }),
  enrollments: router({
    // Fazer inscrição em um evento
    enroll: protectedProcedure
      .input(z.object({ eventId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Verificar se já existe inscrição
        const existing = await db.getUserEnrollmentForEvent(ctx.user.id, input.eventId);
        if (existing) {
          if (existing.status === "cancelled" || existing.status === "rejected") {
            // Reativar inscrição cancelada/rejeitada como pendente
            await db.updateEnrollmentStatus(existing.id, "pending");
            return { success: true, enrollmentId: existing.id, message: "Inscrição reativada. Aguarde aprovação do instrutor." };
          }
          throw new TRPCError({ code: "BAD_REQUEST", message: "Você já está inscrito neste evento" });
        }

        const enrollmentId = await db.createEnrollment({
          userId: ctx.user.id,
          eventId: input.eventId,
          status: "pending", // Inscrição pendente aguardando aprovação do instrutor
        });

        // Buscar dados do evento para notificação
        const event = await db.getCourseEventById(input.eventId);
        if (event) {
          const course = await db.getCourseById(event.courseId);
          if (course) {
            // Converter UTC para horário de Brasília
            const { toZonedTime } = await import("date-fns-tz");
            const brasiliaTimezone = "America/Sao_Paulo";
            const startDateBrasilia = toZonedTime(new Date(event.startDate), brasiliaTimezone);
            const endDateBrasilia = toZonedTime(new Date(event.endDate), brasiliaTimezone);

            // Enviar notificação para Discord
            await sendEnrollmentNotification({
              userName: ctx.user.name || "Usuário",
              userStudentId: ctx.user.studentId || "N/A",
              courseName: course.nome,
              eventDate: format(startDateBrasilia, "dd/MM/yyyy", { locale: ptBR }),
              eventTime: `${format(startDateBrasilia, "HH:mm")} - ${format(endDateBrasilia, "HH:mm")}`,
            });
          }
        }

        return { success: true, enrollmentId, message: "Inscrição realizada com sucesso" };
      }),

    // Cancelar inscrição
    cancel: protectedProcedure
      .input(z.object({ enrollmentId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.cancelEnrollment(input.enrollmentId);
        return { success: true };
      }),

    // Listar inscrições de um evento (com dados dos usuários)
    listByEvent: publicProcedure
      .input(z.object({ eventId: z.number() }))
      .query(async ({ input }) => {
        const enrollments = await db.getEventEnrollments(input.eventId);
        const dbInstance = await db.getDb();
        if (!dbInstance) return [];

        // Buscar dados dos usuários usando import direto
        const { users: usersTable } = await import("../drizzle/schema");
        const { eq: eqOp } = await import("drizzle-orm");
        
        const enrollmentsWithUsers = await Promise.all(
          enrollments.map(async (enrollment) => {
            const userResults = await dbInstance.select().from(usersTable).where(eqOp(usersTable.id, enrollment.userId));
            const user = userResults[0];
            return {
              ...enrollment,
              user: user ? {
                id: user.id,
                name: user.name,
                studentId: user.studentId,
                rank: user.rank,
              } : null,
            };
          })
        );

        return enrollmentsWithUsers;
      }),

    // Verificar inscrição do usuário em um evento
    myEnrollment: protectedProcedure
      .input(z.object({ eventId: z.number() }))
      .query(async ({ input, ctx }) => {
        return await db.getUserEnrollmentForEvent(ctx.user.id, input.eventId);
      }),

    // Atualizar status de inscrição (apenas instrutores/admins)
    updateStatus: protectedProcedure
      .input(z.object({
        enrollmentId: z.number(),
        status: z.enum(["pending", "confirmed", "cancelled", "rejected"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem gerenciar inscrições" });
        }

        await db.updateEnrollmentStatus(input.enrollmentId, input.status);

        // Enviar email se status for confirmed ou rejected
        if (input.status === "confirmed" || input.status === "rejected") {
          try {
            // Buscar dados da inscrição, evento e usuário
            const dbInstance = await db.getDb();
            if (dbInstance) {
              const { courseEnrollments, courseEvents, courses, users: usersTable } = await import("../drizzle/schema");
              const { eq: eqOp } = await import("drizzle-orm");

              const enrollmentResults = await dbInstance.select().from(courseEnrollments).where(eqOp(courseEnrollments.id, input.enrollmentId));
              const enrollment = enrollmentResults[0];

              if (enrollment) {
                const eventResults = await dbInstance.select().from(courseEvents).where(eqOp(courseEvents.id, enrollment.eventId));
                const event = eventResults[0];

                const userResults = await dbInstance.select().from(usersTable).where(eqOp(usersTable.id, enrollment.userId));
                const user = userResults[0];

                if (event && user && user.email) {
                  const courseResults = await dbInstance.select().from(courses).where(eqOp(courses.id, event.courseId));
                  const course = courseResults[0];

                  if (course) {
                    // Converter UTC para horário de Brasília
                    const { toZonedTime } = await import("date-fns-tz");
                    const brasiliaTimezone = "America/Sao_Paulo";
                    const startDateBrasilia = toZonedTime(new Date(event.startDate), brasiliaTimezone);
                    const endDateBrasilia = toZonedTime(new Date(event.endDate), brasiliaTimezone);

                    const eventDate = format(startDateBrasilia, "dd/MM/yyyy", { locale: ptBR });
                    const eventTime = `${format(startDateBrasilia, "HH:mm")} - ${format(endDateBrasilia, "HH:mm")}`;

                    if (input.status === "confirmed") {
                      const emailTemplate = getEnrollmentApprovedEmailTemplate({
                        studentName: user.name || "Aluno",
                        courseName: course.nome,
                        eventDate,
                        eventTime,
                        location: event.location || "A definir",
                      });
                      await sendEmail({
                        to: user.email,
                        subject: emailTemplate.subject,
                        html: emailTemplate.html,
                      });
                    } else if (input.status === "rejected") {
                      const emailTemplate = getEnrollmentRejectedEmailTemplate({
                        studentName: user.name || "Aluno",
                        courseName: course.nome,
                        eventDate,
                      });
                      await sendEmail({
                        to: user.email,
                        subject: emailTemplate.subject,
                        html: emailTemplate.html,
                      });
                    }

                    // Enviar notificação para Discord
                    await sendApprovalNotification({
                      userName: user.name || "Usuário",
                      userStudentId: user.studentId || "N/A",
                      courseName: course.nome,
                      eventDate,
                      eventTime,
                      status: input.status,
                    });
                  }
                }
              }
            }
          } catch (emailError) {
            console.error("[Enrollment] Failed to send email/notification:", emailError);
            // Não falhar a operação se o email/notificação não for enviado
          }
        }

        return { success: true };
      }),

    // Contar inscrições de um evento
    count: publicProcedure
      .input(z.object({ eventId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEnrollmentCountByEvent(input.eventId);
      }),

    // Emitir certificado para um inscrito
    emitCertificate: protectedProcedure
      .input(z.object({
        enrollmentId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Apenas instrutores e admins podem emitir certificados
        if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Apenas instrutores e administradores podem emitir certificados" });
        }

        // Buscar dados da inscrição
        const dbInstance = await db.getDb();
        if (!dbInstance) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao conectar com banco de dados" });
        }

        const { courseEnrollments, courseEvents, courses, users: usersTable } = await import("../drizzle/schema");
        const { eq: eqOp } = await import("drizzle-orm");

        const enrollmentResults = await dbInstance.select().from(courseEnrollments).where(eqOp(courseEnrollments.id, input.enrollmentId));
        const enrollment = enrollmentResults[0];

        if (!enrollment) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Inscrição não encontrada" });
        }

        // Buscar dados do evento
        const eventResults = await dbInstance.select().from(courseEvents).where(eqOp(courseEvents.id, enrollment.eventId));
        const event = eventResults[0];

        if (!event) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Evento não encontrado" });
        }

        // Buscar dados do curso
        const courseResults = await dbInstance.select().from(courses).where(eqOp(courses.id, event.courseId));
        const course = courseResults[0];

        if (!course) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Curso não encontrado" });
        }

        // Buscar dados do usuário
        const userResults = await dbInstance.select().from(usersTable).where(eqOp(usersTable.id, enrollment.userId));
        const student = userResults[0];

        if (!student) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });
        }

        // Buscar dados do instrutor
        const instructorResults = await dbInstance.select().from(usersTable).where(eqOp(usersTable.id, event.instructorId));
        const instructor = instructorResults[0];

        if (!instructor) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Instrutor não encontrado" });
        }

        // Gerar certificado em PNG usando Puppeteer
        const { generateCertificate } = await import("./_core/certificateGeneratorPuppeteer");
        console.log("[EmitCertificate] Generating certificate for:", student.name, student.studentId, course.nome);
        const certificateBuffer = await generateCertificate({
          studentName: student.name || "Aluno",
          studentId: student.studentId || "N/A",
          courseName: course.nome,
          instructorName: instructor.name || "Instrutor",
          instructorRank: instructor.rank || "Tenente-Coronel",
        });
        console.log("[EmitCertificate] Certificate buffer generated, size:", certificateBuffer.length, "bytes");

        // Fazer upload do certificado para S3
        const { storagePut } = await import("./storage");
        const timestamp = Date.now();
        const randomHash = Math.random().toString(36).substring(2, 10);
        const fileName = `certificado-${student.studentId}-${course.nome.replace(/\s+/g, "-")}-${timestamp}-${randomHash}.png`;
        const s3Key = `certificates/${fileName}`;
        console.log("[EmitCertificate] Uploading certificate to S3:", s3Key);
        const { url: certificateUrl } = await storagePut(s3Key, certificateBuffer, "image/png");
        console.log("[EmitCertificate] Certificate uploaded to S3:", certificateUrl);

        // Publicar certificado no Discord com URL da imagem
        const { sendCertificateNotification } = await import("./_core/discord");
        const success = await sendCertificateNotification({
          userName: student.name || "Aluno",
          userStudentId: student.studentId || "N/A",
          courseName: course.nome,
          certificateUrl: certificateUrl, // Enviar URL ao invés do buffer
        });

        if (!success) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Falha ao publicar certificado no Discord" });
        }

        // Salvar certificado no banco de dados com URL
        const { certificates } = await import("../drizzle/schema");
        await dbInstance.insert(certificates).values({
          userId: student.id,
          discordId: student.discordId || null,
          studentName: student.name || "Aluno",
          studentId: student.studentId || "N/A",
          courseId: course.id,
          courseName: course.nome,
          instructorName: instructor.name || "Instrutor",
          instructorRank: instructor.rank || "Tenente-Coronel",
          issuedBy: ctx.user.id,
          certificateUrl: certificateUrl, // Salvar URL no banco
        });

        // Garantir que o status seja "confirmed" após emissão do certificado
        if (enrollment.status !== "confirmed") {
          await db.updateEnrollmentStatus(input.enrollmentId, "confirmed");
        }

        return { success: true, message: "Certificado emitido e publicado no Discord com sucesso!" };
      }),
  }),

  // Router de certificados
  certificates: router({
    // Publicar certificado no Discord
    publishToDiscord: protectedProcedure
      .input(z.object({
        studentName: z.string(),
        studentId: z.string(),
        courseName: z.string(),
        imageBase64: z.string().optional(), // Imagem PNG em base64
      }))
      .mutation(async ({ input, ctx }) => {
        // Apenas instrutores e admins podem publicar certificados
        if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }

        const { sendCertificateNotification } = await import("./_core/discord");
        
        // Converter base64 para Buffer se imagem foi fornecida
        let imageBuffer: Buffer | undefined;
        if (input.imageBase64) {
          // Remover prefixo data:image/png;base64, se existir
          const base64Data = input.imageBase64.replace(/^data:image\/png;base64,/, "");
          imageBuffer = Buffer.from(base64Data, "base64");
        }
        
        const success = await sendCertificateNotification({
          userName: input.studentName,
          userStudentId: input.studentId,
          courseName: input.courseName,
          imageBuffer,
        });

        if (!success) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Falha ao publicar no Discord" });
        }

        // Salvar certificado no banco de dados
        const { certificates } = await import("../drizzle/schema");
        const dbInstance = await db.getDb();
        if (dbInstance) {
          // Buscar usuário pelo studentId
          const { users } = await import("../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          const [user] = await dbInstance.select().from(users).where(eq(users.studentId, input.studentId));
          
          // Buscar curso pelo nome
          const { courses } = await import("../drizzle/schema");
          const [course] = await dbInstance.select().from(courses).where(eq(courses.nome, input.courseName));
          
          await dbInstance.insert(certificates).values({
            userId: user?.id || 0, // 0 se usuário não encontrado
            discordId: user?.discordId || null,
            studentName: input.studentName,
            studentId: input.studentId,
            courseId: course?.id || null,
            courseName: input.courseName,
            instructorName: ctx.user.name || "Instrutor",
            instructorRank: ctx.user.rank || "Tenente-Coronel",
            issuedBy: ctx.user.id,
          });
        }

        return { success: true, message: "Certificado publicado no Discord com sucesso!" };
      }),

    // Publicar múltiplos certificados no Discord (em lote)
    publishBatchToDiscord: protectedProcedure
      .input(z.object({
        certificates: z.array(z.object({
          studentName: z.string(),
          studentId: z.string(),
          courseName: z.string(),
          imageBase64: z.string().optional(), // Imagem PNG em base64
        })),
      }))
      .mutation(async ({ input, ctx }) => {
        // Apenas instrutores e admins podem publicar certificados
        if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }

        const { sendCertificateNotification } = await import("./_core/discord");
        let successCount = 0;
        let failCount = 0;

        for (const cert of input.certificates) {
          // Converter base64 para Buffer se imagem foi fornecida
          let imageBuffer: Buffer | undefined;
          if (cert.imageBase64) {
            const base64Data = cert.imageBase64.replace(/^data:image\/png;base64,/, "");
            imageBuffer = Buffer.from(base64Data, "base64");
          }
          
          const success = await sendCertificateNotification({
            userName: cert.studentName,
            userStudentId: cert.studentId,
            courseName: cert.courseName,
            imageBuffer,
          });

          if (success) {
            successCount++;
          } else {
            failCount++;
          }

          // Pequeno delay entre publicações para evitar rate limit
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        return {
          success: true,
          message: `${successCount} certificado(s) publicado(s) com sucesso. ${failCount > 0 ? `${failCount} falharam.` : ""}`,
          successCount,
          failCount,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
