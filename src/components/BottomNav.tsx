"use client";

import React from "react";
import { Home, History } from "lucide-react";

interface BottomNavProps {
  activeTab: "home" | "history";
  onTabChange: (tab: "home" | "history") => void;
  historyCount?: number;
}

export default function BottomNav({
  activeTab,
  onTabChange,
  historyCount = 0,
}: BottomNavProps) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "520px",
        height: "68px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 50,
        padding: "0 16px",
      }}
    >
      {/* Tab Home */}
      <button
        type="button"
        onClick={() => onTabChange("home")}
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: activeTab === "home" ? "var(--accent-pink)" : "var(--text-muted)",
          transition: "color 0.2s ease",
        }}
      >
        <Home size={22} strokeWidth={activeTab === "home" ? 2.5 : 2} />
        <span
          style={{
            fontSize: "12px",
            fontWeight: activeTab === "home" ? "700" : "500",
          }}
        >
          Home
        </span>
      </button>

      {/* Tab History */}
      <button
        type="button"
        onClick={() => onTabChange("history")}
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: activeTab === "history" ? "var(--accent-pink)" : "var(--text-muted)",
          transition: "color 0.2s ease",
          position: "relative",
        }}
      >
        <div style={{ position: "relative" }}>
          <History size={22} strokeWidth={activeTab === "history" ? 2.5 : 2} />
          {historyCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-8px",
                background: "var(--accent-pink)",
                color: "#FFFFFF",
                fontSize: "10px",
                fontWeight: "700",
                padding: "2px 5px",
                borderRadius: "var(--radius-full)",
                minWidth: "16px",
                textAlign: "center",
                lineHeight: "1",
              }}
            >
              {historyCount > 99 ? "99+" : historyCount}
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: "12px",
            fontWeight: activeTab === "history" ? "700" : "500",
          }}
        >
          History
        </span>
      </button>
    </nav>
  );
}
