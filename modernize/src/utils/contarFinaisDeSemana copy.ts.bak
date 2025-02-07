export default function contarFinaisDeSemana(dataInicio: Date, dias: number): number {
  console.log('contando finais de semana... dataInicio', dataInicio);
  console.log('contando finais de semana... dias', dias);
  
  // Cria cópias das datas para não modificar a original
  const inicio = new Date(dataInicio);
  const fim = new Date(dataInicio);
  fim.setDate(fim.getDate() + dias);
  
  let finaisDeSemana = 0;
  const dataAtual = new Date(inicio);
  
  // Itera por cada dia no intervalo
  while (dataAtual <= fim) {
    const diaDaSemana = dataAtual.getDay();
    // Verifica se é sábado (6) ou domingo (0)
    if (diaDaSemana === 0 || diaDaSemana === 6) {
      finaisDeSemana++;
    }
    // Avança para o próximo dia
    dataAtual.setDate(dataAtual.getDate() + 1);
  }
  
  console.log('contando finais de semana... finaisDeSemana inicial:', finaisDeSemana);
  
  // Se encontrou finais de semana, verifica se há mais finais de semana no próximo período
  if (finaisDeSemana > 0) {
    const finaisDeSemanaDoPeriodoAdicional = contarFinaisDeSemana(fim, finaisDeSemana);
    finaisDeSemana += finaisDeSemanaDoPeriodoAdicional;
  }
  
  console.log('contando finais de semana... finaisDeSemana final:', finaisDeSemana);
  return finaisDeSemana;
}