import { HistoryItem } from "@/types/tiktok";

const STORAGE_KEY = "tikdown_history_v1";
const MAX_HISTORY_ITEMS = 30;

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Gagal membaca riwayat unduhan:", e);
    return [];
  }
}

export function saveToHistory(item: HistoryItem): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    // Hapus jika sudah pernah ada ID yang sama agar posisinya naik ke paling atas
    const filtered = history.filter((h) => h.id !== item.id);
    const updated = [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Gagal menyimpan riwayat:", e);
  }
}

export function removeFromHistory(id: string): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const history = getHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Gagal menghapus item riwayat:", e);
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Gagal membersihkan riwayat:", e);
  }
}
