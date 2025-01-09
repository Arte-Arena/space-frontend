export default async function contarFeriados(dataInicio: Date, days: number) {
    // console.log('Contando feriados...');
    // console.log('Contando feriados... dataInicio: ', dataInicio);
    // console.log('Contando feriados... days: ', days);

    const dataFinal = new Date(dataInicio.getTime() + (days * 24 * 60 * 60 * 1000));

    // console.log('Contando feriados... dataFinal: ', dataFinal);

    const url = `http://localhost:8000/api/calendar/feriados?datainicio=${dataInicio.toISOString().split('T')[0]}&datafim=${dataFinal.toISOString().split('T')[0]}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 23|jhZYmBGECTZFY8Fzyaec5DsEslKCTvC82IFsN2LYd36ca661`
        }
    });
    
    const data = await response.json();
    const qtdFeriados = data.dias_feriados;
    // console.log('Contando feriados... qtdFeriados:', qtdFeriados);

    return qtdFeriados;
}