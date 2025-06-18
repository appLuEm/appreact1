export default function VideoPlayer({ videoId }) {
  return (
    <div className="aspect-video w-full bg-black rounded shadow">
      <video controls className="w-full h-full rounded">
        <source src={`https://cdn.mystream.com/${videoId}.mp4`} type="video/mp4" />
        Tu navegador no soporta video.
      </video>
    </div>
  );
}
