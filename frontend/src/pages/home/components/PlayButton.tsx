import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore"
import type { Song } from "@/types"
import { Pause, Play } from "lucide-react";


const PlayButton = ({ song }: { song: Song }) => {
    const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
    const isCurrentSong = currentSong?._id === song._id;

    const handlePlay = () => {
        if (isCurrentSong) togglePlay();
        else setCurrentSong(song);
    }

    return (
        <Button size={"default"} onClick={handlePlay} className={`absolute bottom-2 right-2 bg-green-500 hover:bg-green-400 hover:scale-105
            transition-all w-9 h-9 rounded-full opacity-0 translate-y-2 group-hover:translate-y-0
            ${isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
            {isCurrentSong && isPlaying ? (
                <Pause fill="#000000" className='size-4 text-black' />
            ) : (
                <Play fill="#000000" className='size-4 text-black' />
            )}
        </Button>
    )
}

export default PlayButton