import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line
} from 'recharts';

const COLORS = ['#38bdf8', '#818cf8', '#f472b6', '#34d399', '#fbbf24', '#f87171'];

const AnalyticsCharts = () => {
    const expenses = useSelector((state) => state.expenses.items);

    // Process data for category pie chart
    const categoryData = expenses.reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.category);
        if (existing) {
            existing.value += curr.amount;
        } else {
            acc.push({ name: curr.category, value: curr.amount });
        }
        return acc;
    }, []);

    // Process data for daily bar chart (last 7 days/entries)
    const barData = expenses.slice(-7).map(ex => ({
        name: ex.title.slice(0, 8),
        amount: ex.amount,
        date: ex.date
    }));

    // Cumulative data for Area Chart
    let runningTotal = 0;
    const cumulativeData = expenses.map(ex => {
        runningTotal += ex.amount;
        return {
            name: ex.title.slice(0, 5),
            cumulative: runningTotal
        };
    });

    if (expenses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-500 italic space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <BarChart3 size={32} className="text-slate-400" />
                </div>
                <p>Insufficient data to display charts. Start by adding some expenses!</p>
            </div>
        );
    }

    const tooltipStyle = {
        backgroundColor: 'var(--tw-slate-900)',
        border: 'none',
        borderRadius: '12px',
        color: '#fff',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    };

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Spending by Category */}
                <div className="glass p-6 rounded-2xl h-[350px]">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest">Spending by Category</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Transactions Bar Chart */}
                <div className="glass p-6 rounded-2xl h-[350px]">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest">Recent Transactions</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#88888820" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: '#88888810' }} contentStyle={tooltipStyle} />
                            <Bar dataKey="amount" fill="#38bdf8" radius={[6, 6, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cumulative Spending Area Chart */}
                <div className="glass p-6 rounded-2xl h-[350px]">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest">Spending Trend (Cumulative)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={cumulativeData}>
                            <defs>
                                <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#88888820" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Area type="monotone" dataKey="cumulative" stroke="#818cf8" fillOpacity={1} fill="url(#colorCum)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Expense Evolution Line Chart */}
                <div className="glass p-6 rounded-2xl h-[350px]">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest">Expense Intensity</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#88888820" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Line type="stepAfter" dataKey="amount" stroke="#f472b6" strokeWidth={3} dot={{ fill: '#f472b6', r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
