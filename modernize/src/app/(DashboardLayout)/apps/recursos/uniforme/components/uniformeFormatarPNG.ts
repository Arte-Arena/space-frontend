import html2canvas from 'html2canvas';

interface EsbocoUniforme {
  id: string;
  gola: string;
  composicao: string;
  logoTotem: string;
  estampa: string;
  escudo: string;
  opcao: string;
}

const esbocoUniformeFormatarPNG = async (form: EsbocoUniforme) => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.style.width = '794px';
  iframe.style.height = '1123px';
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
          width: 794px;
          height: 1123px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
    
        .vertical-warning {
          position: absolute;
          left: 30px;
          bottom: 27%;
          transform: rotate(-90deg);
          transform-origin: bottom left;
          font-size: 13px;
          font-weight: bold;
          text-transform: uppercase;
          color: #d32f2f;
          max-width: 100vh;
        }
    
        .header {
          width: 100%;
          background-color: #FFFFFF;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px 0;
        }
    
        .logo {
          width: 140px;
        }
    
        .banner {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background: #FFFFFF;
        }
    
        .banner img.uniforme {
          max-height: 90%;
          max-width: 90%;
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
    
        .id {
          font-size: 13px;
          text-align: center;
          font-weight: bold;
          color: #ffffff;
        }
    
        .titulo {
          font-size: 30px;
          font-weight: bold;
          color: #f7931e;
          text-transform: uppercase;
        }
    
        .titulo span {
          color: white;
        }
    
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 15px;
        }
    
        .info-box {
          text-transform: uppercase;
        }
    
        .label {
          font-weight: bold;
          color: #f7931e;
          font-size: 16px;
        }
    
        .value {
          font-size: 18px;
          font-weight: bold;
          color: white;
        }
    
        .selo {
          font-size: 12px;
          text-transform: uppercase;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
    
        .opcao-destaque {
          position: absolute;
          bottom: 70px;
          right: 40px;
          font-size: 26px;
          font-weight: bold;
          color: #fdd835;
          text-transform: uppercase;
        }
      </style>
    </head>
    <body>
      <div class="vertical-warning">
        * IMAGEM MERAMENTE ILUSTRATIVA • MARCA D'ÁGUA NÃO INCLUSA • AS CORES PODEM VARIAR EM ATÉ 20%<br/> • PODEM OCORRER VARIAÇÕES DE TAMANHO EM ATÉ 4CM
      </div>
    
      <div class="header">
        <img class="logo" src="/images/logos/logo.png" alt="Logo Arte Arena" />
      </div>
    
      <div class="banner">
        <img class="uniforme" src="/images/mockups/uniforme.png" alt="Mockup Uniforme" />
      </div>
    
      <div class="footer">
        <div class="id">ID: ${form.id}</div>
    
        <div class="titulo">Uniforme <span>Profissional</span></div>
    
        <div class="info-grid">
          <div class="info-box"><div class="label">Gola:</div><div class="value">${form.gola}</div></div>
          <div class="info-box"><div class="label">Composição:</div><div class="value">${form.composicao}</div></div>
          <div class="info-box"><div class="label">Logo Totem:</div><div class="value">${form.logoTotem}</div></div>
          <div class="info-box"><div class="label">Estampas:</div><div class="value">${form.estampa}</div></div>
          <div class="info-box"><div class="label">Escudo:</div><div class="value">${form.escudo}</div></div>
        </div>
    
        <div class="selo">
          <span>• ETIQUETA PRODUTO AUTÊNTICO</span>
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

  const canvas = await html2canvas(target);
  const imgData = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.href = imgData;
  link.download = `uniforme-${form.id || Date.now()}.png`;
  link.click();

  iframe.remove();
};

export default esbocoUniformeFormatarPNG;