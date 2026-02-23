import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Copy, ExternalLink, Layout, MessageSquare, Zap, Bell, Check } from 'lucide-react';

const Overlays: React.FC = () => {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const overlayItems = [
        {
            id: 'chat',
            name: 'Unified Chat Overlay',
            description: 'A transparent, animated chat overlay for your stream.',
            url: 'https://streampulse.app/overlay/chat/user-123',
            icon: <MessageSquare className="text-primary" />,
            preview: 'https://images.unsplash.com/photo-1614850523296-e8c04a0697ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'alert',
            name: 'Monetization Alerts',
            description: 'Show real-time popups for SuperChats and Bits.',
            url: 'https://streampulse.app/overlay/alerts/user-123',
            icon: <Zap className="text-secondary" />,
            preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'goal',
            name: 'Live Goal Tracker',
            description: 'Progress bars for follower or donation goals.',
            url: 'https://streampulse.app/overlay/goals/user-123',
            icon: <Layout className="text-accent" />,
            preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }
    ];

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <h1 className="page-title">Overlay Management</h1>
                <p className="page-subtitle">Generate browser source URLs for OBS, vMix, and more</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {overlayItems.map((item) => (
                        <Card key={item.id} hoverable className="overflow-hidden group">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                                    <img
                                        src={item.preview}
                                        alt={item.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <Badge variant="info" className="backdrop-blur-md bg-black/40 border-white/20">PREVIEW</Badge>
                                    </div>
                                </div>
                                <CardBody className="md:w-2/3 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                                {item.icon}
                                            </div>
                                            <h3 className="text-xl font-bold">{item.name}</h3>
                                        </div>
                                        <p className="text-muted text-sm mb-6">{item.description}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 p-2 bg-black/40 border border-white/5 rounded-xl font-mono text-xs text-muted overflow-hidden">
                                            <span className="truncate flex-1 pl-2">{item.url}</span>
                                            <Button
                                                variant="secondary"
                                                className="h-8 min-w-[32px] p-0"
                                                onClick={() => handleCopy(item.url, item.id)}
                                                icon={copied === item.id ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="primary" className="flex-1 gap-2">
                                                Customize
                                            </Button>
                                            <Button variant="secondary" iconOnly icon={<ExternalLink size={18} />} />
                                        </div>
                                    </div>
                                </CardBody>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="space-y-6">
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-primary">
                                <Layout size={18} />
                                Quick Integration
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Copy the URL above and add it as a <strong>Browser Source</strong> in your streaming software.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-muted">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Recommended Width: 800px
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Recommended Height: 600px
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Enable "Shutdown source when not visible"
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bell size={18} className="text-secondary" />
                                Global Themes
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-3">
                            {['Cyberpunk Neon', 'Minimal Glass', 'Professional Dark', 'Retro Arcade'].map((theme, idx) => (
                                <button key={idx} className="w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/50 text-left text-sm transition-all hover:bg-white/10">
                                    {theme}
                                </button>
                            ))}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Overlays;
