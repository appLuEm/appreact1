import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib";

export default function VideoPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  async function fetchVideo() {
    try {
      // 1. Buscar en episodios
      let { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('id', id)
        .single();
      // 2. Si no se encuentra, buscar en videos
      if (error || !data) {
        ({ data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', id)
          .single());
      }
      if (error) throw error;
      setVideo(data);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-2xl">Video no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-white transition-colors"
        >
          ← Volver
        </button>

        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden mb-6">
          <video
            src={video.video_url || video.url}
            controls
            className="w-full h-full"
            poster={video.thumbnail}
          />
        </div>

        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
          <p className="text-gray-300 mb-6">{video.description}</p>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
              {video.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
