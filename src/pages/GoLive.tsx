import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Radio, Users, Activity, Settings, Maximize2, Mic, MicOff, Video as VidIcon, VideoOff, PlaySquare, SkipForward, Globe, Youtube, Twitch } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

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
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, user: 'GamerPro99', text: 'Wow, the quality is insane!', platform: 'Youtube', time: '10:42 AM', isSuperChat: false },
        { id: 2, user: 'TechNerdz', text: 'Hi everyone! First time here 👋', platform: 'Twitch', time: '10:43 AM', isSuperChat: false },
        { id: 3, user: 'BigSpender', text: 'Keep up the great work! Amazing stream setup.', platform: 'Youtube', time: '10:44 AM', isSuperChat: true, amount: '$50.00' },
    ]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isLive) {
            interval = setInterval(() => {
                setUptime(prev => prev + 1);
            }, 1000);
        } else {
            setUptime(0);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isLive]);

    // Simulated Chat Messages
    useEffect(() => {
        if (!isLive) return;

        const simulatedUsers = ['AlexStream', 'LiveFan_01', 'ProGamerX', 'Sarah_Creative', 'TechGuru'];
        const simulatedTexts = [
            'Love the content!',
            'What equipment are you using?',
            'Can you explain that again?',
            'Hype! 🚀🚀🚀',
            'Is this the new 1080p setup?',
            'Just joined, what did I miss?',
            'This is looking great!'
        ];

        const chatInterval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every 4 seconds
                const newUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
                const newText = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
                const platform = Math.random() > 0.5 ? 'Youtube' : 'Twitch';

                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        user: newUser,
                        text: newText,
                        platform,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isSuperChat: false
                    }
                ].slice(-50)); // Keep last 50 messages
            }
        }, 4000);

        return () => clearInterval(chatInterval);
    }, [isLive]);

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            user: 'You (Host)',
            text: chatInput,
            platform: 'StreamPulse',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSuperChat: false
        };

        setMessages(prev => [...prev, newMessage].slice(-50));
        setChatInput('');
    };

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
                        onClick={() => setIsLive(!isLive)}
                        className="px-8 py-3 text-lg font-bold shadow-lg"
                    >
                        {isLive ? 'END STREAM' : 'GO LIVE'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* Main Feed Column */}
                <div className="xl:col-span-3 space-y-6">

                    {/* Video Player Mockup */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
                        {camEnabled ? (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse-glow opacity-50"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                    alt="Stream Preview"
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </>
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
                                        <Settings size={14} /> 1080p60
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
                                    <h3 className="text-xl font-bold font-mono mt-0.5">{isLive ? '6,240 Kbps' : '0 Kbps'}</h3>
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
                <div className="xl:col-span-1 space-y-6 flex flex-col h-full">

                    <Card className="flex-1 flex flex-col border border-primary/20 h-[600px] xl:h-auto">
                        <CardHeader className="bg-primary/5 py-4 border-b border-primary/10">
                            <CardTitle className="text-md flex-between w-full">
                                <span className="flex items-center gap-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg> Unified Chat</span>
                                <Badge variant="info" className="bg-primary/20 text-primary border-none">Connected</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="flex-1 overflow-hidden flex flex-col p-0">
                            {/* Chat Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages">
                                <div className="text-center text-xs text-muted pb-4 border-b border-white/5 mb-4">Chat connection established. Waiting for messages...</div>

                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex flex-col gap-1 ${msg.isSuperChat ? 'px-3 py-2 bg-secondary/10 border-l-2 border-secondary rounded-r-lg' : ''}`}>
                                        <span className={`text-xs font-semibold flex items-center gap-1.5 ${msg.isSuperChat ? 'text-secondary' : ''}`}>
                                            {msg.platform === 'Youtube' ? (
                                                <Youtube size={12} className="text-red-500" />
                                            ) : msg.platform === 'Twitch' ? (
                                                <Twitch size={12} className="text-purple-500" />
                                            ) : (
                                                <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center text-[6px] text-white">S</div>
                                            )}
                                            {msg.user}
                                            {msg.isSuperChat && <Badge variant="warning" className="text-[8px] px-1.5 py-0">SUPERCHAT</Badge>}
                                            <span className="text-[10px] text-muted font-normal ml-auto">{msg.time} {msg.amount && <span className="font-bold ml-1">{msg.amount}</span>}</span>
                                        </span>
                                        <p className={`text-sm ${msg.isSuperChat ? 'mt-1 font-medium' : 'text-gray-200'}`}>{msg.text}</p>
                                    </div>
                                ))}
                                <div style={{ float: "left", clear: "both" }} />
                            </div>

                            {/* Chat Input */}
                            <div className="p-3 border-t border-white/5 bg-black/20">
                                <form
                                    className="relative"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Send message to all platforms..."
                                        className="w-full bg-[#111318] border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-white"
                                    />
                                    <Button
                                        type="submit"
                                        iconOnly
                                        variant="secondary"
                                        className="absolute right-1 top-1 bottom-1 bg-primary text-white border-none rounded-md px-2"
                                        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
                                    />
                                </form>
                            </div>
                        </CardBody>
                    </Card>

                </div>

            </div>
        </div>
    );
};

export default GoLive;
