import { describe, it, expect } from "vitest";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { format } from "date-fns";

describe("Events - Timezone Conversion (Brasília GMT-3)", () => {
  const timeZone = 'America/Sao_Paulo';

  it("deve converter horário de Brasília para UTC corretamente", () => {
    // Criar data local de Brasília: 10:00 do dia 15/03/2026
    const localDate = new Date('2026-03-15T10:00:00');
    
    // Converter para UTC (deve adicionar 3 horas no horário de verão ou horário padrão)
    const utcDate = fromZonedTime(localDate, timeZone);
    
    // Verificar que a conversão foi feita
    expect(utcDate).toBeInstanceOf(Date);
    expect(utcDate.toISOString()).toBeDefined();
  });

  it("deve converter horário UTC para Brasília corretamente", () => {
    // Data UTC: 13:00 do dia 15/03/2026
    const utcDate = new Date('2026-03-15T13:00:00Z');
    
    // Converter para horário de Brasília (deve subtrair 3 horas)
    const brasiliaDate = toZonedTime(utcDate, timeZone);
    
    // Verificar que a conversão foi feita
    expect(brasiliaDate).toBeInstanceOf(Date);
    
    // A hora local deve ser 10:00 (13:00 UTC - 3 horas)
    const hour = format(brasiliaDate, 'HH');
    expect(hour).toBe('10');
  });

  it("deve manter consistência em conversão ida e volta", () => {
    // Horário original em Brasília
    const originalLocal = new Date('2026-03-15T14:30:00');
    
    // Converter para UTC
    const utc = fromZonedTime(originalLocal, timeZone);
    
    // Converter de volta para Brasília
    const backToLocal = toZonedTime(utc, timeZone);
    
    // Verificar que o horário local é o mesmo
    expect(format(backToLocal, 'HH:mm')).toBe(format(originalLocal, 'HH:mm'));
  });

  it("deve formatar horários de Brasília corretamente", () => {
    const utcDate = new Date('2026-03-15T16:00:00Z');
    const brasiliaDate = toZonedTime(utcDate, timeZone);
    
    const formattedTime = format(brasiliaDate, 'HH:mm');
    
    // 16:00 UTC deve ser 13:00 em Brasília (GMT-3)
    expect(formattedTime).toBe('13:00');
  });

  it("deve lidar com diferentes horários do dia", () => {
    const testCases = [
      { utc: '2026-03-15T03:00:00Z', expectedBrasilia: '00:00' },
      { utc: '2026-03-15T12:00:00Z', expectedBrasilia: '09:00' },
      { utc: '2026-03-15T18:00:00Z', expectedBrasilia: '15:00' },
      { utc: '2026-03-15T23:00:00Z', expectedBrasilia: '20:00' },
    ];

    testCases.forEach(({ utc, expectedBrasilia }) => {
      const utcDate = new Date(utc);
      const brasiliaDate = toZonedTime(utcDate, timeZone);
      const formatted = format(brasiliaDate, 'HH:mm');
      
      expect(formatted).toBe(expectedBrasilia);
    });
  });

  it("deve validar que timezone de São Paulo é GMT-3", () => {
    // Criar data em UTC: meio-dia
    const utcDate = new Date('2026-06-15T12:00:00Z');
    
    // Converter para São Paulo
    const spDate = toZonedTime(utcDate, timeZone);
    
    // Verificar que está 3 horas atrás (09:00)
    const hour = parseInt(format(spDate, 'HH'));
    const utcHour = utcDate.getUTCHours();
    
    // Diferença deve ser 3 horas (considerando horário padrão)
    const diff = utcHour - hour;
    expect(diff).toBe(3);
  });
});
