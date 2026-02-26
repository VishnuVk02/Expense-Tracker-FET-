import React from 'react';
import { useSelector } from 'react-redux';
import { Wallet, Bell } from 'lucide-react';

const MobileHeader = ({ setActiveView }) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <header className="lg:hidden sticky top-0 z-[60] w-full px-4 py-3 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                        <Wallet size={20} />
                    </div>
                    <div>
                        {/* <h1 className="text-lg font-black tracking-tight dark:text-white leading-none">Antigravity</h1> */}
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">Expense Flow</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveView('bills')}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-500 transition-all"
                    >
                        <Bell size={18} />
                    </button>
                    {user?.profilePic ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-indigo-500/20">
                            <img
                                src={user.profilePic}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold border border-indigo-500/20">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default MobileHeader;
