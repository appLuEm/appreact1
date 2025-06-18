// src/components/VideoPlayerWrapper.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function VideoPlayerWrapper() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setVideo(data);
      } else {
        console.error("Error al cargar el video:", error.message);
      }
    };

    fetchVideo();
  }, [id]);

  if (!video) return <p className="text-white">Cargando...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">{video.title}</h2>
      <video controls className="w-full rounded shadow">
        <source src={video.video_url} type="video/mp4" />
        Tu navegador no soporta video.
      </video>
      {video.description && (
        <p className="mt-4 text-gray-300">{video.description}</p>
      )}
    </div>
  );
}
