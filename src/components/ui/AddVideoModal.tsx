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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-md bg-[#0d1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                <div className="flex-between p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Link2 size={24} className="text-primary" />
                        Add Cloud Video
                    </h2>
                    <button onClick={onClose} className="text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg flex items-start gap-3 text-danger text-sm">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted">Video Title</label>
                        <Input
                            placeholder="e.g. Cinematic B-Roll"
                            icon={<FileVideo size={18} />}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted">Google Drive Link</label>
                        <Input
                            placeholder="https://drive.google.com/file/d/..."
                            icon={<Link2 size={18} />}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                        <p className="text-[10px] text-muted italic px-1">Ensure the link is shared with 'Anyone with the link'</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted">Duration (Optional)</label>
                        <Input
                            placeholder="HH:MM:SS"
                            icon={<Clock size={18} />}
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            icon={<Save size={18} />}
                            loading={loading}
                            className="flex-1"
                        >
                            Add to Library
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVideoModal;
