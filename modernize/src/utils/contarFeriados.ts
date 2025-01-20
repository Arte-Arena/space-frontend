export default async function contarFeriados(
    dataFeriados: { dias_feriados: Array<{ start_at: string }> },
    dataInicio: Date,
    days: number
  ): Promise<number> {
    // Garantir que os dados de feriados existem
    if (!dataFeriados || !dataFeriados.dias_feriados) {
      console.log("Erro? Nenhum feriado disponível.");
      return 0;
    }
  
    // console.log("Contando feriados...");
    // console.log("Contando feriados... dataFeriados: ", dataFeriados);
    // console.log("Contando feriados... dataInicio: ", dataInicio);
    // console.log("Contando feriados... days: ", days);
  
    // Calcular a data final
    const dataFinal = new Date(dataInicio.getTime() + days * 24 * 60 * 60 * 1000);
  
    // Converter a data inicial e final para o formato somente data (YYYY-MM-DD)
    const dataInicioISO = dataInicio.toISOString().split("T")[0];
    const dataFinalISO = dataFinal.toISOString().split("T")[0];
  
    // Filtrar os feriados que estão no intervalo
    const qtdFeriados = dataFeriados.dias_feriados.filter((feriado) => {
      const feriadoDate = feriado.start_at.split(" ")[0];
      return feriadoDate >= dataInicioISO && feriadoDate <= dataFinalISO;
    }).length;
  
    return qtdFeriados;
  }