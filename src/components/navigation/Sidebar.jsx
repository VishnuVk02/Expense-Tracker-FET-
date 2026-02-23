import React, { useState } from 'react';
import { Wallet, LayoutDashboard, BarChart3, Users, LogOut, Sun, Moon, Copy, Check, Shield, Settings as SettingsIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Sidebar = ({ activeView, setActiveView, isDark, toggleTheme }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { group } = useSelector((state) => state.expenses);
    const [copied, setCopied] = useState(false);

    const isAdmin = user?.role === 'admin';

    const navItems = [
        { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'family', icon: Users, label: 'Family Group' },
        { id: 'settings', icon: SettingsIcon, label: 'Settings' },
    ];

    const copyInviteCode = () => {
        if (group?.inviteCode) {
            navigator.clipboard.writeText(group.inviteCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <aside className="hidden lg:flex flex-col w-72 h-screen fixed left-0 top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Wallet size={24} />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ExpenseFlow
                    </h1>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${activeView === item.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {isAdmin && group?.inviteCode && (
                    <div className="mt-8 p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1">
                            <Shield size={10} /> Admin Invite
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Share this code to invite family members:</p>
                        <button
                            onClick={copyInviteCode}
                            className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary transition-all group"
                        >
                            <span className="font-mono font-bold text-primary">{group.inviteCode}</span>
                            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400 group-hover:text-primary" />}
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-auto p-6 space-y-4">
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        {user?.avatar ? (
                            <div
                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary"
                                dangerouslySetInnerHTML={{ __html: user.avatar }}
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-500">
                                {user?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                        )}
                        <div className="flex-1 truncate">
                            <p className="text-sm font-bold truncate dark:text-white">{user?.name}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                {isAdmin && <Shield size={10} className="text-primary" />}
                                {user?.role || 'User'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => dispatch(logout())}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all text-sm font-bold"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
