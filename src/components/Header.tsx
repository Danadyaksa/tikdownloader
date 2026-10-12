"use client";

import React from "react";
import { Heart } from "lucide-react";

export default function Header() {
  return (
    <header style={{
      padding: "24px 20px 16px",
      textAlign: "center",
      borderBottom: "1px solid var(--border-subtle)",
      background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFC 100%)",
    }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "8px",
      }}>
        {/* Logo SVG dengan aksen TikTok Cyan & Pink */}
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "#161823",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(22, 24, 35, 0.15)",
          position: "relative",
          overflow: "hidden",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.31 0 .607.05.884.143V9.45a6.31 6.31 0 0 0-.884-.062 6.335 6.335 0 0 0-6.334 6.335 6.335 6.335 0 0 0 6.334 6.334 6.335 6.335 0 0 0 6.335-6.334V8.502a8.17 8.17 0 0 0 4.956 1.664V6.72c-.413-.01-.83-.021-1.2-.034Z"
              fill="#25F4EE"
            />
            <path
              d="M18.8 6.1a4.793 4.793 0 0 1-3.77-4.245V1.5h-3.445v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.31 0 .607.05.884.143V8.85a6.31 6.31 0 0 0-.884-.062 6.335 6.335 0 0 0-6.334 6.335 6.335 6.335 0 0 0 6.334 6.334 6.335 6.335 0 0 0 6.335-6.334V7.9a8.17 8.17 0 0 0 4.956 1.664V6.13c-.413-.01-.83-.021-1.2-.03Z"
              fill="#FE2C55"
              style={{ mixBlendMode: "screen" }}
            />
          </svg>
        </div>
        <h1 style={{
          fontSize: "24px",
          fontWeight: "800",
          letterSpacing: "-0.5px",
          color: "var(--text-main)",
        }}>
          Tik<span style={{ color: "var(--accent-pink)" }}>Downloader</span>
        </h1>
      </div>

      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 14px",
        borderRadius: "var(--radius-full)",
        background: "var(--accent-pink-subtle)",
        color: "var(--accent-pink)",
        fontSize: "13px",
        fontWeight: "600",
        border: "1px solid rgba(254, 44, 85, 0.15)",
      }}>
        <Heart size={14} fill="var(--accent-pink)" />
        <span>buat ikaku sayang</span>
      </div>
    </header>
  );
}
