import React, { useState } from 'react';
import Button from './Button';
import { Input } from './Input';
import { X, Calendar, Clock, Youtube, Twitch, Facebook, Server } from 'lucide-react';

interface AddScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (schedule: {
        title: string;
        date: string;
        time: string;
        duration: string;
        platforms: string[]
    }) => void;
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('1h 00m');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['YouTube']);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const platforms = [
        { id: 'YouTube', icon: <Youtube size={20} color="#FF0000" /> },
        { id: 'Twitch', icon: <Twitch size={20} color="#9146FF" /> },
        { id: 'Facebook', icon: <Facebook size={20} color="#1877F2" /> },
        { id: 'RTMP', icon: <Server size={20} /> },
    ];

    const togglePlatform = (pId: string) => {
        if (selectedPlatforms.includes(pId)) {
            setSelectedPlatforms(selectedPlatforms.filter(p => p !== pId));
        } else {
            setSelectedPlatforms([...selectedPlatforms, pId]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !time || selectedPlatforms.length === 0) return;

        setLoading(true);
        try {
            await onAdd({
                title,
                date,
                time,
                duration,
                platforms: selectedPlatforms,
            });

            setTitle('');
            setDate('');
            setTime('');
            setSelectedPlatforms(['YouTube']);
            onClose();

            window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { message: 'Broadcast scheduled successfully!', type: 'success' }
            }));
        } catch (error) {
            console.error('Error scheduling broadcast:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
            <div className="relative w-full max-w-lg bg-[#0d1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                {/* Visual Header Accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-accent" />

                <div className="flex-between p-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex-center text-primary border border-primary/20">
                            <Calendar size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Schedule Broadcast</h2>
                            <p className="text-[10px] text-muted uppercase tracking-widest font-semibold mt-0.5">Stream Planning & Management</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex-center text-muted hover:text-white hover:bg-white/5 transition-all bg-transparent border-none cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2.5">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Event Title</label>
                        <Input
                            placeholder="e.g. Monthly Community Q&A"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-black/20 border-white/5 focus:border-primary/50 transition-all h-12 text-md"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Stream Date</label>
                            <Input
                                type="date"
                                icon={<Calendar size={18} className="text-primary/60" />}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-black/20 border-white/5 focus:border-primary/50 transition-all h-12"
                                required
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Start Time</label>
                            <Input
                                type="time"
                                icon={<Clock size={18} className="text-secondary/60" />}
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="bg-black/20 border-white/5 focus:border-secondary/50 transition-all h-12"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Estimated Duration</label>
                        <Input
                            placeholder="e.g. 1h 30m"
                            icon={<Clock size={18} className="text-accent/60" />}
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="bg-black/20 border-white/5 focus:border-accent/50 transition-all h-12"
                        />
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Broadcast Targets</label>
                        <div className="grid grid-cols-2 gap-3">
                            {platforms.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => togglePlatform(p.id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedPlatforms.includes(p.id)
                                        ? 'border-primary bg-primary/10 text-white shadow-lg shadow-primary/5'
                                        : 'border-white/5 bg-white/5 text-muted hover:bg-white/10'
                                        }`}
                                >
                                    {p.icon}
                                    <span className="text-sm font-medium">{p.id}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1 h-12 border-white/5 hover:bg-white/5 font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            className="flex-[1.5] h-12 shadow-lg shadow-primary/20 font-bold text-md"
                        >
                            Confirm Schedule
                        </Button>
                    </div>
                </form>

                {/* Footer Metadata Hint */}
                <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-4 opacity-50">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-muted" />
                        <span className="text-[9px] uppercase tracking-tighter font-bold">Auto-Notification</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-muted" />
                        <span className="text-[9px] uppercase tracking-tighter font-bold">Public Listing</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-muted" />
                        <span className="text-[9px] uppercase tracking-tighter font-bold">Calendar Sync</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddScheduleModal;
