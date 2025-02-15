'use client';
import { useEffect, useState } from 'react';
import { getHealth } from './actions';

export default function Button() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    getHealth().then((output) => {
        console.log('getHealth output', output);
        setHealth(output);
    });
  }, []);

  return <div>
    Health: {JSON.stringify(health?.Item)}
  </div>
}