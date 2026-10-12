"use client";

import React, { useState } from "react";
import { Download, Check, Loader2, Sparkles } from "lucide-react";
import { triggerDownload, downloadSequentialImages, sanitizeFilename } from "@/utils/downloadHelper";

interface ImageTabProps {
  images: string[];
  title: string;
  id: string;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function ImageTab({ images, title, id, onToast }: ImageTabProps) {
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ current: number; total: number } | null>(null);
  const [downloadedIndices, setDownloadedIndices] = useState<Set<number>>(new Set());

  const handleDownloadAll = async () => {
    if (images.length === 0) return;
    setIsBatchDownloading(true);
    setDownloadProgress({ current: 0, total: images.length });
    onToast(`Memulai unduhan ${images.length} foto langsung ke galeri...`, "info");

    try {
      await downloadSequentialImages(images, title, (current, total) => {
        setDownloadProgress({ current, total });
        setDownloadedIndices((prev) => new Set(prev).add(current - 1));
      });
      onToast(`Semua ${images.length} foto berhasil diunduh ke galeri!`, "success");
    } catch {
      onToast("Terjadi kendala saat mengunduh beberapa foto.", "error");
    } finally {
      setIsBatchDownloading(false);
      setTimeout(() => setDownloadProgress(null), 3000);
    }
  };

  const handleDownloadSingle = (imageUrl: string, index: number) => {
    const filename = `${sanitizeFilename(title)}_slide_${index + 1}.jpg`;
    triggerDownload(imageUrl, filename, "image");
    setDownloadedIndices((prev) => new Set(prev).add(index));
    onToast(`Mengunduh foto slide #${index + 1}...`, "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Tombol Utama: Unduh Semua Foto Sekaligus (Non-ZIP Langsung ke Galeri) */}
      <div
        style={{
          background: "var(--accent-pink-subtle)",
          border: "1.5px solid rgba(254, 44, 85, 0.2)",
          borderRadius: "var(--radius-md)",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: "800", color: "var(--text-main)" }}>
              {images.length} Slide Foto Ditemukan
            </h4>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Langsung tersimpan satu per satu ke Galeri Foto HP
            </p>
          </div>
          <span
            style={{
              padding: "4px 8px",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-full)",
              fontSize: "12px",
              fontWeight: "700",
              color: "var(--accent-pink)",
              border: "1px solid rgba(254, 44, 85, 0.2)",
            }}
          >
            HD Photos
          </span>
        </div>

        <button
          type="button"
          onClick={handleDownloadAll}
          disabled={isBatchDownloading}
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "var(--radius-sm)",
            background: isBatchDownloading ? "#9CA3AF" : "var(--accent-pink)",
            color: "#FFFFFF",
            border: "none",
            fontSize: "14px",
            fontWeight: "700",
            cursor: isBatchDownloading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: isBatchDownloading ? "none" : "var(--shadow-btn)",
            transition: "all 0.2s ease",
          }}
        >
          {isBatchDownloading ? (
            <>
              <Loader2 size={18} className="spin-icon" />
              <span>
                Mengunduh {downloadProgress?.current || 0} dari {downloadProgress?.total || images.length} foto...
              </span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>Unduh Semua Foto Langsung</span>
            </>
          )}
        </button>
      </div>

      {/* Grid Galeri Foto Individual */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}
      >
        {images.map((imgUrl, idx) => {
          const isDownloaded = downloadedIndices.has(idx);
          return (
            <div
              key={idx}
              style={{
                background: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Preview Image */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  position: "relative",
                  background: "#E5E7EB",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`Slide ${idx + 1}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    background: "rgba(0, 0, 0, 0.65)",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "3px 7px",
                    borderRadius: "var(--radius-full)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  #{idx + 1}
                </span>
              </div>

              {/* Action Button Per Foto */}
              <div style={{ padding: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleDownloadSingle(imgUrl, idx)}
                  style={{
                    width: "100%",
                    height: "36px",
                    borderRadius: "var(--radius-sm)",
                    background: isDownloaded ? "#ECFDF5" : "var(--bg-card)",
                    color: isDownloaded ? "#059669" : "var(--text-main)",
                    border: `1px solid ${isDownloaded ? "#A7F3D0" : "var(--border-color)"}`,
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isDownloaded ? <Check size={14} /> : <Download size={14} />}
                  <span>{isDownloaded ? "Terunduh" : "Unduh Foto"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
