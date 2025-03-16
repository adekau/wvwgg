import { IFormattedGuild } from '@shared/interfaces/formatted-guild.interface';
import { atom } from 'jotai';

export const guildsAtom = atom<IFormattedGuild[]>([]);
export const bookmarkedGuildsAtom = atom<string[]>([]);
