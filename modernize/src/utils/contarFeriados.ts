export default async function contarFeriados(dataInicio: Date, days: number) {
    
    const accessToken = localStorage.getItem('accessToken');
    // console.log('Contando feriados...');
    // console.log('Contando feriados... dataInicio: ', dataInicio);
    // console.log('Contando feriados... days: ', days);

    const dataFinal = new Date(dataInicio.getTime() + (days * 24 * 60 * 60 * 1000));
    // console.log('Contando feriados... dataFinal: ', dataFinal);

    const url = `${process.env.NEXT_PUBLIC_API}/api/calendar/feriados?datainicio=${dataInicio.toISOString().split('T')[0]}&datafim=${dataFinal.toISOString().split('T')[0]}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        }
    });
    
    const data = await response.json();
    const qtdFeriados = data.dias_feriados;
    // console.log('Contando feriados... qtdFeriados:', qtdFeriados);

    return qtdFeriados;
}