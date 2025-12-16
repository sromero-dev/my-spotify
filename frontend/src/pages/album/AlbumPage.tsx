import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import useMusicStore from "@/stores/useMusicStore";
import usePlayerStore from "@/stores/usePlayerStore";
import { formatDuration, type Song } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause } from "lucide-react";

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  // Memoize playable Song objects so we avoid re-filtering on every interaction
  const playableSongs = useMemo(
    () =>
      currentAlbum?.songs?.filter((s): s is Song => typeof s !== "string") ??
      [],
    [currentAlbum?.songs]
  );

  // Fast lookup from id -> Song to fill in data for rows that contain only IDs
  const songMap = useMemo(
    () =>
      new Map(
        playableSongs.filter((s) => s._id).map((s) => [s._id as string, s])
      ),
    [playableSongs]
  );

  const isCurrentAlbumPlaying = useMemo(
    () => !!currentSong && playableSongs.some((s) => s._id === currentSong._id),
    [playableSongs, currentSong]
  );

  // Keep the render path consistent for hooks: do not return early before
  // declaring all hooks. Return after hooks are declared to avoid the ESLint
  // "React Hook is called conditionally" warning.
  if (isLoading) return null;

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    if (isCurrentAlbumPlaying) {
      togglePlay();
      return;
    }

    if (playableSongs.length === 0) return; // nothing to play
    playAlbum(playableSongs, 0);
  };

  // Play a specific song (accepts either a `Song` or a string id).
  const handlePlaySong = (songRef: string | Song) => {
    if (!currentAlbum) return;

    if (playableSongs.length === 0) return;

    const songId = typeof songRef === "string" ? songRef : songRef._id;
    if (!songId) return;

    const index = playableSongs.findIndex((s) => s._id === songId);
    if (index === -1) return;

    playAlbum(playableSongs, index);
  };

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
                  width={240}
                  height={240}
                  loading="lazy"
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
                onClick={handlePlayAlbum}
                size="icon"
                className="size-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
                aria-label="Play album"
                aria-disabled={playableSongs.length === 0}
                disabled={playableSongs.length === 0}
              >
                {isPlaying && isCurrentAlbumPlaying ? (
                  <Pause className="size-7 text-black" />
                ) : (
                  <Play className="size-7 text-black" />
                )}
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
                    // Resolve a Song object when the album stores only an ID
                    const resolvedSong =
                      typeof song === "string" ? songMap.get(song) : song;

                    // Compute a stable id for the row (string id or index fallback)
                    const songId =
                      typeof song === "string" ? song : song._id ?? String(id);

                    // Determine if this is the currently playing track by id
                    const isCurrentSong = currentSong?._id === songId;

                    // Derive display values from the resolved Song or fallbacks
                    const title = resolvedSong?.title ?? "Unknown title";
                    const artist = resolvedSong?.artist ?? "Unknown artist";
                    const imageUrl =
                      resolvedSong?.imageUrl ?? "/placeholder.png";
                    const createdAt = resolvedSong?.createdAt ?? "";
                    const duration = resolvedSong
                      ? formatDuration(resolvedSong.duration)
                      : "";

                    return (
                      <div
                        key={songId}
                        onClick={() => handlePlaySong(song)}
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-green-500">♬</div>
                          ) : (
                            <span className="group-hover:hidden">{id + 1}</span>
                          )}
                          {!isCurrentSong && (
                            <Play className="size-4 hidden group-hover:block" />
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={imageUrl}
                            alt={title}
                            className="size-10"
                            width={40}
                            height={40}
                            loading="lazy"
                          />

                          <div>
                            <div className="font-medium text-white">
                              {title}
                            </div>
                            <div>{artist} </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {createdAt?.split("T")[0]}
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
