import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Plus, Pin, Trash2, Calendar, DollarSign, Clock } from 'lucide-react';
import { fetchBills, togglePinBill, removeBill } from './billsSlice';
import BillForm from './BillForm';
import { format, isAfter, isBefore, addDays } from 'date-fns';

const BillsView = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.bills);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchBills());
    }, [dispatch]);

    const sortedBills = useMemo(() => {
        return [...items].sort((a, b) => {
            // Pinned first
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            // Then by due date
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }, [items]);

    const getStatus = (dueDate) => {
        const date = new Date(dueDate);
        const today = new Date();
        const tomorrow = addDays(today, 1);

        if (isBefore(date, today)) return { label: 'Overdue', color: 'text-rose-500 bg-rose-500/10' };
        if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) return { label: 'Due Today', color: 'text-amber-500 bg-amber-500/10' };
        if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) return { label: 'Due Tomorrow', color: 'text-blue-500 bg-blue-500/10' };

        return { label: `Due in ${format(date, 'MMM d')}`, color: 'text-slate-500 bg-slate-500/10' };
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black dark:text-white flex items-center gap-3">
                        <Bell className="text-indigo-500" size={32} />
                        Pending Bills
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Never miss a payment again</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    New Bill
                </button>
            </div>

            {loading && items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 glass rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium italic">Loading your bills...</p>
                </div>
            ) : sortedBills.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 glass rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 text-slate-400">
                        <Bell size={40} />
                    </div>
                    <h3 className="text-xl font-bold dark:text-white mb-2">No pending bills</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">You're all caught up! Create a new reminder for your upcoming payments.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedBills.map((bill) => {
                        const status = getStatus(bill.dueDate);
                        return (
                            <div
                                key={bill._id}
                                className={`glass group relative p-6 rounded-3xl border transition-all hover:shadow-xl hover:-translate-y-1 ${bill.isPinned
                                        ? 'border-indigo-500/30 bg-indigo-500/[0.02]'
                                        : 'border-slate-200/50 dark:border-slate-800'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                        {status.label}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => dispatch(togglePinBill(bill._id))}
                                            className={`p-2 rounded-xl transition-all ${bill.isPinned
                                                    ? 'text-indigo-500 bg-indigo-500/10'
                                                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <Pin size={16} className={bill.isPinned ? 'fill-indigo-500' : ''} />
                                        </button>
                                        <button
                                            onClick={() => dispatch(removeBill(bill._id))}
                                            className="p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-lg font-bold dark:text-white truncate">{bill.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[40px]">
                                            {bill.description || 'No description provided.'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Calendar size={14} />
                                            <span className="text-xs font-bold">{format(new Date(bill.dueDate), 'MMM dd, yyyy')}</span>
                                        </div>
                                        <div className="text-lg font-black text-indigo-500 flex items-center gap-0.5">
                                            <DollarSign size={16} />
                                            {bill.amount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {isFormOpen && <BillForm onClose={() => setIsFormOpen(false)} />}
        </div>
    );
};

export default BillsView;
