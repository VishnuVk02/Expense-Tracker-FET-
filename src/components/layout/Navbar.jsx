import React from 'react';
import { Wallet, Sun, Moon, LayoutDashboard, BarChart3 } from 'lucide-react';

const Navbar = ({ activeView, setActiveView, isDark, toggleTheme }) => {
    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('home')}>
                        <Wallet className="text-primary w-8 h-8" />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
                            ExpenseFlow
                        </h1>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveView('home')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'home'
                                    ? 'bg-white dark:bg-slate-700 shadow-sm text-primary'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            <LayoutDashboard size={18} />
                            <span>Home</span>
                        </button>
                        <button
                            onClick={() => setActiveView('analytics')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'analytics'
                                    ? 'bg-white dark:bg-slate-700 shadow-sm text-primary'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            <BarChart3 size={18} />
                            <span>Analytics</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                        <div className="hidden md:block text-right">
                            <p className="text-xs text-slate-500">Welcome Back</p>
                            <p className="text-sm font-bold">User</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
