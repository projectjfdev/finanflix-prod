// // AccessToken Finanflix
// // const accessToken = "9c36a7d9f1ea53f57a0c350b01134f96";

const accessToken = process.env.VIMEO_ACCESS_TOKEN;

export async function fetchVideoDuration(
  videoUrl: string
): Promise<number | null> {
  const videoId = videoUrl.split("/").pop();
  try {
    const response = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error("Error al obtener la duración del video");
    const data = await response.json();

    return data.duration || null;
  } catch (error) {
    console.error("Error fetching video duration:", error);
    return null;
  }
}
