import React from 'react';
import { LayoutDashboard, BarChart3, Users, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';

const MobileNav = ({ activeView, setActiveView, isDark, toggleTheme }) => {
    const navItems = [
        { id: 'home', icon: LayoutDashboard, label: 'Home' },
        { id: 'analytics', icon: BarChart3, label: 'Charts' },
        { id: 'family', icon: Users, label: 'Family' },
        { id: 'settings', icon: SettingsIcon, label: 'Settings' },
    ];

    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
            <nav className="glass bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-2 flex justify-between items-center shadow-2xl">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                        </button>
                    );
                })}
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </nav>
        </div>
    );
};

export default MobileNav;
