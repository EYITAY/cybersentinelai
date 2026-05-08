
import React from 'react';
import type { HackerPersona } from './types';
import { WhiteHatIcon } from './components/icons/WhiteHatIcon';
import { BlackHatIcon } from './components/icons/BlackHatIcon';
import { GreyHatIcon } from './components/icons/GreyHatIcon';
import { RedHatIcon } from './components/icons/RedHatIcon';
import { GreenHatIcon } from './components/icons/GreenHatIcon';
import { BlueHatIcon } from './components/icons/BlueHatIcon';

interface PersonaInfo {
    id: HackerPersona;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    accentColor: string;
}

export const PERSONAS: PersonaInfo[] = [
    {
        id: 'white',
        name: 'White Hat',
        description: 'Ethical Hacker',
        icon: <WhiteHatIcon />,
        color: 'bg-gray-200/10 border-gray-300/80 text-gray-100',
        accentColor: 'border-gray-300',
    },
    {
        id: 'black',
        name: 'Black Hat',
        description: 'Malicious Hacker',
        icon: <BlackHatIcon />,
        color: 'bg-neutral-800/20 border-neutral-600/80 text-neutral-300',
        accentColor: 'border-neutral-600',
    },
    {
        id: 'grey',
        name: 'Grey Hat',
        description: 'Not malicious, but not always ethical',
        icon: <GreyHatIcon />,
        color: 'bg-gray-500/10 border-gray-400/80 text-gray-300',
        accentColor: 'border-gray-400',
    },
    {
        id: 'red',
        name: 'Red Hat',
        description: 'Vigilante Hacker',
        icon: <RedHatIcon />,
        color: 'bg-red-500/10 border-red-500/80 text-red-400',
        accentColor: 'border-red-500',
    },
    {
        id: 'green',
        name: 'Green Hat',
        description: 'New, unskilled Hacker',
        icon: <GreenHatIcon />,
        color: 'bg-green-500/10 border-green-500/80 text-green-400',
        accentColor: 'border-green-500',
    },
    {
        id: 'blue',
        name: 'Blue Hat',
        description: 'Vengeful Hacker',
        icon: <BlueHatIcon />,
        color: 'bg-blue-500/10 border-blue-500/80 text-blue-400',
        accentColor: 'border-blue-500',
    },
];