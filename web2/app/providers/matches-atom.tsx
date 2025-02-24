import { atom, useAtom } from "jotai";
import { MatchId } from "../../../shared/interfaces/match-id.type";
import { IFormattedMatch } from "../../../shared/interfaces/formatted-match.interface";

export const matchesAtom = atom<Record<MatchId, IFormattedMatch>>({})
export const selectedMatchAtom = atom<string | undefined>(undefined);
