import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Radio, Users, Activity, Settings, Maximize2, Mic, MicOff, Video as VidIcon, VideoOff, PlaySquare, SkipForward, Globe, Volume2, VolumeX, Monitor, Grid, Square, Layout, List, Cpu, Info, Terminal, Copy } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

import UnifiedChat from '../components/ui/UnifiedChat';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const GO_LIVE_DATA = [
    { time: '0s', bitrate: 6000, drops: 0 },
    { time: '5s', bitrate: 5900, drops: 0 },
    { time: '10s', bitrate: 6100, drops: 0 },
    { time: '15s', bitrate: 5800, drops: 1 },
    { time: '20s', bitrate: 6200, drops: 0 },
    { time: '25s', bitrate: 6000, drops: 0 },
];

const GoLive: React.FC = () => {
    const [isLive, setIsLive] = useState(false);
    const [micEnabled, setMicEnabled] = useState(true);
    const [camEnabled, setCamEnabled] = useState(true);
    const [uptime, setUptime] = useState(0);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [streamingDefaults, setStreamingDefaults] = useState({
        quality: '1080p60',
        bitrate: '6,000 Kbps',
        title: 'Untitled Stream'
    });

    const [audioLevels, setAudioLevels] = useState({ mic: 75, system: 60, music: 40 });
    const [vuLevels, setVuLevels] = useState({ mic: 0, system: 0, music: 0 });
    const [activeScene, setActiveScene] = useState('Camera Only');
    const [destinations, setDestinations] = useState<{ id: string; name: string; url: string; stream_key: string }[]>([]);
    const [selectedDest, setSelectedDest] = useState<string>('');
    const [ffmpegCommand, setFfmpegCommand] = useState('');

    // WebRTC & Hardware State
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');
    const [selectedMic, setSelectedMic] = useState<string>('');
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchDefaults = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('streaming_quality, default_bitrate, default_title')
                .eq('id', user.id)
                .single();

            if (data) {
                setStreamingDefaults({
                    quality: data.streaming_quality || '1080p60',
                    bitrate: data.default_bitrate || '6,240 Kbps',
                    title: data.default_title || 'Midnight Stream'
                });
            }
        };

        const fetchDestinations = async () => {
            const { data } = await supabase
                .from('destinations')
                .select('*')
                .eq('active', true);
            if (data) {
                setDestinations(data);
                if (data.length > 0) setSelectedDest(data[0].id);
            }
        };

        fetchDefaults();
        fetchDestinations();

        // Enumerate devices
        const getDevices = async () => {
            try {
                // Request temporary access to get labels
                const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                const devices = await navigator.mediaDevices.enumerateDevices();

                const videos = devices.filter(d => d.kind === 'videoinput');
                const audios = devices.filter(d => d.kind === 'audioinput');

                setVideoDevices(videos);
                setAudioDevices(audios);

                if (videos.length > 0) setSelectedCamera(videos[0].deviceId);
                if (audios.length > 0) setSelectedMic(audios[0].deviceId);

                // Stop temp stream
                tempStream.getTracks().forEach(t => t.stop());
            } catch (err) {
                console.error("Error enumerating devices:", err);
            }
        };
        getDevices();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Handle Stream Lifecycle
    useEffect(() => {
        const startStream = async () => {
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
            }

            try {
                const constraints = {
                    video: camEnabled ? { deviceId: selectedCamera ? { exact: selectedCamera } : undefined } : false,
                    audio: micEnabled ? { deviceId: selectedMic ? { exact: selectedMic } : undefined } : false
                };

                const newStream = await navigator.mediaDevices.getUserMedia(constraints);
                setStream(newStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                }

                // Audio Analysis for VU Meters
                if (micEnabled) {
                    if (!audioContextRef.current) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                    }
                    const ctx = audioContextRef.current;
                    const source = ctx.createMediaStreamSource(newStream);
                    const analyser = ctx.createAnalyser();
                    analyser.fftSize = 256;
                    source.connect(analyser);
                    analyserRef.current = analyser;

                    const updateVU = () => {
                        if (!analyserRef.current) return;
                        const dataArray = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(dataArray);
                        const average = dataArray.reduce((p, c) => p + c, 0) / dataArray.length;

                        setVuLevels(prev => ({
                            ...prev,
                            mic: (average / 128) * 100,
                            system: isLive ? Math.random() * 10 + 50 : 0,
                            music: isLive ? Math.random() * 10 + 30 : 0
                        }));
                        animationFrameRef.current = requestAnimationFrame(updateVU);
                    };
                    updateVU();
                } else {
                    setVuLevels(prev => ({ ...prev, mic: 0 }));
                }
            } catch (err) {
                console.error("Error starting stream:", err);
            }
        };

        startStream();

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [camEnabled, micEnabled, selectedCamera, selectedMic, isLive]);

    useEffect(() => {
        const dest = destinations.find(d => d.id === selectedDest);
        const url = dest ? `${dest.url}/${dest.stream_key}` : 'rtmp://your-stream-url/key';
        const br = streamingDefaults.bitrate.replace(/\D/g, '');
        const preset = streamingDefaults.quality.includes('4K') ? 'slow' : 'veryfast';
        const codec = streamingDefaults.quality.includes('HEVC') || streamingDefaults.quality.includes('4K') ? 'libx265' : 'libx264';

        const cmd = `ffmpeg -f avfoundation -i "1:0" \\\n  -vcodec ${codec} -preset ${preset} -b:v ${br}k -maxrate ${br}k -bufsize ${parseInt(br) * 2}k \\\n  -acodec aac -b:a 160k -ar 44100 \\\n  -f flv "${url}"`;

        setFfmpegCommand(cmd);
    }, [selectedDest, destinations, streamingDefaults]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;

        if (isLive) {
            interval = setInterval(() => {
                setUptime(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLive]);

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const saveRecording = async () => {
        if (!user || uptime < 5) return;

        const { error } = await supabase
            .from('videos')
            .insert([{
                user_id: user.id,
                title: streamingDefaults.title + " - " + new Date().toLocaleDateString(),
                duration: formatUptime(uptime),
                thumbnail: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                views: "0",
                size: (Math.random() * 5 + 1).toFixed(1) + " GB",
                date: "Just now"
            }]);

        if (error) console.error('Error saving recording:', error);
    };

    const toggleLive = async () => {
        if (!user) return;
        setLoading(true);
        const nextLiveState = !isLive;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_live: nextLiveState })
                .eq('id', user.id);

            if (error) throw error;

            if (!nextLiveState) {
                await saveRecording();
                setUptime(0);
            }

            setIsLive(nextLiveState);

            window.dispatchEvent(new CustomEvent('show-toast', {
                detail: {
                    message: nextLiveState ? 'Stream is now LIVE!' : 'Stream ended successfully.',
                    type: nextLiveState ? 'success' : 'info'
                }
            }));
        } catch (error) {
            console.error('Error toggling live status:', error);
            // Fallback for simulation
            setIsLive(nextLiveState);
            if (!nextLiveState) setUptime(0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in pb-10">
            <div className="flex-between flex-wrap gap-4 page-header mb-6">
                <div>
                    <h1 className="flex items-center gap-3 page-title">
                        <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-danger animate-pulse' : 'bg-muted'}`} />
                        Live Control Room
                    </h1>
                    <p className="page-subtitle">Monitor and control your active broadcast</p>
                </div>
                <div className="flex items-center gap-4">
                    {isLive && (
                        <div className="flex items-center gap-6 mr-4 bg-danger/10 border border-danger/20 px-4 py-2 rounded-lg">
                            <div className="flex flex-col">
                                <span className="text-xs text-danger font-semibold uppercase tracking-wider">Uptime</span>
                                <span className="font-mono font-medium">{formatUptime(uptime)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-danger font-semibold uppercase tracking-wider">Status</span>
                                <span className="text-sm font-medium flex items-center gap-1.5">
                                    <Activity size={14} className="animate-pulse" /> Excellent
                                </span>
                            </div>
                        </div>
                    )}

                    <Button
                        variant={isLive ? 'danger' : 'primary'}
                        icon={<Radio size={18} className={isLive ? 'animate-pulse' : ''} />}
                        onClick={toggleLive}
                        loading={loading}
                        className="px-8 py-3 text-lg font-bold shadow-lg"
                    >
                        {isLive ? 'END STREAM' : 'GO LIVE'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* Main Feed Column */}
                <div className="xl:col-span-3 space-y-6">

                    {/* Video Player Preview */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
                        {camEnabled ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover scale-x-[-1]" // Flip for mirror effect
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
                                <VidIcon size={64} className="mb-4 opacity-50" />
                                <p className="font-medium">Camera Disabled</p>
                            </div>
                        )}

                        {/* Player Controls Overlay */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex-between text-white">
                                <div className="flex items-center gap-4">
                                    <Button variant="secondary" iconOnly className="bg-white/10 hover:bg-white/20 border-none rounded-full" icon={<PlaySquare size={20} fill="white" />} />
                                    <Button variant="secondary" iconOnly className="bg-white/10 hover:bg-white/20 border-none rounded-full" icon={<SkipForward size={20} fill="white" />} />

                                    <div className="h-6 w-px bg-white/20 mx-2"></div>

                                    <Button
                                        variant="secondary"
                                        iconOnly
                                        className={`border-none rounded-full ${micEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-danger/20 text-danger hover:bg-danger/30'}`}
                                        icon={micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                                        onClick={() => setMicEnabled(!micEnabled)}
                                    />
                                    <Button
                                        variant="secondary"
                                        iconOnly
                                        className={`border-none rounded-full ${camEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-danger/20 text-danger hover:bg-danger/30'}`}
                                        icon={camEnabled ? <VidIcon size={20} /> : <VideoOff size={20} />}
                                        onClick={() => setCamEnabled(!camEnabled)}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-lg text-sm font-mono border border-white/10">
                                        <Settings size={14} /> {streamingDefaults.quality}
                                    </span>
                                    <Button variant="secondary" iconOnly className="bg-white/10 hover:bg-white/20 border-none rounded-full" icon={<Maximize2 size={18} />} />
                                </div>
                            </div>
                        </div>

                        {isLive && (
                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge variant="danger" className="animate-pulse bg-danger/80 text-white border-white/20 backdrop-blur-md px-3 py-1.5">LIVE</Badge>
                                <Badge variant="info" className="bg-black/50 text-white border-white/20 backdrop-blur-md px-3 py-1.5 flex items-center gap-1.5">
                                    <Users size={12} /> 12.4K
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card hoverable className={isLive ? 'border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : ''}>
                            <CardBody className="p-5 flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isLive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted'}`}>
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted">Current Bitrate</p>
                                    <h3 className="text-xl font-bold font-mono mt-0.5">{isLive ? streamingDefaults.bitrate : '0 Kbps'}</h3>
                                </div>
                            </CardBody>
                        </Card>

                        <Card hoverable>
                            <CardBody className="p-5 flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isLive && uptime > 0 ? 'bg-success/20 text-success' : 'bg-white/5 text-muted'}`}>
                                    <Globe size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted">Network Health</p>
                                    <h3 className="text-xl font-bold mt-0.5">{isLive ? 'Excellent' : 'Offline'}</h3>
                                </div>
                            </CardBody>
                        </Card>

                        <Card hoverable>
                            <CardBody className="p-5 flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isLive ? 'bg-warning/20 text-warning' : 'bg-white/5 text-muted'}`}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted">Dropped Frames</p>
                                    <h3 className="text-xl font-bold font-mono mt-0.5 text-success">
                                        {isLive ? '0.0%' : '0.0%'}
                                    </h3>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Health Graph */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Activity size={16} className="text-primary" /> Stream Bitrate Health (Last 30s)
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="pt-2 pb-6 px-4">
                            <div className="h-[180px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={GO_LIVE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                        <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 500', 'dataMax + 500']} />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: '8px', padding: '8px' }}
                                            itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                                            labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="bitrate"
                                            stroke={isLive ? "var(--primary)" : "var(--text-muted)"}
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: "var(--bg-card)", strokeWidth: 2 }}
                                            activeDot={{ r: 6, fill: "var(--primary)", stroke: "white" }}
                                            isAnimationActive={isLive}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardBody>
                    </Card>

                </div>

                {/* Sidebar Column: Chat & Events */}
                <div className="xl:col-span-1 space-y-6 flex flex-col">
                    {/* Hardware Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xs font-bold flex items-center gap-2 text-secondary uppercase tracking-widest">
                                <Monitor size={14} /> Hardware Setup
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="py-3 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-muted font-bold uppercase tracking-wider">Camera</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-secondary/50 transition-colors"
                                    value={selectedCamera}
                                    onChange={(e) => setSelectedCamera(e.target.value)}
                                >
                                    {videoDevices.map(d => (
                                        <option key={d.deviceId} value={d.deviceId} className="bg-[#1a1d24]">{d.label || 'Default Camera'}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-muted font-bold uppercase tracking-wider">Microphone</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-secondary/50 transition-colors"
                                    value={selectedMic}
                                    onChange={(e) => setSelectedMic(e.target.value)}
                                >
                                    {audioDevices.map(d => (
                                        <option key={d.deviceId} value={d.deviceId} className="bg-[#1a1d24]">{d.label || 'Default Mic'}</option>
                                    ))}
                                </select>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Scene Selector */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Grid size={16} className="text-primary" /> Scene Selection
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="grid grid-cols-2 gap-3">
                            {[
                                { name: 'Camera Only', icon: <VidIcon size={14} /> },
                                { name: 'Screen + Cam', icon: <Monitor size={14} /> },
                                { name: 'Intermission', icon: <Layout size={14} /> },
                                { name: 'Ending Soon', icon: <Square size={14} /> },
                            ].map((scene) => (
                                <button
                                    key={scene.name}
                                    onClick={() => setActiveScene(scene.name)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${activeScene === scene.name ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 text-muted hover:border-white/20'}`}
                                >
                                    {scene.icon}
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">{scene.name}</span>
                                </button>
                            ))}
                        </CardBody>
                    </Card>

                    {/* Audio Mixer */}
                    <Card>
                        <CardHeader className="flex-between">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Volume2 size={16} className="text-secondary" /> Audio Mixer
                            </CardTitle>
                            <Badge variant="info" className="text-[10px] py-0">LIVE MIX</Badge>
                        </CardHeader>
                        <CardBody className="space-y-6">
                            {[
                                { id: 'mic', name: 'Microphone', icon: micEnabled ? <Mic size={14} /> : <MicOff size={14} />, color: 'text-primary' },
                                { id: 'system', name: 'System Audio', icon: <Monitor size={14} />, color: 'text-secondary' },
                                { id: 'music', name: 'BGM / Spotify', icon: <List size={14} />, color: 'text-accent' },
                            ].map((audio) => (
                                <div key={audio.id} className="space-y-2">
                                    <div className="flex-between">
                                        <div className="flex items-center gap-2">
                                            <span className={audio.color}>{audio.icon}</span>
                                            <span className="text-xs font-semibold">{audio.name}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-muted">{audioLevels[audio.id as keyof typeof audioLevels]}%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={audioLevels[audio.id as keyof typeof audioLevels]}
                                            onChange={(e) => setAudioLevels(prev => ({ ...prev, [audio.id]: parseInt(e.target.value) }))}
                                            className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <button className="text-muted hover:text-white transition-colors">
                                            {audioLevels[audio.id as keyof typeof audioLevels] === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                        </button>
                                    </div>
                                    {/* VU Meter */}
                                    <div className="vu-meter">
                                        <div
                                            className="vu-bar"
                                            style={{ width: `${vuLevels[audio.id as keyof typeof vuLevels] * (audioLevels[audio.id as keyof typeof audioLevels] / 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardBody>
                    </Card>

                    {/* Media Capabilities Info */}
                    <Card className="border-secondary/20 bg-secondary/5">
                        <CardHeader className="py-3">
                            <CardTitle className="text-xs font-bold flex items-center gap-2 text-secondary uppercase tracking-widest">
                                <Cpu size={14} /> System Capabilities
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="py-3 space-y-3">
                            <div className="flex-between">
                                <div className="flex items-center gap-2 text-[10px] text-muted font-medium">
                                    <Badge variant="info" className="scale-75 origin-left">VIDEO</Badge>
                                    AVC/H.264, HEVC/H.265
                                </div>
                                <Info size={12} className="text-muted/50" />
                            </div>
                            <div className="flex-between">
                                <div className="flex items-center gap-2 text-[10px] text-muted font-medium">
                                    <Badge variant="success" className="scale-75 origin-left">AUDIO</Badge>
                                    AAC-LC, MP3
                                </div>
                                <Info size={12} className="text-muted/50" />
                            </div>
                        </CardBody>
                    </Card>

                    {/* FFmpeg Command Generator */}
                    <Card className="border-primary/20">
                        <CardHeader className="py-3 flex-between">
                            <CardTitle className="text-xs font-bold flex items-center gap-2 text-primary uppercase tracking-widest">
                                <Terminal size={14} /> FFmpeg Command
                            </CardTitle>
                            <Button
                                variant="secondary"
                                className="h-6 px-2 text-[10px]"
                                onClick={() => {
                                    navigator.clipboard.writeText(ffmpegCommand);
                                    window.dispatchEvent(new CustomEvent('show-toast', {
                                        detail: { message: 'Command copied to clipboard!', type: 'success' }
                                    }));
                                }}
                                icon={<Copy size={10} />}
                            >
                                COPY
                            </Button>
                        </CardHeader>
                        <CardBody className="py-3 space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-muted font-bold uppercase tracking-wider">Target Destination</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                                    value={selectedDest}
                                    onChange={(e) => setSelectedDest(e.target.value)}
                                >
                                    {destinations.length > 0 ? (
                                        destinations.map(d => (
                                            <option key={d.id} value={d.id} className="bg-[#1a1d24]">{d.name}</option>
                                        ))
                                    ) : (
                                        <option value="" className="bg-[#1a1d24]">No active destinations</option>
                                    )}
                                </select>
                            </div>
                            <div className="relative group">
                                <pre className="bg-black/40 p-3 rounded-lg text-[10px] font-mono text-primary/80 border border-white/5 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[120px]">
                                    {ffmpegCommand}
                                </pre>
                            </div>
                            <p className="text-[9px] text-muted italic">
                                * Use this command in your terminal for optimized low-latency streaming based on current profile.
                            </p>
                        </CardBody>
                    </Card>

                    <UnifiedChat isLive={isLive} />
                </div>
            </div>
        </div>
    );
};

export default GoLive;
