import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpenseAsync } from './expensesSlice';
import { PlusCircle } from 'lucide-react';

const ExpenseForm = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.expenses);
    const { user } = useSelector((state) => state.auth);
    const hasGroup = !!user?.groupId;

    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hasGroup || !formData.title || !formData.amount) return;

        dispatch(addExpenseAsync({
            ...formData,
            amount: parseFloat(formData.amount)
        }));

        setFormData({
            title: '',
            amount: '',
            category: 'Food',
            date: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!hasGroup && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-500 text-center">
                        Please join or create a group to start adding expenses.
                    </p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                    <input
                        type="text"
                        required
                        disabled={!hasGroup}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white disabled:opacity-50"
                        placeholder="Dinner, Groceries..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
                    <input
                        type="number"
                        required
                        disabled={!hasGroup}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white disabled:opacity-50"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                    <select
                        disabled={!hasGroup}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white disabled:opacity-50"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option>Food</option>
                        <option>Shopping</option>
                        <option>Transport</option>
                        <option>Entertainment</option>
                        <option>Bills</option>
                        <option>Other</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                    <input
                        type="date"
                        required
                        disabled={!hasGroup}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white disabled:opacity-50"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !hasGroup}
                className={`w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-primary/20 mt-4 disabled:opacity-50`}
            >
                <PlusCircle size={20} />
                {loading ? 'Adding...' : 'Add Transaction'}
            </button>
        </form>
    );
};

export default ExpenseForm;
