import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Calendar as CalendarIcon, Clock, Plus, Edit2, Trash2 } from 'lucide-react';
import AddScheduleModal from '../components/ui/AddScheduleModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Schedule {
    id: string;
    title: string;
    date: string;
    time: string;
    duration: string;
    platforms: string[];
}

const SchedulePage: React.FC = () => {
    const { user } = useAuth();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!user) return;
        fetchSchedules();
    }, [user]);

    const fetchSchedules = async () => {
        const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .order('date', { ascending: true })
            .order('time', { ascending: true });

        if (error) console.error('Error fetching schedules:', error);
        else setSchedules(data || []);
        setLoading(false);
    };

    const handleAddSchedule = async (newSchedule: Omit<Schedule, 'id'>) => {
        if (!user) return;

        const { error } = await supabase
            .from('schedules')
            .insert([{
                user_id: user.id,
                ...newSchedule
            }]);

        if (error) console.error('Error adding schedule:', error);
        else fetchSchedules();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to cancel this scheduled broadcast?')) {
            const { error } = await supabase
                .from('schedules')
                .delete()
                .eq('id', id);

            if (error) console.error('Error deleting schedule:', error);
            else fetchSchedules();
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex-between flex-wrap gap-4 page-header mb-8">
                <div>
                    <h1 className="page-title">Broadcast Schedule</h1>
                    <p className="page-subtitle">Plan and organize your upcoming streams</p>
                </div>
                <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>Schedule Stream</Button>
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
                                    const hasEvent = schedules.some(s => new Date(s.date).getDate() === date);

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
                                    All Scheduled ({schedules.length})
                                </label>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Event List */}
                <div className="xl:col-span-3 space-y-4">
                    <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>

                    {loading ? (
                        <div className="py-20 text-center animate-pulse text-muted">Loading your schedule...</div>
                    ) : schedules.map((schedule) => (
                        <Card key={schedule.id} className="border-l-4 border-l-primary hover:border-l-secondary transition-colors" hoverable>
                            <CardBody className="p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between">

                                <div className="flex gap-5">
                                    <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl min-w-[70px]">
                                        <span className="text-xs text-muted uppercase font-semibold">
                                            {new Date(schedule.date).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                        <span className="text-2xl font-bold">{new Date(schedule.date).getDate()}</span>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-semibold">{schedule.title}</h3>
                                            <Badge variant={new Date(schedule.date) >= new Date() ? 'success' : 'info'}>
                                                {new Date(schedule.date) >= new Date() ? 'Upcoming' : 'Past'}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted mt-2">
                                            <span className="flex items-center gap-1.5"><Clock size={14} /> {schedule.time} ({schedule.duration})</span>
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
                                        <Button
                                            variant="danger"
                                            className="text-muted hover:text-white"
                                            iconOnly
                                            icon={<Trash2 size={16} />}
                                            title="Cancel Event"
                                            onClick={() => handleDelete(schedule.id)}
                                        />
                                    </div>
                                </div>

                            </CardBody>
                        </Card>
                    ))}

                    {schedules.length === 0 && (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <CalendarIcon size={48} className="mx-auto text-muted mb-4 opacity-20" />
                            <p className="text-muted">No scheduled broadcasts found.</p>
                            <Button variant="secondary" className="mt-4" onClick={() => setIsModalOpen(true)}>Schedule your first stream</Button>
                        </div>
                    )}

                </div>
            </div>

            <AddScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddSchedule}
            />
        </div>
    );
};

export default SchedulePage;
