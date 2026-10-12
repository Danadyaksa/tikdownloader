"use client";

import React, { useState } from "react";
import { Music, Download, Check } from "lucide-react";
import { TikTokMediaData } from "@/types/tiktok";
import { triggerDownload, sanitizeFilename } from "@/utils/downloadHelper";

interface MusicTabProps {
  music: NonNullable<TikTokMediaData["music"]>;
  title: string;
  id: string;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function MusicTab({ music, title, id, onToast }: MusicTabProps) {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownloadMusic = () => {
    if (!music.play) {
      onToast("Link audio tidak tersedia.", "error");
      return;
    }
    const filename = `${sanitizeFilename(music.title || title)}_audio.mp3`;
    triggerDownload(music.play, filename, "audio");
    setIsDownloaded(true);
    onToast("Memulai unduhan audio MP3...", "success");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        background: "var(--bg-subtle)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Audio Info Card */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "var(--radius-sm)",
            background: "#161823",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-cyan)",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {music.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={music.cover}
              alt={music.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Music size={24} />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "var(--text-main)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {music.title || "Original Sound"}
          </h4>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {music.author || "TikTok Creator"}
          </p>
        </div>
      </div>

      {/* Audio HTML5 Player */}
      <div style={{ width: "100%" }}>
        <audio
          src={music.play}
          controls
          preload="metadata"
          style={{
            width: "100%",
            height: "44px",
            borderRadius: "var(--radius-sm)",
          }}
        />
      </div>

      {/* Download Audio Button */}
      <button
        type="button"
        onClick={handleDownloadMusic}
        style={{
          width: "100%",
          height: "48px",
          borderRadius: "var(--radius-md)",
          background: "var(--accent-pink)",
          color: "#FFFFFF",
          border: "none",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          boxShadow: "var(--shadow-btn)",
          transition: "all 0.2s ease",
        }}
      >
        {isDownloaded ? <Check size={18} /> : <Download size={18} />}
        <span>Download Audio (MP3)</span>
      </button>
    </div>
  );
}
