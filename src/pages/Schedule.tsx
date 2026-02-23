import React from 'react';
import { Card, CardBody, CardHeader, CardTitle, } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Calendar as CalendarIcon, Clock, Users, Plus, Edit2, Trash2 } from 'lucide-react';

const mockSchedules = [
    { id: 1, title: 'Weekly Q&A - Web Development', date: '2026-10-25', time: '14:00', duration: '1h 30m', expectedViewers: '5k+', status: 'upcoming', platforms: ['YouTube', 'Twitch'] },
    { id: 2, title: 'Live Coding: Building a React App', date: '2026-10-26', time: '20:00', duration: '2h 00m', expectedViewers: '3k+', status: 'draft', platforms: ['YouTube'] },
    { id: 3, title: 'Interview with Tech Lead', date: '2026-10-28', time: '18:00', duration: '1h 00m', expectedViewers: '10k+', status: 'upcoming', platforms: ['YouTube', 'Facebook', 'Twitch'] },
    { id: 4, title: 'Product Launch Showcase', date: '2026-11-01', time: '10:00', duration: '45m', expectedViewers: '25k+', status: 'upcoming', platforms: ['Custom RTMP', 'YouTube'] },
];

const Schedule: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="flex-between flex-wrap gap-4 page-header mb-8">
                <div>
                    <h1 className="page-title">Broadcast Schedule</h1>
                    <p className="page-subtitle">Plan and organize your upcoming streams</p>
                </div>
                <Button icon={<Plus size={18} />}>Schedule Stream</Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* Left Column: Calendar Widget (Mock) & Filters */}
                <div className="xl:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CalendarIcon size={18} className="text-primary" />
                                October 2026
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="p-4">
                            {/* Simple mock calendar layout */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                                    <div key={day} className="text-xs font-medium text-muted">{day}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                {Array.from({ length: 31 }).map((_, i) => {
                                    const date = i + 1;
                                    const isToday = date === 24;
                                    const hasEvent = [25, 26, 28].includes(date);

                                    return (
                                        <div
                                            key={i}
                                            className={`
                         aspect-square flex items-center justify-center rounded-full cursor-pointer transition-colors
                         ${isToday ? 'bg-primary text-white font-bold' : ''}
                         ${!isToday && hasEvent ? 'bg-primary/20 text-primary font-medium' : 'hover:bg-white/10'}
                       `}
                                        >
                                            {date}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="space-y-4">
                            <h3 className="font-medium text-sm text-muted mb-2">Filters</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" className="rounded bg-transparent border-white/20 text-primary focus:ring-primary h-4 w-4" defaultChecked />
                                    Upcoming (3)
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" className="rounded bg-transparent border-white/20 text-primary focus:ring-primary h-4 w-4" defaultChecked />
                                    Drafts (1)
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" className="rounded bg-transparent border-white/20 text-primary focus:ring-primary h-4 w-4" />
                                    Past Streams (42)
                                </label>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Event List */}
                <div className="xl:col-span-3 space-y-4">
                    <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>

                    {mockSchedules.map((schedule) => (
                        <Card key={schedule.id} className="border-l-4 border-l-primary hover:border-l-secondary transition-colors" hoverable>
                            <CardBody className="p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between">

                                <div className="flex gap-5">
                                    <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl min-w-[70px]">
                                        <span className="text-xs text-muted uppercase font-semibold">{new Date(schedule.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                        <span className="text-2xl font-bold">{new Date(schedule.date).getDate()}</span>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-semibold">{schedule.title}</h3>
                                            {schedule.status === 'upcoming' ? (
                                                <Badge variant="success">Upcoming</Badge>
                                            ) : (
                                                <Badge variant="warning">Draft</Badge>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted mt-2">
                                            <span className="flex items-center gap-1.5"><Clock size={14} /> {schedule.time} ({schedule.duration})</span>
                                            <span className="flex items-center gap-1.5"><Users size={14} /> Est. ~{schedule.expectedViewers}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mt-4 md:mt-0">
                                    <div className="flex -space-x-2">
                                        {schedule.platforms.map((p, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-[#1a1d24] border border-white/10 flex items-center justify-center text-[10px] font-bold z-10" title={p}>
                                                {p.substring(0, 1)}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                                        <Button variant="secondary" iconOnly icon={<Edit2 size={16} />} title="Edit Event" />
                                        <Button variant="danger" className="text-muted hover:text-white" iconOnly icon={<Trash2 size={16} />} title="Cancel Event" />
                                    </div>
                                </div>

                            </CardBody>
                        </Card>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Schedule;
