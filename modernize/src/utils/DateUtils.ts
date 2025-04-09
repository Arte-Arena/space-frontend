/**
 * DateUtils.ts
 *
 * Uma classe utilitária para conversão e formatação de datas, garantindo que a data no formato "YYYY-MM-DD"
 * seja interpretada e trabalhada como data local, evitando problemas com fuso horário.
 */
export class DateUtils {
    /**
     * Converte um valor (string ou Date) em um objeto Date com base na interpretação de data local.
     * Se a string estiver no formato "YYYY-MM-DD", ela será convertida manualmente para evitar a interpretação
     * como UTC.
     *
     * @param dateInput - Data como string ou objeto Date.
     * @returns Um objeto Date que representa a data no horário local.
     */
    public static parseLocalDate(dateInput: string | Date): Date {
      // Se for uma string, verifique se está no formato "YYYY-MM-DD"
      if (typeof dateInput === 'string') {
        // Verifica o formato exato da data sem informações de tempo
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
          const [year, month, day] = dateInput.split('-').map(Number);
          // Importante: o construtor Date espera o mês com base zero
          return new Date(year, month - 1, day);
        } else {
          // Caso a string tenha um formato diferente, tente usá-la normalmente
          return new Date(dateInput);
        }
      } else if (dateInput instanceof Date) {
        // Se já é um Date, crie um novo objeto para garantir que trabalhamos com os componentes locais
        const year = dateInput.getFullYear();
        const month = dateInput.getMonth(); // Valor de 0 a 11
        const day = dateInput.getDate();
        return new Date(year, month, day);
      }
      throw new Error('Entrada de data inválida');
    }
  
    /**
     * Formata a data em um formato local legível.
     *
     * @param dateInput - Data como string ou objeto Date.
     * @param locale - A localidade para formatação (padrão: 'pt-BR').
     * @returns A data formatada, ex.: "24/04/2025"
     */
    public static formatLocalDate(dateInput: string | Date, locale: string = 'pt-BR'): string {
      const date = this.parseLocalDate(dateInput);
      return date.toLocaleDateString(locale);
    }
  }