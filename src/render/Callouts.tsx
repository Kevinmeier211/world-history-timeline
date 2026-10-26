import { Callout } from './Callout.tsx';
import type { CalloutViewModel } from './calloutView.ts';

/** Placed callouts and the markers that still have room. */
export function Callouts({ callouts }: { callouts: readonly CalloutViewModel[] }) {
  return (
    <g className="callouts">
      {callouts.map((model) => (
        <Callout key={model.id} model={model} />
      ))}
    </g>
  );
}
