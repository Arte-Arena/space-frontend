import html2canvas from 'html2canvas';

interface Esboco {
    id: string;
    produto: string;
    material: string;
    altura: string;
    largura: string;
    composicao: string;
    ilhoses: boolean;
    qtdIlhoses?: string;
    bordaMastro: boolean;
    duplaFace: boolean;
}

const esbocoFormatarPDF = async (form: Esboco) => {
    const largura = parseFloat(form.largura || '1');
    const altura = parseFloat(form.altura || '1');
    const proporcao = largura / altura;

    // espaço entre linhas proporcional (ex: entre 1.5vw a 4vw)
    const lineGap = Math.max(1.5, Math.min(4, altura * 1.5));

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background: #2c2c2c;
          font-family: Arial, sans-serif;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
  
        @page {
          margin: 0;
          size: auto;
        }
  
        .wrapper {
          width: 100%;
          max-width: 1000px;
          margin: auto;
          position: relative;
        }
  
        .aspect-ratio-box {
          position: relative;
          width: 100%;
          padding-top: ${(1 / proporcao) * 100}%; /* proporcional à largura */
        }
  
        .page {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          background: #2c2c2c;
          color: white;
          overflow: hidden;
        }
  
        .left {
          flex: 4;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          background-color: #3b3b3b;
          position: relative;
        }
  
        .id {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 14px;
          color: #bfbfbf;
        }
  
        .imagem-simbolo {
          margin: auto;
          width: 200px;
          height: 200px;
          background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Blank_Flag_icon.svg/1200px-Blank_Flag_icon.svg.png') no-repeat center;
          background-size: contain;
          opacity: 0.4;
        }
  
        .aviso-topo, .aviso-baixo {
          text-align: center;
          font-size: 12px;
          font-weight: bold;
        }
  
        .direita {
          flex: 1;
          background-color: #1a1a1a;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
  
        .logo {
          width: 30px;
          align-self: flex-end;
        }
  
        .info-box {
          margin-top: 20px;
          padding-left: 10px;
          display: grid;
          grid-template-columns: auto 1fr;
          row-gap: ${lineGap}vh;
          column-gap: 12px;
          align-items: center;
        }
  
        .label {
          justify-self: start;
          font-weight: bold;
          color: #f7931e;
          font-size: 18px;
        }
  
        .valor {
          justify-self: center;
          font-weight: bold;
          font-size: 20px;
          color: #ffffff;
        }
  
        .opcao {
          text-align: center;
          font-weight: bold;
          font-size: 18px;
          color: #fdd835;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="aspect-ratio-box">
          <div class="page">
            <div class="left">
              <div class="id">ID: ${form.id}</div>
              <div class="aviso-topo">
                <h3>AS CORES PODEM SOFRER UMA VARIAÇÃO DE 20%</h3>
                <p>IMAGENS MERAMENTE ILUSTRATIVAS</p>
              </div>
              <div class="imagem-simbolo"></div>
              <div class="aviso-baixo">
                AS BANDEIRAS BRANCAS SE TRATAM DE NOSSA<br />
                MARCA D'ÁGUA E NÃO SERÃO INCLUSAS NA ARTE FINAL
              </div>
            </div>
  
            <div class="direita">
              <img class="logo" src="https://cdn-icons-png.flaticon.com/512/25/25311.png" alt="logo" />
              <div class="info-box">
                ${form.produto ? `<span class="label">PRODUTO:</span><span class="valor">${form.produto}</span>` : ''}
                ${form.altura && form.largura ? `<span class="label">DIMENSÕES:</span><span class="valor">${form.altura} x ${form.largura} M</span>` : ''}
                ${form.ilhoses && form.qtdIlhoses ? `<span class="label">ILHÓSES:</span><span class="valor">${form.qtdIlhoses}</span>` : ''}
                <span class="label">BORDA MASTRO:</span><span class="valor">${form.bordaMastro ? 'SIM' : 'NÃO'}</span>
                ${form.composicao ? `<span class="label">COMPOSIÇÃO:</span><span class="valor">${form.composicao}</span>` : ''}
                <span class="label">DUPLA FACE:</span><span class="valor">${form.duplaFace ? 'SIM' : 'NÃO'}</span>
                ${form.material ? `<span class="label">MATERIAL:</span><span class="valor">${form.material}</span>` : ''}
              </div>
              <div class="opcao">OPÇÃO A</div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    const element = document.getElementById('container'); // o wrapper que contém seu esboço
    html2canvas(element!).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'esboco.png';
        link.click();
    });

    // const printWindow = window.open('', '_blank');
    // if (printWindow) {
    //     printWindow.document.write(html);
    //     printWindow.document.close();
    // } else {
    //     console.error('Não foi possível abrir a janela de impressão.');
    // }
};

export default esbocoFormatarPDF;  