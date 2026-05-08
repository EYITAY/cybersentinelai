import React from 'react';

interface LegalModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const LegalModal: React.FC<LegalModalProps> = ({ title, onClose, children }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
        <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
            <header className="flex justify-between items-center p-6 border-b border-gray-700 flex-shrink-0">
                <h2 className="text-2xl font-bold text-cyan-400">{title}</h2>
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
            <div className="overflow-y-auto p-6 text-gray-300 prose prose-invert prose-sm max-w-none">
                {children}
            </div>
        </div>
    </div>
);

// ─── Terms of Service ──────────────────────────────────────────────────────────
export const TermsOfServiceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <LegalModal title="Terms of Service" onClose={onClose}>
        <p className="text-xs text-gray-500 mb-6">Last updated: March 2026</p>

        <h3 className="text-lg font-bold text-gray-100 mt-4 mb-2">1. Acceptance of Terms</h3>
        <p>By accessing or using Cyber Sentinel AI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">2. Description of Service</h3>
        <p>Cyber Sentinel AI is an AI-powered security analysis platform that generates reports describing potential vulnerabilities, attack scenarios, and mitigation strategies for user-supplied targets. Reports are produced by a large language model and are for <strong>informational and educational purposes only</strong>.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">3. Acceptable Use</h3>
        <p>You agree to use the Service <strong>only on systems you own or have explicit written permission to test</strong>. You must not:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Use the Service to attack, compromise, or gain unauthorized access to any system.</li>
            <li>Submit targets belonging to third parties without their consent.</li>
            <li>Attempt to circumvent rate limits, authentication, or security controls.</li>
            <li>Use the Service to generate content that is illegal, harmful, or violates any applicable law.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">4. No Warranty</h3>
        <p>The Service is provided "as is" without warranty of any kind. AI-generated reports may contain errors, omissions, or outdated information. They are <strong>not a substitute for professional penetration testing or security audits</strong>.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">5. Limitation of Liability</h3>
        <p>To the maximum extent permitted by law, Cyber Sentinel AI shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of or inability to use the Service.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">6. Subscriptions & Billing</h3>
        <p>Paid plans are billed monthly. You may cancel at any time. <strong>All sales are final — no refunds will be issued.</strong> Each scan consumes significant high-performance AI compute resources that cannot be recovered once used. We strongly encourage all users to take advantage of the free trial and start with the lowest tier before upgrading. We reserve the right to modify pricing with 30 days' notice.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">7. Changes to Terms</h3>
        <p>We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">8. Contact</h3>
        <p>For questions about these Terms, email <a href="mailto:legal@cybersentinel.ai" className="text-cyan-400 hover:underline">legal@cybersentinel.ai</a>.</p>
    </LegalModal>
);

// ─── Privacy Policy ────────────────────────────────────────────────────────────
export const PrivacyPolicyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <LegalModal title="Privacy Policy" onClose={onClose}>
        <p className="text-xs text-gray-500 mb-6">Last updated: March 2026</p>

        <h3 className="text-lg font-bold text-gray-100 mt-4 mb-2">1. Information We Collect</h3>
        <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account data:</strong> email address and name when you sign up.</li>
            <li><strong>Usage data:</strong> scan targets you submit, persona selected, and timestamp. We do not store full AI-generated reports on our servers beyond your account history.</li>
            <li><strong>Payment data:</strong> handled entirely by Stripe. We do not store card details.</li>
            <li><strong>Technical data:</strong> IP address, browser type, referring URL, and error logs for security and rate-limiting purposes.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">2. How We Use Your Information</h3>
        <ul className="list-disc pl-6 space-y-1">
            <li>To provide, operate, and improve the Service.</li>
            <li>To enforce rate limits and prevent abuse.</li>
            <li>To process payments and manage subscriptions.</li>
            <li>To send transactional emails (receipts, password resets).</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">3. Data Sharing</h3>
        <p>We do not sell your personal data. We share data only with service providers necessary to operate the Service (hosting, payment processing, email delivery) under appropriate data processing agreements.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">4. Data Retention</h3>
        <p>Account data is retained for the duration of your account. Scan history is retained for 90 days by default. You may request deletion at any time.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">5. Your Rights (GDPR / CCPA)</h3>
        <p>You have the right to access, correct, export, or delete your personal data. To exercise these rights, email <a href="mailto:privacy@cybersentinel.ai" className="text-cyan-400 hover:underline">privacy@cybersentinel.ai</a>.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">6. Cookies</h3>
        <p>We use essential cookies for session management and analytics cookies (opt-in) to understand usage patterns. See our cookie banner on first visit to manage preferences.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">7. Security</h3>
        <p>We use TLS encryption for all data in transit. API keys are stored server-side and never exposed to the browser. We conduct regular security reviews.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">8. Contact</h3>
        <p>Privacy questions: <a href="mailto:privacy@cybersentinel.ai" className="text-cyan-400 hover:underline">privacy@cybersentinel.ai</a></p>
    </LegalModal>
);

// ─── Refund Policy ─────────────────────────────────────────────────────────────
export const RefundPolicyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <LegalModal title="Refund Policy" onClose={onClose}>
        <p className="text-xs text-gray-500 mb-6">Last updated: March 2026</p>

        <h3 className="text-lg font-bold text-gray-100 mt-4 mb-2">No-Refund Policy</h3>
        <p><strong>All purchases on Cyber Sentinel AI are final. We do not offer refunds, credits, or exchanges for any subscription plan, partial billing period, or unused scans.</strong></p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">Why?</h3>
        <p>Every scan you run consumes high-performance AI compute resources — including large-language-model inference, real-time threat analysis, and multi-persona report generation. Once these compute cycles are expended, they <strong>cannot be recovered or reused</strong>. This cost is incurred by us the moment a scan is initiated, regardless of how the results are used.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">Try Before You Buy</h3>
        <p>We want every customer to be confident in their purchase. That's why we offer:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>A free 3-day trial</strong> — test the platform with 1 scan per day, no credit card required.</li>
            <li><strong>A low-cost starter plan (Greenhorn — $7/mo)</strong> — start small and upgrade only when you need more capacity.</li>
        </ul>
        <p className="mt-3">We strongly encourage all users to explore the free trial and start with the lowest plan that fits their needs before committing to a higher tier.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">Cancellation</h3>
        <p>You may cancel your subscription at any time from the billing portal. Cancellation takes effect at the end of the current billing period — you will retain access until then. No partial-month refunds will be issued.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">Contact</h3>
        <p>If you believe there has been a billing error, please email <a href="mailto:billing@cybersentinel.ai" className="text-cyan-400 hover:underline">billing@cybersentinel.ai</a> and we will investigate promptly.</p>
    </LegalModal>
);

// ─── EEA (GDPR) Notice ─────────────────────────────────────────────────────────
export const GDPRNoticeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <LegalModal title="EEA (GDPR) Privacy Notice" onClose={onClose}>
        <p className="text-xs text-gray-500 mb-6">Last updated: March 2026</p>

        <p>This notice supplements our Privacy Policy for users located in the European Economic Area (EEA), the United Kingdom, and Switzerland, in accordance with the General Data Protection Regulation (GDPR).</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">1. Data Controller</h3>
        <p>CyberPlanet LLC is the data controller responsible for your personal data. Contact: <a href="mailto:privacy@cybersentinel.ai" className="text-cyan-400 hover:underline">privacy@cybersentinel.ai</a>.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">2. Legal Basis for Processing</h3>
        <ul className="list-disc pl-6 space-y-1">
            <li><strong>Contract performance:</strong> processing necessary to provide the Service you signed up for.</li>
            <li><strong>Legitimate interest:</strong> security monitoring, fraud prevention, and service improvement.</li>
            <li><strong>Consent:</strong> analytics cookies and optional marketing communications (you may withdraw consent at any time).</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">3. Your Rights Under GDPR</h3>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Access</strong> the personal data we hold about you.</li>
            <li><strong>Rectify</strong> inaccurate or incomplete data.</li>
            <li><strong>Erase</strong> your data ("right to be forgotten").</li>
            <li><strong>Restrict</strong> processing in certain circumstances.</li>
            <li><strong>Data portability</strong> — receive your data in a structured, machine-readable format.</li>
            <li><strong>Object</strong> to processing based on legitimate interest.</li>
            <li><strong>Withdraw consent</strong> at any time without affecting the lawfulness of prior processing.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">4. International Transfers</h3>
        <p>Your data may be transferred to and processed in the United States. We rely on Standard Contractual Clauses (SCCs) approved by the European Commission to safeguard these transfers.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">5. Data Retention</h3>
        <p>We retain personal data only as long as necessary to fulfil the purposes described in our Privacy Policy, or as required by law. Scan history is retained for 90 days by default.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">6. Supervisory Authority</h3>
        <p>If you are not satisfied with our response to a privacy concern, you have the right to lodge a complaint with your local data protection authority.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">7. Contact</h3>
        <p>For GDPR-related requests: <a href="mailto:privacy@cybersentinel.ai" className="text-cyan-400 hover:underline">privacy@cybersentinel.ai</a></p>
    </LegalModal>
);

// ─── California (CCPA) Notice ──────────────────────────────────────────────────
export const CCPANoticeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <LegalModal title="California (CCPA) Privacy Notice" onClose={onClose}>
        <p className="text-xs text-gray-500 mb-6">Last updated: March 2026</p>

        <p>This notice supplements our Privacy Policy for California residents, in accordance with the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA).</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">1. Categories of Personal Information Collected</h3>
        <ul className="list-disc pl-6 space-y-1">
            <li><strong>Identifiers:</strong> email address, name, IP address.</li>
            <li><strong>Commercial information:</strong> subscription plan, billing history.</li>
            <li><strong>Internet activity:</strong> scan targets submitted, pages visited, interactions with the Service.</li>
            <li><strong>Geolocation data:</strong> approximate location derived from IP address.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">2. How We Use Personal Information</h3>
        <p>We use personal information to provide the Service, process payments, improve functionality, prevent fraud, and comply with legal obligations. See our Privacy Policy for full details.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">3. Sale / Sharing of Personal Information</h3>
        <p><strong>We do not sell or share your personal information</strong> for cross-context behavioral advertising as defined by the CCPA/CPRA.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">4. Your Rights Under CCPA/CPRA</h3>
        <p>As a California resident, you have the right to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Know</strong> what personal information we collect, use, and disclose.</li>
            <li><strong>Delete</strong> your personal information.</li>
            <li><strong>Correct</strong> inaccurate personal information.</li>
            <li><strong>Opt out</strong> of the sale or sharing of personal information (we do not sell/share).</li>
            <li><strong>Non-discrimination</strong> — we will not penalize you for exercising your rights.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">5. How to Exercise Your Rights</h3>
        <p>Submit a verifiable request by emailing <a href="mailto:privacy@cybersentinel.ai" className="text-cyan-400 hover:underline">privacy@cybersentinel.ai</a>. We will respond within 45 days as required by law.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">6. Authorized Agents</h3>
        <p>You may designate an authorized agent to submit requests on your behalf. We may require verification of the agent's authority.</p>

        <h3 className="text-lg font-bold text-gray-100 mt-6 mb-2">7. Contact</h3>
        <p>California privacy inquiries: <a href="mailto:privacy@cybersentinel.ai" className="text-cyan-400 hover:underline">privacy@cybersentinel.ai</a></p>
    </LegalModal>
);
