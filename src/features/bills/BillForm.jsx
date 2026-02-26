import React, { useState } from 'react';
import { X, Calendar, DollarSign, FileText } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addBill } from './billsSlice';

const BillForm = ({ onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
        dueDate: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addBill({
            ...formData,
            amount: Number(formData.amount)
        }));
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
            <div className="glass bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold dark:text-white">New Bill Reminder</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Title</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <FileText size={18} />
                            </div>
                            <input
                                required
                                type="text"
                                placeholder="Electric Bill, Rent, etc."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Description</label>
                        <textarea
                            placeholder="Add some details..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-all h-24 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Amount</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <DollarSign size={18} />
                                </div>
                                <input
                                    required
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Due Date</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Calendar size={18} />
                                </div>
                                <input
                                    required
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] mt-2"
                    >
                        Create Reminder
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BillForm;
