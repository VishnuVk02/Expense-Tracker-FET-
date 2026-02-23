import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, logout } from '../auth/authSlice';
import { createAvatar } from '@dicebear/core';
import { toonHead } from '@dicebear/collection';
import { ArrowLeft, Check, Globe, Save, LogOut } from 'lucide-react';

const AVATAR_SEEDS = ['Wyatt', 'Luna', 'Felix', 'Maya', 'Oscar', 'Zara'];

const CURRENCY_OPTIONS = [
    { symbol: '$', label: 'USD ($)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '£', label: 'GBP (£)' },
    { symbol: '₹', label: 'INR (₹)' },
    { symbol: '¥', label: 'JPY (¥)' },
    { symbol: 'A$', label: 'AUD (A$)' },
];

const Settings = ({ setActiveView }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '');
    const [selectedCurrency, setSelectedCurrency] = useState(user?.currency || '$');
    const [saved, setSaved] = useState(false);
    const [avatars, setAvatars] = useState([]);

    // Generate avatars on mount
    useEffect(() => {
        const generated = AVATAR_SEEDS.map((seed) => {
            const avatar = createAvatar(toonHead, { seed });
            return { seed, svg: avatar.toString() };
        });
        setAvatars(generated);

        // If user has no avatar yet, default to first
        if (!user?.avatar && generated.length > 0) {
            setSelectedAvatar(generated[0].svg);
        }
    }, []);

    const handleSave = () => {
        dispatch(updateProfile({
            avatar: selectedAvatar,
            currency: selectedCurrency
        }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setActiveView('home')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-3xl font-black dark:text-white">Settings</h2>
            </div>

            {/* Profile Info */}
            <div className="glass p-8 rounded-3xl space-y-8">
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Profile</h3>
                    <div className="flex items-center gap-4">
                        {selectedAvatar ? (
                            <div
                                className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary"
                                dangerouslySetInnerHTML={{ __html: selectedAvatar }}
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500">
                                {user?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                        )}
                        <div>
                            <p className="text-lg font-bold dark:text-white">{user?.name}</p>
                            <p className="text-sm text-slate-400">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Avatar Selection */}
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Choose Avatar</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {avatars.map((av) => {
                            const isSelected = selectedAvatar === av.svg;
                            return (
                                <button
                                    key={av.seed}
                                    onClick={() => setSelectedAvatar(av.svg)}
                                    className={`relative p-2 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${isSelected
                                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                        }`}
                                >
                                    <div
                                        className="w-full aspect-square rounded-xl overflow-hidden"
                                        dangerouslySetInnerHTML={{ __html: av.svg }}
                                    />
                                    {isSelected && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                            <Check size={12} className="text-white" />
                                        </div>
                                    )}
                                    <p className="text-[10px] font-bold text-center mt-1 text-slate-500">{av.seed}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Currency Selection */}
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Currency</h3>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white appearance-none cursor-pointer"
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                        >
                            {CURRENCY_OPTIONS.map((c) => (
                                <option key={c.symbol} value={c.symbol}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl mt-4 ${saved
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : 'bg-gradient-to-r from-primary to-secondary text-white shadow-primary/20 hover:from-primary/90 hover:to-secondary/90'
                        }`}
                >
                    {saved ? (
                        <>
                            <Check size={20} />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Save Changes
                        </>
                    )}
                </button>

                {/* Logout Button (Mobile Access) */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 lg:hidden">
                    <button
                        onClick={() => dispatch(logout())}
                        className="w-full flex items-center justify-center gap-2 px-4 py-4 border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all font-bold"
                    >
                        <LogOut size={20} />
                        Logout Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
