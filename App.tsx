import React, { useState, useCallback, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { ReportDisplay } from './components/ReportDisplay';
import { Spinner } from './components/common/Spinner';
import { generateSecurityAnalysis } from './services/geminiService';
import type { AnalysisReport, HackerPersona } from './types';
import { PERSONAS } from './constants';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TermsOfServiceModal, PrivacyPolicyModal, RefundPolicyModal, GDPRNoticeModal, CCPANoticeModal } from './components/LegalModals';
import { CookieConsent } from './components/CookieConsent';
import { EnterpriseModal } from './components/EnterpriseModal';
import { AccountPage } from './components/AccountModal';
import { HistoryPanel } from './components/common/HistoryPanel';
import { ToastProvider, useToast } from './components/common/Toast';
import type { HistoryEntry } from './types';
import { supabase } from './services/supabaseClient';
import { AuthModal } from './components/AuthModal';
import { startCheckout, openBillingPortal, syncBillingAfterCheckout, type PaidPlan } from './services/billingService';
import { fetchMe, type MeResponse } from './services/meService';

const HISTORY_KEY = 'cs_scan_history';
const MAX_HISTORY = 20;

const AppInner: React.FC = () => {
    const { showToast } = useToast();
    const [showApp, setShowApp] = useState<boolean>(false);
    const [showAuth, setShowAuth] = useState(false);
    const [pendingLaunch, setPendingLaunch] = useState(false);
    const [pendingCheckoutPlan, setPendingCheckoutPlan] = useState<PaidPlan | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [me, setMe] = useState<MeResponse | null>(null);
    const [scrollToPricingOnHome, setScrollToPricingOnHome] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [report, setReport] = useState<AnalysisReport | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentPersona, setCurrentPersona] = useState<HackerPersona>(PERSONAS[0].id);
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showRefund, setShowRefund] = useState(false);
    const [showGDPR, setShowGDPR] = useState(false);
    const [showCCPA, setShowCCPA] = useState(false);
    const [showEnterprise, setShowEnterprise] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>(() => {
        try {
            return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') as HistoryEntry[];
        } catch { return []; }
    });
    const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            setUserEmail(data.session?.user.email ?? null);
            setUserId(data.session?.user.id ?? null);
        });

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserEmail(session?.user.email ?? null);
            setUserId(session?.user.id ?? null);

            if (pendingLaunch && session) {
                setShowAuth(false);
                setShowApp(true);
                setPendingLaunch(false);
            }

            if (pendingCheckoutPlan && session) {
                const plan = pendingCheckoutPlan;
                setPendingCheckoutPlan(null);
                startCheckout(plan).catch((e) => {
                    const msg = e instanceof Error ? e.message : 'Checkout failed.';
                    showToast(msg, 'error');
                });
            }
        });

        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, [pendingLaunch, pendingCheckoutPlan, showToast]);

    const refreshMe = useCallback(async () => {
        try {
            const next = await fetchMe();
            setMe(next);
        } catch {
            setMe(null);
        }
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('checkout');
        const openAccount = params.get('account');

        if (openAccount === '1') {
            setShowAccount(true);
            setShowApp(false);
            params.delete('account');
            const qs = params.toString();
            window.history.replaceState({}, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
            return;
        }

        if (!status) return;

        if (status === 'success') {
            showToast('Checkout successful. Syncing your plan…', 'success');
            // Sync subscription from Stripe → Supabase (webhook-free fallback),
            // then refresh the local plan/quota display.
            syncBillingAfterCheckout()
                .then(() => refreshMe())
                .catch(() => undefined);
            // Redirect user to their Account page after successful checkout
            setShowAccount(true);
            setShowApp(false);
        } else if (status === 'cancel') {
            showToast('Checkout canceled.', 'info');
        }

        params.delete('checkout');
        const qs = params.toString();
        const nextUrl = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
        window.history.replaceState({}, '', nextUrl);
    }, [refreshMe, showToast]);

    useEffect(() => {
        if (!userEmail) {
            setMe(null);
            return;
        }
        refreshMe().catch(() => undefined);
    }, [userEmail, refreshMe]);

    useEffect(() => {
        if (showApp) return;
        if (!scrollToPricingOnHome) return;
        // Wait a tick for the landing page DOM to be present.
        const t = window.setTimeout(() => {
            document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
            setScrollToPricingOnHome(false);
        }, 50);
        return () => window.clearTimeout(t);
    }, [scrollToPricingOnHome, showApp]);

    useEffect(() => {
        if (!userId) return;
        // Load persisted scan history from Supabase
        supabase
            .from('scans')
            .select('id,target,persona,report,created_at')
            .order('created_at', { ascending: false })
            .limit(MAX_HISTORY)
            .then(({ data, error }) => {
                if (error || !data) return;
                const entries = data.map((row) => ({
                    id: row.id as string,
                    target: row.target as string,
                    persona: row.persona as HackerPersona,
                    timestamp: new Date(row.created_at as string).getTime(),
                    report: row.report as AnalysisReport,
                })) as HistoryEntry[];
                setHistory(entries);
            });
    }, [userId]);

    const handleLaunchApp = () => {
        if (!userEmail) {
            setPendingLaunch(true);
            setShowAuth(true);
            showToast('Sign in to launch the scanner.', 'info');
            return;
        }
        setShowApp(true);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setShowApp(false);
        setReport(null);
        setError(null);
        setMe(null);
        showToast('Signed out.', 'info');
    };

    const handleManageBilling = async () => {
        try {
            await openBillingPortal();
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Billing portal failed.';
            showToast(msg, 'error');
        }
    };

    const handleUpgradeFromScanner = () => {
        setShowApp(false);
        setScrollToPricingOnHome(true);
    };

    const handleChoosePlan = async (plan: PaidPlan) => {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
            setPendingCheckoutPlan(plan);
            setShowAuth(true);
            showToast('Sign in to subscribe.', 'info');
            return;
        }
        try {
            await startCheckout(plan);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Checkout failed.';
            showToast(msg, 'error');
        }
    };

    const handleAnalysisRequest = useCallback(async (target: string, persona: HackerPersona) => {
        setIsLoading(true);
        setError(null);
        setReport(null);
        setCurrentPersona(persona);
        setActiveHistoryId(null);

        try {
            const analysisResult = await generateSecurityAnalysis(target, persona);
            setReport(analysisResult);
            const entry: HistoryEntry = {
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                target,
                persona,
                timestamp: Date.now(),
                report: analysisResult,
            };
            setHistory(prev => {
                const next = [entry, ...prev].slice(0, MAX_HISTORY);
                localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
                return next;
            });
            setActiveHistoryId(entry.id);

            // Update plan usage counters (scans remaining) after a successful scan.
            refreshMe().catch(() => undefined);
        } catch (err) {
            console.error(err);
            const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [refreshMe, showToast]);

    const handleHistorySelect = (entry: HistoryEntry) => {
        setReport(entry.report);
        setCurrentPersona(entry.persona);
        setActiveHistoryId(entry.id);
        setError(null);
    };

    const handleClearHistory = () => {
        setHistory([]);
        localStorage.removeItem(HISTORY_KEY);
        if (userId) {
            supabase.from('scans').delete().eq('user_id', userId).then(() => {
                // ignore errors here; RLS or schema may not yet be applied
            });
        }
        showToast('Scan history cleared.', 'info');
    };

    const remainingScans = me ? Math.max(0, me.scansPerMonth - me.scansUsed) : null;
    const planLabel = (plan: MeResponse['plan']) => {
        if (plan === 'trial') return 'Trial';
        if (plan === 'expired') return 'Expired';
        if (plan === 'greenhorn') return 'Greenhorn';
        if (plan === 'vigilante') return 'Vigilante';
        if (plan === 'sentinel') return 'Sentinel';
        return plan;
    };
    const isPaidPlan = me?.plan === 'greenhorn' || me?.plan === 'vigilante' || me?.plan === 'sentinel';

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
            {showAccount && me && userEmail ? (
                <AccountPage
                    onBack={() => setShowAccount(false)}
                    me={me}
                    userEmail={userEmail}
                    onLaunchScanner={() => { setShowAccount(false); setShowApp(true); }}
                    onManageBilling={() => { setShowAccount(false); handleManageBilling(); }}
                    onUpgrade={() => { setShowAccount(false); handleUpgradeFromScanner(); }}
                    onSignOut={() => { setShowAccount(false); handleSignOut(); }}
                />
            ) : !showApp ? (
                <>
                    <Navbar
                        userEmail={userEmail}
                        onSignIn={() => setShowAuth(true)}
                        onSignOut={handleSignOut}
                        me={me}
                        onShowAccount={() => setShowAccount(true)}
                    />
                    <LandingPage
                        onEnter={handleLaunchApp}
                        onContactEnterprise={() => setShowEnterprise(true)}
                        onChoosePlan={handleChoosePlan}
                    />
                    <Footer onShowTerms={() => setShowTerms(true)} onShowPrivacy={() => setShowPrivacy(true)} onShowRefund={() => setShowRefund(true)} onShowGDPR={() => setShowGDPR(true)} onShowCCPA={() => setShowCCPA(true)} onShowCookieSettings={() => { localStorage.removeItem('cs_cookie_consent'); window.dispatchEvent(new Event('cs_reopen_cookies')); }} />
                </>
            ) : (
                <>
                    <header className="py-3 px-4 sm:px-8 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-20">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                             <h1 className="text-xl sm:text-3xl font-bold text-cyan-400 tracking-wider">
                                <span className="text-gray-100">Cyber Sentinel</span> AI
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
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
                                {userEmail && <span className="hidden md:block text-xs text-gray-400 max-w-[220px] truncate">{userEmail}</span>}

                                {userEmail && me && (
                                    <button
                                        onClick={() => setShowAccount(true)}
                                        className="text-xs sm:text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                                    >
                                        Account
                                    </button>
                                )}

                                {me && !isPaidPlan && (
                                    <button
                                        onClick={handleUpgradeFromScanner}
                                        className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                                    >
                                        Upgrade
                                    </button>
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="hidden sm:block text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                                >
                                    Sign out
                                </button>
                                <button
                                    onClick={() => setShowApp(false)}
                                    className="text-xs sm:text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                                >
                                    &larr; Back
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
                        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                            <InputForm onSubmit={handleAnalysisRequest} isLoading={isLoading} allowedPersonas={me?.allowedPersonas} onUpgrade={handleUpgradeFromScanner} />
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <HistoryPanel
                                    history={history}
                                    onSelect={handleHistorySelect}
                                    onClear={handleClearHistory}
                                    activeId={activeHistoryId}
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-8 xl:col-span-9">
                            {isLoading && (
                                <div className="flex flex-col justify-center items-center h-full bg-gray-800/50 rounded-lg p-8">
                                    <Spinner />
                                    <p className="mt-4 text-lg text-cyan-300">Analyzing... The AI agent is putting on its hacker hat.</p>
                                </div>
                            )}
                            {error && (
                                <div className="flex flex-col justify-center items-center h-full bg-red-900/30 border border-red-700 rounded-lg p-8">
                                    <h2 className="text-2xl font-bold text-red-400">Analysis Failed</h2>
                                    <p className="mt-2 text-red-300 text-center">{error}</p>
                                </div>
                            )}
                            {!isLoading && !error && (
                                <ReportDisplay
                                    report={report}
                                    persona={currentPersona}
                                    canExportPdf={me?.plan === 'greenhorn' || me?.plan === 'vigilante' || me?.plan === 'sentinel'}
                                    onUpgrade={handleUpgradeFromScanner}
                                />
                            )}
                        </div>
                    </main>
                    <Footer onShowTerms={() => setShowTerms(true)} onShowPrivacy={() => setShowPrivacy(true)} onShowRefund={() => setShowRefund(true)} onShowGDPR={() => setShowGDPR(true)} onShowCCPA={() => setShowCCPA(true)} onShowCookieSettings={() => { localStorage.removeItem('cs_cookie_consent'); window.dispatchEvent(new Event('cs_reopen_cookies')); }} />
                </>
            )}

            {/* Global modals */}
            {showTerms && <TermsOfServiceModal onClose={() => setShowTerms(false)} />}
            {showPrivacy && <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />}
            {showRefund && <RefundPolicyModal onClose={() => setShowRefund(false)} />}
            {showGDPR && <GDPRNoticeModal onClose={() => setShowGDPR(false)} />}
            {showCCPA && <CCPANoticeModal onClose={() => setShowCCPA(false)} />}
            {showEnterprise && <EnterpriseModal onClose={() => setShowEnterprise(false)} />}
            {showAuth && <AuthModal onClose={() => { setShowAuth(false); setPendingLaunch(false); }} />}
            <CookieConsent />
        </div>
    );
};

const App: React.FC = () => (
    <ToastProvider>
        <AppInner />
    </ToastProvider>
);

export default App;