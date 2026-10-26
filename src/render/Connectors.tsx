import { Connector, CONNECTOR_HATCH } from './Connector.tsx';
import type { ConnectorPaint } from './connectorInk.ts';

export function Connectors({ connectors }: { connectors: readonly ConnectorPaint[] }) {
  const hatched = connectors.some((connector) => connector.hatch);
  return (
    <g className="connectors">
      {hatched ? (
        <defs>
          <pattern
            id={CONNECTOR_HATCH}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line className="connector-hatch-line" x1="0" y1="0" x2="0" y2="6" />
          </pattern>
        </defs>
      ) : null}
      {connectors.map((connector) => (
        <Connector key={connector.id} connector={connector} />
      ))}
    </g>
  );
}
