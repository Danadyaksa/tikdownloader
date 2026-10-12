"use client";

import React, { useState } from "react";
import { Clipboard, X, Loader2, ArrowDownToLine } from "lucide-react";

interface InputSectionProps {
  onExtract: (url: string) => Promise<void>;
  isLoading: boolean;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function InputSection({
  onExtract,
  isLoading,
  onToast,
}: InputSectionProps) {
  const [url, setUrl] = useState("");

  const handlePaste = async () => {
    try {
      if (!navigator.clipboard) {
        onToast("Fitur clipboard tidak didukung di browser ini.", "error");
        return;
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        onToast("Tautan berhasil ditempel!", "success");
      } else {
        onToast("Clipboard kosong.", "info");
      }
    } catch {
      onToast("Silakan tempel tautan secara manual (tekan tahan lalu paste).", "info");
    }
  };

  const handleClear = () => {
    setUrl("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      onToast("Harap masukkan tautan video TikTok.", "error");
      return;
    }
    onExtract(url.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "20px 20px 10px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* 1. Text Input Field di Atas */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          background: "var(--bg-input)",
          border: "2px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          transition: "all 0.2s ease",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste TikTok link here..."
          disabled={isLoading}
          style={{
            width: "100%",
            height: "52px",
            padding: "0 90px 0 16px",
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "15px",
            color: "var(--text-main)",
            fontWeight: "500",
          }}
        />

        {/* Action icons di ujung kanan input */}
        <div
          style={{
            position: "absolute",
            right: "8px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {url ? (
            <button
              type="button"
              onClick={handleClear}
              title="Hapus tautan"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                borderRadius: "var(--radius-full)",
              }}
            >
              <X size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePaste}
              title="Tempel dari Clipboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--text-main)",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <Clipboard size={14} color="var(--accent-pink)" />
              <span>Paste</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Tombol Download Besar di Bawah Tepat */}
      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        style={{
          width: "100%",
          height: "52px",
          borderRadius: "var(--radius-md)",
          background: isLoading || !url.trim() ? "#FCA5B5" : "var(--accent-pink)",
          color: "#FFFFFF",
          border: "none",
          fontSize: "16px",
          fontWeight: "700",
          cursor: isLoading || !url.trim() ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          boxShadow: isLoading || !url.trim() ? "none" : "var(--shadow-btn)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onMouseEnter={(e) => {
          if (!isLoading && url.trim()) {
            e.currentTarget.style.backgroundColor = "var(--accent-pink-hover)";
            e.currentTarget.style.boxShadow = "var(--shadow-btn-hover)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading && url.trim()) {
            e.currentTarget.style.backgroundColor = "var(--accent-pink)";
            e.currentTarget.style.boxShadow = "var(--shadow-btn)";
          }
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="spin-icon" />
            <span>Memproses Video...</span>
          </>
        ) : (
          <>
            <ArrowDownToLine size={20} />
            <span>Download</span>
          </>
        )}
      </button>
    </form>
  );
}
