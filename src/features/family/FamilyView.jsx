import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, TrendingUp, UserCheck, Shield, ArrowLeft, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { leaveGroup } from '../expenses/expensesSlice';
import JoinGroupView from './JoinGroupView';

const FamilyView = ({ setActiveView }) => {
    const dispatch = useDispatch();
    const expenses = useSelector((state) => state.expenses.items);
    const members = useSelector((state) => state.expenses.members);
    const group = useSelector((state) => state.expenses.group);

    const handleLeaveGroup = () => {
        if (window.confirm('Are you sure you want to leave this group?')) {
            dispatch(leaveGroup());
            setActiveView('home');
        }
    };

    // Group expenses by user
    const memberContributions = members.map(member => {
        const userExpenses = expenses.filter(ex => ex.userId === member._id);
        const total = userExpenses.reduce((sum, ex) => sum + ex.amount, 0);
        return {
            ...member,
            total,
            count: userExpenses.length,
            recent: userExpenses.slice(0, 3) // Assume expenses is already sorted by date descending
        };
    });

    const totalFamilySpending = expenses.reduce((sum, ex) => sum + ex.amount, 0);

    if (!group) {
        return <JoinGroupView />;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary/10 p-8 rounded-3xl border border-primary/20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setActiveView('home')}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors text-slate-500"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black dark:text-white mb-2 flex items-center gap-3">
                            <Users className="text-primary" />
                            {group?.name || 'Family Collaboration'}
                        </h2>
                        <div className="flex items-center gap-3">
                            <p className="text-slate-500 dark:text-slate-400">Tracking expenses together in one shared space</p>
                            {group?.inviteCode && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-primary/20">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Group ID:</span>
                                    <code className="text-xs font-black text-primary select-all">{group.inviteCode}</code>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Group Spending</p>
                        <p className="text-3xl font-black text-primary">${totalFamilySpending.toLocaleString()}</p>
                    </div>
                    {group && (
                        <button
                            onClick={handleLeaveGroup}
                            className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all text-sm font-bold"
                        >
                            <LogOut size={16} />
                            Leave Group
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {memberContributions.map((member) => (
                    <div key={member._id} className="glass p-6 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary shadow-lg shadow-primary/10">
                                <img src={member.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                    {member.name}
                                    {member.role === 'admin' && <Shield size={16} className="text-primary" />}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded-full w-fit mt-1">
                                    <UserCheck size={12} />
                                    {member.role === 'admin' ? 'Group Admin' : 'Family Member'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contributed</p>
                                <p className="text-xl font-black text-primary">${member.total.toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Items</p>
                                <p className="text-xl font-black text-secondary">{member.count}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <TrendingUp size={14} />
                                Recent Activity
                            </h4>
                            {member.recent.length > 0 ? (
                                member.recent.map((ex) => (
                                    <div key={ex._id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                                        <div className="truncate pr-2">
                                            <p className="text-sm font-bold truncate dark:text-white">{ex.title}</p>
                                            <p className="text-[10px] text-slate-400">{format(new Date(ex.date), 'MMM dd')}</p>
                                        </div>
                                        <span className="text-sm font-black text-red-500">-${ex.amount.toLocaleString()}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 italic py-4 text-center">No recent expenses</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FamilyView;
