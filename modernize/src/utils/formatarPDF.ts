import Logo from '../../public/images/logos/logo.png'

const formatarPDF = async(htmlContent: string) => {
  const linhas = htmlContent.split("\n").map(linha => linha.trim()).filter(linha => linha !== "");
  const logo = Logo.src;

  // Regex
  const regexProduto = /^\d+\s+un\s+.+\s+R\$\s*[\d.,]+\s*(\(R\$\s*[\d.,]+\))?/;
  const regexBrinde = /Brinde:\s*\d+\s+un\s+.+\s+R\$\s*\d+,\d{2}\s*\(R\$\s*\d+,\d{2}\)/i;
  const regexFrete = /Frete:\s*R\$\s*\d+,\d{2}/;
  const regexDesconto = /Desconto:\s*R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?/i;
  const regexTotal = /Total:\s*R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?/;
  const regexPrazoProducao = /Prazo de Produção:\s*\d+\s+dias\s+úteis/;
  const regexPrevisao = /(Previsão de (Retirada|Entrega):\s*\d{1,2}\s+de\s+[a-zA-Zçáéíóúãõ]+\s+de\s+\d{4}(?:\s*\(.*?\))?|Não é possível prever a data de entrega\.)/i;
  const regexTaxaAntecipacao = /Taxa de Antecipação:\s*R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?/i;


  // // regex numerico
  // const regexFreteValor = /Frete:\s*R\$\s*([\d.,]+)/i;
  // const regexTotalValor = /Total:\s*R\$\s*([\d.,]+)/i;
  // const regexDescontoValor = /Desconto:\s*R\$\s*([\d.,]+)/i;
  
  // console.log(regexFreteValor,regexTotalValor,regexDescontoValor )

  // // Função para converter valor de string para número
  // const converterParaNumero = (valor: string | undefined): number => {
  //   // Se o valor for undefined, use "0" como padrão
  //   const valorString = valor || "0";
  //   return parseFloat(valorString.replace('.', '').replace(',', '.'));
  // };
  
  // // Extrair e somar os valores
  // let freteValor = 0;
  // let totalValor = 0;
  // let descontoValor = 0;

  // linhas.forEach((linha) => {
  //   const matchFrete = linha.match(regexFrete);
  //   const matchTotal = linha.match(regexTotal);
  //   const matchDesconto = linha.match(regexDesconto);
  
  //   if (matchFrete) {
  //     const valorFrete = matchFrete[1]; // Acessa o grupo de captura
  //     freteValor = converterParaNumero(valorFrete);
  //   }
  
  //   if (matchTotal) {
  //     const valorTotal = matchTotal[1]; // Acessa o grupo de captura
  //     totalValor = converterParaNumero(valorTotal);
  //   }
  
  //   if (matchDesconto) {
  //     const valorDesconto = matchDesconto[1]; // Acessa o grupo de captura
  //     descontoValor = converterParaNumero(valorDesconto);
  //   }
  // });

  // // Calcular o valor final (total + frete - desconto)
  // const valorFinal = totalValor + freteValor - descontoValor;
  // console.log(regexFreteValor,regexTotalValor,regexDescontoValor)

  // filtragem por Regex
  const produtos = linhas.filter(linha => regexProduto.test(linha));
  const brinde = linhas.find(linha => regexBrinde.test(linha)) || "";
  const frete = linhas.find(linha => regexFrete.test(linha)) || "Frete não informado";
  const desconto = linhas.find(linha => regexDesconto.test(linha)) || "";
  const total = linhas.find(linha => regexTotal.test(linha)) || "Total não informado";
  const prazoProducao = linhas.find(linha => regexPrazoProducao.test(linha)) || "Prazo de produção não informado";
  const previsaoRetirada = linhas.find(linha => regexPrevisao.test(linha)) || "Não é possível prever a data de entrega.";
  const TaxaAntecipacao = linhas.find(linha => regexTaxaAntecipacao.test(linha)) || "";

  console.log(produtos)
  // Função auxiliar para calcular soma das quantidades
  const somaQuantidades = produtos.reduce((acc, produto) => {
    const partes = produto.match(/(\d+)\s+un/);
    return acc + (partes ? parseInt(partes[1], 10) : 0);
  }, 0);
  
  let somaTotalItens = 0;

  // Geração do HTML formatado
  const html = `
  <html>
  <head>
    <style>
      @page {
        margin: 0;
        size: auto;
      }

      body { font-family: Arial, sans-serif; font-size: 15px; padding: 20px; margin-right: 5%; margin-left: 5%; padding-top: 20px;}
      .container-header { display: flex; }
      .header { padding-left: 0; padding-top: 0;}
      .info-header {text-align: end; width: 100%; padding: 0; margin 0;}
      .info-header p { padding: 0; margin 0;}
      .logo { width: 250px; }
      .title { font-size: 22px; font-weight: bold; margin-top: 20px; text-align: center; }
      .table, .info-table, .total-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        font-size: 15px; !important
      }
      .table th, .table td, .info-table th, .info-table td, .total-table th, .total-table td {
        border: 2px solid #1C1C1C;
        padding: 8px;
        text-align: left;
      }
      .table th, .info-table th, .total-table th {
        background-color: #f2f2f2;
      }
      .td-titulo{
        width: 60%;
      }
      // table td {
      //   background-color: #f0f8ff; /* Azul bebê bem suave */
      // }

      .footer { margin-top: 40px; font-size: 12px; text-align: center; }
      
      @media print {
        body { padding: 0; }
        .table { width: 100%; }
      }
    </style>
  </head>
  <body>
    <div class="container-header">
      <div class="header">
        <img src="${logo}" class="logo" />
      </div>
      <div class="info-header">
       <div><b>Arte Arena</b></div>
       <div>46.745.203/0001-08</div>
       <div>(11) 2337-1548</div>
       <div>Avenida Doutor Luís Arrobas Martins, 335, Galdivão</div>
       <div><span>Cadivela do Socorro, São divaulo - Sdiv</span></div>
       <div><span>04.781-000</span></div>
       <div><span>136254528111</span></div>
      </div>
    </div>

    <div class="title">Proposta Comercial</div>

    <table class="table">
      <tr>
        <th>Nº</th>
        <th>Item</th>
        <th>SKU</th>
        <th>Qtd</th>
        <th>Un</th>
        <th>Preço un</th>
        <th>Total un</th>
      </tr>
      ${produtos.map((produto, index) => {
          const partes = produto.match(/^(\d+)\s+un\s+(.+)\s+R\$\s*([\d.,]+)\s*(\(R\$\s*([\d.,]+)\))?/);
          if (partes) {
            const quantidade = parseInt(partes[1], 10);
            const precoUnitario = parseFloat(partes[3].replace(',', '.'));
            const totalPorItens = precoUnitario * quantidade;
            somaTotalItens += totalPorItens
            return `<tr>
                        <td>${index + 1}</td>
                        <td>${partes[2]}</td>
                        <td>-</td>
                        <td>${quantidade}</td>
                        <td>-</td>
                        <td>R$ ${precoUnitario.toFixed(2).replace('.', ',')}</td>
                        <td>R$ ${totalPorItens.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                      </tr>`;
          }
          return "";
      }).join("")}
    </table>

    <table class="total-table">
      <tr><th colspan="2">Resumo</th></tr>
      
      <tr>
        <td class="td-titulo"><b>Total dos itens:</b></td>
        <td>${somaTotalItens.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
      </tr>
      <tr>
        <td class="td-titulo"><b>Número de itens:</b></td>
        <td>${produtos.length}</td>
      </tr>
      <tr>
        <td class="td-titulo"><b>Soma das quantidades:</b></td>
        <td>${somaQuantidades}</td>
      </tr>

      ${TaxaAntecipacao ? `
        <tr>
          <td class="td-titulo"><b>Taxa de Antecipação:</b></td>
          <td>${TaxaAntecipacao}</td>
        </tr>
      ` : ""}


      ${brinde ? `
        <tr>
        <td class="td-titulo"><b>Brinde:</b></td>
        <td>${brinde}</td>
        </tr>
        ` : ""}

      ${desconto ? `
          <tr>
          <td class="td-titulo"><b>Desconto:</b></td>
          <td>${desconto}</td>
          </tr>
          ` : ""}

      <tr>
        <td class="td-titulo"><b>Total a pagar:</b></td>
        <td> ${total}</td>
      </tr>
    </table>

    <table class="info-table">
      <tr><th colspan="2">Informações de Entrega</th></tr>
      <tr>
        <td class="td-titulo"><b>Frete:</b></td>
        <td>${frete}</td>
      </tr>          
      <tr>
        <td class="td-titulo"><b>Prazo de Produção:</b></td>
        <td>${prazoProducao}</td>
      </tr>
      <tr>
        <td class="td-titulo"><b>Previsão De Retirada:</b></td>
        <td>${previsaoRetirada}</td>
      </tr>
    </table>

    <div class="footer">
      <p>Atenciosamente,</p>
      <p>Equipe Arte Arena</p>
    </div>

    <script>
      window.onload = function() {
        window.print();
      };
    </script>
  </body>
  </html>
  `;

  // Abre uma nova janela com o conteúdo HTML
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    console.error('Não foi possível abrir a janela de impressão.');
  }

};

export default formatarPDF;
