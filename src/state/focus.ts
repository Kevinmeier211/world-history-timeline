import { create } from 'zustand';

import type { Confidence, Verification } from '../data/schema/primitives.ts';

export interface FocusTip {
  polityId: string;
  familyId: string;
  name: string;
  dates: string;
  confidence: Confidence;
  verification: Verification;
  x: number;
  y: number;
}

interface FocusState extends FocusTip {
  active: boolean;
  show: (tip: FocusTip) => void;
  hide: () => void;
}

const empty: FocusTip = {
  polityId: '',
  familyId: '',
  name: '',
  dates: '',
  confidence: 'secure',
  verification: 'unverified',
  x: 0,
  y: 0,
};

export const useFocus = create<FocusState>((set) => ({
  ...empty,
  active: false,
  show: (tip) => set({ ...tip, active: true }),
  hide: () => set({ active: false }),
}));

export function resetFocus(): void {
  useFocus.setState({ ...empty, active: false });
}
