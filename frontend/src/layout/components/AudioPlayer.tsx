import { useEffect, useRef } from "react"
import { usePlayerStore } from "@/stores/usePlayerStore";


const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<string | null>(null);

    const { currentSong, isPlaying, playNext } = usePlayerStore();

    //  Handel play/pause logic
    useEffect(() => {
        if (isPlaying) audioRef.current?.play();
        else audioRef.current?.pause();
    }, [isPlaying])

    //Handle song end
    useEffect(() => {
        const audio = audioRef.current;

        const handleSongEnded = () => {
            playNext();
        }

        audio?.addEventListener('ended', handleSongEnded);
        return () => audio?.removeEventListener('ended', handleSongEnded);
    }, [playNext]);

    //  Handle song change
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;

        const audio = audioRef.current;

        //  Check if this is actually a new song
        const isSongChanged = prevSongRef.current !== currentSong?.audioUrl;
        if (isSongChanged) {
            audio.src = currentSong.audioUrl;

            //  Reset the playback position
            audio.currentTime = 0;

            prevSongRef.current = currentSong?.audioUrl;

            if (isPlaying) audio.play();
        }
    }, [currentSong, isPlaying]);

    return <audio ref={audioRef} />
}

export default AudioPlayer