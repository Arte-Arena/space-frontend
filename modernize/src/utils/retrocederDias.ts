import { DateTime } from 'luxon';

export default function retrocederDias(initial: DateTime, days: number): DateTime<boolean> {
  // console.log('Retrocedendo dias... Data inicial:', initial.toFormat('dd \'de\' MMMM \'de\' yyyy'));
  // console.log('Retrocedendo dias... Dias a subtrair:', days);
  const novaData = initial.minus({ days: days });
  // const novaDataPorExtenso = novaData.setLocale('pt-BR').toFormat('dd \'de\' MMMM \'de\' yyyy');
  // console.log(typeof novaData);

  return novaData;
}

