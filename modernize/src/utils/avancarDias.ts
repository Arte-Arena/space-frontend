import { DateTime } from 'luxon';

export default function avancarDias(initial: DateTime, days: number): DateTime<boolean> {

  console.log('Avançando dias... Initial date:', initial.toFormat('dd \'de\' MMMM \'de\' yyyy'));
  console.log('Avançando dias... Days to add:', days);


    const novaData = initial.plus({ days: days });
    // const novaDataPorExtenso = novaData.setLocale('pt-BR').toFormat('dd \'de\' MMMM \'de\' yyyy');

    console.log(typeof novaData);

    return novaData;

}
