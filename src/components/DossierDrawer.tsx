import React, { useEffect, useState } from 'react';
import {
  Polity,
  HistoricalNode,
  CrossCuttingBand,
  Region,
  RegionId,
} from '../types/history';
import { formatYear } from '../utils/timeLayout';
import {
  X,
  Crown,
  MapPin,
  Users,
  Compass,
  Award,
  ArrowUpRight,
  GitBranch,
  Sparkles,
  BookOpen,
  Calendar,
  AlertCircle,
  Landmark,
} from 'lucide-react';

interface WikiSummary {
  title: string;
  extract: string;
  thumbnail?: { source: string; width: number; height: number };
  content_urls?: { desktop?: { page?: string } };
}

interface DossierDrawerProps {
  selectedPolity: Polity | null;
  selectedNode: HistoricalNode | null;
  selectedBand: CrossCuttingBand | null;
  polityById: Record<string, Polity>;
  regions: Region[];
  allNodes: HistoricalNode[];
  onSelectPolity: (id: string) => void;
  onSelectNode: (node: HistoricalNode) => void;
  onJumpToYear: (year: number, regionId?: RegionId) => void;
  onClose: () => void;
}

export const DossierDrawer: React.FC<DossierDrawerProps> = ({
  selectedPolity,
  selectedNode,
  selectedBand,
  polityById,
  regions,
  allNodes,
  onSelectPolity,
  onSelectNode,
  onJumpToYear,
  onClose,
}) => {
  const [wikiData, setWikiData] = useState<WikiSummary | null>(null);
  const [wikiLoading, setWikiLoading] = useState(false);

  const regionNameById = Object.fromEntries(regions.map((r) => [r.id, r.name]));

  const activeWikiSlug =
    selectedNode?.wikipediaTitle || selectedPolity?.wikipediaTitle || null;

  useEffect(() => {
    if (!activeWikiSlug) {
      setWikiData(null);
      return;
    }

    let cancelled = false;
    setWikiLoading(true);
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        activeWikiSlug
      )}`
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data: WikiSummary | null) => {
        if (!cancelled) {
          setWikiData(data);
          setWikiLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWikiData(null);
          setWikiLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeWikiSlug]);

  if (!selectedPolity && !selectedNode && !selectedBand) {
    return null;
  }

  // Case 1: Selected Historical Node
  if (selectedNode) {
    const parentPolity = selectedNode.polityId
      ? polityById[selectedNode.polityId]
      : null;

    return (
      <aside className="dossier-drawer" aria-label="Historical Milestone Dossier">
        <div
          className="dossier-header"
          style={{
            borderTop: `4px solid ${parentPolity?.color || 'var(--accent-color)'}`,
          }}
        >
          <div className="dossier-badge-row">
            <span className="dossier-type-pill">{selectedNode.category}</span>
            <span className="dossier-year-pill">
              <Calendar size={12} /> {formatYear(selectedNode.year)}
            </span>
          </div>
          <button
            type="button"
            className="dossier-close-btn"
            onClick={onClose}
            aria-label="Close Dossier"
          >
            <X size={18} />
          </button>
        </div>

        <div className="dossier-body">
          <h2 className="dossier-title">{selectedNode.title}</h2>
          <p className="dossier-subtitle">
            <MapPin size={13} /> {regionNameById[selectedNode.regionId]}
          </p>

          {wikiData?.thumbnail?.source && (
            <div className="dossier-hero-media">
              <img
                src={wikiData.thumbnail.source}
                alt={selectedNode.title}
                loading="lazy"
              />
            </div>
          )}

          <div className="dossier-section">
            <h3>Historical Overview</h3>
            <p className="dossier-lead">{selectedNode.description}</p>
          </div>

          <div className="dossier-section highlight-callout">
            <h3>
              <Sparkles size={14} /> Global Significance
            </h3>
            <p>{selectedNode.significance}</p>
          </div>

          {parentPolity && (
            <div className="dossier-section">
              <h3>Associated Civilization</h3>
              <button
                type="button"
                className="lineage-chip is-primary"
                style={{ borderLeft: `4px solid ${parentPolity.color}` }}
                onClick={() => onSelectPolity(parentPolity.id)}
              >
                <div>
                  <strong>{parentPolity.name}</strong>
                  <span>
                    {formatYear(parentPolity.startYear)} –{' '}
                    {formatYear(parentPolity.endYear)}
                  </span>
                </div>
                <ArrowUpRight size={14} />
              </button>
            </div>
          )}

          {wikiData?.extract && (
            <div className="dossier-section wiki-box">
              <h3>
                <BookOpen size={14} /> Archival Encyclopedia Excerpt
              </h3>
              <p className="wiki-extract">{wikiData.extract}</p>
              {wikiData.content_urls?.desktop?.page && (
                <a
                  href={wikiData.content_urls.desktop.page}
                  target="_blank"
                  rel="noreferrer"
                  className="wiki-link"
                >
                  Read full Wikipedia article <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          )}

          <div className="dossier-actions-footer">
            <button
              type="button"
              className="btn-primary-action"
              onClick={() =>
                onJumpToYear(selectedNode.year, selectedNode.regionId)
              }
            >
              <Compass size={15} /> Center Camera on {formatYear(selectedNode.year)}
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Case 2: Selected Cross-Cutting Global Band
  if (selectedBand) {
    return (
      <aside className="dossier-drawer" aria-label="Cross-Regional Epoch Dossier">
        <div
          className="dossier-header"
          style={{ borderTop: `4px solid ${selectedBand.color}` }}
        >
          <div className="dossier-badge-row">
            <span className="dossier-type-pill">{selectedBand.type} HORIZON</span>
            <span className="dossier-year-pill">
              {formatYear(selectedBand.startYear)} – {formatYear(selectedBand.endYear)}
            </span>
          </div>
          <button
            type="button"
            className="dossier-close-btn"
            onClick={onClose}
            aria-label="Close Dossier"
          >
            <X size={18} />
          </button>
        </div>

        <div className="dossier-body">
          <h2 className="dossier-title">{selectedBand.title}</h2>
          <p className="dossier-subtitle">{selectedBand.subtitle}</p>

          <div className="dossier-section">
            <h3>Cross-Regional Impact</h3>
            <p className="dossier-lead">{selectedBand.description}</p>
          </div>

          <div className="dossier-section">
            <h3>Affected World Regions ({selectedBand.regionIds.length})</h3>
            <div className="region-tag-grid">
              {selectedBand.regionIds.map((rid) => (
                <button
                  key={rid}
                  type="button"
                  className="region-pill-btn"
                  onClick={() =>
                    onJumpToYear(
                      Math.round((selectedBand.startYear + selectedBand.endYear) / 2),
                      rid
                    )
                  }
                >
                  <MapPin size={12} /> {regionNameById[rid]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Case 3: Selected Polity (Civilization / Empire / Dynasty)
  if (!selectedPolity) return null;

  const relatedNodes = allNodes.filter(
    (n) => n.polityId === selectedPolity.id
  );
  const durationYears = selectedPolity.endYear - selectedPolity.startYear;

  return (
    <aside className="dossier-drawer" aria-label="Civilization Dossier">
      <div
        className="dossier-header"
        style={{ borderTop: `5px solid ${selectedPolity.color}` }}
      >
        <div className="dossier-badge-row">
          <span
            className="dossier-color-dot"
            style={{ backgroundColor: selectedPolity.color }}
          />
          <span className="dossier-year-pill">
            {formatYear(selectedPolity.startYear)} –{' '}
            {formatYear(selectedPolity.endYear)} ({durationYears} yrs)
          </span>
        </div>
        <button
          type="button"
          className="dossier-close-btn"
          onClick={onClose}
          aria-label="Close Dossier"
        >
          <X size={18} />
        </button>
      </div>

      <div className="dossier-body">
        <h2 className="dossier-title">{selectedPolity.name}</h2>
        {selectedPolity.nativeOrAltName && (
          <p className="dossier-subtitle">{selectedPolity.nativeOrAltName}</p>
        )}

        {selectedPolity.uncertaintyYears && (
          <div className="fuzzy-date-banner">
            <AlertCircle size={14} />
            <span>
              <strong>Archaeological Chronology:</strong> Early origin dates carry a scholarly margin of ±
              {selectedPolity.uncertaintyYears} years (shown with a gradient fade on the timeline).
            </span>
          </div>
        )}

        {wikiData?.thumbnail?.source && (
          <div className="dossier-hero-media">
            <img
              src={wikiData.thumbnail.source}
              alt={selectedPolity.name}
              loading="lazy"
            />
          </div>
        )}

        {/* Key Metadata Grid */}
        <div className="dossier-meta-grid">
          {selectedPolity.capital && (
            <div className="meta-card">
              <span className="meta-label">
                <Landmark size={12} /> Capital Centers
              </span>
              <strong>{selectedPolity.capital}</strong>
            </div>
          )}
          {selectedPolity.governmentType && (
            <div className="meta-card">
              <span className="meta-label">
                <Crown size={12} /> Governance
              </span>
              <strong>{selectedPolity.governmentType}</strong>
            </div>
          )}
          {selectedPolity.peakAreaKm2 && (
            <div className="meta-card">
              <span className="meta-label">
                <Compass size={12} /> Peak Territory
              </span>
              <strong>{selectedPolity.peakAreaKm2}</strong>
            </div>
          )}
          {selectedPolity.estimatedPopulation && (
            <div className="meta-card">
              <span className="meta-label">
                <Users size={12} /> Est. Population
              </span>
              <strong>{selectedPolity.estimatedPopulation}</strong>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="dossier-section">
          <h3>Historical Synthesis</h3>
          <p className="dossier-lead">{selectedPolity.summary}</p>
        </div>

        {/* Key Achievements */}
        {selectedPolity.keyAchievements.length > 0 && (
          <div className="dossier-section">
            <h3>
              <Award size={14} /> Hallmarks & Contributions
            </h3>
            <ul className="achievement-list">
              {selectedPolity.keyAchievements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Regional Footprint Spans */}
        {selectedPolity.spans.length > 1 && (
          <div className="dossier-section">
            <h3>Trans-Regional Footprint ({selectedPolity.spans.length} Regions)</h3>
            <div className="spans-breakdown">
              {selectedPolity.spans.map((sp, idx) => (
                <button
                  key={`${sp.regionId}-${idx}`}
                  type="button"
                  className="span-row-btn"
                  onClick={() =>
                    onJumpToYear(
                      Math.round((sp.startYear + sp.endYear) / 2),
                      sp.regionId
                    )
                  }
                >
                  <span>{regionNameById[sp.regionId]}</span>
                  <span className="span-years">
                    {formatYear(sp.startYear)} – {formatYear(sp.endYear)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notable Rulers & Figures */}
        {selectedPolity.rulers.length > 0 && (
          <div className="dossier-section">
            <h3>
              <Crown size={14} /> Notable Rulers & Leaders
            </h3>
            <div className="rulers-list">
              {selectedPolity.rulers.map((r, i) => (
                <div key={i} className="ruler-card">
                  <div className="ruler-top">
                    <strong>{r.name}</strong>
                    <span className="ruler-reign">{r.reign}</span>
                  </div>
                  {r.title && <div className="ruler-title">{r.title}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lineage Graph: Predecessors & Successors */}
        {(selectedPolity.parentIds.length > 0 ||
          selectedPolity.childIds.length > 0) && (
          <div className="dossier-section">
            <h3>
              <GitBranch size={14} /> Historical Lineage & Succession
            </h3>
            {selectedPolity.parentIds.length > 0 && (
              <div className="lineage-group">
                <span className="lineage-Sublabel">Preceded By (Ancestors):</span>
                <div className="lineage-chips">
                  {selectedPolity.parentIds.map((pid) => {
                    const p = polityById[pid];
                    if (!p) return null;
                    return (
                      <button
                        key={pid}
                        type="button"
                        className="lineage-chip"
                        style={{ borderLeft: `4px solid ${p.color}` }}
                        onClick={() => onSelectPolity(p.id)}
                      >
                        <span>{p.name}</span>
                        <small>{formatYear(p.startYear)}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {selectedPolity.childIds.length > 0 && (
              <div className="lineage-group">
                <span className="lineage-Sublabel">Succeeded By (Descendants):</span>
                <div className="lineage-chips">
                  {selectedPolity.childIds.map((cid) => {
                    const c = polityById[cid];
                    if (!c) return null;
                    return (
                      <button
                        key={cid}
                        type="button"
                        className="lineage-chip"
                        style={{ borderLeft: `4px solid ${c.color}` }}
                        onClick={() => onSelectPolity(c.id)}
                      >
                        <span>{c.name}</span>
                        <small>{formatYear(c.startYear)}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Related Milestones on the Timeline */}
        {relatedNodes.length > 0 && (
          <div className="dossier-section">
            <h3>Key Milestones & Artifacts ({relatedNodes.length})</h3>
            <div className="related-nodes-list">
              {relatedNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className="related-node-btn"
                  onClick={() => onSelectNode(node)}
                >
                  <span className="node-cat-tag">{node.category}</span>
                  <div className="node-btn-main">
                    <strong>{node.title}</strong>
                    <small>{formatYear(node.year)}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Wikipedia Extract */}
        {wikiLoading && (
          <div className="dossier-section wiki-box">
            <p className="wiki-loading">Fetching archival encyclopedia entry…</p>
          </div>
        )}
        {!wikiLoading && wikiData?.extract && (
          <div className="dossier-section wiki-box">
            <h3>
              <BookOpen size={14} /> Wikipedia Archival Summary
            </h3>
            <p className="wiki-extract">{wikiData.extract}</p>
            {wikiData.content_urls?.desktop?.page && (
              <a
                href={wikiData.content_urls.desktop.page}
                target="_blank"
                rel="noreferrer"
                className="wiki-link"
              >
                Open full entry on Wikipedia <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        )}

        <div className="dossier-actions-footer">
          <button
            type="button"
            className="btn-primary-action"
            onClick={() =>
              onJumpToYear(
                Math.round(
                  (selectedPolity.startYear + selectedPolity.endYear) / 2
                ),
                selectedPolity.primaryRegionId
              )
            }
          >
            <Compass size={15} /> Focus Stream on Timeline
          </button>
        </div>
      </div>
    </aside>
  );
};
