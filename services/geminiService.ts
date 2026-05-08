import type { AnalysisReport, HackerPersona } from '../types';
import { supabase } from './supabaseClient';

/**
 * All AI calls go through the backend API (/api/analyze).
 * The GEMINI_API_KEY never leaves the server — it is NOT included in the
 * client bundle.
 */
export const generateSecurityAnalysis = async (
    target: string,
    persona: HackerPersona
): Promise<AnalysisReport> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ target, persona }),
    });

    if (!response.ok) {
        let errorMessage = 'Analysis failed. Please try again.';
        try {
            const body = await response.json() as { error?: string };
            if (body.error) errorMessage = body.error;
        } catch {
            // ignore JSON parse errors; use fallback message
        }
        throw new Error(errorMessage);
    }

    const report = await response.json() as AnalysisReport;
    return report;
};