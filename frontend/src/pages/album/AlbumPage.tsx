import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useMusicStore from "@/stores/useMusicStore";
import { formatDuration } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, Play } from "lucide-react";

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  if (isLoading) return null;

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        {/* Main content */}
        <div className="relative min-h-full">
          {/* bg gradient */}
          <div
            className="absolute inset-0 bg-linear-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-0 pointer-events-none"
            aria-hidden="true"
          >
            {/* Content */}
            <div className="relative z-10">
              <div className="flex p-6 gap-6 pb-8">
                <img
                  src={currentAlbum?.imageUrl}
                  alt={currentAlbum?.title}
                  className="size-60 shadow-xl rounded"
                />
                <div className="flex flex-col justify-end">
                  <p className="text-sm font-medium">Album</p>
                  <h1 className="text-7xl font-bold my-4">
                    {currentAlbum?.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-zinc-100">
                    <span className="font-medium text-white">
                      {currentAlbum?.artist}
                    </span>
                    <span>• {currentAlbum?.songs?.length} songs</span>
                    <span>• {currentAlbum?.year}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                size="icon"
                className="size-14 roundend-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
              >
                <Play className="size-7 text-black" />
              </Button>
            </div>

            {/* Songs Table */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* Table Header */}
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Release date</div>
                <div>
                  <Clock className="size-4" />
                </div>
              </div>

              {/* Table Rows */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs?.map((song, id) => {
                    const songId = typeof song === "string" ? song : song._id;
                    const title =
                      typeof song === "string" ? "Unknown title" : song.title;
                    const artist =
                      typeof song === "string" ? "Unknown artist" : song.artist;
                    const imageUrl =
                      typeof song === "string"
                        ? "Unknown title"
                        : song.imageUrl;
                    const year = typeof song === "string" ? "" : song.createdAt;
                    const duration =
                      typeof song === "string"
                        ? ""
                        : formatDuration(song.duration);

                    return (
                      <div
                        key={songId}
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          <span className="group-hover:hidden">{id + 1}</span>
                          <Play className="size-4 hidden group-hover:block" />
                        </div>

                        <div className="flex items-center gap-3">
                          <img src={imageUrl} alt={title} className="size-10" />

                          <div>
                            <div className="font-medium text-white">
                              {title}
                            </div>
                            <div>{artist} </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {year?.split("T")[0]}
                        </div>
                        <div className="flex items-center">{duration}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;
