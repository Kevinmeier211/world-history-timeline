import { useState } from 'react';

import {
  addMilestone,
  readMilestones,
  removeMilestone,
  writeMilestones,
  type Milestone,
} from '../state/milestones.ts';

function storage(): Storage | null {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function useMilestones(): {
  marks: readonly Milestone[];
  add: (year: number, label: string) => void;
  remove: (id: string) => void;
} {
  const [marks, setMarks] = useState(() => readMilestones(storage()));
  const add = (year: number, label: string) => {
    setMarks((rows) => writeMilestones(storage(), addMilestone(rows, year, label)));
  };
  const remove = (id: string) => {
    setMarks((rows) => writeMilestones(storage(), removeMilestone(rows, id)));
  };
  return { marks, add, remove };
}
