import React from 'react';
import type { MeResponse } from '../services/meService';
import { PERSONAS } from '../constants';

interface AccountPageProps {
    onBack: () => void;
    me: MeResponse;
    userEmail: string;
    onManageBilling: () => void;
    onUpgrade: () => void;
    onSignOut: () => void;
    onLaunchScanner: () => void;
}

const planLabel = (plan: MeResponse['plan']) => {
    if (plan === 'trial') return 'Free Trial';
    if (plan === 'expired') return 'Expired';
    if (plan === 'greenhorn') return 'Greenhorn';
    if (plan === 'vigilante') return 'Vigilante';
    if (plan === 'sentinel') return 'Sentinel';
    return plan;
};

const planColor = (plan: MeResponse['plan']) => {
    if (plan === 'trial') return 'text-yellow-400';
    if (plan === 'expired') return 'text-red-400';
    if (plan === 'greenhorn') return 'text-green-400';
    if (plan === 'vigilante') return 'text-cyan-400';
    if (plan === 'sentinel') return 'text-red-400';
    return 'text-gray-300';
};

const planBg = (plan: MeResponse['plan']) => {
    if (plan === 'trial') return 'bg-yellow-500/10 border-yellow-500/30';
    if (plan === 'expired') return 'bg-red-500/10 border-red-500/30';
    if (plan === 'greenhorn') return 'bg-green-500/10 border-green-500/30';
    if (plan === 'vigilante') return 'bg-cyan-500/10 border-cyan-500/30';
    if (plan === 'sentinel') return 'bg-red-500/10 border-red-500/30';
    return 'bg-gray-800 border-gray-700';
};

export const AccountPage: React.FC<AccountPageProps> = ({ onBack, me, userEmail, onManageBilling, onUpgrade, onSignOut, onLaunchScanner }) => {
    const isPaidPlan = me.plan === 'greenhorn' || me.plan === 'vigilante' || me.plan === 'sentinel';
    const isTrial = me.plan === 'trial';
    const isExpired = me.plan === 'expired';
    const remaining = Math.max(0, me.scansPerMonth - me.scansUsed);
    const usagePercent = me.scansPerMonth > 0 ? Math.min(100, Math.round((me.scansUsed / me.scansPerMonth) * 100)) : 0;

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="py-3 px-4 sm:px-8 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-20">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-xl sm:text-2xl font-bold text-cyan-400 tracking-wider">
                        <span className="text-gray-100">Cyber Sentinel</span> AI
                    </h1>
                    <button
                        onClick={onBack}
                        className="text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                        &larr; Back
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 max-w-2xl">
                {/* Profile header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-10">
                    <div className="w-20 h-20 rounded-full bg-cyan-600/20 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 text-3xl font-bold flex-shrink-0">
                        {userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center sm:text-left min-w-0">
                        <h2 className="text-2xl font-bold text-gray-100 truncate">{userEmail}</h2>
                        <p className={`text-sm font-medium mt-1 ${planColor(me.plan)}`}>
                            {planLabel(me.plan)} Plan
                        </p>
                        {isTrial && me.trialDaysLeft > 0 && (
                            <p className="text-xs text-yellow-400/80 mt-1">
                                Trial ends in {me.trialDaysLeft} day{me.trialDaysLeft !== 1 ? 's' : ''}
                            </p>
                        )}
                        {isExpired && (
                            <p className="text-xs text-red-400/80 mt-1">
                                Your trial has expired — upgrade to continue scanning
                            </p>
                        )}
                    </div>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                    {/* Plan card */}
                    <div className={`rounded-lg border p-5 ${planBg(me.plan)}`}>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Current Plan</h3>
                        <p className={`text-2xl font-bold ${planColor(me.plan)}`}>{planLabel(me.plan)}</p>
                        {isPaidPlan && (
                            <p className="text-xs text-gray-500 mt-1">Billed monthly</p>
                        )}
                    </div>

                    {/* Usage card */}
                    <div className="rounded-lg border border-gray-700 bg-gray-800/60 p-5">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                            {isTrial ? 'Daily Usage' : 'Monthly Usage'}
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-100">{me.scansUsed}</span>
                            <span className="text-sm text-gray-500">/ {me.scansPerMonth}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                    usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 60 ? 'bg-yellow-500' : 'bg-cyan-500'
                                }`}
                                style={{ width: `${usagePercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{remaining} scan{remaining !== 1 ? 's' : ''} remaining</p>
                    </div>
                </div>

                {/* Personas section */}
                <div className="rounded-lg border border-gray-700 bg-gray-800/40 p-5 mb-8">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Persona Access</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {PERSONAS.map((persona) => {
                            const unlocked = me.allowedPersonas.includes(persona.id);
                            return (
                                <div
                                    key={persona.id}
                                    className={`relative rounded-lg border p-3 text-center transition-all ${
                                        unlocked
                                            ? `${persona.color}`
                                            : 'bg-gray-800/40 border-gray-700 opacity-40'
                                    }`}
                                >
                                    <div className="flex justify-center mb-1">{persona.icon}</div>
                                    <span className="text-xs font-semibold">{persona.name}</span>
                                    {!unlocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 rounded-lg">
                                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={onLaunchScanner}
                        className="w-full px-4 py-3 text-sm font-bold rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
                    >
                        Launch Scanner
                    </button>
                    {isPaidPlan ? (
                        <button
                            onClick={onManageBilling}
                            className="w-full px-4 py-3 text-sm font-semibold rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700 transition-colors"
                        >
                            Manage Billing & Subscription
                        </button>
                    ) : (
                        <button
                            onClick={onUpgrade}
                            className="w-full px-4 py-3 text-sm font-semibold rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700 transition-colors"
                        >
                            Upgrade Plan
                        </button>
                    )}
                    <button
                        onClick={onSignOut}
                        className="w-full px-4 py-3 text-sm font-semibold rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </main>
        </div>
    );
};
