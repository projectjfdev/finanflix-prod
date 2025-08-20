import VimeoClaseVivo from '@/utils/VimeoPlayer/VimeoClaseVivo';

export default async function ClaseEnVivo({ params }: { params: { id: string } }) {
  const videoId = Number(params.id);

  return (
    <div className=" bg-black m-0 p-0 overflow-hidden">
      <div className="w-full h-full">
        <VimeoClaseVivo videoId={videoId} />
      </div>
    </div>
  );
}
