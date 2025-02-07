export default async function contarFeriados(
  dataFeriados: { dias_feriados: Array<{ start_at: string }> },
  dataInicio: Date,
  days: number
): Promise<{ quantidade: number; feriadosExatos: string[] }> {
  // console.log("------------ Iniciando a contagem de feriados...");

  if (!dataFeriados || !dataFeriados.dias_feriados) {
    // console.log("Erro? Nenhum feriado disponível.");
    return { quantidade: 0, feriadosExatos: [] };
  }

  console.log("Contando feriados... dataInicio:", dataInicio);
  console.log("Contando feriados... days:", days);

  const dataFinal = new Date(dataInicio.getTime() + days * 24 * 60 * 60 * 1000);
  const dataInicioISO = dataInicio.toISOString().split("T")[0];
  const dataFinalISO = dataFinal.toISOString().split("T")[0];

  const feriadosNoPeriodo = dataFeriados.dias_feriados.filter((feriado) => {
    const feriadoDate = feriado.start_at.split(" ")[0];
    return feriadoDate >= dataInicioISO && feriadoDate <= dataFinalISO;
  }).map(f => f.start_at.split(" ")[0]);

  let qtdFeriados = feriadosNoPeriodo.length;
  let listaFeriadosExatos = [...feriadosNoPeriodo];

  // console.log("Contando feriados... quantidade inicial:", qtdFeriados);

  if (qtdFeriados > 0) {
    const resultadoAdicional = await contarFeriados(dataFeriados, dataFinal, qtdFeriados);
    qtdFeriados += resultadoAdicional.quantidade;
    listaFeriadosExatos = Array.from(new Set([...listaFeriadosExatos, ...resultadoAdicional.feriadosExatos]));
    // console.log("Contando feriados... quantidade adicional:", resultadoAdicional.quantidade);
  }

  // console.log("------------ Encerrando a contagem de feriados...");

  return { quantidade: qtdFeriados, feriadosExatos: listaFeriadosExatos };
}
