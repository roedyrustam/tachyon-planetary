import React from 'react';
import { Card, CardBody, CardHeader, CardTitle, } from '../components/ui/Card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Line, Legend, Area, AreaChart
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

const revenueData = [
    { day: 'Mon', superchat: 450, bits: 200, stars: 150 },
    { day: 'Tue', superchat: 320, bits: 180, stars: 120 },
    { day: 'Wed', superchat: 680, bits: 450, stars: 310 },
    { day: 'Thu', superchat: 510, bits: 210, stars: 180 },
    { day: 'Fri', superchat: 890, bits: 600, stars: 450 },
    { day: 'Sat', superchat: 1200, bits: 850, stars: 620 },
    { day: 'Sun', superchat: 950, bits: 400, stars: 380 },
];

const Analytics: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState<'overview' | 'revenue'>('overview');
    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8 flex-between">
                <div>
                    <h1 className="page-title">Analytics Deep Dive</h1>
                    <p className="page-subtitle">Granular performance data for your broadcasting empire</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-white'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('revenue')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'revenue' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-white'}`}
                    >
                        Revenue
                    </button>
                </div>
            </div>

            {activeTab === 'overview' ? (
                <>
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
                                                {platformData.map((_, index) => (
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
                </>
            ) : (
                <div className="space-y-8 animate-fade-in">
                    {/* Revenue Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Total Revenue', value: '$4,285.50', change: '+24%', color: 'text-primary' },
                            { title: 'SuperChat Count', value: '1,240', change: '+12%', color: 'text-secondary' },
                            { title: 'Avg. Donation', value: '$3.45', change: '-5%', color: 'text-accent' },
                        ].map((stat, idx) => (
                            <Card key={idx}>
                                <CardBody>
                                    <p className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
                                    <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
                                    <span className="text-xs text-success mt-2 font-medium bg-success/10 px-2 py-0.5 rounded-full inline-block">
                                        {stat.change} vs last 7 days
                                    </span>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Revenue Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Revenue Breakdown</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="h-[400px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                        <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: '12px' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="superchat" name="SuperChats ($)" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="bits" name="Bits & Stars" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardBody>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Top Donors</CardTitle></CardHeader>
                            <CardBody className="p-0">
                                <div className="space-y-1">
                                    {[
                                        { name: 'AlexStreamer', amount: '$450.00', platform: 'YouTube' },
                                        { name: 'GameKing_99', amount: '$320.50', platform: 'Twitch' },
                                        { name: 'SarahLovesLive', amount: '$280.00', platform: 'Facebook' },
                                        { name: 'NightOwl', amount: '$150.00', platform: 'YouTube' },
                                    ].map((donor, idx) => (
                                        <div key={idx} className="flex-between p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex-center text-primary text-xs font-bold">
                                                    {donor.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{donor.name}</p>
                                                    <p className="text-xs text-muted">{donor.platform}</p>
                                                </div>
                                            </div>
                                            <span className="font-mono text-success font-bold">{donor.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Recent Large SuperChats</CardTitle></CardHeader>
                            <CardBody className="p-0">
                                <div className="space-y-1">
                                    {[
                                        { text: "Love the content! Keep going!", amount: "$100.00", user: "ProGamer" },
                                        { text: "Tutorial was super helpful.", amount: "$50.00", user: "DevMind" },
                                        { text: "Happy birthday stream!", amount: "$50.00", user: "FanNumber1" },
                                        { text: "Amazing setup tour.", amount: "$25.00", user: "KevinJ" },
                                    ].map((chat, idx) => (
                                        <div key={idx} className="flex flex-col gap-1 p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <div className="flex-between">
                                                <span className="text-xs font-bold text-primary">{chat.user}</span>
                                                <span className="text-xs font-bold text-secondary">{chat.amount}</span>
                                            </div>
                                            <p className="text-sm italic text-muted">"{chat.text}"</p>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
