import React from 'react';
import type { HistoryEntry } from '../../types';
import { PERSONAS } from '../../constants';

interface HistoryPanelProps {
    history: HistoryEntry[];
    onSelect: (entry: HistoryEntry) => void;
    onClear: () => void;
    activeId: string | null;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear, activeId }) => {
    if (history.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 text-sm">
                <p>No scan history yet.</p>
                <p className="mt-1">Run your first analysis to get started.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Scans</h3>
                <button
                    onClick={onClear}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                    Clear all
                </button>
            </div>
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {history.map(entry => {
                    const persona = PERSONAS.find(p => p.id === entry.persona);
                    const isActive = entry.id === activeId;
                    return (
                        <li key={entry.id}>
                            <button
                                onClick={() => onSelect(entry)}
                                className={`w-full text-left p-3 rounded-md border transition-all duration-150 ${
                                    isActive
                                        ? 'bg-cyan-900/30 border-cyan-600'
                                        : 'bg-gray-700/40 border-gray-700 hover:border-gray-500 hover:bg-gray-700/60'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${persona?.color ?? ''}`}>
                                        {persona?.name ?? entry.persona}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-300 truncate">{entry.target}</p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    {new Date(entry.timestamp).toLocaleDateString(undefined, {
                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                    })}
                                </p>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
