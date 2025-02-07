export default function contarFinaisDeSemana(
  dataInicio: Date,
  dias: number,
  feriadosExatos?: string[]
): number {
  // console.log("--- inicio --- contando finais de semana... dataInicio", dataInicio);
  // console.log("contando finais de semana... dias", dias);

  const inicio = new Date(dataInicio);
  const fim = new Date(dataInicio);
  fim.setDate(fim.getDate() + dias);

  let finaisDeSemana = 0;
  let feriadosCoincidentes: string[] = [];
  const dataAtual = new Date(inicio);

  while (dataAtual <= fim) {
    const diaDaSemana = dataAtual.getDay();
    const dataAtualISO = dataAtual.toISOString().split("T")[0];

    if (diaDaSemana === 0 || diaDaSemana === 6) {
      if (feriadosExatos && feriadosExatos.includes(dataAtualISO)) {
        feriadosCoincidentes.push(dataAtualISO);
      } else {
        finaisDeSemana++;
      }
    }

    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  // console.log("contando finais de semana... finaisDeSemana inicial:", finaisDeSemana);
  // console.log("Feriados que coincidiram com finais de semana:", feriadosCoincidentes);
  // console.log("Quantidade de feriados coincidentes:", feriadosCoincidentes.length);

  if (finaisDeSemana > 0) {
    const finaisDeSemanaDoPeriodoAdicional = contarFinaisDeSemana(fim, finaisDeSemana, feriadosExatos);
    finaisDeSemana += finaisDeSemanaDoPeriodoAdicional;
  }

  // console.log("--- fim --- contando finais de semana... finaisDeSemana final:", finaisDeSemana);
  return finaisDeSemana;
}