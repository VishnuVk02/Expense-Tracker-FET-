import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeExpenseAsync } from './expensesSlice';
import { Trash2, ShoppingBag, Utensils, Car, Film, Receipt, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';

const categoryIcons = {
    Food: Utensils,
    Shopping: ShoppingBag,
    Transport: Car,
    Entertainment: Film,
    Bills: Receipt,
    Other: HelpCircle
};

const ExpenseList = () => {
    const dispatch = useDispatch();
    const { items: expenses, loading } = useSelector((state) => state.expenses);
    const { user } = useSelector((state) => state.auth);
    const currency = user?.currency || '$';

    const handleDelete = (id) => {
        dispatch(removeExpenseAsync(id));
    };

    if (expenses.length === 0) {
        return (
            <div className="text-center py-10 opacity-50">
                <p className="text-slate-500 italic">No expenses yet. Start adding some!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {expenses.map((expense) => {
                const Icon = categoryIcons[expense.category] || HelpCircle;
                return (
                    <div
                        key={expense._id}
                        className="group flex items-center justify-between p-4 bg-white/5 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                                <Icon size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">{expense.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-gray-400">
                                    {expense.category} • {format(new Date(expense.date), 'MMM dd')} • <span className="text-primary font-bold">@{expense.addedBy?.split(' ')[0] || 'Unknown'}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                -{currency}{expense.amount.toLocaleString()}
                            </span>
                            <button
                                onClick={() => handleDelete(expense._id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ExpenseList;
