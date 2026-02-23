import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Shield, Bell, Monitor, Globe, Save, Camera, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Profile State
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80');

    // Streaming Defaults State
    const [defaultTitle, setDefaultTitle] = useState('');
    const [streamCategory, setStreamCategory] = useState('');
    const [quality, setQuality] = useState('1080p 60fps (Recommended)');
    const [latency, setLatency] = useState('Low');

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            if (data) {
                setDisplayName(data.display_name || '');
                setBio(data.bio || '');
                if (data.avatar_url) setAvatarUrl(data.avatar_url);
                setDefaultTitle(data.default_title || '');
                setStreamCategory(data.stream_category || '');
                setQuality(data.streaming_quality || '1080p 60fps (Recommended)');
                setLatency(data.latency_mode || 'Low');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    display_name: displayName,
                    bio: bio,
                    avatar_url: avatarUrl,
                    default_title: defaultTitle,
                    stream_category: streamCategory,
                    streaming_quality: quality,
                    latency_mode: latency,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: <User size={18} /> },
        { id: 'streaming', name: 'Streaming', icon: <Globe size={18} /> },
        { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
        { id: 'security', name: 'Security', icon: <Shield size={18} /> },
        { id: 'appearance', name: 'Appearance', icon: <Monitor size={18} /> },
    ];

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Configure your account and streaming preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.icon}
                            <span className="font-medium">{tab.name}</span>
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {activeTab === 'profile' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                            </CardHeader>
                            {loading ? (
                                <CardBody className="py-20 text-center text-muted">Loading profile...</CardBody>
                            ) : (
                                <CardBody className="space-y-6">
                                    <div className="flex items-center gap-6 mb-4">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[var(--border-color)] group-hover:border-primary transition-colors">
                                                <img
                                                    src={avatarUrl}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
                                                <Camera size={24} className="text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold mb-1">{displayName || 'Anonymous User'}</h4>
                                            <p className="text-sm text-muted">{user?.email}</p>
                                            <Button variant="secondary" className="mt-2 text-xs py-1.5 h-auto">Change Avatar</Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="input-group">
                                            <label className="input-label">Display Name</label>
                                            <Input
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                placeholder="Enter display name"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Email Address (Read Only)</label>
                                            <Input value={user?.email || ''} type="email" readOnly disabled className="opacity-50" />
                                        </div>
                                        <div className="input-group md:col-span-2">
                                            <label className="input-label">Bio</label>
                                            <textarea
                                                className="w-full bg-white/5 border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-main)] outline-none focus:border-[var(--primary)] transition-colors min-h-[100px] resize-none"
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                    </div>
                                </CardBody>
                            )}
                            <CardFooter className="flex justify-end p-4">
                                <Button
                                    icon={isSaving ? undefined : <Save size={18} />}
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving Changes...' : 'Save Profile'}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {activeTab === 'streaming' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Streaming Defaults</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="input-group">
                                        <label className="input-label">Default Title</label>
                                        <Input
                                            placeholder="Exciting Live Stream!"
                                            value={defaultTitle}
                                            onChange={(e) => setDefaultTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Stream Category</label>
                                        <Input
                                            placeholder="Programing / Technology"
                                            value={streamCategory}
                                            onChange={(e) => setStreamCategory(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Standard Quality</label>
                                        <select
                                            className="w-full bg-white/5 border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-main)] outline-none focus:border-[var(--primary)] transition-colors"
                                            value={quality}
                                            onChange={(e) => setQuality(e.target.value)}
                                        >
                                            <option>1080p 60fps (Recommended)</option>
                                            <option>720p 60fps</option>
                                            <option>4k 30fps</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Broadcast Latency</label>
                                        <div className="flex gap-3">
                                            <Button
                                                variant={latency === 'Low' ? 'primary' : 'secondary'}
                                                className="flex-1 text-xs"
                                                onClick={() => setLatency('Low')}
                                            >Low</Button>
                                            <Button
                                                variant={latency === 'Standard' ? 'primary' : 'secondary'}
                                                className="flex-1 text-xs"
                                                onClick={() => setLatency('Standard')}
                                            >Standard</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Key size={18} className="text-primary" />
                                        <span className="font-semibold text-sm">Primary Stream Key</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input type="password" value="••••••••••••••••••••••••" readOnly className="flex-1" />
                                        <Button variant="secondary">Copy</Button>
                                    </div>
                                    <p className="text-[10px] text-muted mt-2 italic">Never share your stream key. StreamPulse will never ask for it outside this encrypted field.</p>
                                </div>
                            </CardBody>
                            <CardFooter className="flex justify-end p-4">
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? 'Updating...' : 'Save Default Settings'}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {activeTab === 'appearance' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Interface Preferences</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">Theme</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl border-2 border-primary bg-[#0f1117] cursor-pointer">
                                            <div className="w-full aspect-video bg-[#1a1d24] rounded-lg mb-2" />
                                            <span className="text-sm font-medium">Deep Space (Default)</span>
                                        </div>
                                        <div className="p-4 rounded-xl border border-white/5 bg-[#1a1d24] hover:bg-white/10 cursor-pointer transition-colors">
                                            <div className="w-full aspect-video bg-white/5 rounded-lg mb-2" />
                                            <span className="text-sm font-medium">Nebula Dark</span>
                                        </div>
                                        <div className="p-4 rounded-xl border border-white/5 bg-white cursor-pointer opacity-50 grayscale">
                                            <div className="w-full aspect-video bg-gray-100 rounded-lg mb-2" />
                                            <span className="text-sm font-medium">Polar White (Coming Soon)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">Interface Scaling</h4>
                                    <div className="flex items-center gap-6">
                                        <input type="range" className="flex-1 accent-primary" min="80" max="120" defaultValue="100" />
                                        <span className="text-sm font-mono w-10 text-right">100%</span>
                                    </div>
                                </div>

                                <div className="flex-between p-4 rounded-xl bg-white/5">
                                    <div>
                                        <p className="font-medium">Glassmorphism Intensity</p>
                                        <p className="text-xs text-muted">Control the level of transparency and blur effects.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-primary rounded-full relative">
                                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
