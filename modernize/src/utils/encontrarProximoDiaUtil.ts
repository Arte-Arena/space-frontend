import { DateTime } from 'luxon';
import avancarDias from './avancarDias';
import contarFeriados from './contarFeriados';
import contarFinaisDeSemana from './contarFinaisDeSemana';

export default async function encontrarProximoDiaUtil(dataPrevista: DateTime) {

    // console.log("dataPrevistaPreliminar", dataPrevista.toString());

    // define o contador como 0
    // inicia um loop
    // define o contador como + 1
    // define a data de verificacao como a data preliminar + o contador (use a função avancarDias)
    // data de verificacao é um dia útil? (não é feriado nem final de semana? use as funções contarFeriados e contarFinaisDeSemana)
    // se sim, então define a dataPrevistaPreliminar como a data de verificação, encerra o loop.
    // se não, volte para o começo do loop.


    let contador = 0;
    while (true) {
        const dataVerificacao = avancarDias(dataPrevista, contador);
        // console.log("dataVerificacao: ", dataVerificacao);
        const qtdFeriados = await contarFeriados(dataVerificacao.toJSDate(), 1);
        // console.log("qtdFeriados: ", qtdFeriados);
        const qtdFinaisDeSemana = contarFinaisDeSemana(dataVerificacao.toJSDate(), 1);
        // console.log("qtdFinaisDeSemana: ", qtdFinaisDeSemana);
        if (qtdFeriados === 0 && qtdFinaisDeSemana === 0) {
            dataPrevista = dataVerificacao;
            // console.log("Data Prevista Definitiva: ", dataPrevista);
            break;
        }
        contador++;
    }

    return dataPrevista;
}
