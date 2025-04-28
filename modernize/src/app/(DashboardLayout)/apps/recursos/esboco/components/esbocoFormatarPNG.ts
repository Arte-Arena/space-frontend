import html2canvas from 'html2canvas';
import { FormState } from './types';

const esbocoFormatarPNG = async (form: FormState) => {
  // separar produtos que tem largura e altura de metros e os de centimetros para exibir corretamente
  
  const isFrenteVerso = form.produto?.toLowerCase().includes('sacochila');
    // form.produto?.toLowerCase().includes('bandeira') ||
    // form.produto?.toLowerCase().includes('cachecol') ||
    // form.produto?.toLowerCase().includes('toalha');
   const isDuplaFace = 
   form.produto?.toLowerCase().includes('bandeira') ||
   form.produto?.toLowerCase().includes('cachecol') ||
   form.produto?.toLowerCase().includes('cachecol') ||
   form.produto?.toLowerCase().includes('estandarte') ||
   form.produto?.toLowerCase().includes('almofada') ||
   form.produto?.toLowerCase().includes('flâmula');


  
  let largura = parseFloat(form.largura || form.altura || '5'); //posteriormente adicionar 15% da largura a mais
  let altura = parseFloat(form.altura || form.largura || '5');

  // if(form.dimensao) {
  //   largura = 5;
  //   altura = 5;
  // }

  if(form.produto.includes('Cachecol')) {
    largura = 5;
    altura = 5;
  }

  const larguraPx = 1000;
  const alturaPx = Math.round((altura / largura) * larguraPx);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.style.width = `${larguraPx}px`;
  iframe.style.height = 'auto';
  document.body.appendChild(iframe);

  const nome = form.produto.trim().replace('*', '');
  const palavras = nome.split(' ');

  const primeira = palavras[0];
  const restante = palavras.slice(1).join(' ');


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
      font-size: 46px;
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
      font-size: 26px;
    }

    .value {
      font-size: 26px;
      font-weight: bold;
      color: white;
    }

    .selo {
      font-size: 20px;
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
      bottom: 30px; 
      right: 40px;
      font-size: 40px; 
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
    ${form.produto ?
      `<div class="titulo">${primeira} <span style="color: white">${restante}</span></div>`
      : `<div class="titulo">${form.produto} </div>`
    }

    <div class="info-grid">
      ${
        form.dimensao
          ? `<div class="info-box">
              <div class="label">Dimensões:</div>
              <div class="value">${form.dimensao}</div>
            </div>`
          : `
            ${form.altura && !form.largura ? `<div class="info-box"><div class="label">Altura:</div><div class="value">${form.altura} m</div></div>` : ''}
            ${form.largura && !form.altura ? `<div class="info-box"><div class="label">Largura:</div><div class="value">${form.largura} m</div></div>` : ''}
            ${form.altura && form.largura ? `<div class="info-box"><div class="label">Dimensões:</div><div class="value">${form.altura} x ${form.largura} m</div></div>` : ''}
          `
      }
      ${form.material ? `<div class="info-box"><div class="label">Material:</div><div class="value">${form.material}</div></div>` : ''}
      ${form.composicao ? `<div class="info-box"><div class="label">Composição:</div><div class="value">${form.composicao}</div></div>` : ''}
      ${form.ilhoses && form.qtdIlhoses ? `<div class="info-box"><div class="label">Ilhóses:</div><div class="value">${form.qtdIlhoses}</div></div>` : ''}
      ${form.produto?.toLowerCase().includes('bandeira oficial') ? `<div class="info-box"><div class="label">Borda Mastro:</div><div class="value">${form.bordaMastro ? 'SIM' : 'NÃO'}</div></div>` : ''}
      ${isDuplaFace ? `<div class="info-box"><div class="label">Dupla Face:</div><div class="value">${form.duplaFace ? 'SIM' : 'NÃO'}</div></div>` : ''}
      ${isFrenteVerso ? `<div class="info-box"><div class="label">Frente e Verso:</div><div class="value">${form.duplaFace ? 'SIM' : 'NÃO'}</div></div>` : ''}
      ${form.produto?.toLowerCase().includes('windbanner') ? `<div class="info-box"><div class="label">Base:</div><div class="value">${form.duplaFace ? 'SIM' : 'NÃO'}</div></div>` : ''}
      ${form.produto?.toLowerCase().includes('short') ? `<div class="info-box"><div class="label">Bolso:</div><div class="value">${form.duplaFace ? 'SIM' : 'NÃO'}</div></div>` : ''}
      ${form.corSolado ? `<div class="info-box"><div class="label">Cor do Solado:</div><div class="value">${form.corSolado}</div></div>` : ''}
      ${form.corTira ? `<div class="info-box"><div class="label">Cor da Tira:</div><div class="value">${form.corTira}</div></div>` : ''}
      ${form.cordao ? `<div class="info-box"><div class="label">Cordão:</div><div class="value">${form.cordao}</div></div>` : ''}
      ${form.modelo ? `<div class="info-box"><div class="label">Modelo:</div><div class="value">${form.modelo}</div></div>` : ''}
      ${form.haste ? `<div class="info-box"><div class="label">Haste:</div><div class="value">${form.haste}</div></div>` : ''}
      ${form.qntHastes ? `<div class="info-box"><div class="label">N° de Hastes:</div><div class="value">${form.qntHastes}</div></div>` : ''}
      ${form.materialHaste ? `<div class="info-box"><div class="label">Material da Haste:</div><div class="value">${form.materialHaste}</div></div>` : ''}
      ${form.estampa ? `<div class="info-box"><div class="label">Estampa:</div><div class="value">${form.estampa}</div></div>` : ''}
      ${form.fechamento ? `<div class="info-box"><div class="label">Fechamento:</div><div class="value">${form.fechamento}</div></div>` : ''}
      ${form.franja ? `<div class="info-box"><div class="label">Franjas:</div><div class="value">${form.franja}</div></div>` : ''}
    </div>

    <div class="selo" >
      <span>• ID: ${form.id}</span>
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
