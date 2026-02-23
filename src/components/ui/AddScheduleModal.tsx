import React, { useState } from 'react';
import { CardHeader, CardTitle, CardBody, CardFooter } from './Card';
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

    if (!isOpen) return null;

    const platforms = [
        { id: 'YouTube', icon: <Youtube size={18} color="#FF0000" /> },
        { id: 'Twitch', icon: <Twitch size={18} color="#9146FF" /> },
        { id: 'Facebook', icon: <Facebook size={18} color="#1877F2" /> },
        { id: 'RTMP', icon: <Server size={18} /> },
    ];

    const togglePlatform = (pId: string) => {
        if (selectedPlatforms.includes(pId)) {
            setSelectedPlatforms(selectedPlatforms.filter(p => p !== pId));
        } else {
            setSelectedPlatforms([...selectedPlatforms, pId]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !time || selectedPlatforms.length === 0) return;

        onAdd({
            title,
            date,
            time,
            duration,
            platforms: selectedPlatforms,
        });

        // Reset and close
        setTitle('');
        setDate('');
        setTime('');
        setSelectedPlatforms(['YouTube']);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
            <div className="relative w-full max-w-lg bg-[#0d1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                <CardHeader className="flex-between">
                    <CardTitle>Schedule New broadcast</CardTitle>
                    <Button variant="secondary" iconOnly icon={<X size={18} />} onClick={onClose} className="border-none bg-transparent" />
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardBody className="space-y-4">
                        <div className="input-group">
                            <label className="input-label">Broadcast Title</label>
                            <Input
                                placeholder="e.g. Project Launch Live"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="input-group">
                                <label className="input-label">Date</label>
                                <div className="input-wrapper">
                                    <Calendar className="input-icon-left" size={16} />
                                    <Input
                                        type="date"
                                        className="input-with-icon"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Time</label>
                                <div className="input-wrapper">
                                    <Clock className="input-icon-left" size={16} />
                                    <Input
                                        type="time"
                                        className="input-with-icon"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Estimated Duration</label>
                            <Input
                                placeholder="e.g. 1h 30m"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Select Platforms</label>
                            <div className="flex flex-wrap gap-2">
                                {platforms.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => togglePlatform(p.id)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${selectedPlatforms.includes(p.id)
                                            ? 'border-primary bg-primary/10 text-white'
                                            : 'border-white/5 bg-white/5 text-muted hover:bg-white/10'
                                            }`}
                                    >
                                        {p.icon}
                                        <span className="text-xs font-medium">{p.id}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex justify-end gap-3 p-4">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Schedule Event</Button>
                    </CardFooter>
                </form>
            </div>
        </div>
    );
};

export default AddScheduleModal;
