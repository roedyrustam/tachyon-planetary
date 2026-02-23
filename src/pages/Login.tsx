import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardBody, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            alert('Signup successful! Please check your email for verification.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] p-4 bg-dots">
            <Card className="max-w-md w-full glass shadow-2xl">
                <CardHeader className="text-center space-y-2 pb-2">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                        <LogIn className="text-primary" size={32} />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Welcome to StreamPulse
                    </CardTitle>
                    <p className="text-sm text-muted">Sign in to manage your broadcasts</p>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardBody className="space-y-4 pt-4">
                        {error && (
                            <div className="bg-danger/10 border border-danger/20 text-danger text-xs p-3 rounded-lg text-center animate-shake">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Email Address</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 focus:border-primary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 focus:border-primary/50"
                            />
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-col gap-3 pt-6">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-3 text-base shadow-lg shadow-primary/20"
                            loading={loading}
                        >
                            Sign In
                        </Button>
                        <div className="relative w-full py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/5"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0a0c10] px-2 text-muted">Or</span>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full py-2 text-sm border-white/5 hover:bg-white/5"
                            onClick={handleSignUp}
                            disabled={loading}
                        >
                            Create New Account
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Login;
