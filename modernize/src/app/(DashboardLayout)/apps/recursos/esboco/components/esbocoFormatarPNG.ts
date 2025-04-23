import html2canvas from 'html2canvas';

interface Esboco {
  id: string;
  opcao: string;
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
  const larguraPx = 1000;
  const alturaPx = Math.round((altura / largura) * larguraPx);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.style.width = `${larguraPx}px`;
  iframe.style.height = 'auto';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, sans-serif;
      background: #fff;
      width: ${larguraPx}px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .logo {
      width: 180px;
      margin: 20px 0;
    }

    .mockup-area {
      width: 100%;
      height: ${alturaPx}px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px dashed #ccc;
      background-color: #B3B3B3;
    }

    .mockup-area img {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
    }

    .footer {
      width: 100%;
      background: #000;
      color: #fff;
      padding: 30px 40px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
    }

    .titulo {
      font-size: 30px;
      font-weight: bold;
      color: #f7931e;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
    }

    .info-box {
      text-transform: uppercase;
    }

    .label {
      font-weight: bold;
      color: #f7931e;
      font-size: 18px;
    }

    .value {
      font-size: 18px;
      font-weight: bold;
      color: white;
    }

    .selo {
      font-size: 14px;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
 
    .header {
      width: 100%;
      background-color: #B3B3B3;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
    }

    .opcao-destaque {
      position: absolute;
      bottom: 80px; 
      right: 40px;
      font-size: 28px; 
      font-weight: bold;
      color: #fdd835;
      text-transform: uppercase;
      text-align: right;
    }

  </style>
</head>
<body>
  <div class="header">
    <img class="logo" src="/images/logos/logo.png" alt="Logo Arte Arena" />
  </div>

  <div class="mockup-area">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Blank_Flag_icon.svg/1200px-Blank_Flag_icon.svg.png" alt="Mockup" />
  </div>

  <div class="footer">
    <div class="titulo">Bandeira <span style="color: white">Personalizada</span></div>

    <div class="info-grid">
      ${form.produto ? `<div class="info-box"><div class="label">Produto:</div><div class="value">${form.produto}</div></div>` : ''}
      ${form.altura && form.largura ? `<div class="info-box"><div class="label">Dimensões:</div><div class="value">${form.altura} x ${form.largura} m</div></div>` : ''}
      ${form.material ? `<div class="info-box"><div class="label">Material:</div><div class="value">${form.material}</div></div>` : ''}
      ${form.composicao ? `<div class="info-box"><div class="label">Composição:</div><div class="value">${form.composicao}</div></div>` : ''}
      ${form.ilhoses && form.qtdIlhoses ? `<div class="info-box"><div class="label">Ilhóses:</div><div class="value">${form.qtdIlhoses}</div></div>` : ''}
      ${form.produto?.toLowerCase().includes('bandeira') ? `<div class="info-box"><div class="label">Borda Mastro:</div><div class="value">BANDEIRA NÃO PRECISA DE BORDA MASTRO</div></div>` : (form.produto ? `<div class="info-box"><div class="label">Borda Mastro:</div><div class="value">${form.bordaMastro ? 'SIM' : 'NÃO'}</div></div>` : '')}
      ${form.produto?.toLowerCase().includes('bandeira') ? `<div class="info-box"><div class="label">Dupla Face:</div><div class="value">${form.duplaFace ? 'SIM' : 'NÃO'}</div></div>` : ''}
    </div>

    <div class="selo" >
      <span>• ETIQUETA PRODUTO AUTÊNTICO</span><br/>
      <span>• SELO DE PRODUTO OFICIAL</span>
    </div>

    <div class="opcao-destaque">OPÇÃO ${form.opcao}</div>
  </div>
</body>
</html>
  `);
  doc.close();

  await new Promise(resolve => setTimeout(resolve, 500));
  const target = iframe.contentDocument?.body;
  if (!target) return;

  const contentHeight = target.scrollHeight;
  iframe.style.height = `${contentHeight}px`;

  const canvas = await html2canvas(target);
  const imgData = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = imgData;
  link.download = `esboco-${form.id || Date.now()}.png`;
  link.click();

  iframe.remove();
};

export default esbocoFormatarPNG;
