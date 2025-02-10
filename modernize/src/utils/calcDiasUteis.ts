import { DateTime } from 'luxon';
import avancarDias from './avancarDias';

interface Feriado {
  start_at: string;
}

interface ApiResponseFeriados {
  dias_feriados: Feriado[];
}

function isWeekend(date: DateTime): boolean {
  // 6 = Sábado, 7 = Domingo
  const dayOfWeek = date.weekday;
  return dayOfWeek === 6 || dayOfWeek === 7;
}

function isHoliday(date: DateTime, holidays: ApiResponseFeriados): boolean {
  return holidays.dias_feriados.some(holiday => {
    const holidayDate = DateTime.fromSQL(holiday.start_at);
    return holidayDate.hasSame(date, 'day') &&
      holidayDate.hasSame(date, 'month') &&
      holidayDate.hasSame(date, 'year');
  });
}

function isDiaUtil(date: DateTime, holidays: ApiResponseFeriados): boolean {
  return !isWeekend(date) && !isHoliday(date, holidays);
}

export default function calcularDataDiasUteis(
  dataInicial: DateTime,
  diasUteisDesejados: number,
  feriados: ApiResponseFeriados
): DateTime {
  let dataAtual = dataInicial;
  let diasUteisContados = 0;

  console.log(dataAtual);

  while (diasUteisContados < diasUteisDesejados) {
    // Avança um dia
    dataAtual = avancarDias(dataAtual, 1);

    // Se for dia útil, incrementa o contador
    if (isDiaUtil(dataAtual, feriados)) {
      diasUteisContados++;
      console.log(`Dia útil contado: ${diasUteisContados}, Data Atual: ${dataAtual}`);

    }
  }

  return dataAtual;
}

export function calcDiasUteisEntreDatas(
  dataInicial: DateTime,
  dataFinal: DateTime,
  feriados: ApiResponseFeriados
): number {
  let dataAtual = dataInicial;
  let diasUteisContados = 0;

  while (dataAtual < dataFinal) {
    dataAtual = avancarDias(dataAtual, 1);
    if (isDiaUtil(dataAtual, feriados)) {
      diasUteisContados++;
    }
  }

  return diasUteisContados;
}

