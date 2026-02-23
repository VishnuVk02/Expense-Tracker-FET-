import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, reset, resetPassword } from './authSlice';
import { Wallet, LogIn, UserPlus, Mail, User, ShieldCheck, Lock, Users, Key, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Login = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [isLogin, setIsLogin] = useState(true);
    const [isForgot, setIsForgot] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        groupName: '',
        inviteCode: ''
    });

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => dispatch(reset()), 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => setSuccessMsg(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMsg]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isForgot) {
            const result = await dispatch(resetPassword({
                username: formData.username,
                email: formData.email,
                newPassword: formData.password
            }));
            if (!result.error) {
                setSuccessMsg('Password updated successfully!');
                setIsForgot(false);
                setIsLogin(true);
            }
        } else if (isLogin) {
            dispatch(login({ email: formData.email, password: formData.password }));
        } else {
            dispatch(register(formData));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 pt-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary text-white shadow-xl shadow-primary/20 mb-6 group transition-transform hover:scale-110">
                        <Wallet size={40} />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                        Expense<span className="text-primary text-secondary">Flow</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Collaborative Family Budgeting</p>
                </div>

                <div className="glass p-8 rounded-3xl space-y-6">
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                        <button
                            onClick={() => { setIsLogin(true); setIsForgot(false); }}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isLogin && !isForgot ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-500'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setIsForgot(false); }}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${!isLogin && !isForgot ? 'bg-white dark:bg-slate-800 shadow-sm text-primary' : 'text-slate-500'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {successMsg && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 p-4 rounded-2xl text-xs font-bold border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2">
                            <CheckCircle2 size={16} />
                            {successMsg}
                        </div>
                    )}

                    {error && error !== 'username not available' && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-900/30 animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                        {isLogin && !isForgot ? (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className={`w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white ${error === 'username not available' ? 'ring-2 ring-red-500' : ''}`}
                                        placeholder="johndoe123"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                                {error === 'username not available' && !isLogin && (
                                    <p className="text-red-500 text-xs font-bold ml-1 animate-pulse">username not available</p>
                                )}
                            </div>
                        )}
                        {!isLogin || isForgot ? (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : null}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                                {isForgot ? 'New Password' : 'Password'}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {isLogin && !isForgot && (
                            <div className="flex justify-end pr-1">
                                <button
                                    type="button"
                                    onClick={() => setIsForgot(true)}
                                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        {isForgot && (
                            <div className="flex justify-start pl-1">
                                <button
                                    type="button"
                                    onClick={() => setIsForgot(false)}
                                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
                                >
                                    <ArrowLeft size={12} />
                                    Back to Login
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-primary/20 mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-primary/90 hover:to-secondary/90'}`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {isForgot ? <Key size={20} /> : (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
                                    {isForgot ? 'Save Changes' : (isLogin ? 'Log In' : (formData.inviteCode ? 'Join' : 'Sign Up'))}
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-xs">
                    <ShieldCheck size={14} />
                    <span>MongoDB & JWT Protected Storage</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
