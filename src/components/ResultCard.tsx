"use client";

import React, { useState } from "react";
import { Film, Image as ImageIcon, Music, RefreshCw } from "lucide-react";
import { TikTokMediaData } from "@/types/tiktok";
import VideoTab from "./VideoTab";
import ImageTab from "./ImageTab";
import MusicTab from "./MusicTab";

interface ResultCardProps {
  data: TikTokMediaData;
  onReset: () => void;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function ResultCard({ data, onReset, onToast }: ResultCardProps) {
  const [activeMediaTab, setActiveMediaTab] = useState<"video" | "image" | "music">(
    data.type === "image" ? "image" : "video"
  );
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const hasImages = Array.isArray(data.images) && data.images.length > 0;
  const hasVideo = !!data.video?.play;
  const hasMusic = !!data.music?.play;

  return (
    <div
      className="animate-fade-in"
      style={{
        margin: "12px 20px 24px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
      }}
    >
      {/* 1. Creator & Post Info Header */}
      <div
        style={{
          padding: "18px 18px 14px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Creator Avatar */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-full)",
              background: "#E5E7EB",
              overflow: "hidden",
              flexShrink: 0,
              border: "2px solid #FFFFFF",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            {data.author.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.author.avatar}
                alt={data.author.nickname}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : null}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "var(--text-main)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {data.author.nickname}
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              @{data.author.unique_id}
            </p>
          </div>
        </div>

        {/* Caption */}
        {data.title && (
          <p
            onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
            style={{
              fontSize: "13px",
              color: "var(--text-main)",
              lineHeight: "1.4",
              cursor: "pointer",
              display: "-webkit-box",
              WebkitLineClamp: isCaptionExpanded ? "unset" : 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {data.title}
          </p>
        )}
      </div>

      {/* 2. Sub-Tabs Bar (Video, Image, Music) */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border-color)",
          background: "#FAFAFA",
        }}
      >
        {hasVideo && (
          <button
            type="button"
            onClick={() => setActiveMediaTab("video")}
            style={{
              flex: 1,
              padding: "12px 8px",
              border: "none",
              borderBottom: activeMediaTab === "video" ? "2.5px solid var(--accent-pink)" : "2.5px solid transparent",
              background: activeMediaTab === "video" ? "#FFFFFF" : "transparent",
              color: activeMediaTab === "video" ? "var(--accent-pink)" : "var(--text-muted)",
              fontWeight: activeMediaTab === "video" ? "700" : "600",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            <Film size={16} />
            <span>Video</span>
          </button>
        )}

        {hasImages && (
          <button
            type="button"
            onClick={() => setActiveMediaTab("image")}
            style={{
              flex: 1,
              padding: "12px 8px",
              border: "none",
              borderBottom: activeMediaTab === "image" ? "2.5px solid var(--accent-pink)" : "2.5px solid transparent",
              background: activeMediaTab === "image" ? "#FFFFFF" : "transparent",
              color: activeMediaTab === "image" ? "var(--accent-pink)" : "var(--text-muted)",
              fontWeight: activeMediaTab === "image" ? "700" : "600",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            <ImageIcon size={16} />
            <span>Image ({data.images?.length})</span>
          </button>
        )}

        {hasMusic && (
          <button
            type="button"
            onClick={() => setActiveMediaTab("music")}
            style={{
              flex: 1,
              padding: "12px 8px",
              border: "none",
              borderBottom: activeMediaTab === "music" ? "2.5px solid var(--accent-pink)" : "2.5px solid transparent",
              background: activeMediaTab === "music" ? "#FFFFFF" : "transparent",
              color: activeMediaTab === "music" ? "var(--accent-pink)" : "var(--text-muted)",
              fontWeight: activeMediaTab === "music" ? "700" : "600",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            <Music size={16} />
            <span>Music</span>
          </button>
        )}
      </div>

      {/* 3. Tab Content */}
      <div style={{ padding: "18px" }}>
        {activeMediaTab === "video" && hasVideo && data.video && (
          <VideoTab video={data.video} title={data.title} id={data.id} onToast={onToast} />
        )}

        {activeMediaTab === "image" && hasImages && data.images && (
          <ImageTab images={data.images} title={data.title} id={data.id} onToast={onToast} />
        )}

        {activeMediaTab === "music" && hasMusic && data.music && (
          <MusicTab music={data.music} title={data.title} id={data.id} onToast={onToast} />
        )}
      </div>

      {/* 4. Reset Button */}
      <div
        style={{
          padding: "12px 18px 18px",
          borderTop: "1px solid var(--border-subtle)",
          textAlign: "center",
        }}
      >
        <button
          type="button"
          onClick={onReset}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "var(--radius-full)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-main)";
            e.currentTarget.style.backgroundColor = "var(--bg-subtle)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <RefreshCw size={14} />
          <span>Unduh Video / Konten Lain</span>
        </button>
      </div>
    </div>
  );
}
