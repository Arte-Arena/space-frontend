import { DateTime } from 'luxon';
import avancarDias from './avancarDias';

interface Feriado {
  start_at: string; // Assumindo que vem no formato 'YYYY-MM-DD'
}

interface ApiResponseFeriados {
  dias_feriados: Feriado[];
}

function isWeekend(date: DateTime): boolean {
  const dayOfWeek = date.weekday;
  return dayOfWeek === 6 || dayOfWeek === 7;
}

// Pré-processa os feriados para um Set para busca mais rápida
function criarSetDeFeriados(feriados: ApiResponseFeriados): Set<string> {
  const feriadosSet = new Set<string>();
  feriados.dias_feriados.forEach(feriado => {
    const holidayDate = DateTime.fromSQL(feriado.start_at);
    feriadosSet.add(holidayDate.toFormat('yyyy-MM-dd')); // Padroniza o formato
  });
  return feriadosSet;
}

function isHoliday(date: DateTime, feriadosSet: Set<string>): boolean {
  const dataFormatada = date.toFormat('yyyy-MM-dd');
  return feriadosSet.has(dataFormatada);
}

function isDiaUtil(date: DateTime, feriadosSet: Set<string>): boolean {
  return !isWeekend(date) && !isHoliday(date, feriadosSet);
}

function isDiaNaoUtil(date: DateTime, feriadosSet: Set<string>): boolean {
  return isWeekend(date) || isHoliday(date, feriadosSet);
}

// Função auxiliar para iterar sobre as datas e aplicar uma lógica
function iterarDiasUteis(
  dataInicial: DateTime,
  dataFinal: DateTime | null, // dataFinal pode ser nula no caso de calcularDataFuturaDiasUteis
  feriados: ApiResponseFeriados,
  callback: (dataAtual: DateTime) => void
): void {
    const feriadosSet = criarSetDeFeriados(feriados);
    let dataAtual = dataInicial;

    if (dataFinal) { // Lógica para calcDiasUteisEntreDatas
        while (dataAtual < dataFinal) {
            if (isDiaUtil(dataAtual, feriadosSet)) {
                callback(dataAtual);
            }
            dataAtual = avancarDias(dataAtual, 1);
        }
    } else { // Lógica para calcularDataFuturaDiasUteis (dataFinal é null)
        callback(dataAtual); // Garante que a data inicial também seja considerada
    }
}

export function calcularDataFuturaDiasUteis(
  dataInicial: DateTime,
  diasUteisDesejados: number,
  feriados: ApiResponseFeriados
): DateTime {
  let dataAtual = dataInicial;
  let diasUteisContados = 0;
  const feriadosSet = criarSetDeFeriados(feriados);

  while (diasUteisContados < diasUteisDesejados) {
    dataAtual = avancarDias(dataAtual, 1);
    if (isDiaUtil(dataAtual, feriadosSet)) {
      diasUteisContados++;
    }
  }

  return dataAtual;
}

export function calcDiasUteisEntreDatas(
  dataInicial: DateTime,
  dataFinal: DateTime,
  feriados: ApiResponseFeriados
): number {
  let diasUteisContados = 0;
  const feriadosSet = criarSetDeFeriados(feriados);

  iterarDiasUteis(dataInicial, dataFinal, feriados, (dataAtual) => {
    if (isDiaUtil(dataAtual, feriadosSet)) {
      diasUteisContados++;
    }
  });

  return diasUteisContados;
}

export function calcDiasNaoUteisEntreDatas(
  dataInicial: DateTime,
  dataFinal: DateTime,
  feriados: ApiResponseFeriados
): number {
  let dataAtual = dataInicial;
  let diasNaoUteisContados = 0;
  const feriadosSet = criarSetDeFeriados(feriados);

  while (dataAtual < dataFinal) {
    if (isDiaNaoUtil(dataAtual, feriadosSet)) {
      diasNaoUteisContados++;
    }
    dataAtual = avancarDias(dataAtual, 1);
  }

  return diasNaoUteisContados;
}

