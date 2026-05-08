import React from 'react';

interface FooterProps {
    onShowTerms: () => void;
    onShowPrivacy: () => void;
    onShowRefund: () => void;
    onShowGDPR: () => void;
    onShowCCPA: () => void;
    onShowCookieSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowTerms, onShowPrivacy, onShowRefund, onShowGDPR, onShowCCPA, onShowCookieSettings }) => {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-gray-900 border-t border-gray-800 py-10 px-4 mt-auto">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <p className="text-xl font-bold text-gray-100">
                            Cyber Sentinel <span className="text-cyan-400">AI</span>
                        </p>
                        <p className="mt-2 text-sm text-gray-500 max-w-xs">
                            AI-driven security analysis from multiple hacker perspectives. Uncover vulnerabilities before attackers do.
                        </p>
                    </div>

                    {/* Legal */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Legal</p>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={onShowPrivacy}
                                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                                >
                                    Privacy Policy
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={onShowTerms}
                                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                                >
                                    Terms of Use
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={onShowRefund}
                                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                                >
                                    Refund Policy
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={onShowCookieSettings}
                                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                                >
                                    Cookie Settings
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={onShowGDPR}
                                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                                >
                                    EEA (GDPR)
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={onShowCCPA}
                                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                                >
                                    California (CCPA)
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Contact</p>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="mailto:hello@cybersentinel.ai"
                                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                                >
                                    hello@cybersentinel.ai
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:enterprise@cybersentinel.ai"
                                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                                >
                                    Enterprise inquiries
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-600">
                        &copy; {year} Cyber Sentinel AI — A product of CyberPlanet LLC. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-600 max-w-xl text-right">
                        This tool is intended for educational purposes and authorized security testing only. Unauthorized scanning or testing of targets is illegal and unethical.
                    </p>
                </div>
            </div>
        </footer>
    );
};
