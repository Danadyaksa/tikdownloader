"use client";

import React, { useState, useEffect } from "react";
import { History, Trash2, Download, Film, Image as ImageIcon, ArrowLeft, Clock } from "lucide-react";
import { HistoryItem } from "@/types/tiktok";
import { getHistory, removeFromHistory, clearHistory } from "@/utils/storage";
import { triggerDownload, downloadSequentialImages, sanitizeFilename } from "@/utils/downloadHelper";

interface HistoryViewProps {
  onBackToHome: () => void;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
  onHistoryUpdated: () => void;
}

export default function HistoryView({
  onBackToHome,
  onToast,
  onHistoryUpdated,
}: HistoryViewProps) {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistoryList(getHistory());
  }, []);

  const handleClearAll = () => {
    if (window.confirm("Apakah kamu yakin ingin menghapus semua riwayat unduhan?")) {
      clearHistory();
      setHistoryList([]);
      onHistoryUpdated();
      onToast("Semua riwayat unduhan berhasil dihapus.", "info");
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeFromHistory(id);
    setHistoryList(updated);
    onHistoryUpdated();
    onToast("Item riwayat dihapus.", "info");
  };

  const handleRedownload = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === "video" && item.playUrl) {
      const filename = `${sanitizeFilename(item.title)}_nowm.mp4`;
      triggerDownload(item.playUrl, filename, "video");
      onToast("Mengunduh ulang video...", "success");
    } else if (item.type === "image" && item.images && item.images.length > 0) {
      onToast(`Mengunduh ulang ${item.images.length} slide foto...`, "info");
      downloadSequentialImages(item.images, item.title);
    } else {
      onToast("Tautan media sudah tidak tersedia dalam riwayat.", "error");
    }
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="animate-fade-in" style={{ padding: "20px 20px 40px" }}>
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={onBackToHome}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-main)",
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-main)" }}>
            Riwayat Unduhan
          </h2>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "var(--text-muted)",
              background: "var(--bg-subtle)",
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
            }}
          >
            {historyList.length}
          </span>
        </div>

        {historyList.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "transparent",
              border: "none",
              color: "#EF4444",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <Trash2 size={14} />
            <span>Hapus Semua</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {historyList.length === 0 ? (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            background: "var(--bg-card)",
            borderRadius: "var(--radius-lg)",
            border: "1px dashed var(--border-color)",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-subtle)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              marginBottom: "14px",
            }}
          >
            <History size={28} />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "6px" }}>
            Belum Ada Riwayat
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              marginBottom: "20px",
              maxWidth: "280px",
              margin: "0 auto 20px",
            }}
          >
            Video dan foto yang kamu unduh akan tersimpan di sini agar mudah diakses kembali.
          </p>
          <button
            type="button"
            onClick={onBackToHome}
            style={{
              padding: "10px 24px",
              borderRadius: "var(--radius-md)",
              background: "var(--accent-pink)",
              color: "#FFFFFF",
              border: "none",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "var(--shadow-btn)",
            }}
          >
            Mulai Download Sekarang
          </button>
        </div>
      ) : (
        /* List Riwayat Cards */
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {historyList.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s ease",
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  background: "#161823",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                {item.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.cover}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9CA3AF",
                    }}
                  >
                    {item.type === "image" ? <ImageIcon size={20} /> : <Film size={20} />}
                  </div>
                )}
                <span
                  style={{
                    position: "absolute",
                    bottom: "3px",
                    right: "3px",
                    background: "rgba(0,0,0,0.65)",
                    color: "#FFFFFF",
                    fontSize: "9px",
                    fontWeight: "700",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  {item.type}
                </span>
              </div>

              {/* Info Postingan */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "var(--text-main)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: "3px",
                  }}
                >
                  {item.title || "Video TikTok"}
                </h4>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}
                >
                  @{item.authorName}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    color: "var(--text-light)",
                  }}
                >
                  <Clock size={11} />
                  <span>{formatDate(item.downloadDate)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {/* Re-download button */}
                <button
                  type="button"
                  onClick={(e) => handleRedownload(item, e)}
                  title="Unduh Ulang"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--accent-pink-subtle)",
                    color: "var(--accent-pink)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Download size={16} />
                </button>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  title="Hapus dari riwayat"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-full)",
                    background: "transparent",
                    color: "var(--text-muted)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
