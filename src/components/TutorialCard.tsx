"use client";

import React from "react";
import { Share2, Link as LinkIcon, Download, ExternalLink } from "lucide-react";

export default function TutorialCard() {
  const handleOpenTikTok = () => {
    window.open("https://www.tiktok.com/", "_blank");
  };

  return (
    <div
      style={{
        margin: "12px 20px 20px",
        padding: "24px 20px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "18px",
          fontWeight: "800",
          color: "var(--text-main)",
          marginBottom: "4px",
        }}
      >
        Fast Watermark-Free Download
      </h2>
      <p
        style={{
          fontSize: "13px",
          color: "var(--text-muted)",
          marginBottom: "20px",
        }}
      >
        No login · No charge · No ads
      </p>

      {/* 3 Steps Visual Flow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          marginBottom: "22px",
        }}
      >
        {/* Step 1 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-main)",
              marginBottom: "8px",
            }}
          >
            <Share2 size={20} />
          </div>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-main)" }}>
            Tap share
          </span>
        </div>

        {/* Arrow connector */}
        <div style={{ color: "#D1D5DB", fontSize: "16px", fontWeight: "bold" }}>➔</div>

        {/* Step 2 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-main)",
              marginBottom: "8px",
            }}
          >
            <LinkIcon size={20} />
          </div>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-main)" }}>
            Copy link
          </span>
        </div>

        {/* Arrow connector */}
        <div style={{ color: "#D1D5DB", fontSize: "16px", fontWeight: "bold" }}>➔</div>

        {/* Step 3 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-full)",
              background: "var(--text-main)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              marginBottom: "8px",
            }}
          >
            <Download size={20} />
          </div>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-main)" }}>
            Download
          </span>
        </div>
      </div>

      {/* Button Open TikTok Copy Link */}
      <button
        type="button"
        onClick={handleOpenTikTok}
        style={{
          width: "100%",
          height: "46px",
          borderRadius: "var(--radius-md)",
          background: "linear-gradient(135deg, #FF6480 0%, #FE2C55 100%)",
          color: "#FFFFFF",
          border: "none",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          boxShadow: "0 4px 12px rgba(254, 44, 85, 0.25)",
        }}
      >
        <ExternalLink size={16} />
        <span>Open TikTok & Copy Link</span>
      </button>
    </div>
  );
}
