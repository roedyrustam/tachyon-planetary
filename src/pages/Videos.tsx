import React, { useEffect } from 'react';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Play, Download, Trash2, Search, Filter, UploadCloud, Link2, HardDrive, X, Calendar, Eye, Share2 } from 'lucide-react';
import AddVideoModal from '../components/ui/AddVideoModal';
import HLSPlayer from '../components/ui/HLSPlayer';

import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Video {
    id: string;
    title: string;
    duration: string;
    thumbnail: string;
    views: string;
    size: string;
    date: string;
    url?: string;
    created_at?: string;
}

const Videos: React.FC = () => {
    const [videos, setVideos] = React.useState<Video[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [lastSharedId, setLastSharedId] = React.useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [playingVideo, setPlayingVideo] = React.useState<Video | null>(null);
    const { user } = useAuth();

    const fetchVideos = async () => {
        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setVideos(data || []);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchVideos();
        }
    }, [user]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
            try {
                const { error } = await supabase
                    .from('videos')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                setVideos(videos.filter(v => v.id !== id));
            } catch (error) {
                console.error('Error deleting video:', error);
            }
        }
    };

    const handleShare = (id: string) => {
        setLastSharedId(id);
        setTimeout(() => setLastSharedId(null), 2000);
        // Also copy to clipboard for real functionality
        navigator.clipboard.writeText(`${window.location.origin}/play/${id}`);
    };

    const handleAddCloudVideo = async (videoData: { title: string; url: string; duration: string; type: string }) => {
        if (!user) return;

        // In a real app, we'd add columns 'source_type' and 'source_url'
        // For this demo, we'll store the URL as the thumbnail if it's a Drive link
        // or just mock the insertion.
        const { data, error } = await supabase
            .from('videos')
            .insert([{
                user_id: user.id,
                title: videoData.title,
                duration: videoData.duration,
                url: videoData.url,
                thumbnail: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                views: "0",
                size: "Cloud",
                date: "Just now"
            }])
            .select();

        if (error) throw error;
        if (data) {
            setVideos([data[0], ...videos]);
        }
    };

    const filteredVideos = videos.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div className="flex-between flex-wrap gap-4 page-header mb-8">
                <div>
                    <h1 className="page-title">Video Library</h1>
                    <p className="page-subtitle">Manage your past streams and uploaded videos</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={<Link2 size={18} />} onClick={() => setIsModalOpen(true)}>Add Link</Button>
                    <Button variant="primary" icon={<UploadCloud size={18} />}>Upload File</Button>
                </div>
            </div>

            <div className="flex-between flex-wrap gap-4 mb-6">
                <div className="w-full md:w-96">
                    <Input
                        placeholder="Search videos..."
                        icon={<Search size={18} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={<Filter size={16} />}>Filter</Button>
                    <select className="bg-transparent border border-[var(--border-color)] rounded-md px-3 py-2 text-[var(--text-main)] outline-none focus:border-[var(--primary)] transition-colors">
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                        <option value="longest">Longest</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-muted">Loading vault...</div>
                ) : filteredVideos.map(video => (
                    <Card key={video.id} className="group overflow-hidden rounded-xl border border-[var(--border-light)] bg-[#1a1d24]">
                        <div className="relative aspect-video overflow-hidden">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />
                            {lastSharedId === video.id && (
                                <div className="absolute top-4 left-4 z-20">
                                    <Badge variant="success" className="animate-bounce shadow-lg">Link Copied!</Badge>
                                </div>
                            )}
                            <div className="absolute inset-x-0 top-0 p-4 flex-between z-10">
                                <Badge variant="info" className="bg-black/50 backdrop-blur-md border-white/10 font-mono">
                                    {video.duration}
                                </Badge>
                                <div className={`source-indicator ${video.size === 'Cloud' ? 'source-drive' : 'source-local'}`}>
                                    {video.size === 'Cloud' ? <Link2 size={10} /> : <HardDrive size={10} />}
                                    {video.size === 'Cloud' ? 'Drive' : 'Local'}
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                                <Button
                                    iconOnly
                                    className="rounded-full w-12 h-12"
                                    icon={<Play size={24} fill="currentColor" />}
                                    onClick={() => setPlayingVideo(video)}
                                />
                            </div>
                        </div>
                        <CardBody className="p-4 bg-[#111318]">
                            <h3 className="font-semibold text-[1.05rem] mb-1 line-clamp-1 group-hover:text-[var(--primary)] transition-colors" title={video.title}>{video.title}</h3>
                            <p className="text-sm text-[var(--text-muted)] mt-1 flex gap-3">
                                <span>{video.views} views</span>
                                <span>•</span>
                                <span>{video.date}</span>
                            </p>

                            <div className="flex-between mt-4 pt-4 border-t border-[var(--border-light)] text-sm">
                                <span className="text-[var(--text-muted)] font-mono text-xs">{video.size}</span>
                                <div className="flex gap-1">
                                    <Button
                                        variant="secondary"
                                        className="p-1.5 h-auto text-[var(--text-muted)] hover:text-white border-none bg-transparent hover:bg-white/5"
                                        iconOnly
                                        icon={<Download size={16} />}
                                        title="Download"
                                    />
                                    <Button
                                        variant="secondary"
                                        className="p-1.5 h-auto text-[var(--text-muted)] hover:text-white border-none bg-transparent hover:bg-white/5"
                                        iconOnly
                                        icon={<Search size={16} />}
                                        title="Share"
                                        onClick={() => handleShare(video.id)}
                                    />
                                    <Button
                                        variant="danger"
                                        className="p-1.5 h-auto border-none bg-transparent hover:bg-red-500/10"
                                        iconOnly
                                        icon={<Trash2 size={16} />}
                                        title="Delete"
                                        onClick={() => handleDelete(video.id)}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}

            </div>

            <AddVideoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddCloudVideo}
            />

            {/* Video Playback & Details Modal */}
            {playingVideo && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setPlayingVideo(null)} />

                    <div className="relative w-full max-w-4xl bg-[#0d1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                        <div className="flex-between p-4 border-b border-white/5">
                            <h2 className="text-lg font-bold truncate pr-8">{playingVideo.title}</h2>
                            <button onClick={() => setPlayingVideo(null)} className="text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-2 sm:p-6 space-y-6">
                            {playingVideo.url ? (
                                <HLSPlayer
                                    url={playingVideo.url}
                                    autoPlay={true}
                                    poster={playingVideo.thumbnail}
                                />
                            ) : (
                                <div className="aspect-video bg-black/40 rounded-xl flex-center flex-col text-muted border border-white/5 border-dashed">
                                    <Play size={48} className="mb-4 opacity-20" />
                                    <p>Local playback not available in this view.</p>
                                    <p className="text-xs">Only cloud-sourced videos can be previewed.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                    <div className="flex flex-wrap gap-4">
                                        <Badge variant="info" className="bg-primary/20 text-primary border-primary/20 px-3 py-1 flex items-center gap-1.5">
                                            <Calendar size={12} /> Played on {playingVideo.date}
                                        </Badge>
                                        <Badge variant="info" className="bg-secondary/20 text-secondary border-secondary/20 px-3 py-1 flex items-center gap-1.5">
                                            <Eye size={12} /> {playingVideo.views} Views
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted leading-relaxed">
                                        This broadcast was recorded and saved to your cloud library.
                                        {playingVideo.size === 'Cloud' ? ' It is hosted on Google Drive and streamed via low-latency HLS.' : ' This is a local recording available for download.'}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <Button variant="primary" className="w-full" icon={<Download size={18} />}>Download Master</Button>
                                    <Button variant="secondary" className="w-full" icon={<Share2 size={18} />} onClick={() => handleShare(playingVideo.id)}>Share Link</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Videos;
