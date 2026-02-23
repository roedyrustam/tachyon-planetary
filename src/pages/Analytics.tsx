import React from 'react';
import { Card, CardBody, CardHeader, CardTitle, } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend, Area, AreaChart
} from 'recharts';
import { Users, Clock, MessageSquare, TrendingUp, Globe, Smartphone, Monitor } from 'lucide-react';

const engagementData = [
    { time: '0m', viewers: 1200, chat: 45 },
    { time: '10m', viewers: 1800, chat: 62 },
    { time: '20m', viewers: 2400, chat: 88 },
    { time: '30m', viewers: 2200, chat: 110 },
    { time: '40m', viewers: 3600, chat: 145 },
    { time: '50m', viewers: 4200, chat: 180 },
    { time: '60m', viewers: 4800, chat: 210 },
];

const platformData = [
    { name: 'YouTube', value: 45, color: '#FF0000' },
    { name: 'Twitch', value: 35, color: '#9146FF' },
    { name: 'Facebook', value: 15, color: '#1877F2' },
    { name: 'Other', value: 5, color: '#6366F1' },
];

const regionData = [
    { name: 'North America', value: 3500 },
    { name: 'Europe', value: 2800 },
    { name: 'Asia', value: 4200 },
    { name: 'South America', value: 1200 },
    { name: 'Oceania', value: 800 },
];

const Analytics: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <h1 className="page-title">Analytics Deep Dive</h1>
                <p className="page-subtitle">Granular performance data for your broadcasting empire</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { title: 'Total Watch Time', value: '1,240h', change: '+18%', icon: <Clock size={20} className="text-primary" /> },
                    { title: 'Engagement Rate', value: '8.4%', change: '+2.1%', icon: <MessageSquare size={20} className="text-secondary" /> },
                    { title: 'New Followers', value: '1,842', change: '+450', icon: <TrendingUp size={20} className="text-accent" /> },
                    { title: 'Peak Viewers', value: '5,200', change: 'Stable', icon: <Users size={20} className="text-success" /> },
                ].map((stat, idx) => (
                    <Card key={idx}>
                        <CardBody className="flex-between">
                            <div>
                                <p className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                                <p className="text-xs mt-2 text-success inline-flex items-center gap-1 bg-success/10 px-2 py-0.5 rounded-full">
                                    {stat.change}
                                </p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                {stat.icon}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Engagement Over Time */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Engagement vs Viewership</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={engagementData}>
                                    <defs>
                                        <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                    <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area type="monotone" dataKey="chat" name="Chat Messages" stroke="var(--secondary)" fillOpacity={1} fill="url(#colorEngagement)" />
                                    <Line type="monotone" dataKey="viewers" name="Live Viewers" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--bg-card)' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>

                {/* Platform Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Platform Distribution</CardTitle>
                    </CardHeader>
                    <CardBody className="flex items-center">
                        <div className="h-[300px] w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={platformData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {platformData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={platformData[index].color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-4 pl-8">
                            {platformData.map((item, idx) => (
                                <div key={idx} className="flex-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </div>
                                    <span className="text-sm text-muted font-mono">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Geographic Data */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Globe size={18} className="text-primary" />
                            Viewers by Region
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={regionData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                                    <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {regionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`hsla(234, 89%, ${60 - (index * 8)}%, 0.8)`} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>

                {/* Device Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Device Usage</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                            <Monitor size={32} className="text-primary" />
                            <div className="flex-1">
                                <div className="flex-between mb-1">
                                    <span className="text-sm font-medium">Desktop</span>
                                    <span className="text-sm font-mono">68%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '68%' }} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                            <Smartphone size={32} className="text-secondary" />
                            <div className="flex-1">
                                <div className="flex-between mb-1">
                                    <span className="text-sm font-medium">Mobile</span>
                                    <span className="text-sm font-mono">24%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary" style={{ width: '24%' }} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                            <Globe size={32} className="text-accent" />
                            <div className="flex-1">
                                <div className="flex-between mb-1">
                                    <span className="text-sm font-medium">Browser/TV</span>
                                    <span className="text-sm font-mono">8%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-accent" style={{ width: '8%' }} />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
