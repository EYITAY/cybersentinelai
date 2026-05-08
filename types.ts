
export type HackerPersona = 'white' | 'black' | 'grey' | 'red' | 'green' | 'blue';

export interface Vulnerability {
    name: string;
    description: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
}

export interface AttackScenario {
    title: string;
    scenario: string;
}

export interface MitigationStrategy {
    title:string;
    strategy: string;
}

export interface AnalysisReport {
    vulnerabilities: Vulnerability[];
    attackScenarios: AttackScenario[];
    mitigationStrategies: MitigationStrategy[];
}

export interface HistoryEntry {
    id: string;
    target: string;
    persona: HackerPersona;
    timestamp: number;
    report: AnalysisReport;
}