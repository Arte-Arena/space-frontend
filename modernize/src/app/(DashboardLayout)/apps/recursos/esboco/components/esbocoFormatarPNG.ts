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

const esbocoFormatarPNG = async (form: Esboco) => {
    const largura = parseFloat(form.largura || '1');
    const altura = parseFloat(form.altura || '1');
    const proporcao = largura / altura;
    const lineGap = Math.max(1.5, Math.min(4, altura * 1.5));

    // 1. Cria iframe invisível
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '1024px';
    iframe.style.height = `${1024 / proporcao}px`;
    document.body.appendChild(iframe);

    // 2. Acessa o documento interno
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // 3. Insere o HTML completo com estilos inline
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #2c2c2c;
            font-family: Arial, sans-serif;
          }
  
          .page {
            display: flex;
            width: 100%;
            height: 100%;
            background: #2c2c2c;
            color: white;
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
            width: 120px;
            align-self: flex-end;
            margin-bottom: 16px;
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
            white-space: nowrap;
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
            <img class="logo" src="/images/logos/logo.png" alt="logo" />
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
      </body>
      </html>
    `);
    doc.close();

    // 4. Aguarda renderização
    await new Promise(resolve => setTimeout(resolve, 500));

    // 5. Captura o conteúdo do iframe
    const target = iframe.contentDocument?.body?.firstElementChild;
    if (!target) {
        console.error('Falha ao localizar o conteúdo do iframe');
        return;
    }

    const canvas = await html2canvas(target as HTMLElement);
    const imgData = canvas.toDataURL('image/png');

    // 6. Dispara o download
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `esboco-${form.id || Date.now()}.png`;
    link.click();

    // 7. Remove iframe
    iframe.remove();
};

export default esbocoFormatarPNG;
