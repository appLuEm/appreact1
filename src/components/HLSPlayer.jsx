// src/components/HLSPlayer.jsx
import React, { useRef } from "react";

export default function HLSPlayer({ video }) {
  const videoRef = useRef(null);

  if (!video?.url) {
    return <div>No hay URL de video disponible</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-[40vh] md:h-[50vh] object-contain bg-black rounded-lg"
        controls
        autoPlay
        poster={video.thumbnail || ""}
        controlsList="nodownload"
        onContextMenu={e => e.preventDefault()}
      >
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  );
}
