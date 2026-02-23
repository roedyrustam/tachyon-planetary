import React, { useState } from 'react';
import { X, Link2, FileVideo, Clock, Save, AlertCircle } from 'lucide-react';
import Button from './Button';
import { Input } from './Input';

interface AddVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (videoData: { title: string; url: string; duration: string; type: 'drive' | 'local' }) => Promise<void>;
}

const AddVideoModal: React.FC<AddVideoModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [duration, setDuration] = useState('00:00:00');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim() || !url.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        // Basic Google Drive link validation
        if (!url.includes('drive.google.com')) {
            setError('Please enter a valid Google Drive link');
            return;
        }

        setLoading(true);
        try {
            await onAdd({ title, url, duration, type: 'drive' });
            setTitle('');
            setUrl('');
            setDuration('00:00:00');
            onClose();

            window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { message: 'Video link added to library!', type: 'success' }
            }));
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to add video link');
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
                            <Link2 size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Add Cloud Video</h2>
                            <p className="text-[10px] text-muted uppercase tracking-widest font-semibold mt-0.5">Stream Source Integration</p>
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
                    {error && (
                        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3 text-danger text-sm animate-shake">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Universal Video Title</label>
                            <Input
                                placeholder="e.g. Cinematic Production Intro"
                                icon={<FileVideo size={18} className="text-primary/60" />}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-black/20 border-white/5 focus:border-primary/50 transition-all h-12 text-md"
                                required
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Google Drive Source URL</label>
                            <Input
                                placeholder="https://drive.google.com/file/d/..."
                                icon={<Link2 size={18} className="text-secondary/60" />}
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="bg-black/20 border-white/5 focus:border-secondary/50 transition-all h-12 text-md"
                                required
                            />
                            <div className="flex items-center gap-2 px-1 py-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                <p className="text-[10px] text-muted italic font-medium">Ensure "Anyone with the link" permissions are enabled</p>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Asset Duration</label>
                            <Input
                                placeholder="HH:MM:SS (Optional)"
                                icon={<Clock size={18} className="text-accent/60" />}
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="bg-black/20 border-white/5 focus:border-accent/50 transition-all h-12 text-md"
                            />
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
                            icon={<Save size={20} />}
                            loading={loading}
                            className="flex-[1.5] h-12 shadow-lg shadow-primary/20 font-bold text-md"
                        >
                            Integrate Asset
                        </Button>
                    </div>
                </form>

                {/* Footer Metadata Hint */}
                <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-4 opacity-50">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-muted" />
                        <span className="text-[9px] uppercase tracking-tighter font-bold">Encrypted Link</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-muted" />
                        <span className="text-[9px] uppercase tracking-tighter font-bold">Auto-Transcode</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-muted" />
                        <span className="text-[9px] uppercase tracking-tighter font-bold">Cloud Persistence</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddVideoModal;
