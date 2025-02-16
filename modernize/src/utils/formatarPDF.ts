import { jsPDF } from "jspdf";
import logo from '../../public/images/logos/logo.png'

const formatarPDF = (htmlContent: string) => { 
  const doc = new jsPDF("p", "mm", "a4");

  const logoPNG = logo.src;
  const linhas = htmlContent.split("\n").map(linha => linha.trim()).filter(linha => linha !== "");
  console.log("linhas ", htmlContent);

  // Regex
  const regexProduto = /^\d+\s+un\s+.+\s+R\$\s*\d+,\d{2}/;
  const regexBrinde = /Brinde:\s*\d+\s+un\s+.+\s+R\$\s*\d+,\d{2}\s*\(R\$\s*\d+,\d{2}\)/i;
  const regexFrete = /Frete:\s*R\$\s*\d+,\d{2}/;
  const regexDesconto = /Desconto:\s*R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?/i;
  const regexTotal = /Total:\s*R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?/;
  const regexPrazoProducao = /Prazo de Produção:\s*\d+\s+dias\s+úteis/;
  const regexPrevisao = /(Previsão de (Retirada|Entrega):\s*\d{1,2}\s+de\s+[a-zA-Zçáéíóúãõ]+\s+de\s+\d{4}(?:\s*\(.*?\))?|Não é possível prever a data de entrega\.)/i;


  // filtragem por Regex
  const produtos = linhas.filter(linha => regexProduto.test(linha));
  const brinde = linhas.find(linha => regexBrinde.test(linha)) || "Brinde não informado";
  const frete = linhas.find(linha => regexFrete.test(linha)) || "Frete não informado";
  const desconto = linhas.find(linha => regexDesconto.test(linha)) || "Desconto não informado";
  const total = linhas.find(linha => regexTotal.test(linha)) || "Total não informado";
  const prazoProducao = linhas.find(linha => regexPrazoProducao.test(linha)) || "Prazo de produção não informado";
  const previsaoRetirada = linhas.find(linha => regexPrevisao.test(linha)) || "Não é possível prever a data de entrega.";
  
  // testes:
  console.log("Frete: ", frete);
  console.log("Total: ", total);
  console.log("Prazo de Produção: ", prazoProducao);
  console.log("Previsão de Retirada: ", previsaoRetirada);  

  // Definir estilo do título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  
  // Definir estilo do texto normal
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  
  
  doc.addImage(logoPNG, 'PNG', 10, 10, 85, 30);

  doc.setDrawColor(0); // Cor da linha (preto)
  doc.setLineWidth(0.5); // Espessura da linha
  doc.line(10, 10 + 30 + 5, 200, 10 + 30 + 5);

  // Posição inicial do primeiro item
  let y = 75; 
  
  doc.text("Lista de Produtos", 10, 50);
  
  produtos.forEach((produto, index) => {
    doc.text("-"+produto, 15, y);
    y += 10; 
  });

  // Adicionando os outros dados no PDF
  doc.text(brinde, 10, y);
  y += 10;
  doc.text(frete, 10, y);
  y += 10;
  doc.text(desconto, 10, y);
  y += 10;
  doc.text(total, 10, y);
  y += 10;
  doc.text(prazoProducao, 10, y);
  y += 10;
  doc.text(previsaoRetirada, 10, y);

  // comentários finais
  y += 15;
  doc.text("Prazo inicia-se após aprovação da arte e pagamento confirmado.", 10, y);
  y += 5;
  doc.text("Orçamento válido somente hoje.", 10, y);

  // rodapé:
  doc.setFontSize(10);
  doc.text("Arte Arena. | CNPJ: 29.046.501/0001-90", 10, 290);

  // salvando o doc.
  doc.save("Produto_Arte_Arena.pdf");

};

export default formatarPDF;