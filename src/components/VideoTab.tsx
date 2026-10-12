"use client";

import React, { useState } from "react";
import { Download, Sparkles, Film, Check } from "lucide-react";
import { TikTokMediaData } from "@/types/tiktok";
import { triggerDownload, sanitizeFilename } from "@/utils/downloadHelper";

interface VideoTabProps {
  video: NonNullable<TikTokMediaData["video"]>;
  title: string;
  id: string;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function VideoTab({ video, title, id, onToast }: VideoTabProps) {
  const [downloadedState, setDownloadedState] = useState<string | null>(null);

  const handleDownloadSD = () => {
    if (!video.play) {
      onToast("Link video tidak tersedia.", "error");
      return;
    }
    const filename = `${sanitizeFilename(title)}_nowm.mp4`;
    triggerDownload(video.play, filename, "video");
    setDownloadedState("sd");
    onToast("Memulai unduhan video tanpa watermark...", "success");
  };

  const handleDownloadHD = () => {
    if (!video.hdplay) {
      onToast("Kualitas HD tidak tersedia untuk video ini.", "info");
      return;
    }
    const filename = `${sanitizeFilename(title)}_hd_nowm.mp4`;
    triggerDownload(video.hdplay, filename, "video");
    setDownloadedState("hd");
    onToast("Memulai unduhan video HD tanpa watermark...", "success");
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return ` (${mb.toFixed(1)} MB)`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Video Preview Player */}
      <div
        style={{
          width: "100%",
          maxHeight: "360px",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          background: "#000000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        }}
      >
        <video
          src={video.play}
          controls
          playsInline
          preload="metadata"
          style={{
            width: "100%",
            maxHeight: "360px",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* 1. Tombol Download No Watermark (SD/Original) */}
        <button
          type="button"
          onClick={handleDownloadSD}
          style={{
            width: "100%",
            height: "50px",
            borderRadius: "var(--radius-md)",
            background: "var(--accent-pink)",
            color: "#FFFFFF",
            border: "none",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "var(--shadow-btn)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-pink-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-pink)")}
        >
          {downloadedState === "sd" ? (
            <Check size={18} />
          ) : (
            <Download size={18} />
          )}
          <span>Download Video (No Watermark){formatSize(video.size)}</span>
        </button>

        {/* 2. Tombol Download HD (Jika ada) */}
        {video.hdplay && (
          <button
            type="button"
            onClick={handleDownloadHD}
            style={{
              width: "100%",
              height: "48px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-subtle)",
              color: "var(--text-main)",
              border: "1.5px solid var(--border-color)",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-pink)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
          >
            <Sparkles size={16} color="var(--accent-pink)" />
            <span>Download HD Quality{formatSize(video.hd_size)}</span>
          </button>
        )}
      </div>
    </div>
  );
}
