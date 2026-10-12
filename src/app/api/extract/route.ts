import { NextRequest, NextResponse } from "next/server";
import { ExtractApiResponse, TikTokMediaData } from "@/types/tiktok";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json<ExtractApiResponse>(
        { success: false, error: "Mohon masukkan tautan video TikTok." },
        { status: 400 }
      );
    }

    const trimmedUrl = rawUrl.trim();

    // Validasi domain TikTok (tiktok.com, tiktokv.com, douyin.com, dll)
    const tiktokRegex = /(tiktok\.com|tiktokv\.com|douyin\.com)/i;
    if (!tiktokRegex.test(trimmedUrl)) {
      return NextResponse.json<ExtractApiResponse>(
        {
          success: false,
          error: "Tautan tidak valid. Pastikan tautan berasal dari aplikasi atau web TikTok (tiktok.com).",
        },
        { status: 400 }
      );
    }

    // Panggil TikWM API
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(trimmedUrl)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json<ExtractApiResponse>(
        {
          success: false,
          error: "Gagal menghubungi server ekstraksi TikTok. Silakan coba sesaat lagi.",
        },
        { status: 502 }
      );
    }

    const json = await res.json();

    if (json.code !== 0 || !json.data) {
      const msg = json.msg || "Gagal memproses tautan TikTok.";
      let userFriendlyMsg = msg;
      
      if (msg.includes("Free Api Limit")) {
        userFriendlyMsg = "Batas permintaan server sedang penuh. Silakan coba kembali 1 menit lagi.";
      } else if (msg.includes("Url parsing is failed") || msg.includes("invalid")) {
        userFriendlyMsg = "Video tidak ditemukan atau bersifat privat. Pastikan tautan benar dan video masih tersedia di TikTok.";
      }

      return NextResponse.json<ExtractApiResponse>(
        { success: false, error: userFriendlyMsg },
        { status: 422 }
      );
    }

    const item = json.data;
    const isPhotoAlbum = Array.isArray(item.images) && item.images.length > 0;

    const formattedData: TikTokMediaData = {
      id: item.id || String(Date.now()),
      title: item.title || "Video TikTok",
      cover: item.cover || item.origin_cover || (isPhotoAlbum ? item.images[0] : ""),
      duration: item.duration || 0,
      author: {
        id: item.author?.id || "",
        unique_id: item.author?.unique_id || "kreator",
        nickname: item.author?.nickname || item.author?.unique_id || "TikTok User",
        avatar: item.author?.avatar || "",
      },
      type: isPhotoAlbum ? "image" : "video",
      video: !isPhotoAlbum
        ? {
            play: item.play || "",
            hdplay: item.hdplay || undefined,
            wmplay: item.wmplay || undefined,
            size: item.size || 0,
            hd_size: item.hd_size || 0,
          }
        : undefined,
      images: isPhotoAlbum ? item.images : undefined,
      music: item.music
        ? {
            id: item.music_info?.id,
            title: item.music_info?.title || "Suara Asli",
            author: item.music_info?.author || item.author?.nickname || "TikTok",
            play: item.music,
            cover: item.music_info?.cover,
            duration: item.music_info?.duration,
          }
        : undefined,
    };

    return NextResponse.json<ExtractApiResponse>({
      success: true,
      data: formattedData,
    });
  } catch (err: unknown) {
    const error = err as Error;
    const isAbort = error?.name === "AbortError";
    return NextResponse.json<ExtractApiResponse>(
      {
        success: false,
        error: isAbort
          ? "Waktu permintaan habis (timeout). Koneksi ke TikTok lambat, silakan coba lagi."
          : "Terjadi kesalahan internal saat memproses video.",
      },
      { status: 500 }
    );
  }
}
