import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, UserPlus, Key, Wallet } from 'lucide-react';
import { joinGroup, createGroup } from '../expenses/expensesSlice';

const JoinGroupView = () => {
    const dispatch = useDispatch();
    const [inviteCode, setInviteCode] = useState('');
    const [groupName, setGroupName] = useState('');
    const { loading, error } = useSelector((state) => state.expenses);

    const handleJoin = (e) => {
        e.preventDefault();
        if (inviteCode) {
            dispatch(joinGroup(inviteCode));
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();
        if (groupName) {
            dispatch(createGroup(groupName));
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary text-white shadow-xl shadow-primary/20 mb-6 group transition-transform hover:scale-110">
                    <Users size={40} />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
                    Ready to Collaborate?
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                    You're currently not part of any family group. Join an existing one using an invite code or start your own.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Join Group Card */}
                <div className="glass p-8 rounded-3xl flex flex-col h-full border-t-4 border-primary">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                            <Key size={24} />
                        </div>
                        <h2 className="text-2xl font-bold dark:text-white">Join Existing</h2>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-grow">
                        Enter the group invite code shared by your family admin to start tracking expenses together.
                    </p>

                    <form onSubmit={handleJoin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Invite Code</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white font-mono uppercase text-center text-xl tracking-widest"
                                placeholder="X1Y2Z3"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/10 ${loading ? 'opacity-50' : 'hover:bg-primary/90'}`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Users size={20} />
                                    Join Group
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Create Group Card */}
                <div className="glass p-8 rounded-3xl flex flex-col h-full border-t-4 border-secondary">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-secondary/10 text-secondary rounded-2xl">
                            <UserPlus size={24} />
                        </div>
                        <h2 className="text-2xl font-bold dark:text-white">Create New</h2>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-grow">
                        Start a fresh group and invite your family members. You'll be the group administrator.
                    </p>

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Group Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-secondary outline-none transition-all dark:text-white"
                                placeholder="The Smiths"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-secondary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-secondary/10 ${loading ? 'opacity-50' : 'hover:bg-secondary/90'}`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    Create Group
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {error && (
                <div className="mt-8 bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-2xl text-center text-sm font-bold border border-red-100 dark:border-red-900/30">
                    {error}
                </div>
            )}
        </div>
    );
};

export default JoinGroupView;
