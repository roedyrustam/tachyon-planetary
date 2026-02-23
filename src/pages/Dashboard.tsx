import React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Activity, Users, Radio, Video, ArrowUpRight } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const viewershipData: Record<string, { name: string; viewers: number }[]> = {
    '1h': [
        { name: '10:00', viewers: 1200 },
        { name: '10:10', viewers: 1800 },
        { name: '10:20', viewers: 1600 },
        { name: '10:30', viewers: 2400 },
        { name: '10:40', viewers: 2800 },
        { name: '10:50', viewers: 3600 },
        { name: '11:00', viewers: 4200 },
    ],
    '24h': [
        { name: '00:00', viewers: 800 },
        { name: '04:00', viewers: 1200 },
        { name: '08:00', viewers: 2500 },
        { name: '12:00', viewers: 4200 },
        { name: '16:00', viewers: 3800 },
        { name: '20:00', viewers: 5100 },
        { name: '23:59', viewers: 4200 },
    ],
    '7d': [
        { name: 'Mon', viewers: 3200 },
        { name: 'Tue', viewers: 4500 },
        { name: 'Wed', viewers: 4200 },
        { name: 'Thu', viewers: 5800 },
        { name: 'Fri', viewers: 7200 },
        { name: 'Sat', viewers: 8500 },
        { name: 'Sun', viewers: 4200 },
    ]
};

import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Dashboard: React.FC = () => {
    const [timeRange, setTimeRange] = React.useState('1h');
    const [chartData, setChartData] = React.useState(viewershipData['1h']);
    const [stats, setStats] = React.useState({
        viewers: '4,200',
        activeStreams: 0,
        totalVideos: 0,
        bitrate: '6.2 Mbps',
        isLive: false
    });
    const [destinations, setDestinations] = React.useState<{ id: string; name: string; active: boolean }[]>([]);
    const { user } = useAuth();

    const fetchStats = async () => {
        try {
            const [destRes, videoRes, profileRes] = await Promise.all([
                supabase.from('destinations').select('*').eq('active', true),
                supabase.from('videos').select('id', { count: 'exact' }),
                supabase.from('profiles').select('is_live').eq('id', user?.id).single()
            ]);

            setStats(prev => ({
                ...prev,
                activeStreams: destRes.data?.length || 0,
                totalVideos: videoRes.count || 0,
                isLive: profileRes.data?.is_live || false
            }));
            setDestinations(destRes.data || []);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const handleRangeChange = (range: string) => {
        setTimeRange(range);
        setChartData(viewershipData[range] || viewershipData['1h']);
    };

    useEffect(() => {
        if (!user) return;
        fetchStats();

        // Subscribe to profile changes for real-time live status
        const channel = supabase
            .channel('profile-status')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${user?.id}`
            }, (payload: { new: { is_live: boolean } }) => {
                if (payload.new && 'is_live' in payload.new) {
                    setStats(prev => ({ ...prev, isLive: payload.new.is_live }));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <div className="animate-fade-in">
            <div className="flex-between page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Overview of your streaming performance</p>
                </div>
                <Button icon={<Radio size={18} />}>Go Live Now</Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { title: 'Current Status', value: stats.isLive ? 'LIVE' : 'Offline', change: stats.isLive ? 'Active' : 'Standby', icon: <Radio size={24} className={stats.isLive ? "text-danger animate-pulse" : "text-primary"} /> },
                    { title: 'Active Streams', value: stats.activeStreams.toString(), change: 'Live', icon: <Activity size={24} className="text-secondary" /> },
                    { title: 'Total Videos', value: stats.totalVideos.toString(), change: '+4 this week', icon: <Video size={24} className="text-accent" /> },
                    { title: 'Total Viewers', value: stats.viewers, change: '+12%', icon: <Users size={24} className="text-primary" /> },
                ].map((stat, idx) => (
                    <Card key={idx} hoverable>
                        <CardBody className="flex-between">
                            <div>
                                <p className="text-muted text-sm font-medium mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                                <p className="text-sm mt-2 text-success flex items-center gap-1">
                                    <ArrowUpRight size={14} /> {stat.change}
                                </p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl">
                                {stat.icon}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex-between flex-wrap gap-4">
                            <CardTitle>Viewership Overview</CardTitle>
                            <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/5">
                                {['1h', '24h', '7d'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => handleRangeChange(range)}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${timeRange === range
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'text-muted hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: '8px' }}
                                            itemStyle={{ color: 'var(--text-main)' }}
                                        />
                                        <Area
                                            key={timeRange}
                                            type="monotone"
                                            dataKey="viewers"
                                            stroke="var(--primary)"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorViewers)"
                                            animationDuration={1000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Side Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Destinations</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                {destinations.length > 0 ? (
                                    destinations.map((dest, idx) => (
                                        <div key={idx} className="flex-between p-3 rounded-lg bg-white/5 border border-white/5">
                                            <span className="font-medium">{dest.name}</span>
                                            <Badge variant="success">Healthy</Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-sm text-muted">No active destinations</div>
                                )}
                            </div>
                            <Button variant="secondary" className="w-full mt-4" onClick={() => window.location.href = '/destinations'}>Manage Destinations</Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
