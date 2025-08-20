"use client";
import { useEffect, useState } from "react";

interface VideoData {
  duration: string;
}

interface VideoError {
  error: string;
}

const useGetVideo = (videoId: string | number) => {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<VideoError | null>(null);

  const fetchVideoDuration = async () => {
    try {
      const response = await fetch(`/api/video?videoId=${videoId}`);
      const data: VideoData | VideoError = await response.json();

      if (response.ok) {
        setVideoData(data as VideoData);
      } else {
        setError(data as VideoError);
      }
    } catch (error) {
      setError({ error: "Error al obtener la duración" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchVideoDuration();
    }
  }, [videoId]);

  return { videoData, loading, error };
};

export default useGetVideo;
