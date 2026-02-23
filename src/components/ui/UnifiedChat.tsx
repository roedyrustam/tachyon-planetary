import React, { useState, useEffect, useRef } from 'react';
import { Youtube, Twitch, Send, Zap, Trash2, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from './Card';
import Badge from './Badge';
import Button from './Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface Message {
    id: string;
    user: string;
    text: string;
    platform: string;
    time: string;
    isSuperChat: boolean;
    amount?: string;
    created_at?: string;
}

interface UnifiedChatProps {
    isLive: boolean;
}

const UnifiedChat: React.FC<UnifiedChatProps> = ({ isLive }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
    const { user } = useAuth();
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (data && !error) {
            const formatted = data.reverse().map((msg: { id: string; display_name: string; text: string; platform: string; created_at: string; is_super_chat: boolean; amount?: string }) => ({
                id: msg.id,
                user: msg.display_name,
                text: msg.text,
                platform: msg.platform,
                time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSuperChat: msg.is_super_chat,
                amount: msg.amount
            }));
            setMessages(formatted);
        }
    };

    useEffect(() => {
        // Subscribe to real-time messages
        const channel = supabase
            .channel('chat-room')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages'
            }, (payload: { new: { id: string; display_name: string; text: string; platform: string; created_at: string; is_super_chat: boolean; amount?: string } }) => {
                const newMessage = payload.new;
                setMessages(prev => [...prev, {
                    id: newMessage.id,
                    user: newMessage.display_name,
                    text: newMessage.text,
                    platform: newMessage.platform,
                    time: new Date(newMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isSuperChat: newMessage.is_super_chat,
                    amount: newMessage.amount
                }].slice(-50));
            })
            .subscribe();

        // Initial fetch
        fetchMessages();

        return () => {
            supabase.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteMessage = async (id: string) => {
        if (!user) return;

        const { error } = await supabase
            .from('chat_messages')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting message:', error);
            // Fallback: Remove from local state
            setMessages(prev => prev.filter(m => m.id !== id));
        } else {
            // Realtime will handle it if we have a DELETE listener, 
            // but for immediate feedback:
            setMessages(prev => prev.filter(m => m.id !== id));
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !user) return;

        const { error } = await supabase
            .from('chat_messages')
            .insert([{
                user_id: user.id,
                display_name: 'You (Host)',
                text: chatInput,
                platform: 'StreamPulse',
                is_super_chat: false
            }]);

        if (!error) {
            setChatInput('');
        } else {
            console.error('Error sending message:', error);
            // Fallback for simulation if table doesn't exist yet
            const localMsg = {
                id: Date.now().toString(),
                user: 'You (Host)',
                text: chatInput,
                platform: 'StreamPulse',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSuperChat: false
            };
            setMessages(prev => [...prev, localMsg].slice(-50));
            setChatInput('');
        }
    };

    return (
        <Card className="flex-1 flex flex-col border border-primary/20 h-full min-h-[500px]">
            <CardHeader className="bg-primary/5 py-4 border-b border-primary/10">
                <CardTitle className="text-md flex-between w-full">
                    <span className="flex items-center gap-2">
                        <Zap size={18} className="text-primary fill-primary/20" />
                        Unified Chat
                    </span>
                    <Badge variant={isLive ? "success" : "info"} className="border-none">
                        {isLive ? "Live Sync" : "Standby"}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardBody className="flex-1 overflow-hidden flex flex-col p-0 bg-black/10">
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                    {messages.length === 0 && (
                        <div className="text-center text-xs text-muted py-10">
                            No messages yet. Start the conversation!
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            onMouseEnter={() => setHoveredMessage(msg.id)}
                            onMouseLeave={() => setHoveredMessage(null)}
                            className={`group relative flex flex-col gap-1.5 animate-slide-in-right p-2 rounded-lg transition-colors ${msg.isSuperChat ? 'bg-secondary/10 border-l-2 border-secondary' : 'hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-2">
                                {msg.platform === 'Youtube' ? (
                                    <Youtube size={12} className="text-red-500" />
                                ) : msg.platform === 'Twitch' ? (
                                    <Twitch size={12} className="text-purple-500" />
                                ) : (
                                    <Shield size={12} className="text-primary" />
                                )}
                                <span className={`text-xs font-bold ${msg.isSuperChat ? 'text-secondary' : 'text-primary'}`}>
                                    {msg.user}
                                </span>
                                {msg.isSuperChat && (
                                    <Badge variant="warning" className="text-[8px] px-1 py-0 h-auto">DONATION</Badge>
                                )}
                                <span className="text-[10px] text-muted ml-auto font-mono">{msg.time}</span>

                                {/* Moderation Actions */}
                                {hoveredMessage === msg.id && user && (
                                    <div className="flex items-center gap-1 ml-2">
                                        <button
                                            onClick={() => deleteMessage(msg.id)}
                                            className="p-1 hover:bg-danger/20 text-muted hover:text-danger rounded transition-colors"
                                            title="Delete Message"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className={`text-sm leading-relaxed ${msg.isSuperChat ? 'font-medium text-white' : 'text-gray-300'}`}>
                                {msg.isSuperChat && <span className="text-secondary mr-2 font-bold">{msg.amount}</span>}
                                {msg.text}
                            </p>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
                    <form className="relative flex gap-2" onSubmit={handleSendMessage}>
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Broadcast to all platforms..."
                                className="w-full bg-[#111318] border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-primary/50 text-white transition-all focus:ring-1 focus:ring-primary/20"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                                <Zap size={14} className="opacity-50" />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            iconOnly
                            variant="primary"
                            className="rounded-xl px-4 h-[46px]"
                            icon={<Send size={18} />}
                            disabled={!chatInput.trim()}
                        />
                    </form>
                </div>
            </CardBody>
        </Card>
    );
};

export default UnifiedChat;
