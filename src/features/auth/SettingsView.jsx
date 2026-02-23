import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Shield, Camera, Check, Globe, Save } from 'lucide-react';
import { updateSettings } from './authSlice';

const SettingsView = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    // Default cartoon avatars (DiceBear styles)
    const avatars = [
        'https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix',
        'https://api.dicebear.com/7.x/pixel-art/svg?seed=Aneka',
        'https://api.dicebear.com/7.x/pixel-art/svg?seed=Jasper',
        'https://api.dicebear.com/7.x/pixel-art/svg?seed=Luna',
        'https://api.dicebear.com/7.x/pixel-art/svg?seed=Oliver',
        'https://api.dicebear.com/7.x/pixel-art/svg?seed=Misty'
    ];

    const currencies = [
        { label: 'India (₹)', symbol: '₹', country: 'India' },
        { label: 'USA ($)', symbol: '$', country: 'USA' },
        { label: 'Europe (€)', symbol: '€', country: 'Europe' },
        { label: 'UK (£)', symbol: '£', country: 'UK' },
        { label: 'Japan (¥)', symbol: '¥', country: 'Japan' }
    ];

    const [formData, setFormData] = useState({
        username: user?.username || '',
        avatar: user?.avatar || avatars[0],
        currency: user?.currency || '₹',
        country: ''
    });

    const [success, setSuccess] = useState(false);

    const handleCountryChange = (val) => {
        const country = val.toLowerCase().trim();
        setFormData(prev => ({ ...prev, country: val }));

        if (country === 'india') {
            setFormData(prev => ({ ...prev, currency: '₹' }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateSettings({
            username: formData.username,
            avatar: formData.avatar,
            currency: formData.currency
        }));

        if (!result.error) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black dark:text-white mb-2">Settings</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your profile and preferences</p>
                </div>
                {success && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 text-sm font-bold animate-fade-in">
                        <Check size={16} /> Saved Successfully
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass p-8 rounded-3xl space-y-8">
                        {/* Avatar Selection */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Camera size={14} /> Profile Avatar
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {avatars.map((avatar, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setFormData({ ...formData, avatar })}
                                        className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all hover:scale-110 relative ${formData.avatar === avatar ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        {formData.avatar === avatar && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <Check size={20} className="text-white drop-shadow-md" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>
                                    {error === 'Username already taken' && (
                                        <p className="text-red-500 text-xs font-bold ml-1">Username already taken</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Country (Quick Logic)</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                            placeholder="e.g. India"
                                            value={formData.country}
                                            onChange={(e) => handleCountryChange(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-8 bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-primary/20 hover:bg-primary/90 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Preferences */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-3xl space-y-6">
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Global Currency</label>
                            <div className="space-y-3">
                                {currencies.map((curr) => (
                                    <button
                                        key={curr.symbol}
                                        onClick={() => setFormData({ ...formData, currency: curr.symbol })}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${formData.currency === curr.symbol ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                                    >
                                        <span className="font-bold">{curr.label}</span>
                                        {formData.currency === curr.symbol && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl bg-primary/5 border-primary/10">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="text-primary" size={20} />
                            <h4 className="font-bold text-primary">Privacy Note</h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Your username and avatar are visible to other members if you are in a family group. Currency settings only affect your local display.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
