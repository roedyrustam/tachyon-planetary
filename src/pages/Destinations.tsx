import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Youtube, Facebook, Twitch, Server, Plus, Settings, Power } from 'lucide-react';
import AddDestinationModal from '../components/ui/AddDestinationModal';

interface Destination {
    id: number;
    name: string;
    platform: string;
    icon: React.ReactNode;
    active: boolean;
    connected: boolean;
}

const initialDestinations: Destination[] = [
    { id: 1, name: 'Main Channel', platform: 'YouTube', icon: <Youtube size={24} color="#FF0000" />, active: true, connected: true },
    { id: 2, name: 'Gaming Page', platform: 'Facebook', icon: <Facebook size={24} color="#1877F2" />, active: true, connected: true },
    { id: 3, name: 'StreamPulseTV', platform: 'Twitch', icon: <Twitch size={24} color="#9146FF" />, active: false, connected: true },
    { id: 4, name: 'Custom Server', platform: 'RTMP', icon: <Server size={24} className="text-muted" />, active: false, connected: false },
];

const Destinations: React.FC = () => {
    const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleActive = (id: number) => {
        setDestinations(destinations.map(d =>
            d.id === id && d.connected ? { ...d, active: !d.active } : d
        ));
    };

    const handleAddDestination = (newDest: { name: string; platform: string; icon: React.ReactNode }) => {
        setDestinations([
            ...destinations,
            {
                id: Date.now(),
                ...newDest,
                active: false,
                connected: true
            }
        ]);
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
                {destinations.map(dest => (
                    <Card key={dest.id} hoverable className={!dest.connected ? 'opacity-70' : ''}>
                        <CardHeader className="flex-between">
                            <div className="flex-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                    {dest.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{dest.name}</h3>
                                    <p className="text-xs text-muted">{dest.platform}</p>
                                </div>
                            </div>
                            {dest.connected ? (
                                <Button
                                    iconOnly
                                    variant={dest.active ? 'primary' : 'secondary'}
                                    icon={<Power size={18} />}
                                    onClick={() => toggleActive(dest.id)}
                                    title={dest.active ? 'Deactivate' : 'Activate'}
                                    className={dest.active ? 'shadow-[0_0_15px_rgba(99,102,241,0.5)]' : ''}
                                />
                            ) : (
                                <Badge variant="warning">Not Connected</Badge>
                            )}
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-3">
                                <div className="flex-between text-sm">
                                    <span className="text-muted">Status</span>
                                    {dest.connected ? (
                                        <span className={dest.active ? 'text-success font-medium' : 'text-muted'}>
                                            {dest.active ? 'Ready to Stream' : 'Inactive'}
                                        </span>
                                    ) : (
                                        <span className="text-warning">Needs Setup</span>
                                    )}
                                </div>
                                {dest.connected && (
                                    <div className="flex-between text-sm">
                                        <span className="text-muted">Stream Key</span>
                                        <span className="font-mono">••••••••••••</span>
                                    </div>
                                )}
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
