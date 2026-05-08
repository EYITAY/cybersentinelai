import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'cs_cookie_consent';

export const CookieConsent: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) setVisible(true);

        const reopen = () => setVisible(true);
        window.addEventListener('cs_reopen_cookies', reopen);
        return () => window.removeEventListener('cs_reopen_cookies', reopen);
    }, []);

    const accept = () => {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem(STORAGE_KEY, 'declined');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-600 rounded-xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 text-sm text-gray-300">
                    <span className="font-bold text-gray-100">We use cookies</span> to improve your experience and
                    analyse usage. Essential cookies are always active. Analytics cookies are optional.
                    <button
                        className="ml-1 text-cyan-400 hover:underline focus:outline-none"
                        onClick={() => {/* Privacy modal opened from App */ }}
                    >
                        Learn more
                    </button>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <button
                        onClick={decline}
                        className="px-4 py-2 rounded-md text-sm font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={accept}
                        className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition-colors"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
};
