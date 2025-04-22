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
        body {
          margin: 0;
          padding: 5px;
          font-family: Arial, sans-serif;
          background: #ffffff;
          color: black;
          width: 100%;
          aspect-ratio: 210 / 297;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          // border: 5px solid #a5a5a5;
        }
        .logo {
          width: 140px;
          margin: 20px auto;
          display: block;
        }
        .banner {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .banner img.uniforme {
          max-height: 80%;
          max-width: 80%;
          object-fit: contain;
        }
        .id {
          color: #ffffff;
          font-size: 14px;
          text-align: center;
          margin-top: 10px;
          font-weight: bold;
        }
        .footer {
          background: #000000;
          display: grid;
          grid-template-rows: auto auto auto;
          padding: 20px;
          gap: 15px;
          width: 100%;
          color: white;
        }
        .info-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .info-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin: 5px;
          text-transform: uppercase;
        }
        .label {
          color: #f7931e;
          font-weight: bold;
          font-size: 18px;
          margin: 5px 0;
        }
        .value {
          font-weight: bold;
          font-size: 20px;
          margin: 5px 0;
        }
        .bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 0 20px;
        }
        .titulo {
          font-size: 28px;
          font-weight: bold;
          color: #f7931e;
          text-transform: uppercase;
        }
        .titulo span {
          color: white;
        }
        .opcao {
          font-size: 20px;
          font-weight: bold;
          color: #fdd835;
          text-transform: uppercase;
        }
        .selo {
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
          text-transform: uppercase;
          color: #ffffff;
          margin-top: 20px;
          padding: 0 20px;
        }
        .vertical-warning {
          position: absolute;
          left: 35px;
          bottom: 35%;
          transform: rotate(-90deg);
          transform-origin: bottom left;
          font-size: 13px;
          font-weight: bold;
          text-transform: uppercase;
          color: #d32f2f;
        }
      </style>
    </head>
    <body>
      <div class="vertical-warning">
        * IMAGEM MERAMENTE ILUSTRATIVA • MARCA D'ÁGUA NÃO INCLUSA • AS CORES PODEM VARIAR EM ATÉ 20% <br/> • PODEM OCORRER VARIAÇÕES DE TAMANHO EM ATÉ 4CM
      </div>

      <img class="logo" src="/images/logos/logo.png" alt="Logo Arte Arena" />

      <div class="banner">
        <img class="uniforme" src="/images/mockups/uniforme.png" alt="Mockup Uniforme" />
      </div>

      
      <div class="footer">
      <div class="id">ID: ${form.id}</div>
        <div class="bottom-row">
          <div class="titulo">UNIFORME <span>PROFISSIONAL</span></div>
          <div class="opcao">OPÇÃO ${form.opcao}</div>
        </div>
        <div class="info-row">
          <div class="info-box"><span class="label">Gola:</span><span class="value">${form.gola}</span></div>
          <div class="info-box"><span class="label">Composição:</span><span class="value">${form.composicao}</span></div>
          <div class="info-box"><span class="label">Logo Totem:</span><span class="value">${form.logoTotem}</span></div>
        </div>
        <div class="info-row">
          <div class="info-box"><span class="label">Estampas:</span><span class="value">${form.estampa}</span></div>
          <div class="info-box"><span class="label">Escudo:</span><span class="value">${form.escudo}</span></div>
          <div class="info-box"></div>
        </div>
        <div class="selo" >
          <span>• ETIQUETA PRODUTO AUTÊNTICO</span><br/>
          <span>• SELO DE PRODUTO OFICIAL</span>
        </div>
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