import type { LayoutOverrides } from '../data/schema/overrides.ts';
import type {
  Band,
  Callout,
  Geography,
  MacroRegion,
  Polity,
  Relation,
} from '../data/schema/index.ts';

/**
 * Pure layout data. Design px, y growing downward. No functions, DOM nodes,
 * or class instances, so a result can be cached and sent to the PDF export.
 */

/** Camera window the solver is asked to fill. */
export interface LayoutViewport {
  /** Poster viewport width in CSS px, before camera scale. */
  width: number;
  /** Poster viewport height in CSS px. */
  height: number;
  /** Horizontal zoom. 1 matches Appendix G column widths. */
  zoomX: number;
  /** Vertical zoom. 1 matches Appendix G `PX_PER_YEAR`. */
  zoomY: number;
}

/** Everything the solver may read. Visibility filters are applied by the caller. */
export interface LayoutInput {
  /** Polities that may become ribbons. */
  polities: readonly Polity[];
  /** Relations that may become connectors. */
  relations: readonly Relation[];
  /** Callouts the placer may draw. */
  callouts: readonly Callout[];
  /** Full-width era and event bands. */
  bands: readonly Band[];
  /** Longitude knots, zone guides, and family bias. */
  geography: Geography;
  /** Human pins and nudges. An empty file is valid. */
  overrides: LayoutOverrides;
  /** Viewport the camera is filling. */
  viewport: LayoutViewport;
  /** Family ids to draw. Empty means every family. */
  visibleFamilies: readonly string[];
  /** Macro-regions to draw. Empty means every region. */
  visibleMacroRegions: readonly MacroRegion[];
}

/** One centerline sample. Keyframes are monotone in `y`. */
export interface LayoutKeyframe {
  /** Design-px y of this sample. */
  y: number;
  /** Centerline x in design px. */
  x: number;
  /** Full ribbon width in design px at this y. */
  width: number;
  /** True when this sample starts a new piece after the ribbon was culled. */
  breakBefore?: boolean;
}

/** One polity ribbon after geometry. */
export interface LayoutRibbon {
  /** Polity this ribbon draws. */
  polityId: string;
  /** Family id, copied so the renderer can pick the lineage color. */
  familyId: string;
  /** Closed SVG path in design px. Empty until geometry runs. */
  d: string;
  /** Centerline samples from the lane solver. */
  keyframes: readonly LayoutKeyframe[];
  /** Crossfade opacity. Omitted means fully visible. */
  opacity?: number;
}

/** One relation curve. */
export interface LayoutConnector {
  /** Relation this curve draws. */
  relationId: string;
  /** Relation type, copied so the stroke can be chosen without the input. */
  type: Relation['type'];
  /** SVG path of the fan curve in design px. */
  d: string;
  /** True when the curve meets a parent side because the spans overlap. */
  sideAttach: boolean;
}

/** How a ribbon label is drawn. `rotated` follows the ribbon; `outside` sits beside a short one. */
export type LayoutLabelOrientation = 'rotated' | 'horizontal' | 'outside';

/** A fitted or hover-only ribbon label. */
export interface LayoutLabel {
  /** Polity the label names. */
  polityId: string;
  /** Text actually drawn, after short-name fallback or ellipsis. */
  text: string;
  /** Left edge of the text box in design px. */
  x: number;
  /** Top edge of the text box in design px. */
  y: number;
  /** Text box width in design px. */
  width: number;
  /** Text box height in design px. */
  height: number;
  /** Font size in design px. The floor is 10. */
  fontSize: number;
  /** Chosen orientation. */
  orientation: LayoutLabelOrientation;
  /** False when the label is hover-only because it did not fit. */
  fitted: boolean;
  /** Leader for a label that sits outside a short ribbon. */
  leader?: LayoutLeader;
}

/** Leader from a ribbon edge to a callout card. */
export interface LayoutLeader {
  /** Start x on the ribbon edge, design px. */
  x1: number;
  /** Start y on the ribbon edge, design px. */
  y1: number;
  /** End x on the card, design px. */
  x2: number;
  /** End y on the card, design px. */
  y2: number;
}

/** A placed, marked, or dropped callout. */
export interface LayoutCallout {
  /** Callout this box belongs to. */
  calloutId: string;
  /** Left edge in design px. */
  x: number;
  /** Top edge in design px. */
  y: number;
  /** Card width in design px. */
  width: number;
  /** Card height in design px. */
  height: number;
  /** False when the placer dropped the card. */
  placed: boolean;
  /** True when a collision left only a marker dot. */
  marker: boolean;
  /** Leader line. Absent when the card was dropped. */
  leader?: LayoutLeader;
}

/** Reserved image plate. The layout does not wait for the image bytes. */
export interface LayoutPlate {
  /** Media item to draw. */
  mediaId: string;
  /** Callout the plate is attached to. */
  calloutId: string;
  /** Left edge in design px. */
  x: number;
  /** Top edge in design px. */
  y: number;
  /** Reserved width in design px. */
  width: number;
  /** Reserved height in design px. */
  height: number;
}

/** A band's vertical span on the plot. */
export interface LayoutBand {
  /** Band this span draws. */
  bandId: string;
  /** Top y in design px. */
  y0: number;
  /** Bottom y in design px. */
  y1: number;
}

/** One axis tick. */
export interface LayoutTick {
  /** Historical year. Never 0. */
  year: number;
  /** Tick y in design px. */
  y: number;
  /** Display string from `formatYear`. Empty for a minor tick. */
  label: string;
  /** True when the tick is labeled. */
  major: boolean;
}

/** Left and right axis ticks. Both gutters share this list. */
export interface LayoutAxis {
  /** Ticks in increasing y. */
  ticks: readonly LayoutTick[];
}

/** Axis-aligned box used by collision tests and the debug overlay. */
export interface LayoutBox {
  /** Id of the ribbon, label, callout, or plate. */
  id: string;
  /** Left edge in design px. */
  x: number;
  /** Top edge in design px. */
  y: number;
  /** Box width in design px. */
  width: number;
  /** Box height in design px. */
  height: number;
}

/** One layout-gate failure. */
export interface LayoutViolation {
  /** Gate code: overlap, unroutable, unfit, dropped, or drift. */
  code: 'overlap' | 'unroutable' | 'unfit' | 'dropped' | 'drift';
  /** Short explanation for the debug overlay. */
  message: string;
  /** Ids involved in the failure. */
  ids: readonly string[];
}

/** Lane centerline for the debug overlay. */
export interface LayoutLane {
  /** Polity whose lane this is. */
  polityId: string;
  /** Centerline x in design px. */
  x: number;
  /** Lane top y in design px. */
  y0: number;
  /** Lane bottom y in design px. */
  y1: number;
}

/** Debug payload. T2.18 fills it; an empty payload is valid. */
export interface LayoutDebug {
  /** Lane centerlines. */
  lanes: readonly LayoutLane[];
  /** Collision boxes. */
  boxes: readonly LayoutBox[];
  /** Gate failures. Empty when the layout passes. */
  violations: readonly LayoutViolation[];
}

/** Serializable output of the layout engine. */
export interface LayoutResult {
  /** Polity ribbons. */
  ribbons: readonly LayoutRibbon[];
  /** Relation curves. */
  connectors: readonly LayoutConnector[];
  /** Ribbon labels. */
  labels: readonly LayoutLabel[];
  /** Callout cards and markers. */
  callouts: readonly LayoutCallout[];
  /** Reserved image plates. */
  plates: readonly LayoutPlate[];
  /** Band spans. */
  bands: readonly LayoutBand[];
  /** Shared axis ticks. */
  axis: LayoutAxis;
  /** Lanes, boxes, and violations for `?debug=layout`. */
  debug: LayoutDebug;
}
