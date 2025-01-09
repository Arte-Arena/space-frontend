export default async function gerarNumeroAleatorioDe4Digitos(str: string) {
    const numeroAleatorio = Math.floor(Math.random() * 10000); // Gera número entre 0 e 9999
    const numeroFormatado = String(numeroAleatorio).padStart(4, '0'); // Adiciona zeros à esquerda
    return Number(numeroFormatado);
}
