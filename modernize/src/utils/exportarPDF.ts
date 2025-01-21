import { jsPDF } from "jspdf";

const exportarPDF = (htmlContent: string) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Envolva o conteúdo com estilos adicionais
  const styledContent = `
    <style>
      body {
        color: black !important; /* Define o texto como preto */
        font-family: Arial, sans-serif;
        font-size: 12px;
      }
    </style>
    <div>
      ${htmlContent} <!-- Conteúdo original -->
    </div>
  `;

  doc.html(styledContent, {
    callback: function (doc) {
      doc.save("Orcamento_Arte_Arena.pdf");
    },
    x: 10,
    y: 10,
    width: 190, // Define a largura do conteúdo
    windowWidth: 800, // Simula o tamanho da janela ao renderizar
  });
};

export default exportarPDF;
