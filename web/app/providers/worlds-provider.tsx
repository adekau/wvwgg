'use client';
import { IWorld } from '@shared/interfaces/world.interface';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { worldsAtom } from './worlds-atom';

export default function WorldsProvider({ worlds }: { worlds: IWorld[] }) {
    const setWorlds = useSetAtom(worldsAtom);

    useEffect(() => {
        setWorlds(worlds ?? []);
    }, [worlds, setWorlds]);

    return null;
}
