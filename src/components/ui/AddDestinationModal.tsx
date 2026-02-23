import React, { useState } from 'react';
import { CardHeader, CardTitle, CardBody, CardFooter } from './Card';
import Button from './Button';
import { Input } from './Input';
import { X, Youtube, Twitch, Facebook, Server } from 'lucide-react';

interface AddDestinationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (destination: { name: string; platform: string; streamKey: string }) => void;
}

const AddDestinationModal: React.FC<AddDestinationModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [platform, setPlatform] = useState('YouTube');
    const [streamKey, setStreamKey] = useState('');

    if (!isOpen) return null;

    const platforms = [
        { id: 'YouTube', icon: <Youtube size={20} color="#FF0000" /> },
        { id: 'Twitch', icon: <Twitch size={20} color="#9146FF" /> },
        { id: 'Facebook', icon: <Facebook size={20} color="#1877F2" /> },
        { id: 'RTMP', icon: <Server size={20} /> },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !streamKey) return;

        onAdd({
            name,
            platform,
            streamKey,
        });

        setName('');
        setStreamKey('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
            <div className="relative w-full max-w-lg bg-[#0d1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                <CardHeader className="flex-between">
                    <CardTitle>Add New Destination</CardTitle>
                    <Button variant="secondary" iconOnly icon={<X size={18} />} onClick={onClose} className="border-none bg-transparent" />
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardBody className="space-y-4">
                        <div className="input-group">
                            <label className="input-label">Destination Name</label>
                            <Input
                                placeholder="e.g. My Channel - High Quality"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Select Platform</label>
                            <div className="grid grid-cols-2 gap-3">
                                {platforms.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setPlatform(p.id)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${platform === p.id
                                            ? 'border-primary bg-primary/10 text-white'
                                            : 'border-white/5 bg-white/5 text-muted hover:bg-white/10'
                                            }`}
                                    >
                                        {p.icon}
                                        <span className="text-sm font-medium">{p.id}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Stream Key</label>
                            <Input
                                type="password"
                                placeholder="Paste your stream key here"
                                value={streamKey}
                                onChange={(e) => setStreamKey(e.target.value)}
                                required
                            />
                            <p className="text-[10px] text-muted mt-1 italic">Stream keys are stored locally and never shared.</p>
                        </div>
                    </CardBody>
                    <CardFooter className="flex justify-end gap-3 p-4">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Add Destination</Button>
                    </CardFooter>
                </form>
            </div>
        </div>
    );
};

export default AddDestinationModal;
