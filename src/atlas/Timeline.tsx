import type { ComponentProps } from 'react';
import { LivingTimeline } from './LivingTimeline';
import { TimelineReference } from './TimelineReference';

export function Timeline(props: ComponentProps<typeof LivingTimeline>) {
  return (
    <>
      <LivingTimeline
        key={`${props.location.year}:${props.location.scale}:${props.location.pack}:${props.location.region}`}
        {...props}
      />
      <details className="timeline-reference">
        <summary>Full chronology, chapter reading &amp; coverage notes</summary>
        <TimelineReference
          corpus={props.corpus}
          location={props.location}
          pack={props.pack}
          openSubject={props.openSubject}
          openPack={props.openPack}
        />
      </details>
    </>
  );
}
