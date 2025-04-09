import jsPDF from "jspdf";
import "jspdf-autotable";
import { UniformData, Sketch, Player } from "./types";

// Need to augment the jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Define AutoTable data type
interface AutoTableData {
  settings: {
    margin: {
      left: number;
      top: number;
      right: number;
      bottom: number;
    };
  };
  cursor: {
    y: number;
  };
}

/**
 * Função para gerar um checkbox no PDF
 */
const addCheckbox = (
  doc: jsPDF,
  x: number,
  y: number,
  checked: boolean,
): void => {
  // Desenha o quadrado do checkbox
  doc.setDrawColor(0);
  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, 3, 3, "FD"); // Reduzido para 3x3 (antes era 4x4)

  // Se marcado, desenha o "X" dentro do checkbox
  if (checked) {
    doc.setDrawColor(0, 0, 0);

    // Desenha o X
    doc.line(x, y, x + 3, y + 3);
    doc.line(x + 3, y, x, y + 3);
  }
};

/**
 * Função auxiliar para formatar a data atual em formato brasileiro
 */
const getFormattedDateTime = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

/**
 * Função para adicionar texto com quebra de linha
 */
const addWrappedText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
): number => {
  if (!text || text === "-") {
    doc.text("-", x, y);
    return y;
  }

  const textLines = doc.splitTextToSize(text, maxWidth);
  doc.text(textLines, x, y);
  return y + (textLines.length - 1) * 5; // Retorna a nova posição Y
};

export const generateUniformPDF = (uniformData: UniformData): void => {
  // Verificar se há algum esboço sem jogadores
  const hasEmptySketches = uniformData.sketches.some(
    (sketch) => !sketch.players || sketch.players.length === 0,
  );

  if (hasEmptySketches) {
    throw new Error(
      "Não é possível gerar o PDF. Todos os esboços devem ter pelo menos um jogador.",
    );
  }

  const doc = new jsPDF();
  const budgetId = uniformData.budget_id;
  let pageCount = 0;
  let pagesGenerated = false;

  // Data e hora da geração
  const dataHoraGeracao = getFormattedDateTime();

  // Gerar uma página do PDF para cada esboço, separado por gênero
  uniformData.sketches.forEach((sketch, sketchIndex) => {
    // Agrupar jogadores por gênero
    const playersByGender: Record<string, Player[]> = {};

    sketch.players.forEach((player) => {
      const gender = player.gender || "Não especificado";
      if (!playersByGender[gender]) {
        playersByGender[gender] = [];
      }
      playersByGender[gender].push(player);
    });

    // Se não houver jogadores após a filtragem (caso raro), ignore este esboço
    if (Object.keys(playersByGender).length === 0) {
      return;
    }

    // Criar uma página para cada gênero neste esboço
    Object.entries(playersByGender).forEach(
      ([gender, players], genderIndex) => {
        // Adiciona uma nova página para todas exceto a primeira página
        if (pageCount > 0) {
          doc.addPage();
        }
        pageCount++;
        pagesGenerated = true;

        // Formatar o gênero para exibição
        const formattedGender =
          gender === "masculino"
            ? "Masculino"
            : gender === "feminino"
              ? "Feminino"
              : gender === "infantil"
                ? "Infantil"
                : gender;

        // Adicionar cabeçalho
        doc.setFontSize(14); // Reduzido de 18 para 14
        doc.text(`Orçamento #${budgetId} - Uniformes`, 14, 15); // Posição Y reduzida

        doc.setFontSize(12); // Reduzido de 14 para 12
        doc.text(
          `Esboço ${sketch.id} (${sketch.package_type}) - ${formattedGender}`,
          14,
          22,
        ); // Posição Y reduzida

        doc.setFontSize(10); // Reduzido de 12 para 10
        doc.text(`Total de jogadores: ${players.length}`, 14, 29); // Posição Y reduzida

        // Adicionar data e hora de geração
        doc.setFontSize(8);
        doc.text(`Gerado em: ${dataHoraGeracao}`, 14, 35);

        // Criar tabela com dados dos jogadores
        // Manualmente criar uma tabela ao invés de usar autoTable para ter mais controle
        doc.line(14, 38, 196, 38); // Linha horizontal superior - Y reduzido

        // Cabeçalho da tabela
        const startY = 42; // Reduzido de 50 para 42
        const rowHeight = 8; // Reduzido de 10 para 8

        // Ajuste de larguras das colunas para dar mais espaço para observações
        const colWidths = [14, 50, 18, 18, 18, 64]; // Larguras ajustadas, em particular a última (aumentada)
        const colStarts = [
          14, // Número
          14 + colWidths[0], // Nome
          14 + colWidths[0] + colWidths[1], // Tam. Camisa
          14 + colWidths[0] + colWidths[1] + colWidths[2], // Tam. Calção
          14 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], // Pronto
          14 +
            colWidths[0] +
            colWidths[1] +
            colWidths[2] +
            colWidths[3] +
            colWidths[4], // Observações
        ];

        // Calcular a altura total da tabela com base na última linha da tabela
        const lastRowY =
          players.length > 0
            ? startY + 4 + (players.length - 1) * rowHeight + 4 // Última linha + 4px de espaço para a borda inferior
            : startY; // Se não houver jogadores, a altura é apenas o cabeçalho

        // Desenhar linhas verticais da tabela
        for (let i = 0; i < colStarts.length; i++) {
          doc.line(colStarts[i], 38, colStarts[i], lastRowY);
        }
        // Última linha vertical (direita)
        doc.line(
          colStarts[colStarts.length - 1] + colWidths[colWidths.length - 1],
          38,
          colStarts[colStarts.length - 1] + colWidths[colWidths.length - 1],
          lastRowY,
        );

        // Títulos das colunas
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8); // Fonte menor para os títulos
        doc.text("Número", colStarts[0] + 2, startY - 2);
        doc.text("Nome", colStarts[1] + 2, startY - 2);
        doc.text("Tam. Camisa", colStarts[2] + 2, startY - 2);
        doc.text("Tam. Calção", colStarts[3] + 2, startY - 2);
        doc.text("Pronto", colStarts[4] + 2, startY - 2);
        doc.text("Observações", colStarts[5] + 2, startY - 2);

        doc.line(14, startY, 196, startY); // Linha horizontal após o cabeçalho

        // Dados dos jogadores
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8); // Fonte menor para os dados

        players.forEach((player, index) => {
          const rowY = startY + 4 + index * rowHeight; // 4 pixels de espaço após o cabeçalho

          // Número
          doc.text(player.number, colStarts[0] + 2, rowY);

          // Nome (com quebra de linha se necessário)
          const nameWidth = colWidths[1] - 4; // -4 para margem
          addWrappedText(doc, player.name, colStarts[1] + 2, rowY, nameWidth);

          // Tamanho da camisa
          doc.text(player.shirt_size, colStarts[2] + 2, rowY);

          // Tamanho do calção
          doc.text(player.shorts_size, colStarts[3] + 2, rowY);

          // Checkbox "Pronto"
          addCheckbox(doc, colStarts[4] + 7, rowY - 2, player.ready);

          // Observações (com quebra de linha)
          const obsWidth = colWidths[5] - 4; // -4 para margem
          const observations = player.observations || "-";
          addWrappedText(doc, observations, colStarts[5] + 2, rowY, obsWidth);

          // Linha horizontal após cada linha de dados, exceto a última
          if (index < players.length - 1) {
            doc.line(14, rowY + 4, 196, rowY + 4);
          }
        });

        // Linha horizontal final da tabela (linha inferior)
        if (players.length > 0) {
          const lastRowY = startY + 4 + (players.length - 1) * rowHeight;
          doc.line(14, lastRowY + 4, 196, lastRowY + 4);
        }

        // Adicionar rodapé com número da página
        doc.setFontSize(8);
        doc.text(
          `Página ${doc.getNumberOfPages()}`,
          14,
          doc.internal.pageSize.height - 10,
        );
      },
    );
  });

  // Lidar com o caso onde nenhuma página foi gerada
  if (!pagesGenerated) {
    throw new Error(
      "Nenhum dado válido para gerar o PDF. Verifique se há jogadores configurados nos esboços.",
    );
  }

  // Salvar o PDF
  doc.save(`uniformes-orcamento-${budgetId}.pdf`);
};

export default generateUniformPDF;
