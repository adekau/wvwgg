'use client';
import { useEffect } from "react";
import { useMatches } from "./matches-atom";

export default function MatchesProvider({ matches }: { matches: any }) {
    const [_matches, setMatches] = useMatches();

    useEffect(() => {
        setMatches(matches);
    }, [matches]);

    return null;
}