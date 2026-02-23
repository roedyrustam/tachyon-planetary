import React from 'react';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Play, Download, Trash2, Search, Filter, UploadCloud } from 'lucide-react';

const mockVideos = [
    { id: 1, title: 'Weekly Community Update #45', duration: '1:12:05', size: '2.4 GB', date: 'Oct 12, 2026', views: '12K', thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'Gaming Stream - Valorant Ranked', duration: '3:45:20', size: '8.1 GB', date: 'Oct 10, 2026', views: '45K', thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Tech Talk: Future of Web3', duration: '0:58:30', size: '1.2 GB', date: 'Oct 08, 2026', views: '8.5K', thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 4, title: 'How to build a Streaming PC', duration: '0:24:15', size: '4.8 GB', date: 'Oct 05, 2026', views: '150K', thumbnail: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 5, title: 'Q&A Session with Subscribers', duration: '1:30:00', size: '3.0 GB', date: 'Oct 01, 2026', views: '18K', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 6, title: 'Indie Game Showcase', duration: '2:15:40', size: '5.5 GB', date: 'Sep 28, 2026', views: '22K', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
];

const Videos: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="flex-between flex-wrap gap-4 page-header mb-8">
                <div>
                    <h1 className="page-title">Video Library</h1>
                    <p className="page-subtitle">Manage your past streams and uploaded videos</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={<UploadCloud size={18} />}>Upload File</Button>
                </div>
            </div>

            <div className="flex-between flex-wrap gap-4 mb-6">
                <div className="w-full md:w-96">
                    <Input
                        placeholder="Search videos..."
                        icon={<Search size={18} />}
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
                {mockVideos.map(video => (
                    <Card key={video.id} className="group overflow-hidden rounded-xl border border-[var(--border-light)] bg-[#1a1d24]">
                        <div className="relative aspect-video overflow-hidden">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                <Badge variant="info" className="self-end mb-auto bg-black/50 backdrop-blur-md border-white/10 font-mono">
                                    {video.duration}
                                </Badge>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                                    <Button iconOnly className="rounded-full w-12 h-12" icon={<Play size={24} fill="currentColor" />} />
                                </div>
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
                                    <Button variant="secondary" className="p-1.5 h-auto text-[var(--text-muted)] hover:text-white border-none bg-transparent hover:bg-white/5" iconOnly icon={<Download size={16} />} title="Download" />
                                    <Button variant="danger" className="p-1.5 h-auto border-none bg-transparent hover:bg-red-500/10" iconOnly icon={<Trash2 size={16} />} title="Delete" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Videos;
