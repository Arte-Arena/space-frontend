import { DateTime } from 'luxon';

export default function contarFinaisDeSemana(initial: DateTime, days: number, extenso: boolean = false) {

    const novaData = initial.plus({ days: days });
    const novaDataPorExtenso = novaData.setLocale('pt-BR').toFormat('dd \'de\' MMMM \'de\' yyyy');

    if (extenso) {
      return novaDataPorExtenso;
    } else {
      return novaData;
    }

}
