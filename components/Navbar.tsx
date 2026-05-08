import React, { useState } from 'react';
import type { MeResponse } from '../services/meService';

interface NavbarProps {
    userEmail?: string | null;
    onSignIn: () => void;
    onSignOut: () => void;
    me?: MeResponse | null;
    onShowAccount?: () => void;
}

const navLinks = [
    { name: 'Personas', href: '#personas' },
    { name: 'Features', href: '#features' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
];

export const Navbar: React.FC<NavbarProps> = ({ userEmail, onSignIn, onSignOut, me, onShowAccount }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const remainingScans = typeof me?.scansPerMonth === 'number' && typeof me?.scansUsed === 'number'
        ? Math.max(0, me.scansPerMonth - me.scansUsed)
        : null;

    const planLabel = (plan: MeResponse['plan']) => {
        if (plan === 'trial') return 'Trial';
        if (plan === 'expired') return 'Expired';
        if (plan === 'greenhorn') return 'Greenhorn';
        if (plan === 'vigilante') return 'Vigilante';
        if (plan === 'sentinel') return 'Sentinel';
        return plan;
    };

    const isPaidPlan = me?.plan === 'greenhorn' || me?.plan === 'vigilante' || me?.plan === 'sentinel';

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        if (href) {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };
    
    const handleUpgrade = () => {
        setIsMenuOpen(false);
        document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header className="py-4 px-4 sm:px-8 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-2xl font-bold text-cyan-400 tracking-wider">
                    <span className="text-gray-100">Cyber Sentinel</span> AI
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map(link => (
                        <a key={link.name} href={link.href} onClick={handleLinkClick} className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">
                            {link.name}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    {userEmail ? (
                        <div className="hidden md:flex items-center gap-3">
                            {me && remainingScans !== null && (
                                <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-md bg-gray-800/60 border border-gray-700">
                                    <span className="text-xs text-gray-300">
                                        Plan: <span className="font-semibold text-cyan-300">{planLabel(me.plan)}</span>
                                    </span>
                                    {me.plan === 'trial' && me.trialDaysLeft > 0 && (
                                        <>
                                            <span className="text-xs text-gray-500">•</span>
                                            <span className="text-xs text-yellow-400">{me.trialDaysLeft}d left</span>
                                        </>
                                    )}
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="text-xs text-gray-300">
                                        {remainingScans}/{me.scansPerMonth} {me.plan === 'trial' ? 'today' : 'scans left'}
                                    </span>
                                </div>
                            )}
                            {onShowAccount && (
                                <button
                                    onClick={onShowAccount}
                                    className="px-3 py-2 bg-gray-700/60 text-gray-200 font-bold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all text-sm"
                                >
                                    Account
                                </button>
                            )}
                            {!isPaidPlan && (
                                <button
                                    onClick={handleUpgrade}
                                    className="px-3 py-2 bg-cyan-600/80 text-white font-bold rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all text-sm"
                                >
                                    Upgrade
                                </button>
                            )}
                            <button
                                onClick={onSignOut}
                                className="px-4 py-2 bg-gray-700/60 text-gray-200 font-bold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all text-sm"
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onSignIn}
                            className="hidden md:block px-4 py-2 bg-gray-700/60 text-gray-200 font-bold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all text-sm"
                        >
                            Sign in
                        </button>
                    )}

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500">
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                            <a key={link.name} href={link.href} onClick={handleLinkClick} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">
                                {link.name}
                            </a>
                        ))}
                        {userEmail && me && remainingScans !== null && (
                            <div className="mt-3 px-3 py-2 rounded-md bg-gray-800/60 border border-gray-700">
                                <div className="text-xs text-gray-300">Plan: <span className="font-semibold text-cyan-300">{planLabel(me.plan)}</span>
                                    {me.plan === 'trial' && me.trialDaysLeft > 0 && (
                                        <span className="ml-2 text-yellow-400">({me.trialDaysLeft}d left)</span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-300 mt-1">
                                    {remainingScans}/{me.scansPerMonth} {me.plan === 'trial' ? 'today' : 'scans left'}
                                </div>
                            </div>
                        )}

                        {userEmail && !isPaidPlan && (
                            <button
                                onClick={handleUpgrade}
                                className="w-full mt-2 px-5 py-3 bg-cyan-600/80 text-white font-bold rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all text-sm"
                            >
                                Upgrade
                            </button>
                        )}

                        {userEmail && onShowAccount && (
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onShowAccount();
                                }}
                                className="w-full mt-2 px-5 py-3 bg-gray-700/70 text-gray-200 font-bold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all text-sm"
                            >
                                My Account
                            </button>
                        )}

                        {userEmail ? (
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onSignOut();
                                }}
                                className="w-full mt-2 px-5 py-3 bg-gray-700/70 text-gray-200 font-bold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all text-sm"
                            >
                                Sign out
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onSignIn();
                                }}
                                className="w-full mt-2 px-5 py-3 bg-gray-700/70 text-gray-200 font-bold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all text-sm"
                            >
                                Sign in
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};