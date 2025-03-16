import { IFormattedMatch } from '@shared/interfaces/formatted-match.interface';
import { MatchId } from '@shared/interfaces/match-id.type';
import { atom } from 'jotai';

export const matchesAtom = atom<Record<MatchId, IFormattedMatch>>({});
export const selectedMatchAtom = atom<string | undefined>(undefined);
