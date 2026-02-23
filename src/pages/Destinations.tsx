import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Youtube, Facebook, Twitch, Server, Plus, Settings, Power } from 'lucide-react';
import AddDestinationModal from '../components/ui/AddDestinationModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Destination {
    id: string;
    name: string;
    platform: string;
    active: boolean;
    stream_key?: string;
}

const getPlatformIcon = (platform: string) => {
    switch (platform) {
        case 'YouTube': return <Youtube size={24} color="#FF0000" />;
        case 'Facebook': return <Facebook size={24} color="#1877F2" />;
        case 'Twitch': return <Twitch size={24} color="#9146FF" />;
        default: return <Server size={24} className="text-muted" />;
    }
};

const Destinations: React.FC = () => {
    const { user } = useAuth();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!user) return;
        fetchDestinations();
    }, [user]);

    const fetchDestinations = async () => {
        const { data, error } = await supabase
            .from('destinations')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) console.error('Error fetching destinations:', error);
        else setDestinations(data || []);
        setLoading(false);
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('destinations')
            .update({ active: !currentStatus })
            .eq('id', id);

        if (error) console.error('Error updating destination:', error);
        else fetchDestinations();
    };

    const handleAddDestination = async (newDest: { name: string; platform: string }) => {
        if (!user) return;

        const { error } = await supabase
            .from('destinations')
            .insert([{
                user_id: user.id,
                name: newDest.name,
                platform: newDest.platform,
                active: false
            }]);

        if (error) console.error('Error adding destination:', error);
        else fetchDestinations();
    };

    return (
        <div className="animate-fade-in">
            <div className="flex-between page-header">
                <div>
                    <h1 className="page-title">Destinations</h1>
                    <p className="page-subtitle">Manage where your stream is broadcasted</p>
                </div>
                <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>Add Destination</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {loading ? (
                    <div className="col-span-full py-20 text-center animate-pulse text-muted">Loading destinations...</div>
                ) : destinations.map(dest => (
                    <Card key={dest.id} hoverable>
                        <CardHeader className="flex-between">
                            <div className="flex-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                    {getPlatformIcon(dest.platform)}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{dest.name}</h3>
                                    <p className="text-xs text-muted">{dest.platform}</p>
                                </div>
                            </div>
                            <Button
                                iconOnly
                                variant={dest.active ? 'primary' : 'secondary'}
                                icon={<Power size={18} />}
                                onClick={() => toggleActive(dest.id, dest.active)}
                                title={dest.active ? 'Deactivate' : 'Activate'}
                                className={dest.active ? 'shadow-[0_0_15px_rgba(99,102,241,0.5)]' : ''}
                            />
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-3">
                                <div className="flex-between text-sm">
                                    <span className="text-muted">Status</span>
                                    <span className={dest.active ? 'text-success font-medium' : 'text-muted'}>
                                        {dest.active ? 'Ready to Stream' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex-between text-sm">
                                    <span className="text-muted">Stream Key</span>
                                    <span className="font-mono">••••••••••••</span>
                                </div>
                            </div>
                        </CardBody>
                        <CardFooter className="flex-between">
                            <Button variant="secondary" className="text-sm px-3 py-1" icon={<Settings size={14} />}>Settings</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <h2 className="text-xl font-semibold mb-6">Supported Platforms</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { name: 'YouTube Live', icon: <Youtube size={20} color="#FF0000" /> },
                    { name: 'Facebook Live', icon: <Facebook size={20} color="#1877F2" /> },
                    { name: 'Twitch', icon: <Twitch size={20} color="#9146FF" /> },
                    { name: 'Custom RTMP', icon: <Server size={20} /> },
                ].map((platform, idx) => (
                    <div key={idx} className="glass p-6 text-center rounded-xl cursor-pointer hover:bg-white/5 transition-colors group">
                        <div className="mb-3 flex-center opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-200">
                            {platform.icon}
                        </div>
                        <p className="font-medium text-sm text-muted group-hover:text-white transition-colors">{platform.name}</p>
                    </div>
                ))}
            </div>

            <AddDestinationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddDestination}
            />
        </div>
    );
};

export default Destinations;
