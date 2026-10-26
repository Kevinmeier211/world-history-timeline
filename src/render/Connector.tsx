import { memo } from 'react';

import type { ConnectorPaint } from './connectorInk.ts';

export const CONNECTOR_HATCH = 'connector-hatch';

function ConnectorView({ connector }: { connector: ConnectorPaint }) {
  const dashed = connector.dasharray.length > 0;
  return (
    <g className={`connector connector-${connector.type}`} data-relation={connector.id}>
      <path
        className={dashed ? 'connector-flow connector-dashed' : 'connector-flow'}
        d={connector.d}
        fill={dashed ? 'none' : connector.fill}
        stroke={dashed ? connector.fill : 'none'}
        strokeDasharray={dashed ? connector.dasharray : undefined}
      />
      {connector.hatch ? (
        <path
          className="connector-hatch"
          d={connector.d}
          fill={`url(#${CONNECTOR_HATCH})`}
        />
      ) : null}
    </g>
  );
}

export const Connector = memo(ConnectorView);
