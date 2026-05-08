import React, { useState } from 'react';

interface EnterpriseModalProps {
    onClose: () => void;
}

export const EnterpriseModal: React.FC<EnterpriseModalProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const body = encodeURIComponent(
            `Name: ${name}\nCompany: ${company}\nEmail: ${email}\n\n${message}`
        );
        window.location.href = `mailto:enterprise@cybersentinel.ai?subject=Enterprise%20Inquiry%20from%20${encodeURIComponent(company)}&body=${body}`;
        setSent(true);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-gray-900 border border-purple-500/50 rounded-xl w-full max-w-lg shadow-2xl shadow-purple-500/10">
                <header className="flex justify-between items-center p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-purple-400">Enterprise Plan</h2>
                        <p className="text-sm text-gray-400 mt-1">Tell us about your team and we'll be in touch within 24 hours.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                {sent ? (
                    <div className="p-10 text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white">Your email client opened!</h3>
                        <p className="text-gray-400 mt-2">Send the pre-filled email to reach our enterprise team. We usually respond within 24 hours.</p>
                        <button onClick={onClose} className="mt-6 px-6 py-2 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 transition-colors">Close</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                    placeholder="Jane Smith"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                                <input
                                    type="text"
                                    required
                                    value={company}
                                    onChange={e => setCompany(e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                    placeholder="Acme Corp"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Work Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                placeholder="you@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">What are you looking for?</label>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={3}
                                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                                placeholder="Team size, use cases, API access needs..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white font-bold py-3 rounded-md hover:bg-purple-700 transition-colors"
                        >
                            Send Inquiry
                        </button>
                        <p className="text-xs text-center text-gray-500">This will open your email client with a pre-filled message.</p>
                    </form>
                )}
            </div>
        </div>
    );
};
