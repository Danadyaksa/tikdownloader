"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import InputSection from "@/components/InputSection";
import TutorialCard from "@/components/TutorialCard";
import ResultCard from "@/components/ResultCard";
import HistoryView from "@/components/HistoryView";
import BottomNav from "@/components/BottomNav";
import { TikTokMediaData, ExtractApiResponse, HistoryItem } from "@/types/tiktok";
import { saveToHistory, getHistory } from "@/utils/storage";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function Home() {
  const [activeNav, setActiveNav] = useState<"home" | "history">("home");
  const [mediaData, setMediaData] = useState<TikTokMediaData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Load history count on mount
  useEffect(() => {
    updateHistoryCount();
  }, []);

  const updateHistoryCount = () => {
    const list = getHistory();
    setHistoryCount(list.length);
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleExtract = async (url: string) => {
    setIsLoading(true);
    setMediaData(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const json: ExtractApiResponse = await res.json();

      if (!res.ok || !json.success || !json.data) {
        showToast(json.error || "Gagal memproses video TikTok.", "error");
        return;
      }

      setMediaData(json.data);
      showToast("Video berhasil diekstrak tanpa watermark!", "success");

      // Simpan ke Riwayat secara otomatis
      const historyItem: HistoryItem = {
        id: json.data.id,
        title: json.data.title,
        cover: json.data.cover,
        authorName: json.data.author.nickname,
        authorAvatar: json.data.author.avatar,
        type: json.data.type,
        downloadDate: Date.now(),
        playUrl: json.data.video?.play,
        hdPlayUrl: json.data.video?.hdplay,
        images: json.data.images,
        musicUrl: json.data.music?.play,
      };

      saveToHistory(historyItem);
      updateHistoryCount();
    } catch {
      showToast("Terjadi kesalahan koneksi internet. Silakan coba lagi.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMediaData(null);
  };

  return (
    <div className="app-container">
      {/* Toast Notification Alert */}
      {toast && (
        <div className={`toast-container toast-${toast.type}`}>
          {toast.type === "success" && <CheckCircle2 size={18} />}
          {toast.type === "error" && <AlertCircle size={18} />}
          {toast.type === "info" && <Info size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Content Pages */}
      {activeNav === "home" ? (
        <>
          <Header />

          {/* Form Input URL + Tombol Download Tepat di Bawahnya */}
          <InputSection
            onExtract={handleExtract}
            isLoading={isLoading}
            onToast={showToast}
          />

          {/* Tampilan Hasil jika ada, atau Kartu Panduan jika belum ada hasil */}
          {mediaData ? (
            <ResultCard
              data={mediaData}
              onReset={handleReset}
              onToast={showToast}
            />
          ) : (
            <TutorialCard />
          )}
        </>
      ) : (
        <HistoryView
          onBackToHome={() => setActiveNav("home")}
          onToast={showToast}
          onHistoryUpdated={updateHistoryCount}
        />
      )}

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeNav}
        onTabChange={(tab) => {
          setActiveNav(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        historyCount={historyCount}
      />
    </div>
  );
}
