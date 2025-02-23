'use client';
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { matchesAtom } from "./matches-atom";

export default function MatchesProvider({ matches }: { matches: any }) {
    const setMatches = useSetAtom(matchesAtom);

    useEffect(() => {
        setMatches(matches);
    }, [matches]);

    return null;
}