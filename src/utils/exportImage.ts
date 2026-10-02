import { toJpeg, toPng, toBlob } from 'html-to-image';

export interface ExportJpgOptions {
  filename?: string;
  pixelRatio?: number; // 2 is great balance of sharpness and file size (~400KB)
  quality?: number; // 0.95
}

/**
 * Clean filename to avoid forbidden OS characters
 */
export function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, '-').trim();
}

/**
 * Generate high-definition JPG data URL from a DOM element
 */
export async function generateJpgDataUrl(
  element: HTMLElement,
  options: { pixelRatio?: number; quality?: number } = {}
): Promise<string> {
  const pixelRatio = options.pixelRatio ?? 2;
  const quality = options.quality ?? 0.95;

  // Ensure all fonts are loaded
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  const exportConfig = {
    quality,
    pixelRatio,
    backgroundColor: '#ffffff',
    cacheBust: true,
    style: {
      transform: 'none',
      margin: '0',
    },
  };

  try {
    return await toJpeg(element, exportConfig);
  } catch (err) {
    console.warn('First attempt failed, retrying with skipFonts: true', err);
    return await toJpeg(element, { ...exportConfig, skipFonts: true });
  }
}

/**
 * Download DOM element directly as a JPG file
 */
export async function downloadElementAsJpg(
  element: HTMLElement,
  filename: string,
  options: { pixelRatio?: number; quality?: number } = {}
): Promise<string> {
  const dataUrl = await generateJpgDataUrl(element, options);

  const link = document.createElement('a');
  link.download = filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? filename : `${filename}.jpg`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return dataUrl;
}

/**
 * Copy element image to system clipboard (uses PNG format required by browser Clipboard API)
 */
export async function copyElementImageToClipboard(
  element: HTMLElement,
  pixelRatio = 2
): Promise<boolean> {
  if (!navigator.clipboard || !window.ClipboardItem) {
    throw new Error('เบราว์เซอร์ไม่รองรับการคัดลอกรูปภาพลงคลิปบอร์ดโดยตรง');
  }

  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  const blob = await toBlob(element, {
    pixelRatio,
    backgroundColor: '#ffffff',
    cacheBust: true,
  });

  if (!blob) {
    throw new Error('ไม่สามารถแปลงรูปภาพได้');
  }

  const item = new ClipboardItem({ 'image/png': blob });
  await navigator.clipboard.write([item]);
  return true;
}
