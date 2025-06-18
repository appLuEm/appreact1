// src/components/HeroBanner.jsx
import { useTranslation } from "react-i18next";

export default function HeroBanner({ video }) {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-[75vh] bg-black">
      <img
        src={video.image_url}
        alt={video.title}
        className="w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{video.title}</h1>
        <p className="text-lg md:text-xl max-w-2xl">{video.description}</p>
      </div>
    </div>
  );
}
