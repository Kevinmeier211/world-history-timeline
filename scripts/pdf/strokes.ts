import { inflateSync } from 'node:zlib';

/** §4.13 minimum stroke on the 24×36 sheet. */
export const MIN_STROKE_PT = 0.25;

type Mat = [number, number, number, number, number, number];

const IDENTITY: Mat = [1, 0, 0, 1, 0, 0];
const STROKE_OPS = new Set(['S', 's', 'b', 'b*', 'B', 'B*']);

export interface PdfObject {
  id: number;
  dict: string;
  stream: string | null;
}

export interface StrokeHit {
  lineWidth: number;
  scaleX: number;
  scaleY: number;
  widthPt: number;
}

interface GState {
  ctm: Mat;
  lineWidth: number;
}

type Tok =
  | { kind: 'num'; value: number }
  | { kind: 'name'; value: string }
  | { kind: 'op'; value: string };

function isPage(dict: string): boolean {
  return /\/Type\s*\/Page(?!s)/.test(dict);
}

function dictSection(dict: string, key: string): string | null {
  const at = dict.indexOf(`/${key}`);
  if (at < 0) return null;
  const open = dict.indexOf('<<', at);
  if (open < 0 || open > at + key.length + 24) return null;
  let depth = 0;
  for (let i = open; i < dict.length - 1; i += 1) {
    if (dict.startsWith('<<', i)) {
      depth += 1;
      i += 1;
      continue;
    }
    if (dict.startsWith('>>', i)) {
      depth -= 1;
      if (depth === 0) return dict.slice(open + 2, i);
      i += 1;
    }
  }
  return null;
}

function nameMap(dict: string, key: string): Map<string, number> {
  const section = dictSection(dict, key) ?? '';
  const map = new Map<string, number>();
  const re = /\/([A-Za-z0-9]+)\s+(\d+)\s+\d+\s+R/g;
  for (const match of section.matchAll(re)) {
    const name = match[1];
    const id = match[2];
    if (name !== undefined && id !== undefined) map.set(name, Number(id));
  }
  return map;
}

function lineWidthOf(dict: string): number | null {
  const match = dict.match(/\/LW\s+([0-9.]+)/);
  const raw = match?.[1];
  if (raw === undefined) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function matrixOf(dict: string): Mat | null {
  const match = dict.match(
    /\/Matrix\s*\[\s*([0-9.eE+-]+)\s+([0-9.eE+-]+)\s+([0-9.eE+-]+)\s+([0-9.eE+-]+)\s+([0-9.eE+-]+)\s+([0-9.eE+-]+)\s*\]/,
  );
  if (!match) return null;
  const nums = [1, 2, 3, 4, 5, 6].map((index) => Number(match[index]));
  if (nums.some((value) => !Number.isFinite(value))) return null;
  return nums as Mat;
}

function contentIds(dict: string): number[] {
  const array = dict.match(/\/Contents\s*\[([^\]]+)\]/);
  const single = dict.match(/\/Contents\s+(\d+)\s+\d+\s+R/);
  const source = array?.[1] ?? (single?.[1] !== undefined ? `${single[1]} 0 R` : '');
  const ids: number[] = [];
  for (const match of source.matchAll(/(\d+)\s+\d+\s+R/g)) {
    const id = match[1];
    if (id !== undefined) ids.push(Number(id));
  }
  return ids;
}

function concat(ctm: Mat, cm: Mat): Mat {
  const [a, b, c, d, e, f] = ctm;
  const [A, B, C, D, E, F] = cm;
  return [
    a * A + c * B,
    b * A + d * B,
    a * C + c * D,
    b * C + d * D,
    a * E + c * F + e,
    b * E + d * F + f,
  ];
}

function tokenize(stream: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < stream.length) {
    const ch = stream[i];
    if (ch === undefined) break;
    if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
      i += 1;
      continue;
    }
    if (ch === '%') {
      while (i < stream.length && stream[i] !== '\n') i += 1;
      continue;
    }
    if (ch === '(') {
      i += 1;
      let depth = 1;
      while (i < stream.length && depth > 0) {
        if (stream[i] === '\\') {
          i += 2;
          continue;
        }
        if (stream[i] === '(') depth += 1;
        else if (stream[i] === ')') depth -= 1;
        i += 1;
      }
      continue;
    }
    if (ch === '<') {
      if (stream[i + 1] === '<') {
        i += 2;
        continue;
      }
      i += 1;
      while (i < stream.length && stream[i] !== '>') i += 1;
      i += 1;
      continue;
    }
    if (ch === '[' || ch === ']') {
      i += 1;
      continue;
    }
    if (ch === '/') {
      i += 1;
      const start = i;
      while (i < stream.length && !' \n\r\t/<>[]()'.includes(stream[i] ?? '')) i += 1;
      out.push({ kind: 'name', value: stream.slice(start, i) });
      continue;
    }
    const start = i;
    if (ch === '+' || ch === '-' || ch === '.' || (ch >= '0' && ch <= '9')) {
      i += 1;
      while (i < stream.length && /[0-9.eE+-]/.test(stream[i] ?? '')) i += 1;
      const raw = stream.slice(start, i);
      const value = Number(raw);
      if (Number.isFinite(value) && /[0-9]/.test(raw)) {
        out.push({ kind: 'num', value });
        continue;
      }
      i = start;
    }
    while (i < stream.length && !' \n\r\t/<>[]()'.includes(stream[i] ?? '')) i += 1;
    const op = stream.slice(start, i);
    if (op.length > 0) out.push({ kind: 'op', value: op });
  }
  return out;
}

function lastNum(operands: Tok[]): number | null {
  for (let i = operands.length - 1; i >= 0; i -= 1) {
    const tok = operands[i];
    if (tok?.kind === 'num') return tok.value;
  }
  return null;
}

function lastName(operands: Tok[]): string | null {
  for (let i = operands.length - 1; i >= 0; i -= 1) {
    const tok = operands[i];
    if (tok?.kind === 'name') return tok.value;
  }
  return null;
}

function walk(
  stream: string,
  resources: string,
  objects: Map<number, PdfObject>,
  ctm: Mat,
  lineWidth: number,
  hits: StrokeHit[],
  depth: number,
): void {
  if (depth > 8) return;
  const ext = nameMap(resources, 'ExtGState');
  const xobj = nameMap(resources, 'XObject');
  const stack: GState[] = [];
  const operands: Tok[] = [];
  let state: GState = { ctm, lineWidth };
  for (const tok of tokenize(stream)) {
    if (tok.kind !== 'op') {
      operands.push(tok);
      continue;
    }
    if (tok.value === 'q') {
      stack.push({ ctm: [...state.ctm], lineWidth: state.lineWidth });
    } else if (tok.value === 'Q') {
      const prev = stack.pop();
      if (prev) state = prev;
    } else if (tok.value === 'cm') {
      const nums = operands.flatMap((item) =>
        item.kind === 'num' ? [item.value] : [],
      );
      if (nums.length >= 6) {
        const cm = nums.slice(-6) as Mat;
        state = { ...state, ctm: concat(state.ctm, cm) };
      }
    } else if (tok.value === 'w') {
      const width = lastNum(operands);
      if (width !== null) state = { ...state, lineWidth: width };
    } else if (tok.value === 'gs') {
      const name = lastName(operands);
      const id = name === null ? undefined : ext.get(name);
      const obj = id === undefined ? undefined : objects.get(id);
      const width = obj ? lineWidthOf(obj.dict) : null;
      if (width !== null) state = { ...state, lineWidth: width };
    } else if (tok.value === 'Do') {
      const name = lastName(operands);
      const id = name === null ? undefined : xobj.get(name);
      const obj = id === undefined ? undefined : objects.get(id);
      if (obj?.stream && /\/Subtype\s*\/Form/.test(obj.dict)) {
        const matrix = matrixOf(obj.dict) ?? IDENTITY;
        walk(
          obj.stream,
          obj.dict,
          objects,
          concat(state.ctm, matrix),
          state.lineWidth,
          hits,
          depth + 1,
        );
      }
    } else if (STROKE_OPS.has(tok.value)) {
      const scaleX = Math.hypot(state.ctm[0], state.ctm[1]);
      const scaleY = Math.hypot(state.ctm[2], state.ctm[3]);
      if (scaleX > 1e-4 && scaleY > 1e-4) {
        const widthPt = state.lineWidth * ((scaleX + scaleY) / 2);
        hits.push({ lineWidth: state.lineWidth, scaleX, scaleY, widthPt });
      }
    }
    operands.length = 0;
  }
}

/** Inflate Flate streams and keep each object's dictionary text. */
export function parsePdfObjects(buf: Buffer): Map<number, PdfObject> {
  const objects = new Map<number, PdfObject>();
  const source = buf.toString('latin1');
  const re = /(\d+)\s+\d+\s+obj/g;
  for (const match of source.matchAll(re)) {
    const idRaw = match[1];
    const at = match.index;
    if (idRaw === undefined || at === undefined) continue;
    const end = source.indexOf('endobj', at);
    if (end < 0) continue;
    const body = source.slice(at, end);
    const streamAt = body.indexOf('stream');
    let dict = body;
    let stream: string | null = null;
    if (streamAt >= 0) {
      dict = body.slice(0, streamAt);
      let start = streamAt + 'stream'.length;
      if (body.startsWith('\r\n', start)) start += 2;
      else if (body.startsWith('\n', start)) start += 1;
      const stop = body.lastIndexOf('endstream');
      if (stop > start) {
        const raw = Buffer.from(body.slice(start, stop), 'latin1');
        const trimmed = raw[raw.length - 1] === 0x0a ? raw.subarray(0, -1) : raw;
        const bytes =
          trimmed[trimmed.length - 1] === 0x0d ? trimmed.subarray(0, -1) : trimmed;
        if (dict.includes('FlateDecode')) {
          try {
            stream = inflateSync(bytes).toString('latin1');
          } catch {
            stream = null;
          }
        } else if (!dict.includes('Image')) {
          stream = bytes.toString('latin1');
        }
      }
    }
    objects.set(Number(idRaw), { id: Number(idRaw), dict, stream });
  }
  return objects;
}

export function strokeHits(objects: Map<number, PdfObject>): StrokeHit[] {
  const hits: StrokeHit[] = [];
  for (const obj of objects.values()) {
    if (!isPage(obj.dict)) continue;
    for (const id of contentIds(obj.dict)) {
      const content = objects.get(id);
      if (!content?.stream) continue;
      walk(content.stream, obj.dict, objects, IDENTITY, 1, hits, 0);
    }
  }
  return hits;
}

export function thinnestStroke(hits: readonly StrokeHit[]): number | null {
  if (hits.length === 0) return null;
  return hits.reduce(
    (min, hit) => Math.min(min, hit.widthPt),
    Number.POSITIVE_INFINITY,
  );
}
