export default function contarFinaisDeSemana(dataInicio: Date, days: number) {
    // console.log('Contando finais de semana...')
    // console.log('Contando finais de semana... dataInicio: ', dataInicio);
    // console.log('Contando finais de semana... days: ', days);
    let contador = 0;
    let dataFim = new Date(dataInicio);
    dataFim.setDate(dataFim.getDate() + days);
    
    while (dataInicio <= dataFim) {
        const diaDaSemana = dataInicio.getDay();
        if (diaDaSemana === 0 || diaDaSemana === 6) {
            contador++;
        }
        dataInicio.setDate(dataInicio.getDate() + 1); // Avança para o próximo dia
    }
    
    // console.log('Contando finais de semana... resultado: ', contador)
    return contador;
}
