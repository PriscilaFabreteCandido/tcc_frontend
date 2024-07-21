import { Buffer } from "buffer";

export const convertBase64ToByteArray = (base64String: string): Uint8Array => {
  // Verifica e remove o prefixo 'data:' da string Base64, se presente
  const base64Content = base64String.split(',')[1] || base64String;

  // Converte a string Base64 para um ArrayBuffer
  const binaryString = window.atob(base64Content);

  // Cria um array de bytes a partir do ArrayBuffer
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  return byteArray;
};

export const convertFileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const byteArray = new Uint8Array(arrayBuffer);
      const base64String = Buffer.from(byteArray).toString('base64'); // Convert byte array to Base64 string

      resolve({
        conteudo: base64String,
        nome: file.name,
        tipo: file.type,
      });
    };

    reader.onerror = (error) => reject(error);
  });
};


