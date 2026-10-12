import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaUrl = searchParams.get("url");
    const rawFilename = searchParams.get("filename") || "tiktok_download";
    const mediaType = searchParams.get("type") || "video";

    if (!mediaUrl) {
      return NextResponse.json(
        { error: "Parameter url diperlukan." },
        { status: 400 }
      );
    }

    // Bersihkan nama file dari karakter ilegal
    const safeFilename = rawFilename
      .replace(/[/\\?%*:|"<>]/g, "_")
      .trim();

    // Fetch upstream media stream
    const upstreamRes = await fetch(mediaUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.tiktok.com/",
      },
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      return NextResponse.json(
        { error: "Gagal mengunduh media dari CDN TikTok." },
        { status: upstreamRes.status || 502 }
      );
    }

    // Tentukan mime type default
    let contentType = upstreamRes.headers.get("content-type");
    if (!contentType || contentType === "application/octet-stream") {
      if (mediaType === "audio" || safeFilename.endsWith(".mp3")) {
        contentType = "audio/mpeg";
      } else if (mediaType === "image" || safeFilename.endsWith(".jpg") || safeFilename.endsWith(".jpeg")) {
        contentType = "image/jpeg";
      } else {
        contentType = "video/mp4";
      }
    }

    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(safeFilename)}"`);
    headers.set("Content-Type", contentType);
    
    const contentLength = upstreamRes.headers.get("content-length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    // Alirkan stream langsung ke client
    return new Response(upstreamRes.body, {
      status: 200,
      headers,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: "Gagal memproses streaming unduhan: " + (error?.message || "Internal error") },
      { status: 500 }
    );
  }
}
