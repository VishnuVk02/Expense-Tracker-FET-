import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { updateGroupSettings } from './expensesSlice';

const HomeSummary = () => {
    const dispatch = useDispatch();
    const { items: expenses, totalIncome, budget } = useSelector((state) => state.expenses);
    const { user } = useSelector((state) => state.auth);

    const currency = user?.currency || '$';
    const hasGroup = !!(user?.groupId || useSelector((state) => state.expenses.group)?._id);
    const isAdmin = user?.role === 'admin' && hasGroup;

    const totalExpenses = (expenses || []).reduce((acc, curr) => acc + (curr?.amount || 0), 0);
    const balance = (totalIncome || 0) - totalExpenses;
    const budgetUsage = (budget > 0) ? (totalExpenses / budget) * 100 : 0;

    const handleIncomeChange = (val) => {
        if (!isAdmin) return;
        dispatch(updateGroupSettings({ income: Number(val) }));
    };

    const handleBudgetChange = (val) => {
        if (!isAdmin) return;
        dispatch(updateGroupSettings({ budget: Number(val) }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Balance Card */}
            <div className="glass p-8 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Wallet size={80} />
                </div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Balance</h3>
                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-primary' : 'text-red-500'}`}>
                    {currency}{balance.toLocaleString()}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs">
                    <span className="flex items-center text-emerald-500">
                        <TrendingUp size={14} className="mr-1" /> +2.5%
                    </span>
                    <span className="text-slate-400">from last month</span>
                </div>
            </div>

            {/* Income Card */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                    <div className='px-2'>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Income</h3>
                        <div className="flex items-center gap-2">
                            {isAdmin ? (
                                <input
                                    type="number"
                                    value={totalIncome || ''}
                                    onChange={(e) => handleIncomeChange(e.target.value)}
                                    placeholder="Income"
                                    className="bg-transparent text-2xl font-bold focus:outline-none w-48 border-b border-transparent focus:border-primary transition-colors"
                                />
                            ) : (
                                <p className="text-2xl font-bold dark:text-white">{currency}{totalIncome.toLocaleString()}</p>
                            )}
                        </div>
                    </div>
                    <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl">
                        <TrendingUp size={24} />
                    </div>
                </div>
                {/* Progress bar for Income vs Expenses */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">Expenses: {currency}{totalExpenses.toLocaleString()}</span>
                        <span className="text-emerald-500">{totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(0) : 0}% of income</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${Math.min(totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Budget Card */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                    <div className='px-2'>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Monthly Budget</h3>
                        <div className="flex items-center gap-2">
                            {isAdmin ? (
                                <input
                                    type="number"
                                    value={budget || ''}
                                    onChange={(e) => handleBudgetChange(e.target.value)}
                                    placeholder="Set Budget"
                                    className="bg-transparent text-2xl font-bold focus:outline-none w-64 border-b border-transparent focus:border-primary transition-colors"
                                />
                            ) : (
                                <p className="text-2xl font-bold dark:text-white">{currency}{budget.toLocaleString()}</p>
                            )}
                        </div>
                    </div>
                    <div className="p-3 bg-primary/20 text-primary rounded-xl">
                        <TrendingDown size={24} />
                    </div>
                </div>
                {/* Progress bar for Budget Usage */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">Used: {currency}{totalExpenses.toLocaleString()}</span>
                        <span className={budgetUsage > 90 ? 'text-red-500' : 'text-primary'}>
                            {budgetUsage.toFixed(0)}%
                        </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${budgetUsage > 90 ? 'bg-red-500' : 'bg-primary'}`}
                            style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSummary;
