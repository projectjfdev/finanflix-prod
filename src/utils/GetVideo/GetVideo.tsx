'use client';
import React, { useEffect, useState } from 'react';

const GetVideo = () => {
  const [videoData, setVideoData] = useState(null);
  const videoId = '1022325100'; // ID del video que quieres consultar

  const fetchVideoDuration = async () => {
    try {
      const response = await fetch(`/api/video?videoId=${videoId}`);
      const data = await response.json();

      if (response.ok) {
        setVideoData(data);
      } else {
        console.error('Error al obtener la duración:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchVideoDuration();
  }, []);

  return <div></div>;
};

export default GetVideo;
