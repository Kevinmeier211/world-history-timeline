import React, { useMemo, useRef, useState } from 'react';
import {
  Region,
  RegionId,
  Polity,
  HistoricalNode,
  CrossCuttingBand,
  TradeOrMigrationRoute,
  HistoricalEra,
  LensMode,
  TimeScaleMode,
  NodeCategory,
} from '../types/history';
import { PALEOCLIMATE_CURVE } from '../data';
import {
  yearToY,
  yToYear,
  getTotalCanvasHeight,
  formatYear,
  formatYearShort,
  generateTimeTicks,
  buildVerticalRibbonPath,
  buildSankeyTransitionPath,
  ComputedSpanRect,
} from '../utils/timeLayout';
import {
  Landmark,
  Sparkles,
  Swords,
  Crown,
  Lightbulb,
  BookOpen,
  CloudLightning,
  Compass,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Maximize2,
  Lock,
  Unlock,
} from 'lucide-react';

interface TimelineCanvasProps {
  visibleRegions: Region[];
  polities: Polity[];
  polityById: Record<string, Polity>;
  nodes: HistoricalNode[];
  bands: CrossCuttingBand[];
  routes: TradeOrMigrationRoute[];
  eras: HistoricalEra[];
  zoom: number;
  timeScaleMode: TimeScaleMode;
  lensMode: LensMode;
  activeYear: number;
  yearLocked: boolean;
  onChangeActiveYear: (year: number) => void;
  onToggleYearLock: () => void;
  selectedPolityId: string | null;
  selectedNodeId: string | null;
  selectedBandId: string | null;
  onSelectPolity: (polity: Polity) => void;
  onSelectNode: (node: HistoricalNode) => void;
  onSelectBand: (band: CrossCuttingBand) => void;
  onMoveRegionColumn: (regionId: RegionId, direction: -1 | 1) => void;
  onHideRegionColumn: (regionId: RegionId) => void;
  onSoloRegionColumn: (regionId: RegionId) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

const ERA_SIDEBAR_WIDTH = 42;
const YEAR_AXIS_WIDTH = 104;
const LEFT_GUTTER = ERA_SIDEBAR_WIDTH + YEAR_AXIS_WIDTH;

function getCategoryIcon(category: NodeCategory) {
  switch (category) {
    case 'MONUMENT':
      return <Landmark size={12} aria-hidden="true" />;
    case 'ARTIFACT':
      return <Sparkles size={12} aria-hidden="true" />;
    case 'WAR':
      return <Swords size={12} aria-hidden="true" />;
    case 'RULER':
      return <Crown size={12} aria-hidden="true" />;
    case 'INVENTION':
      return <Lightbulb size={12} aria-hidden="true" />;
    case 'PHILOSOPHY':
      return <BookOpen size={12} aria-hidden="true" />;
    case 'CLIMATE':
      return <CloudLightning size={12} aria-hidden="true" />;
    case 'TRADE':
      return <Compass size={12} aria-hidden="true" />;
  }
}

function doesNodeMatchLens(node: HistoricalNode, lens: LensMode): boolean {
  if (lens === 'ALL') return true;
  if (lens === 'GEOPOLITICS') return node.category === 'RULER' || node.category === 'WAR';
  if (lens === 'TRADE_MIGRATION') return node.category === 'TRADE';
  if (lens === 'CLIMATE_PANDEMIC') return node.category === 'CLIMATE';
  if (lens === 'SCIENCE_WRITING') return node.category === 'INVENTION';
  if (lens === 'PHILOSOPHY_ART')
    return (
      node.category === 'PHILOSOPHY' ||
      node.category === 'MONUMENT' ||
      node.category === 'ARTIFACT'
    );
  return true;
}

export const TimelineCanvas: React.FC<TimelineCanvasProps> = ({
  visibleRegions,
  polities,
  polityById,
  nodes,
  bands,
  routes,
  eras,
  zoom,
  timeScaleMode,
  lensMode,
  activeYear,
  yearLocked,
  onChangeActiveYear,
  onToggleYearLock,
  selectedPolityId,
  selectedNodeId,
  selectedBandId,
  onSelectPolity,
  onSelectNode,
  onSelectBand,
  onMoveRegionColumn,
  onHideRegionColumn,
  onSoloRegionColumn,
  scrollContainerRef,
}) => {
  const [hoveredPolityId, setHoveredPolityId] = useState<string | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const colWidth = Math.round(215 * Math.max(0.85, Math.min(1.45, zoom * 0.92)));
  const totalWidth = LEFT_GUTTER + visibleRegions.length * colWidth + 40;
  const totalHeight = getTotalCanvasHeight(timeScaleMode, zoom);

  const visibleRegionIndexMap = useMemo(() => {
    const map: Partial<Record<RegionId, number>> = {};
    visibleRegions.forEach((r, idx) => {
      map[r.id] = idx;
    });
    return map;
  }, [visibleRegions]);

  const timeTicks = useMemo(
    () => generateTimeTicks(timeScaleMode, zoom),
    [timeScaleMode, zoom]
  );

  // Compute lineage set for hovered or selected polity so ancestors & descendants stay illuminated
  const highlightedPolitySet = useMemo(() => {
    const focusId = hoveredPolityId || selectedPolityId;
    if (!focusId) return null;
    const set = new Set<string>([focusId]);
    const focusPolity = polityById[focusId];
    if (focusPolity) {
      focusPolity.parentIds.forEach((id) => set.add(id));
      focusPolity.childIds.forEach((id) => set.add(id));
    }
    return set;
  }, [hoveredPolityId, selectedPolityId, polityById]);

  // Compute geometry for every visible PolitySpan
  const computedSpans = useMemo(() => {
    const list: ComputedSpanRect[] = [];
    for (const polity of polities) {
      for (const span of polity.spans) {
        const colIndex = visibleRegionIndexMap[span.regionId];
        if (colIndex === undefined) continue;

        const colCenter = LEFT_GUTTER + colIndex * colWidth + colWidth / 2;
        const offsetPx = (span.laneOffset || 0) * colWidth * 0.68;
        const xCenter = colCenter + offsetPx;
        const width = Math.max(24, span.weight * (colWidth * 0.72));
        const yStart = yearToY(span.startYear, timeScaleMode, zoom);
        const yEnd = yearToY(span.endYear, timeScaleMode, zoom);

        list.push({
          polity,
          regionId: span.regionId,
          colIndex,
          xCenter,
          width,
          xLeft: xCenter - width / 2,
          xRight: xCenter + width / 2,
          yStart,
          yEnd,
          height: Math.max(12, yEnd - yStart),
        });
      }
    }
    return list;
  }, [polities, visibleRegionIndexMap, colWidth, timeScaleMode, zoom]);

  // Compute horizontal bridging envelopes for multi-column empires
  const multiColumnBridges = useMemo(() => {
    const bridges: Array<{
      polity: Polity;
      xLeft: number;
      xRight: number;
      yStart: number;
      yEnd: number;
    }> = [];

    for (const polity of polities) {
      if (polity.spans.length < 2) continue;
      const visibleSpans = computedSpans.filter((s) => s.polity.id === polity.id);
      if (visibleSpans.length < 2) continue;

      // Find overlapping window between primary span and secondary spans
      const primary =
        visibleSpans.find((s) => s.regionId === polity.primaryRegionId) ||
        visibleSpans[0];
      if (!primary) continue;

      for (const other of visibleSpans) {
        if (other === primary) continue;
        const yStart = Math.max(primary.yStart, other.yStart);
        const yEnd = Math.min(primary.yEnd, other.yEnd);
        if (yEnd > yStart + 4) {
          bridges.push({
            polity,
            xLeft: Math.min(primary.xCenter, other.xCenter),
            xRight: Math.max(primary.xCenter, other.xCenter),
            yStart,
            yEnd,
          });
        }
      }
    }
    return bridges;
  }, [polities, computedSpans]);

  // Compute Sankey parent -> child transition paths
  const transitionPaths = useMemo(() => {
    const transitions: Array<{
      id: string;
      parentPolity: Polity;
      childPolity: Polity;
      d: string;
    }> = [];

    for (const parent of polities) {
      for (const childId of parent.childIds) {
        const child = polityById[childId];
        if (!child) continue;

        // Find best matching span pair (prefer same region, else primary spans)
        const parentSpans = computedSpans.filter((s) => s.polity.id === parent.id);
        const childSpans = computedSpans.filter((s) => s.polity.id === child.id);
        if (parentSpans.length === 0 || childSpans.length === 0) continue;

        const firstParent = parentSpans[0];
        const firstChild = childSpans[0];
        if (!firstParent || !firstChild) continue;
        let pSpan = firstParent;
        let cSpan = firstChild;
        for (const ps of parentSpans) {
          const sameReg = childSpans.find((cs) => cs.regionId === ps.regionId);
          if (sameReg) {
            pSpan = ps;
            cSpan = sameReg;
            break;
          }
        }

        const y1 = pSpan.yEnd - 4;
        const y2 = cSpan.yStart + 4;
        if (Math.abs(y2 - y1) < 280) {
          transitions.push({
            id: `${parent.id}->${child.id}`,
            parentPolity: parent,
            childPolity: child,
            d: buildSankeyTransitionPath(
              pSpan.xCenter,
              pSpan.width,
              y1,
              cSpan.xCenter,
              cSpan.width,
              y2
            ),
          });
        }
      }
    }
    return transitions;
  }, [polities, polityById, computedSpans]);

  // Paleoclimate SVG path in the Year Axis gutter
  const climateSparklinePath = useMemo(() => {
    const xZero = ERA_SIDEBAR_WIDTH + 24;
    const scaleX = 14; // px per °C
    return PALEOCLIMATE_CURVE.map((pt, idx) => {
      const y = yearToY(pt.year, timeScaleMode, zoom);
      const x = xZero + pt.tempDeltaC * scaleX;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  }, [timeScaleMode, zoom]);

  // Visible Historical Nodes based on Semantic Zoom LOD & Lens
  const visibleNodes = useMemo(() => {
    const maxTier = zoom >= 1.45 ? 3 : zoom >= 0.95 ? 2 : 1;
    return nodes.filter((n) => {
      if (visibleRegionIndexMap[n.regionId] === undefined) return false;
      if (n.customAdded) return true;
      if (lensMode !== 'ALL') {
        return doesNodeMatchLens(n, lensMode);
      }
      return n.minZoomTier <= maxTier;
    });
  }, [nodes, visibleRegionIndexMap, zoom, lensMode]);

  // Panning handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest(
        'button, a, input, .node-callout-card, .polity-stream-group'
      )
    ) {
      return;
    }
    const container = scrollContainerRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      container.scrollLeft = dragStartRef.current.scrollLeft - dx;
      container.scrollTop = dragStartRef.current.scrollTop - dy;
      return;
    }

    if (!yearLocked) {
      const rect = container.getBoundingClientRect();
      const relY = e.clientY - rect.top + container.scrollTop;
      const hoveredYr = yToYear(relY, timeScaleMode, zoom);
      onChangeActiveYear(hoveredYr);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const activeYearY = yearToY(activeYear, timeScaleMode, zoom);

  return (
    <div
      ref={scrollContainerRef}
      className="timeline-scroll-viewport"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* STICKY REGIONAL COLUMN HEADER BAR */}
      <div
        className="sticky-regions-header"
        style={{ width: `${totalWidth}px` }}
      >
        <div
          className="header-corner-cell"
          style={{ width: `${LEFT_GUTTER}px` }}
        >
          <span className="corner-era-label">ERA / YEAR</span>
          <span className="corner-climate-label">CLIMATE Δ°C</span>
        </div>

        {visibleRegions.map((region, idx) => (
          <div
            key={region.id}
            className="region-column-header"
            style={{
              width: `${colWidth}px`,
              borderBottom: `4px solid ${region.color}`,
            }}
          >
            <div className="region-header-top">
              <div className="region-title-wrap">
                <span
                  className="region-color-badge"
                  style={{ backgroundColor: region.color }}
                />
                <h3>{region.name}</h3>
              </div>

              <div className="region-col-controls">
                <button
                  type="button"
                  className="col-ctrl-btn"
                  disabled={idx === 0}
                  onClick={() => onMoveRegionColumn(region.id, -1)}
                  title="Move Region Left to compare side-by-side"
                >
                  <ChevronLeft size={13} />
                </button>
                <button
                  type="button"
                  className="col-ctrl-btn"
                  disabled={idx === visibleRegions.length - 1}
                  onClick={() => onMoveRegionColumn(region.id, 1)}
                  title="Move Region Right"
                >
                  <ChevronRight size={13} />
                </button>
                <button
                  type="button"
                  className="col-ctrl-btn"
                  onClick={() => onSoloRegionColumn(region.id)}
                  title="Focus / Solo this Region"
                >
                  <Maximize2 size={12} />
                </button>
                {visibleRegions.length > 1 && (
                  <button
                    type="button"
                    className="col-ctrl-btn"
                    onClick={() => onHideRegionColumn(region.id)}
                    title="Hide Region Column"
                  >
                    <EyeOff size={12} />
                  </button>
                )}
              </div>
            </div>

            <p className="region-subtitle">{region.subtitle}</p>
            {zoom >= 1.15 && (
              <div className="subregion-pills">
                {region.subRegions.slice(0, 3).map((sr) => (
                  <span key={sr} className="subregion-pill">
                    {sr}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MAIN TIMELINE STAGE */}
      <div
        className="timeline-stage"
        style={{
          width: `${totalWidth}px`,
          height: `${totalHeight}px`,
        }}
      >
        {/* SVG LAYER: Grid, Era Bands, Multi-Column Bridges, Sankey Transitions, Civilization Streams, Trade Vectors */}
        <svg
          width={totalWidth}
          height={totalHeight}
          className="timeline-svg-layer"
        >
          <defs>
            {/* Uncertainty Fuzzy Top Gradients */}
            {polities
              .filter((p) => p.uncertaintyYears)
              .map((p) => (
                <linearGradient
                  key={`grad-${p.id}`}
                  id={`fuzzyGrad-${p.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={p.color} stopOpacity="0.1" />
                  <stop offset="18%" stopColor={p.color} stopOpacity="0.88" />
                  <stop offset="100%" stopColor={p.color} stopOpacity="0.92" />
                </linearGradient>
              ))}
          </defs>

          {/* Subtle Cartographic Background Watermark Continents */}
          <g
            className="poster-watermark-map"
            opacity="0.035"
            fill="var(--text-primary)"
            transform={`scale(${totalWidth / 1200}, ${totalHeight / 2800})`}
          >
            <circle cx="600" cy="700" r="480" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="600" cy="1800" r="480" fill="none" stroke="currentColor" strokeWidth="4" />
          </g>

          {/* Vertical Column Background Stripes & Divider Lines */}
          {visibleRegions.map((region, idx) => {
            const x = LEFT_GUTTER + idx * colWidth;
            return (
              <g key={`col-bg-${region.id}`}>
                <rect
                  x={x}
                  y={0}
                  width={colWidth}
                  height={totalHeight}
                  fill={idx % 2 === 0 ? 'transparent' : 'var(--column-alt-tint)'}
                />
                <line
                  x1={x + colWidth / 2}
                  y1={0}
                  x2={x + colWidth / 2}
                  y2={totalHeight}
                  stroke={region.color}
                  strokeOpacity="0.16"
                  strokeDasharray="4 6"
                  strokeWidth="1"
                />
                <line
                  x1={x + colWidth}
                  y1={0}
                  x2={x + colWidth}
                  y2={totalHeight}
                  stroke="var(--grid-line)"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Horizontal Chronological Gridlines */}
          {timeTicks.map((yr) => {
            const y = yearToY(yr, timeScaleMode, zoom);
            const isMajor = yr % 500 === 0 || yr === 0;
            return (
              <line
                key={`grid-${yr}`}
                x1={LEFT_GUTTER}
                y1={y}
                x2={totalWidth}
                y2={y}
                stroke="var(--grid-line)"
                strokeWidth={isMajor ? 1.4 : 0.75}
                strokeOpacity={isMajor ? 0.85 : 0.45}
              />
            );
          })}

          {/* Cross-Cutting Global Event & Climate/Epoch Bands */}
          {bands.map((band) => {
            const y1 = yearToY(band.startYear, timeScaleMode, zoom);
            const y2 = yearToY(band.endYear, timeScaleMode, zoom);
            const bandH = Math.max(22, y2 - y1);

            const matchingCols = band.regionIds
              .map((rid) => visibleRegionIndexMap[rid])
              .filter((idx): idx is number => idx !== undefined);
            if (matchingCols.length === 0) return null;

            const minCol = Math.min(...matchingCols);
            const maxCol = Math.max(...matchingCols);
            const x1 = LEFT_GUTTER + minCol * colWidth + 6;
            const x2 = LEFT_GUTTER + (maxCol + 1) * colWidth - 6;

            const isClimateFocused =
              lensMode === 'CLIMATE_PANDEMIC' &&
              (band.type === 'CLIMATE' ||
                band.type === 'PANDEMIC' ||
                band.type === 'COLLAPSE');
            const isSelected = selectedBandId === band.id;

            return (
              <g
                key={band.id}
                className="cross-cutting-band-group"
                onClick={() => onSelectBand(band)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={x1}
                  y={y1}
                  width={Math.max(40, x2 - x1)}
                  height={bandH}
                  rx={4}
                  fill={band.color}
                  fillOpacity={isClimateFocused || isSelected ? 0.32 : 0.14}
                  stroke={band.color}
                  strokeWidth={isClimateFocused || isSelected ? 2 : 1}
                  strokeDasharray={
                    band.type === 'EPOCH' || band.type === 'GOLDEN_AGE'
                      ? '5 3'
                      : undefined
                  }
                />
                <text
                  x={(x1 + x2) / 2}
                  y={y1 + Math.min(bandH / 2 + 4, 16)}
                  textAnchor="middle"
                  className="cross-band-label"
                  fill="var(--text-primary)"
                >
                  {band.title}
                </text>
              </g>
            );
          })}

          {/* Multi-Column Trans-Regional Empire Envelopes */}
          {multiColumnBridges.map((bridge, idx) => {
            const isDimmed =
              highlightedPolitySet && !highlightedPolitySet.has(bridge.polity.id);
            const isHighlighted =
              selectedPolityId === bridge.polity.id ||
              hoveredPolityId === bridge.polity.id;

            return (
              <g
                key={`bridge-${bridge.polity.id}-${idx}`}
                opacity={isDimmed ? 0.14 : isHighlighted ? 0.72 : 0.36}
                onClick={() => onSelectPolity(bridge.polity)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={bridge.xLeft}
                  y={bridge.yStart}
                  width={bridge.xRight - bridge.xLeft}
                  height={Math.max(10, bridge.yEnd - bridge.yStart)}
                  rx={8}
                  fill={bridge.polity.color}
                  stroke={bridge.polity.color}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Parent -> Child Sankey Lineage Transitions */}
          {transitionPaths.map((tr) => {
            const isDimmed =
              highlightedPolitySet &&
              !highlightedPolitySet.has(tr.parentPolity.id) &&
              !highlightedPolitySet.has(tr.childPolity.id);

            return (
              <path
                key={tr.id}
                d={tr.d}
                fill={tr.childPolity.color}
                fillOpacity={isDimmed ? 0.1 : 0.45}
                stroke={tr.childPolity.color}
                strokeOpacity={isDimmed ? 0.15 : 0.65}
                strokeWidth="1"
              />
            );
          })}

          {/* Vertical Civilization Streams (Polities) */}
          {computedSpans.map((span, idx) => {
            const { polity } = span;
            const isSelected = selectedPolityId === polity.id;
            const isHovered = hoveredPolityId === polity.id;
            const isDimmed =
              (highlightedPolitySet && !highlightedPolitySet.has(polity.id)) ||
              (lensMode !== 'ALL' && lensMode !== 'GEOPOLITICS');

            const pathD = buildVerticalRibbonPath(
              span.xCenter,
              span.width,
              span.yStart,
              span.yEnd,
              Boolean(polity.uncertaintyYears)
            );

            const fillUrl = polity.uncertaintyYears
              ? `url(#fuzzyGrad-${polity.id})`
              : polity.color;

            const isPrimaryCol = span.regionId === polity.primaryRegionId;
            const showVerticalLabel = span.height >= 58 && span.width >= 26;

            return (
              <g
                key={`span-${polity.id}-${span.regionId}-${idx}`}
                className="polity-stream-group"
                opacity={isDimmed ? 0.22 : 1}
                onMouseEnter={() => setHoveredPolityId(polity.id)}
                onMouseLeave={() => setHoveredPolityId(null)}
                onClick={() => onSelectPolity(polity)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={pathD}
                  fill={fillUrl}
                  fillOpacity={isSelected || isHovered ? 0.96 : 0.84}
                  stroke={
                    isSelected
                      ? 'var(--text-primary)'
                      : isHovered
                      ? '#ffffff'
                      : 'rgba(0,0,0,0.28)'
                  }
                  strokeWidth={isSelected ? 2.6 : isHovered ? 2 : 1}
                />

                {/* Uncertainty Hatched Cap Indicator */}
                {polity.uncertaintyYears && isPrimaryCol && (
                  <line
                    x1={span.xCenter - span.width * 0.35}
                    y1={span.yStart + 4}
                    x2={span.xCenter + span.width * 0.35}
                    y2={span.yStart + 4}
                    stroke="#ffffff"
                    strokeDasharray="2 2"
                    strokeWidth="1.5"
                  />
                )}

                {/* Stream Title inside Ribbon */}
                {showVerticalLabel && (
                  <text
                    x={span.xCenter}
                    y={span.yStart + span.height / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={
                      span.height > 85
                        ? `rotate(-90, ${span.xCenter}, ${
                            span.yStart + span.height / 2
                          })`
                        : undefined
                    }
                    className="stream-ribbon-label"
                  >
                    {isPrimaryCol
                      ? polity.name
                      : `${polity.name.split(' ')[0]} (${span.regionId.split('_')[0]})`}
                  </text>
                )}
              </g>
            );
          })}

          {/* Trade & Migration Vectors across Columns */}
          {routes.map((route) => {
            const visibleWps = route.waypoints
              .map((wp) => {
                const cIdx = visibleRegionIndexMap[wp.regionId];
                if (cIdx === undefined) return null;
                return {
                  x: LEFT_GUTTER + cIdx * colWidth + colWidth / 2,
                  y: yearToY(wp.year, timeScaleMode, zoom),
                  label: wp.label,
                };
              })
              .filter(
                (
                  item
                ): item is {
                  x: number;
                  y: number;
                  label: string | undefined;
                } => item !== null
              );

            if (visibleWps.length < 2) return null;

            const isTradeLens = lensMode === 'TRADE_MIGRATION';
            const pathD = visibleWps
              .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
              .join(' ');

            return (
              <g
                key={route.id}
                opacity={
                  isTradeLens ? 1 : lensMode === 'ALL' ? 0.72 : 0.15
                }
              >
                <path
                  d={pathD}
                  fill="none"
                  stroke={route.color}
                  strokeWidth={isTradeLens ? 3.5 : 2.2}
                  strokeDasharray="7 5"
                  className="animated-route-line"
                />
                {visibleWps.map((pt, i) => (
                  <g key={`${route.id}-wp-${i}`}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isTradeLens ? 5 : 3.5}
                      fill={route.color}
                      stroke="var(--surface-bg)"
                      strokeWidth="1.5"
                    />
                    {(isTradeLens || i === 0) && (
                      <text
                        x={pt.x + 8}
                        y={pt.y - 6}
                        className="route-vector-label"
                        fill={route.color}
                      >
                        {i === 0 ? route.name : pt.label}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            );
          })}
        </svg>

        {/* HTML OVERLAY LAYER: Crisp Historical Milestone Callouts */}
        <div className="timeline-nodes-overlay">
          {visibleNodes.map((node) => {
            const colIndex = visibleRegionIndexMap[node.regionId];
            if (colIndex === undefined) return null;

            const y = yearToY(node.year, timeScaleMode, zoom);
            const colLeft = LEFT_GUTTER + colIndex * colWidth;
            const isSelected = selectedNodeId === node.id;
            const parentColor = node.polityId
              ? polityById[node.polityId]?.color
              : undefined;

            return (
              <button
                key={node.id}
                type="button"
                className={`node-callout-card tier-${node.minZoomTier} ${
                  isSelected ? 'is-selected' : ''
                }`}
                style={{
                  top: `${y}px`,
                  left: `${colLeft + colWidth * 0.52}px`,
                  maxWidth: `${colWidth * 0.46}px`,
                  borderLeftColor: parentColor || 'var(--accent-color)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node);
                }}
              >
                <span className="node-callout-header">
                  <span className="node-icon-badge">
                    {getCategoryIcon(node.category)}
                  </span>
                  <span className="node-year-tag">
                    {formatYearShort(node.year)}
                  </span>
                </span>
                <span className="node-callout-title">{node.title}</span>
              </button>
            );
          })}
        </div>

        {/* HORIZONTAL SYNCHRONISM TIME SCRUBBER CROSSHAIR */}
        <div
          className={`synchronism-crosshair-line ${
            yearLocked ? 'is-locked' : ''
          }`}
          style={{ top: `${activeYearY}px`, left: `${LEFT_GUTTER}px` }}
        >
          <button
            type="button"
            className="crosshair-year-pill"
            onClick={(e) => {
              e.stopPropagation();
              onToggleYearLock();
            }}
            title={
              yearLocked
                ? 'Click to unlock crosshair from this year'
                : 'Click to lock crosshair at this year'
            }
          >
            {yearLocked ? <Lock size={11} /> : <Unlock size={11} />}
            <strong>{formatYear(activeYear)}</strong>
            <span>{yearLocked ? 'Locked' : 'Click to Lock'}</span>
          </button>
        </div>

        {/* STICKY LEFT CHRONOLOGICAL & ERA AXIS */}
        <div
          className="sticky-left-time-axis"
          style={{ width: `${LEFT_GUTTER}px`, height: `${totalHeight}px` }}
        >
          {/* Macro Era Blocks */}
          {eras.map((era) => {
            const y1 = yearToY(era.startYear, timeScaleMode, zoom);
            const y2 = yearToY(era.endYear, timeScaleMode, zoom);
            const h = Math.max(20, y2 - y1);
            return (
              <div
                key={era.id}
                className="era-vertical-block"
                style={{
                  top: `${y1}px`,
                  height: `${h}px`,
                  width: `${ERA_SIDEBAR_WIDTH}px`,
                  backgroundColor: era.color,
                }}
                title={`${era.name}: ${era.description}`}
              >
                <span className="era-rotated-text">{era.shortName}</span>
              </div>
            );
          })}

          {/* Paleoclimate Sparkline SVG inside Left Axis */}
          <svg
            width={LEFT_GUTTER}
            height={totalHeight}
            className="paleoclimate-axis-svg"
          >
            <line
              x1={ERA_SIDEBAR_WIDTH + 24}
              y1={0}
              x2={ERA_SIDEBAR_WIDTH + 24}
              y2={totalHeight}
              stroke="var(--border-subtle)"
              strokeDasharray="2 3"
              strokeWidth="1"
            />
            <path
              d={climateSparklinePath}
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="1.8"
              opacity="0.75"
            />
          </svg>

          {/* Year Tick Labels */}
          {timeTicks.map((yr) => {
            const y = yearToY(yr, timeScaleMode, zoom);
            const isMajor = yr % 500 === 0 || yr === 0;
            return (
              <div
                key={`tick-lbl-${yr}`}
                className={`axis-year-tick ${isMajor ? 'is-major' : ''}`}
                style={{ top: `${y}px`, left: `${ERA_SIDEBAR_WIDTH}px` }}
              >
                <span>{formatYearShort(yr)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
