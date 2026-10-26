import { createElement } from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MilestoneMarks } from './MilestoneMarks.tsx';

describe('milestone marks', () => {
  it('draws a dashed outline and stacks marks on one year', () => {
    const { container } = render(
      createElement(MilestoneMarks, {
        marks: [
          { id: 'a', year: -221, label: 'Family note' },
          { id: 'b', year: -221, label: 'Another note' },
        ],
      }),
    );
    const boxes = [...container.querySelectorAll('.milestone-box')];
    expect(boxes).toHaveLength(2);
    expect(boxes[0]?.getAttribute('fill')).toBe('none');
    expect(boxes[0]?.getAttribute('stroke-dasharray')).toBe('4 3');
    expect(boxes[0]?.getAttribute('y')).not.toBe(boxes[1]?.getAttribute('y'));
    expect(container.querySelector('.milestone-label')?.textContent).toBe(
      'Another note',
    );
  });
});
