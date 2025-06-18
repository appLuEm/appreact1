// src/components/SmartPlayer.jsx
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import shaka from "shaka-player";

export default function SmartPlayer({ video }) {
  const videoRef = useRef();

  useEffect(() => {
    const player = videoRef.current;
    const url = video.url;

    if (!player || !url) return;

    if (url.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(player);
        return () => hls.destroy();
      } else if (player.canPlayType("application/vnd.apple.mpegurl")) {
        player.src = url;
      }
    } else if (url.endsWith(".mpd")) {
      const shakaPlayer = new shaka.Player(player);
      shakaPlayer.load(url).catch((error) => {
        console.error("Error cargando DASH:", error);
      });
      return () => shakaPlayer.destroy();
    } else {
      player.src = url;
    }
  }, [video]);

  return (
    <div className="aspect-video w-full rounded overflow-hidden shadow">
      <video
        ref={videoRef}
        controls
        autoPlay
        className="w-full h-full bg-black rounded"
      />
    </div>
  );
}
