import { atom, useAtom } from "jotai";

export const matchesAtom = atom<any>({})
export const selectedMatchAtom = atom<string | undefined>(undefined);
