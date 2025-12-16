import usePlayerStore from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

/**
 * AudioPlayer
 *
 * A hidden HTMLAudioElement driven by the global player store (`usePlayerStore`).
 * Responsibilities:
 * - Keep the audio element in sync with `isPlaying` (play / pause).
 * - Listen for the `ended` event and call `playNext` when the current track finishes.
 * - Detect track changes (via `currentSong.audioUrl`) and update the audio source
 *   safely (clearing the src when a song has no URL), resetting playback time,
 *   and optionally starting playback if `isPlaying` is true.
 */
const AudioPlayer = () => {
  // Reference to the underlying <audio> element used for playback control
  const audioRef = useRef<HTMLAudioElement>(null);

  // Keep the previous audio URL here so we can detect when the source changes.
  // Use `string | null` so it never becomes `undefined` when a song has no URL.
  const prevSongRef = useRef<string | null>(null);

  // Values from the centralized player store
  const { currentSong, isPlaying, playNext } = usePlayerStore();

  // Sync play/pause state with the audio element when `isPlaying` changes.
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // Register a one-time event listener for when playback ends, and ensure
  // cleanup to avoid duplicate listeners on re-render.
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      // Ask the player store to advance to the next track
      playNext();
    };

    audio?.addEventListener("ended", handleEnded);

    return () => audio?.removeEventListener("ended", handleEnded);
  }, [playNext]);

  // React to changes in `currentSong` (or `isPlaying` while switching tracks):
  // - Detect if the audio URL changed using `prevSongRef`.
  // - Set `audio.src` only when we have a URL; otherwise clear it and call
  //   `audio.load()` to ensure the element has no source.
  // - Reset `currentTime` so playback starts from the beginning of the track.
  // - Store the last seen URL in `prevSongRef` (always `string` or `null`).
  // - If the player is currently in the playing state, start playback.
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    const audioUrl = currentSong.audioUrl;

    const isSongChanged = prevSongRef.current !== audioUrl;

    if (isSongChanged) {
      // Assign or clear the audio source depending on availability
      if (audioUrl) {
        audio.src = audioUrl;
      } else {
        // If no URL is provided, ensure the audio element has no source
        audio.removeAttribute("src");
        audio.load();
      }

      // Always reset playback position when a new track is selected
      audio.currentTime = 0;

      // Store the last seen URL, using null to represent the absence of a URL
      prevSongRef.current = audioUrl ?? null;
      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  // A hidden audio element — UI controls are provided elsewhere and the
  // element is controlled programmatically via refs and the player store.
  return <audio ref={audioRef} />;
};

export default AudioPlayer;
