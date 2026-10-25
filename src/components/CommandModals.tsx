import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Polity,
  HistoricalNode,
  Region,
  RegionId,
  NodeCategory,
  CrossCuttingBand,
} from '../types/history';
import { formatYear } from '../utils/timeLayout';
import {
  Search,
  Crown,
  Sparkles,
  Compass,
  Plus,
  X,
  ArrowRight,
  Calendar,
} from 'lucide-react';

/**
 * Helper hook that attaches the mandatory fallback for `<dialog closedby="any">`
 * for browsers that do not yet support `closedBy` on HTMLDialogElement.prototype.
 */
function useLightDismissDialog(
  dialogRef: React.RefObject<HTMLDialogElement | null>,
  isOpen: boolean,
  onClose: () => void
) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen, dialogRef]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };
    dialog.addEventListener('close', handleClose);

    // Fallback for browsers without closedby support
    let handleBackdropClick: ((event: MouseEvent) => void) | null = null;
    if (
      typeof HTMLDialogElement !== 'undefined' &&
      !('closedBy' in HTMLDialogElement.prototype)
    ) {
      handleBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        dialog.close();
      };
      dialog.addEventListener('click', handleBackdropClick);
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      if (handleBackdropClick) {
        dialog.removeEventListener('click', handleBackdropClick);
      }
    };
  }, [dialogRef, onClose]);
}

interface SearchCommandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  polities: Polity[];
  nodes: HistoricalNode[];
  bands: CrossCuttingBand[];
  regions: Region[];
  onSelectPolity: (polity: Polity) => void;
  onSelectNode: (node: HistoricalNode) => void;
  onSelectBand: (band: CrossCuttingBand) => void;
  onJumpToYear: (year: number, regionId?: RegionId) => void;
}

export const SearchCommandDialog: React.FC<SearchCommandDialogProps> = ({
  isOpen,
  onClose,
  polities,
  nodes,
  bands,
  regions,
  onSelectPolity,
  onSelectNode,
  onSelectBand,
  onJumpToYear,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');

  useLightDismissDialog(dialogRef, isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  const regionNameById = useMemo(
    () => Object.fromEntries(regions.map((r) => [r.id, r.shortName])),
    [regions]
  );

  // Parse direct year queries like "1177 BCE", "44 BC", "1453", "-500"
  const parsedYearJump = useMemo(() => {
    const trimmed = query.trim().toUpperCase();
    if (!trimmed) return null;
    const bceMatch = trimmed.match(/^(\d{1,4})\s*(BCE|BC)$/);
    const bceText = bceMatch?.[1];
    if (bceText) {
      const y = -parseInt(bceText, 10);
      if (y >= -3300 && y <= 2025) return y;
    }
    const ceMatch = trimmed.match(/^(-?\d{1,4})\s*(CE|AD)?$/);
    const ceText = ceMatch?.[1];
    if (ceText) {
      const y = parseInt(ceText, 10);
      if (y >= -3300 && y <= 2025) return y;
    }
    return null;
  }, [query]);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        polities: polities.slice(0, 6),
        nodes: nodes.slice(0, 6),
        bands: bands.slice(0, 3),
      };
    }
    return {
      polities: polities
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.nativeOrAltName && p.nativeOrAltName.toLowerCase().includes(q)) ||
            p.summary.toLowerCase().includes(q) ||
            p.rulers.some((r) => r.name.toLowerCase().includes(q))
        )
        .slice(0, 8),
      nodes: nodes
        .filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.description.toLowerCase().includes(q) ||
            n.category.toLowerCase().includes(q)
        )
        .slice(0, 8),
      bands: bands
        .filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.subtitle.toLowerCase().includes(q)
        )
        .slice(0, 4),
    };
  }, [query, polities, nodes, bands]);

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
      className="command-dialog"
      aria-labelledby="commandDialogTitle"
    >
      <div className="command-dialog-inner">
        <div className="command-search-header">
          <Search size={18} className="accent-icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search empires, rulers, artifacts, or type a year (e.g. "1177 BCE", "Rome", "Silk", "Confucius")…'
            className="command-search-input"
            id="commandDialogTitle"
          />
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close Search"
          >
            <X size={16} />
          </button>
        </div>

        <div className="command-results-body">
          {parsedYearJump !== null && (
            <div className="command-group">
              <div className="command-group-title">Direct Chronological Jump</div>
              <button
                type="button"
                className="command-result-item is-year-jump"
                onClick={() => {
                  onJumpToYear(parsedYearJump);
                  onClose();
                }}
              >
                <Calendar size={16} className="accent-icon" />
                <div className="command-item-text">
                  <strong>Fly Camera to Year {formatYear(parsedYearJump)}</strong>
                  <small>Synchronize timeline crosshair, map & world snapshot</small>
                </div>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {filteredResults.polities.length > 0 && (
            <div className="command-group">
              <div className="command-group-title">
                Civilizations, Dynasties & Empires ({filteredResults.polities.length})
              </div>
              {filteredResults.polities.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="command-result-item"
                  onClick={() => {
                    onSelectPolity(p);
                    onClose();
                  }}
                >
                  <span
                    className="command-color-swatch"
                    style={{ backgroundColor: p.color }}
                  />
                  <div className="command-item-text">
                    <strong>{p.name}</strong>
                    <small>
                      {regionNameById[p.primaryRegionId]} • {formatYear(p.startYear)} –{' '}
                      {formatYear(p.endYear)}
                    </small>
                  </div>
                  <Crown size={14} className="muted-icon" />
                </button>
              ))}
            </div>
          )}

          {filteredResults.nodes.length > 0 && (
            <div className="command-group">
              <div className="command-group-title">
                Milestones, Monuments, Artifacts & Ideas ({filteredResults.nodes.length})
              </div>
              {filteredResults.nodes.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className="command-result-item"
                  onClick={() => {
                    onSelectNode(n);
                    onClose();
                  }}
                >
                  <Sparkles size={15} className="accent-icon" />
                  <div className="command-item-text">
                    <strong>{n.title}</strong>
                    <small>
                      {n.category} • {formatYear(n.year)} • {regionNameById[n.regionId]}
                    </small>
                  </div>
                  <ArrowRight size={14} className="muted-icon" />
                </button>
              ))}
            </div>
          )}

          {filteredResults.bands.length > 0 && (
            <div className="command-group">
              <div className="command-group-title">Global Epochs & Horizons</div>
              {filteredResults.bands.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className="command-result-item"
                  onClick={() => {
                    onSelectBand(b);
                    onJumpToYear(Math.round((b.startYear + b.endYear) / 2));
                    onClose();
                  }}
                >
                  <Compass size={15} style={{ color: b.color }} />
                  <div className="command-item-text">
                    <strong>{b.title}</strong>
                    <small>
                      {formatYear(b.startYear)} – {formatYear(b.endYear)}
                    </small>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="command-dialog-footer">
          <span>
            <kbd>Esc</kbd> or click outside to dismiss
          </span>
          <span>
            Tip: Try typing <kbd>117 CE</kbd>, <kbd>Olmec</kbd>, <kbd>Ashoka</kbd>, or{' '}
            <kbd>Printing</kbd>
          </span>
        </div>
      </div>
    </dialog>
  );
};

interface AddNodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  regions: Region[];
  polities: Polity[];
  defaultYear: number;
  onAddNode: (node: HistoricalNode) => void;
}

export const AddCustomNodeDialog: React.FC<AddNodeDialogProps> = ({
  isOpen,
  onClose,
  regions,
  polities,
  defaultYear,
  onAddNode,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  useLightDismissDialog(dialogRef, isOpen, onClose);

  const [title, setTitle] = useState('');
  const [year, setYear] = useState<number>(defaultYear);
  const [regionId, setRegionId] = useState<RegionId>('western_europe');
  const [category, setCategory] = useState<NodeCategory>('MONUMENT');
  const [description, setDescription] = useState('');
  const [significance, setSignificance] = useState('');

  useEffect(() => {
    if (isOpen) {
      setYear(defaultYear);
    }
  }, [isOpen, defaultYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchingPolity = polities.find(
      (p) =>
        p.spans.some(
          (s) => s.regionId === regionId && year >= s.startYear && year <= s.endYear
        )
    );

    const newNode: HistoricalNode = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      year: Math.max(-3300, Math.min(2025, year)),
      regionId,
      polityId: matchingPolity?.id,
      category,
      minZoomTier: 1,
      description:
        description.trim() || 'User-curated historical milestone added to the atlas.',
      significance:
        significance.trim() || 'Custom research annotation on the World History Timeline.',
      customAdded: true,
    };

    onAddNode(newNode);
    setTitle('');
    setDescription('');
    setSignificance('');
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
      className="command-dialog add-node-dialog"
      aria-labelledby="addNodeDialogTitle"
    >
      <form className="command-dialog-inner" onSubmit={handleSubmit}>
        <div className="command-search-header">
          <Plus size={18} className="accent-icon" />
          <h2 id="addNodeDialogTitle" className="dialog-heading">
            Add Custom Historical Milestone
          </h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close Dialog"
          >
            <X size={16} />
          </button>
        </div>

        <div className="form-body">
          <label className="form-field">
            <span>Milestone / Event Title *</span>
            <input
              type="text"
              required
              placeholder="e.g., Library of Alexandria Founded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <div className="form-row-2">
            <label className="form-field">
              <span>Year (Negative = BCE, e.g. -285) *</span>
              <input
                type="number"
                min={-3300}
                max={2025}
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </label>

            <label className="form-field">
              <span>Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NodeCategory)}
              >
                <option value="MONUMENT">Monument / Architecture</option>
                <option value="ARTIFACT">Artifact / Archaeology</option>
                <option value="INVENTION">Science / Invention</option>
                <option value="PHILOSOPHY">Philosophy / Literature / Law</option>
                <option value="RULER">Ruler / Dynasty</option>
                <option value="WAR">War / Treaty</option>
                <option value="TRADE">Trade / Exploration</option>
                <option value="CLIMATE">Climate / Pandemic</option>
              </select>
            </label>
          </div>

          <label className="form-field">
            <span>World Region Column</span>
            <select
              value={regionId}
              onChange={(e) => setRegionId(e.target.value as RegionId)}
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.subtitle})
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Historical Description</span>
            <textarea
              rows={3}
              placeholder="Describe what happened and its context…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label className="form-field">
            <span>Global Significance</span>
            <input
              type="text"
              placeholder="Why does this milestone matter?"
              value={significance}
              onChange={(e) => setSignificance(e.target.value)}
            />
          </label>
        </div>

        <div className="command-dialog-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary-action">
            <Plus size={14} /> Plot Milestone on Timeline
          </button>
        </div>
      </form>
    </dialog>
  );
};
