'use client';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { IFormattedMatch } from '../../../shared/interfaces/formatted-match.interface';
import { MatchId } from '../../../shared/interfaces/match-id.type';
import { matchesAtom } from './matches-atom';

export default function MatchesProvider({ matches }: { matches: Record<MatchId, IFormattedMatch> }) {
    const setMatches = useSetAtom(matchesAtom);

    useEffect(() => {
        setMatches({ ...matches });
    }, [matches, setMatches]);

    return null;
}
