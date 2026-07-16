import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Laptop2, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
    const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();

    const [volume, setVolume] = useState(10);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = document.querySelector("audio");

        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);

        const handleEnded = () => {
            usePlayerStore.setState({ isPlaying: false });
        };

        audio.addEventListener("ended", handleEnded);

        return () => {
            setCurrentTime(0);
            setDuration(0);
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [currentSong]);

    const handleSeek = (value: number | readonly number[]) => {
        const newValue = Array.isArray(value) ? value[0] : value;
        setCurrentTime(newValue);
        if (audioRef.current) {
            audioRef.current.currentTime = newValue;
        }
    };

    const handleVolumeChange = (value: number | readonly number[]) => {
        const newValue = Array.isArray(value) ? value[0] : value;
        setVolume(newValue);
        if (audioRef.current) {
            audioRef.current.volume = newValue / 100;
        }
    };

    return (
        <footer className='h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4'>
            <div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
                {/* currently playing song */}
                <div className='hidden sm:flex items-center gap-4 min-w-45 w-[30%]'>
                    {currentSong && (
                        <>
                            <img
                                src={currentSong.imageUrl}
                                alt={currentSong.title}
                                className='w-14 h-14 object-cover rounded-md'
                            />
                            <div className='flex-1 min-w-0'>
                                <div className='font-medium truncate hover:underline cursor-pointer'>
                                    {currentSong.title}
                                </div>
                                <div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
                                    {currentSong.artist}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* player controls*/}
                <div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
                    <div className='flex items-center gap-4 sm:gap-6'>
                        <Button
                            size='icon'
                            variant='link'
                            className='hidden sm:inline-flex hover:scale-125 text-zinc-400'
                        >
                            <Shuffle fill="#9f9fa9" className='h-4 w-4' />
                        </Button>

                        <Button
                            size='icon'
                            variant='link'
                            className='hover:scale-125 text-zinc-400'
                            onClick={playPrevious}
                            disabled={!currentSong}
                        >
                            <SkipBack fill="#9f9fa9" className='h-4 w-4' />
                        </Button>

                        <Button
                            size='icon'
                            variant='link'
                            className='bg-white hover:scale-125 text-black rounded-full h-8 w-8'
                            onClick={togglePlay}
                            disabled={!currentSong}
                        >
                            {isPlaying ? <Pause fill="#000" className='h-5 w-5' /> : <Play fill="#000" className='h-5 w-5' />}
                        </Button>
                        <Button
                            size='icon'
                            variant='link'
                            className='hover:scale-125 text-zinc-400'
                            onClick={playNext}
                            disabled={!currentSong}
                        >
                            <SkipForward fill="#9f9fa9" className='h-4 w-4' />
                        </Button>
                        <Button
                            size='icon'
                            variant='link'
                            className='hidden sm:inline-flex hover:scale-125 text-zinc-400'
                        >
                            <Repeat fill="#9f9fa9" className='h-4 w-4' />
                        </Button>
                    </div>

                    <div className='hidden sm:flex items-center gap-2 w-full'>
                        <div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
                        <Slider
                            value={[currentTime]}
                            max={duration || 100}
                            step={1}
                            className='w-full hover:cursor-grab active:cursor-grabbing'
                            onValueChange={handleSeek}
                            disabled={!currentSong}
                        />
                        <div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
                    </div>
                </div>
                {/* volume controls */}
                <div className='hidden sm:flex items-center gap-4 min-w-45 w-[30%] justify-end'>
                    <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
                        <Mic2 className='h-4 w-4' />
                    </Button>
                    <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
                        <ListMusic className='h-4 w-4' />
                    </Button>
                    <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
                        <Laptop2 className='h-4 w-4' />
                    </Button>

                    <div className='flex items-center gap-2 w-40'>
                        <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
                            <Volume1 className='h-4 w-4' />
                        </Button>

                        <Slider
                            value={volume}
                            max={100}
                            min={0}
                            step={1}
                            className='w-40 hover:cursor-grab active:cursor-grabbing'
                            onValueChange={handleVolumeChange}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};