
import React, { useState } from 'react';
import type { HackerPersona } from '../types';
import { PERSONAS } from '../constants';

interface InputFormProps {
    onSubmit: (target: string, persona: HackerPersona) => void;
    isLoading: boolean;
    allowedPersonas?: string[];
    onUpgrade?: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, allowedPersonas, onUpgrade }) => {
    const [target, setTarget] = useState<string>('');
    const [selectedPersona, setSelectedPersona] = useState<HackerPersona>(PERSONAS[0].id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (target.trim()) {
            onSubmit(target, selectedPersona);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl h-full flex flex-col sticky top-28">
            <h2 className="text-xl font-bold text-cyan-300 mb-4">Analysis Configuration</h2>
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                <div className="mb-6">
                    <label htmlFor="target" className="block text-sm font-medium text-gray-300 mb-2">
                        Target Website or Application
                    </label>
                    <textarea
                        id="target"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="e.g., https://example.com or 'A social media app for pet owners'"
                        className="w-full h-32 p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors placeholder-gray-500 text-gray-200 resize-none"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Hacker Persona
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PERSONAS.map((persona) => {
                            const locked = allowedPersonas && !allowedPersonas.includes(persona.id);
                            return (
                                <button
                                    key={persona.id}
                                    type="button"
                                    onClick={() => locked ? onUpgrade?.() : setSelectedPersona(persona.id)}
                                    disabled={isLoading}
                                    className={`relative p-3 rounded-md border text-center transition-all duration-200 ${
                                        locked
                                            ? 'bg-gray-800/40 border-gray-700 cursor-not-allowed opacity-50'
                                            : selectedPersona === persona.id
                                                ? `${persona.color} ring-2 ring-offset-2 ring-offset-gray-800 ${persona.accentColor.replace('border-', 'ring-')}`
                                                : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <div className="flex justify-center mb-1">{persona.icon}</div>
                                    <span className="font-semibold text-sm">{persona.name}</span>
                                    {locked && (
                                        <span className="absolute inset-0 flex items-center justify-center bg-gray-900/70 rounded-md">
                                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                                Upgrade
                                            </span>
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-auto">
                    <button
                        type="submit"
                        disabled={isLoading || !target.trim()}
                        className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? 'Analyzing...' : 'Run Analysis'}
                    </button>
                </div>
            </form>
        </div>
    );
};