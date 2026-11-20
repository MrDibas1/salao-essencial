/**
 * Utilitário para compressão e redimensionamento client-side de imagens.
 * Transforma fotos de câmeras de alta resolução (5MB-10MB) em imagens otimizadas (~70KB-120KB)
 * para salvar com segurança no localStorage e sincronizar velozmente no Cloudflare D1.
 */

export interface CompressionOptions {
  maxDimension?: number; // Largura ou altura máxima (padrão: 1024px)
  quality?: number;      // Qualidade JPEG de 0.1 a 1.0 (padrão: 0.82)
  mimeType?: string;     // Padrão: 'image/jpeg'
}

export async function compressImageFile(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxDimension = 1024,
    quality = 0.82,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        return reject(new Error('Falha ao ler o arquivo de imagem'));
      }

      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calcula novas dimensões mantendo a proporção
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Contexto 2D do Canvas indisponível'));
        }

        // Fundo branco para garantir que transparências de PNGs não fiquem pretas no JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Suavização de imagem
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Desenha a imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(compressedDataUrl);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error('Não foi possível carregar a imagem para processamento'));
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      reject(new Error('Erro na leitura do arquivo'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Retorna o tamanho aproximado em KB a partir de uma Data URL em Base64.
 */
export function estimateDataUrlSizeKb(dataUrl: string): number {
  if (!dataUrl) return 0;
  const stringLength = dataUrl.length - (dataUrl.indexOf(',') + 1);
  const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383;
  return Math.round(sizeInBytes / 1024);
}
