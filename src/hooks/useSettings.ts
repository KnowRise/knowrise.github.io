'use client';

import { useEffect, useState } from 'react';
import { getSettings } from '../lib/settings';
import type { Settings } from '../types';

let cached: Settings['data'] | null = null;
let inflight: Promise<Settings['data']> | null = null;

export function useSettings(): Settings['data'] | null {
  const [settings, setSettings] = useState<Settings['data'] | null>(cached);

  useEffect(() => {
    if (cached) {
      setSettings(cached);
      return;
    }
    if (!inflight) {
      inflight = getSettings().then((s) => {
        cached = s;
        inflight = null;
        return s;
      });
    }
    inflight.then(setSettings);
  }, []);

  return settings;
}