import { IWorld } from '@shared/interfaces/world.interface';
import { atom } from 'jotai';

export const worldsAtom = atom<IWorld[]>([]);
