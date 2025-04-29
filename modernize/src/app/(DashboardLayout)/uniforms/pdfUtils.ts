import jsPDF from "jspdf";
import "jspdf-autotable";
import { UniformData, Player } from "./types";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const addCheckbox = (
  doc: jsPDF,
  x: number,
  y: number,
  checked: boolean,
): void => {
  doc.setDrawColor(0);
  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, 3, 3, "FD");

  if (checked) {
    doc.setDrawColor(0, 0, 0);

    doc.line(x, y, x + 3, y + 3);
    doc.line(x + 3, y, x, y + 3);
  }
};

const getFormattedDateTime = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

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
  return y + (textLines.length - 1) * 5; 
};

const sortByShirtSize = (players: Player[]): Player[] => {
  const sizeOrder: Record<string, number> = {
    'PP': 1,
    'P': 2,
    'M': 3,
    'G': 4,
    'GG': 5,
    'XG': 6,
    'XGG': 6,
    'XXG': 7,
    '2XL': 7,
    'XXXG': 8, 
    '3XL': 8,
    '4XL': 9,
    '5XL': 10,

    '2': 101,
    '4': 102,
    '6': 103,
    '8': 104,
    '10': 105,
    '12': 106,
    '14': 107,
    '16': 108,

    '2T': 101,
    '4T': 102,
    '6T': 103,
    '8T': 104,
    '10T': 105,
    '12T': 106,
    '14T': 107,
    '16T': 108,
  };

  return [...players].sort((a, b) => {
    const sizeA = a.shirt_size?.trim().toUpperCase() || '';
    const sizeB = b.shirt_size?.trim().toUpperCase() || '';
    
    if (sizeOrder[sizeA] !== undefined && sizeOrder[sizeB] !== undefined) {
      return sizeOrder[sizeA] - sizeOrder[sizeB];
    }
    
    if (sizeOrder[sizeA] !== undefined) return -1;
    if (sizeOrder[sizeB] !== undefined) return 1;
    
    return sizeA.localeCompare(sizeB);
  });
};

export const generateUniformPDF = (uniformData: UniformData): void => {
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

  const dataHoraGeracao = getFormattedDateTime();

  uniformData.sketches.forEach((sketch, sketchIndex) => {
    const playersByGender: Record<string, Player[]> = {};

    sketch.players.forEach((player) => {
      const gender = player.gender || "Não especificado";
      if (!playersByGender[gender]) {
        playersByGender[gender] = [];
      }
      playersByGender[gender].push(player);
    });

    if (Object.keys(playersByGender).length === 0) {
      return;
    }

    Object.entries(playersByGender).forEach(
      ([gender, players], genderIndex) => {
        const sortedPlayers = sortByShirtSize(players);
        
        if (pageCount > 0) {
          doc.addPage();
        }
        pageCount++;
        pagesGenerated = true;

        const formattedGender =
          gender === "masculino"
            ? "Masculino"
            : gender === "feminino"
              ? "Feminino"
              : gender === "infantil"
                ? "Infantil"
                : gender;

        doc.setFontSize(14);
        doc.text(`Orçamento #${budgetId} - Uniformes`, 14, 15);

        doc.setFontSize(12);
        doc.text(
          `Esboço ${sketch.id} (${sketch.package_type}) - ${formattedGender}`,
          14,
          22,
        );

        doc.setFontSize(10);
        doc.text(`Total de jogadores: ${sortedPlayers.length}`, 14, 29);

        doc.setFontSize(8);
        doc.text(`Gerado em: ${dataHoraGeracao}`, 14, 35);

        doc.line(14, 38, 196, 38);

        const startY = 42;
        const rowHeight = 8;

        const colWidths = [14, 50, 18, 18, 18, 64];
        const colStarts = [
          14,
          14 + colWidths[0],
          14 + colWidths[0] + colWidths[1],
          14 + colWidths[0] + colWidths[1] + colWidths[2],
          14 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
          14 +
            colWidths[0] +
            colWidths[1] +
            colWidths[2] +
            colWidths[3] +
            colWidths[4],
        ];

        const lastRowY =
          sortedPlayers.length > 0
            ? startY + 4 + (sortedPlayers.length - 1) * rowHeight + 4
            : startY;

        for (let i = 0; i < colStarts.length; i++) {
          doc.line(colStarts[i], 38, colStarts[i], lastRowY);
        }

        doc.line(
          colStarts[colStarts.length - 1] + colWidths[colWidths.length - 1],
          38,
          colStarts[colStarts.length - 1] + colWidths[colWidths.length - 1],
          lastRowY,
        );


        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("Número", colStarts[0] + 2, startY - 2);
        doc.text("Nome", colStarts[1] + 2, startY - 2);
        doc.text("Tam. Camisa", colStarts[2] + 2, startY - 2);
        doc.text("Tam. Calção", colStarts[3] + 2, startY - 2);
        doc.text("Pronto", colStarts[4] + 2, startY - 2);
        doc.text("Observações", colStarts[5] + 2, startY - 2);

        doc.line(14, startY, 196, startY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        sortedPlayers.forEach((player, index) => {
          const rowY = startY + 4 + index * rowHeight;

          doc.text(player.number, colStarts[0] + 2, rowY);

          const nameWidth = colWidths[1] - 4;
          addWrappedText(doc, player.name, colStarts[1] + 2, rowY, nameWidth);

          doc.text(player.shirt_size, colStarts[2] + 2, rowY);

          doc.text(player.shorts_size, colStarts[3] + 2, rowY);

          addCheckbox(doc, colStarts[4] + 7, rowY - 2, player.ready);

          const obsWidth = colWidths[5] - 4;
          const observations = player.observations || "-";
          addWrappedText(doc, observations, colStarts[5] + 2, rowY, obsWidth);

          if (index < sortedPlayers.length - 1) {
            doc.line(14, rowY + 4, 196, rowY + 4);
          }
        });

        if (sortedPlayers.length > 0) {
          const lastRowY = startY + 4 + (sortedPlayers.length - 1) * rowHeight;
          doc.line(14, lastRowY + 4, 196, lastRowY + 4);
        }

        doc.setFontSize(8);
        doc.text(
          `Página ${doc.getNumberOfPages()}`,
          14,
          doc.internal.pageSize.height - 10,
        );
      },
    );
  });

  if (!pagesGenerated) {
    throw new Error(
      "Nenhum dado válido para gerar o PDF. Verifique se há jogadores configurados nos esboços.",
    );
  }

  doc.save(`uniformes-orcamento-${budgetId}.pdf`);
};

export default generateUniformPDF;
