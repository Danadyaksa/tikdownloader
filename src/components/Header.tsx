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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px",
    }}>
      {/* Baris Atas: Logo & TikDownloader */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
      }}>
        {/* Logo Gambar Aplikasi Transparan */}
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 16px rgba(254, 44, 85, 0.25)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="TikDownloader Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
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

      {/* Baris Bawah: Tepat di Bawah TikDownloader */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 14px",
        borderRadius: "var(--radius-full)",
        background: "var(--accent-pink-subtle)",
        color: "var(--accent-pink)",
        fontSize: "12px",
        fontWeight: "600",
        border: "1px solid rgba(254, 44, 85, 0.15)",
      }}>
        <Heart size={13} fill="var(--accent-pink)" />
        <span>punya ikaku</span>
      </div>
    </header>
  );
}
