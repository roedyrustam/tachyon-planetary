import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize2, Settings, Loader2 } from 'lucide-react';
import Button from './Button';

interface HLSPlayerProps {
    url: string;
    autoPlay?: boolean;
    className?: string;
    poster?: string;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({
    url,
    autoPlay = false,
    className = "",
    poster
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [qualityLevels, setQualityLevels] = useState<{ id: number; height: number; bitrate: number }[]>([]);
    const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 is auto

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls | null = null;

        const initPlayer = () => {
            setIsLoading(true);
            setHasError(false);

            if (Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });

                hls.loadSource(url);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
                    setIsLoading(false);
                    const levels = data.levels.map((level, index) => ({
                        id: index,
                        height: level.height,
                        bitrate: level.bitrate
                    }));
                    setQualityLevels(levels);
                    if (autoPlay) video.play().catch(() => { });
                });

                hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
                    setCurrentQuality(data.level);
                });

                hls.on(Hls.Events.ERROR, (_, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                hls?.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                hls?.recoverMediaError();
                                break;
                            default:
                                setHasError(true);
                                setIsLoading(false);
                                hls?.destroy();
                                break;
                        }
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                video.src = url;
                video.addEventListener('loadedmetadata', () => {
                    setIsLoading(false);
                    if (autoPlay) video.play().catch(() => { });
                });
                video.addEventListener('error', () => {
                    setHasError(true);
                    setIsLoading(false);
                });
            } else {
                setHasError(true);
                setIsLoading(false);
            }
        };

        initPlayer();

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [url, autoPlay]);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(() => { });
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = () => {
        if (!videoRef.current) return;
        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        }
    };

    return (
        <div className={`relative group aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl ${className}`}>
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                poster={poster}
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex-center bg-black/40 backdrop-blur-sm z-10">
                    <Loader2 size={48} className="text-primary animate-spin" />
                </div>
            )}

            {/* Error Overlay */}
            {hasError && (
                <div className="absolute inset-0 flex-center flex-col bg-black/80 z-20 p-6 text-center">
                    <p className="text-danger font-bold mb-2">STREAM ERROR</p>
                    <p className="text-xs text-muted max-w-[200px]">Failed to load HLS manifest or hardware not supported.</p>
                </div>
            )}

            {/* Controls Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex-between gap-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            iconOnly
                            className="bg-white/10 border-none rounded-lg hover:bg-white/20 h-8 w-8"
                            onClick={togglePlay}
                            icon={isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
                        />
                        <Button
                            variant="secondary"
                            iconOnly
                            className="bg-white/10 border-none rounded-lg hover:bg-white/20 h-8 w-8"
                            onClick={toggleMute}
                            icon={isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        {qualityLevels.length > 0 && (
                            <div className="relative group/quality">
                                <button className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md border border-white/10 text-[10px] font-mono hover:bg-white/10 transition-colors">
                                    <Settings size={12} />
                                    {currentQuality === -1 ? 'AUTO' : `${qualityLevels[currentQuality]?.height}p`}
                                </button>
                            </div>
                        )}
                        <Button
                            variant="secondary"
                            iconOnly
                            className="bg-white/10 border-none rounded-lg hover:bg-white/20 h-8 w-8"
                            onClick={toggleFullscreen}
                            icon={<Maximize2 size={16} />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HLSPlayer;
