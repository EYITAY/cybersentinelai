
import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    borderColor?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, borderColor = 'border-gray-700' }) => {
    return (
        <div className={`bg-gray-800 rounded-lg shadow-lg border-t-4 ${borderColor} overflow-hidden`}>
            <div className="p-5">
                <h3 className="text-2xl font-semibold mb-4 text-gray-100">{title}</h3>
                <div className="text-gray-300">
                    {children}
                </div>
            </div>
        </div>
    );
};
