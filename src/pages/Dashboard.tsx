import React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Activity, Users, Radio, Video, ArrowUpRight } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
    { name: '10:00', viewers: 1200 },
    { name: '10:10', viewers: 1800 },
    { name: '10:20', viewers: 1600 },
    { name: '10:30', viewers: 2400 },
    { name: '10:40', viewers: 2800 },
    { name: '10:50', viewers: 3600 },
    { name: '11:00', viewers: 4200 },
];

const Dashboard: React.FC = () => {
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
                    { title: 'Total Viewers', value: '4,200', change: '+12%', icon: <Users size={24} className="text-primary" /> },
                    { title: 'Active Streams', value: '3', change: 'Live', icon: <Radio size={24} className="text-secondary" /> },
                    { title: 'Total Videos', value: '128', change: '+4 this week', icon: <Video size={24} className="text-accent" /> },
                    { title: 'Avg. Bitrate', value: '6.2 Mbps', change: 'Stable', icon: <Activity size={24} className="text-success" /> },
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
                        <CardHeader className="flex-between">
                            <CardTitle>Viewership Overview</CardTitle>
                            <Badge variant="success">Live</Badge>
                        </CardHeader>
                        <CardBody>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                                        <Area type="monotone" dataKey="viewers" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorViewers)" />
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
                                {[
                                    { name: 'YouTube Live', status: 'Healthy', color: 'success' },
                                    { name: 'Facebook Gaming', status: 'Healthy', color: 'success' },
                                    { name: 'Twitch', status: 'Low Bitrate', color: 'warning' },
                                ].map((dest, idx) => (
                                    <div key={idx} className="flex-between p-3 rounded-lg bg-white/5 border border-white/5">
                                        <span className="font-medium">{dest.name}</span>
                                        <Badge variant={dest.color as any}>{dest.status}</Badge>
                                    </div>
                                ))}
                            </div>
                            <Button variant="secondary" className="w-full mt-4">Manage Destinations</Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
