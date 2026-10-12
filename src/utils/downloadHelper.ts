/**
 * Memulai pengunduhan file melalui route handler streaming proxy internal
 */
export function triggerDownload(
  url: string,
  filename: string,
  type: "video" | "audio" | "image" = "video"
): void {
  if (typeof window === "undefined") return;

  const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(
    filename
  )}&type=${type}`;

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Membersihkan judul agar cocok digunakan sebagai nama file
 */
export function sanitizeFilename(title: string, maxLength = 30): string {
  const clean = title
    .replace(/[/\\?%*:|"<>#]/g, "")
    .replace(/\s+/g, "_")
    .trim();
  return (clean.slice(0, maxLength) || "tiktok_download");
}

/**
 * Mengunduh seluruh slide foto satu per satu secara berurutan
 * agar langsung tersimpan ke Galeri Foto HP tanpa perlu diekstrak dari format ZIP
 */
export async function downloadSequentialImages(
  images: string[],
  baseTitle: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const safeBase = sanitizeFilename(baseTitle, 25);
  const total = images.length;

  for (let i = 0; i < total; i++) {
    const filename = `${safeBase}_slide_${i + 1}.jpg`;
    triggerDownload(images[i], filename, "image");

    if (onProgress) {
      onProgress(i + 1, total);
    }

    // Jeda 350ms antar unduhan agar browser HP tidak mencegat multiple download
    if (i < total - 1) {
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }
}
