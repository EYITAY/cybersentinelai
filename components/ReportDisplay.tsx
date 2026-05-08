import React, { useState, useRef } from 'react';
import type { AnalysisReport, HackerPersona, Vulnerability } from '../types';
import { Card } from './common/Card';
import { PERSONAS } from '../constants';
import { useToast } from './common/Toast';

interface ReportDisplayProps {
    report: AnalysisReport | null;
    persona: HackerPersona;
    canExportPdf?: boolean;
    onUpgrade?: () => void;
}

const getSeverityClass = (severity: Vulnerability['severity']): string => {
    switch (severity?.toLowerCase()) {
        case 'critical': return 'bg-red-900/50 text-red-300 border-red-700';
        case 'high': return 'bg-orange-900/50 text-orange-300 border-orange-700';
        case 'medium': return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
        case 'low': return 'bg-blue-900/50 text-blue-300 border-blue-700';
        case 'informational': return 'bg-cyan-900/50 text-cyan-300 border-cyan-700';
        default: return 'bg-gray-700/50 text-gray-300 border-gray-600';
    }
};

const SpinnerSmall: React.FC = () => (
    <div className="w-5 h-5 border-2 border-white border-solid rounded-full animate-spin border-t-transparent"></div>
);

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, persona, canExportPdf = true, onUpgrade }) => {
    const personaInfo = PERSONAS.find(p => p.id === persona) || PERSONAS[0];
    const [isExporting, setIsExporting] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();

    const handleExportPdf = async () => {
        if (!canExportPdf) {
            onUpgrade?.();
            return;
        }
        if (!reportRef.current || !report) return;

        setIsExporting(true);
        try {
            // Load heavy PDF dependencies only when export is triggered.
            const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
                import('jspdf'),
                import('html2canvas'),
            ]);

            // Hide the export button during capture
            const exportBtn = reportRef.current.querySelector('[data-export-btn]') as HTMLElement | null;
            if (exportBtn) exportBtn.style.display = 'none';

            // Expand all <details> so collapsed content is captured
            const detailsEls = reportRef.current.querySelectorAll('details');
            const prevOpen = Array.from(detailsEls).map(d => d.open);
            detailsEls.forEach(d => { d.open = true; });

            const canvas = await html2canvas(reportRef.current, {
                useCORS: true,
                backgroundColor: '#111827',
                scale: 2,
            });

            // Restore collapsed state and button visibility
            detailsEls.forEach((d, i) => { d.open = prevOpen[i]; });
            if (exportBtn) exportBtn.style.display = '';

            const MARGIN = 30; // px margin on each side
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: 'a4',
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const contentWidth = pageWidth - MARGIN * 2;
            const contentHeight = pageHeight - MARGIN * 2 - 20; // 20px reserved for footer

            // Scale canvas to fit within content area
            const scale = contentWidth / canvas.width;
            const scaledFullHeight = canvas.height * scale;
            const totalPages = Math.ceil(scaledFullHeight / contentHeight);

            // Slice canvas into pages
            const sliceHeight = contentHeight / scale; // height in canvas pixels per page

            for (let i = 0; i < totalPages; i++) {
                if (i > 0) pdf.addPage();

                const srcY = i * sliceHeight;
                const srcH = Math.min(sliceHeight, canvas.height - srcY);
                const destH = srcH * scale;

                // Create a per-page canvas slice
                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = canvas.width;
                pageCanvas.height = srcH;
                const ctx = pageCanvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#111827';
                    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
                    ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
                }

                const pageImgData = pageCanvas.toDataURL('image/png');
                pdf.addImage(pageImgData, 'PNG', MARGIN, MARGIN, contentWidth, destH);

                // Footer: branding + page number
                pdf.setFontSize(8);
                pdf.setTextColor(120, 120, 120);
                pdf.text(
                    'Cyber Sentinel AI — Confidential Security Report',
                    MARGIN,
                    pageHeight - 12
                );
                pdf.text(
                    `Page ${i + 1} of ${totalPages}`,
                    pageWidth - MARGIN,
                    pageHeight - 12,
                    { align: 'right' }
                );
            }

            // Set document metadata
            pdf.setProperties({
                title: `Cyber Sentinel AI — ${personaInfo.name} Hat Report`,
                creator: 'Cyber Sentinel AI',
            });

            pdf.save(`CyberSentinel-Report-${personaInfo.name.replace(' ', '-')}.pdf`);

        } catch (error) {
            console.error("Error exporting PDF:", error);
            showToast("Sorry, there was an error exporting the PDF. Please try again.", "error");
        } finally {
            setIsExporting(false);
        }
    };

    if (!report) {
        return (
            <div className="flex flex-col justify-center items-center h-full bg-gray-800/50 rounded-lg p-8 border-2 border-dashed border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="mt-4 text-2xl font-bold text-gray-400">Awaiting Analysis</h2>
                <p className="mt-2 text-gray-500 text-center">Configure your target and select a persona to begin the security scan.</p>
            </div>
        );
    }
    
    return (
        <div id="report-content" ref={reportRef} className="space-y-8 animate-fade-in bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg">
            <header className="flex justify-between items-start flex-wrap gap-4">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                   <span className={`p-2 rounded-md ${personaInfo.color}`}>{personaInfo.icon}</span> 
                   <span className={personaInfo.color.split(' ')[2]}>{personaInfo.name} Hat Report</span>
                </h2>
                <button
                    data-export-btn
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    className={`font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                        canExportPdf
                            ? 'bg-cyan-600 text-white hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                    title={canExportPdf ? 'Export as PDF' : 'Upgrade to a paid plan to export PDFs'}
                >
                    {!canExportPdf ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Export PDF — Upgrade
                        </>
                    ) : isExporting ? (
                        <>
                            <SpinnerSmall />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Export PDF
                        </>
                    )}
                </button>
            </header>

            <section>
                <Card title="Identified Vulnerabilities" borderColor={personaInfo.accentColor}>
                    <div className="space-y-4">
                        {report.vulnerabilities.map((vuln, index) => (
                            <div key={index} className="bg-gray-800/50 p-4 rounded-md">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-lg text-gray-100">{vuln.name}</h4>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getSeverityClass(vuln.severity)}`}>
                                        {vuln.severity}
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-300 whitespace-pre-wrap">{vuln.description}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>
            
            <section>
                 <Card title="Attack Scenarios" borderColor={personaInfo.accentColor}>
                    <div className="space-y-4">
                        {report.attackScenarios.map((attack, index) => (
                            <details key={index} className="bg-gray-800/50 p-4 rounded-md group">
                                <summary className="font-semibold text-lg text-gray-100 cursor-pointer list-none flex items-center justify-between">
                                    {attack.title}
                                    <svg className="w-5 h-5 transition-transform duration-300 group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </summary>
                                <p className="mt-3 text-gray-300 whitespace-pre-wrap">{attack.scenario}</p>
                            </details>
                        ))}
                    </div>
                 </Card>
            </section>

            <section>
                 <Card title="Mitigation Strategies" borderColor="border-green-500">
                    <div className="space-y-4">
                        {report.mitigationStrategies.map((mitigation, index) => (
                            <details key={index} className="bg-gray-800/50 p-4 rounded-md group" open>
                                <summary className="font-semibold text-lg text-green-300 cursor-pointer list-none flex items-center justify-between">
                                    {mitigation.title}
                                    <svg className="w-5 h-5 transition-transform duration-300 group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </summary>
                                <p className="mt-3 text-gray-300 whitespace-pre-wrap">{mitigation.strategy}</p>
                            </details>
                        ))}
                    </div>
                 </Card>
            </section>
        </div>
    );
};