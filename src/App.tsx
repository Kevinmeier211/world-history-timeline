import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  REGIONS,
  HISTORICAL_ERAS,
  CROSS_CUTTING_BANDS,
  TRADE_AND_MIGRATION_ROUTES,
  COMPARISON_PRESETS,
  STORY_TOURS,
  HISTORICAL_NODES,
  ALL_POLITIES,
  POLITY_BY_ID,
} from './data';
import {
  RegionId,
  Polity,
  HistoricalNode,
  CrossCuttingBand,
  LensMode,
  TimeScaleMode,
  StoryTour,
} from './types/history';
import { yearToY, formatYear, MIN_YEAR, MAX_YEAR } from './utils/timeLayout';
import { TimelineCanvas } from './components/TimelineCanvas';
import { DossierDrawer } from './components/DossierDrawer';
import { WorldMapPanel } from './components/WorldMapPanel';
import { YearSnapshotBar } from './components/YearSnapshotBar';
import {
  SearchCommandDialog,
  AddCustomNodeDialog,
} from './components/CommandModals';
import {
  Search,
  Globe,
  Columns,
  Layers,
  Compass,
  ZoomIn,
  ZoomOut,
  Plus,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
  Sparkles,
  Scale,
} from 'lucide-react';

const CUSTOM_NODES_STORAGE_KEY = 'chronos_custom_historical_nodes_v1';

export function App() {
  // Ordered & visible regional columns (supports reordering, pinning, soloing)
  const [visibleRegionIds, setVisibleRegionIds] = useState<RegionId[]>(() =>
    REGIONS.map((r) => r.id)
  );
  const [activePresetId, setActivePresetId] = useState<string>('all_regions');

  // Zoom & Time Scale state
  const [zoom, setZoom] = useState<number>(1.05);
  const [timeScaleMode, setTimeScaleMode] =
    useState<TimeScaleMode>('POSTER_WARPED');
  const [lensMode, setLensMode] = useState<LensMode>('ALL');

  // Active scrubbed year & lock state
  const [activeYear, setActiveYear] = useState<number>(-1200);
  const [yearLocked, setYearLocked] = useState<boolean>(false);
  const [isPlayingTimelapse, setIsPlayingTimelapse] = useState<boolean>(false);

  // Selected entities for Dossier Drawer
  const [selectedPolityId, setSelectedPolityId] = useState<string | null>(
    'roman_empire'
  );
  const [selectedNode, setSelectedNode] = useState<HistoricalNode | null>(null);
  const [selectedBand, setSelectedBand] = useState<CrossCuttingBand | null>(
    null
  );

  // Panels & Modals
  const [showWorldMap, setShowWorldMap] = useState<boolean>(true);
  const [mapExpanded, setMapExpanded] = useState<boolean>(false);
  const [snapshotCollapsed, setSnapshotCollapsed] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [addNodeOpen, setAddNodeOpen] = useState<boolean>(false);

  // Guided Story Tour State
  const [activeTour, setActiveTour] = useState<StoryTour | null>(null);
  const [tourStepIndex, setTourStepIndex] = useState<number>(0);

  // Custom user-authored nodes
  const [customNodes, setCustomNodes] = useState<HistoricalNode[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_NODES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allNodes = useMemo(
    () => [...HISTORICAL_NODES, ...customNodes],
    [customNodes]
  );

  const visibleRegions = useMemo(() => {
    const regMap = Object.fromEntries(REGIONS.map((r) => [r.id, r]));
    return visibleRegionIds.flatMap((id) => {
      const region = regMap[id];
      return region ? [region] : [];
    });
  }, [visibleRegionIds]);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Smooth camera jump to a specific year & optional region column
  const jumpToYearAndRegion = useCallback(
    (
      targetYear: number,
      targetRegionId?: RegionId,
      overrideZoom?: number,
       overrideRegionList?: RegionId[]
    ) => {
      const effectiveZoom = overrideZoom ?? zoom;
      const effectiveRegions = overrideRegionList ?? visibleRegionIds;

      setActiveYear(targetYear);
      setYearLocked(true);

      requestAnimationFrame(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const targetY = yearToY(targetYear, timeScaleMode, effectiveZoom);
        const targetScrollTop = Math.max(
          0,
          targetY - container.clientHeight * 0.42
        );

        let targetScrollLeft = container.scrollLeft;
        if (targetRegionId) {
          const colIdx = effectiveRegions.indexOf(targetRegionId);
          if (colIdx !== -1) {
            const colWidth = Math.round(
              215 * Math.max(0.85, Math.min(1.45, effectiveZoom * 0.92))
            );
            const colCenter = 146 + colIdx * colWidth + colWidth / 2;
            targetScrollLeft = Math.max(
              0,
              colCenter - container.clientWidth * 0.45
            );
          }
        }

        container.scrollTo({
          top: targetScrollTop,
          left: targetScrollLeft,
          behavior: 'smooth',
        });
      });
    },
    [zoom, visibleRegionIds, timeScaleMode]
  );

  // Keyboard shortcut Cmd+K or '/' to open instant search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (e.target as HTMLElement)?.tagName
        )
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Historical Time-Lapse Auto-Player
  useEffect(() => {
    if (!isPlayingTimelapse) return;
    setYearLocked(true);
    const interval = setInterval(() => {
      setActiveYear((prev) => {
        const step = prev < -500 ? 25 : prev < 1500 ? 15 : 5;
        if (prev + step > MAX_YEAR) {
          setIsPlayingTimelapse(false);
          return MIN_YEAR;
        }
        return prev + step;
      });
    }, 140);
    return () => clearInterval(interval);
  }, [isPlayingTimelapse]);

  // Guided Story Tour waypoint synchronization
  const applyTourWaypoint = useCallback(
    (tour: StoryTour, stepIdx: number) => {
      const wp = tour.waypoints[stepIdx];
      if (!wp) return;

      const nextRegions =
        wp.focusRegionIds && wp.focusRegionIds.length > 0
          ? wp.focusRegionIds
          : REGIONS.map((r) => r.id);

      setVisibleRegionIds(nextRegions);
      setZoom(wp.zoomLevel);
      if (wp.lens) setLensMode(wp.lens);

      if (wp.selectedPolityId && POLITY_BY_ID[wp.selectedPolityId]) {
        setSelectedPolityId(wp.selectedPolityId);
        setSelectedNode(null);
        setSelectedBand(null);
      } else if (wp.selectedNodeId) {
        const foundNode = allNodes.find((n) => n.id === wp.selectedNodeId);
        if (foundNode) {
          setSelectedNode(foundNode);
          setSelectedPolityId(null);
          setSelectedBand(null);
        }
      }

      jumpToYearAndRegion(
        wp.year,
        nextRegions[0],
        wp.zoomLevel,
        nextRegions
      );
    },
    [allNodes, jumpToYearAndRegion]
  );

  const handleStartTour = (tour: StoryTour) => {
    setActiveTour(tour);
    setTourStepIndex(0);
    applyTourWaypoint(tour, 0);
  };

  const handleStepTour = (delta: number) => {
    if (!activeTour) return;
    const nextIdx = Math.max(
      0,
      Math.min(activeTour.waypoints.length - 1, tourStepIndex + delta)
    );
    setTourStepIndex(nextIdx);
    applyTourWaypoint(activeTour, nextIdx);
  };

  const handleExitTour = () => {
    setActiveTour(null);
    setVisibleRegionIds(REGIONS.map((r) => r.id));
    setLensMode('ALL');
  };

  // Column ordering & preset handlers
  const handleSelectPreset = (presetId: string) => {
    const preset = COMPARISON_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePresetId(presetId);
    setVisibleRegionIds(preset.regionIds);
    if (preset.focusYear !== undefined) {
      jumpToYearAndRegion(
        preset.focusYear,
        preset.regionIds[0],
        zoom,
        preset.regionIds
      );
    }
  };

  const handleMoveRegionColumn = (regionId: RegionId, direction: -1 | 1) => {
    setVisibleRegionIds((prev) => {
      const idx = prev.indexOf(regionId);
      if (idx === -1) return prev;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      if (!item) return prev;
      copy.splice(targetIdx, 0, item);
      setActivePresetId('custom');
      return copy;
    });
  };

  const handleHideRegionColumn = (regionId: RegionId) => {
    setVisibleRegionIds((prev) => {
      if (prev.length <= 1) return prev;
      setActivePresetId('custom');
      return prev.filter((id) => id !== regionId);
    });
  };

  const handleSoloRegionColumn = (regionId: RegionId) => {
    setVisibleRegionIds((prev) => {
      if (prev.length === 1 && prev[0] === regionId) {
        setActivePresetId('all_regions');
        return REGIONS.map((r) => r.id);
      }
      setActivePresetId('custom');
      return [regionId];
    });
  };

  // Two-state color-scheme toggle per modern-web-guidance (`dark-mode-toggle`)
  const handleToggleColorScheme = () => {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="color-scheme"]'
    );
    if (!meta) return;

    const systemIsDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const systemScheme = systemIsDark ? 'dark' : 'light';

    let stored: string | null = null;
    try {
      stored = localStorage.getItem('color-scheme');
    } catch {}

    const currentlyRendered =
      stored === 'dark' || stored === 'light' ? stored : systemScheme;
    const targetScheme = currentlyRendered === 'dark' ? 'light' : 'dark';

    if (targetScheme === systemScheme) {
      // Returning to system preference: remove stored override rather than pinning
      try {
        localStorage.removeItem('color-scheme');
      } catch {}
      meta.content = 'light dark';
    } else {
      try {
        localStorage.setItem('color-scheme', targetScheme);
      } catch {}
      meta.content = targetScheme;
    }
  };

  // Keep tabs in sync via window storage event
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'color-scheme') {
        const meta = document.querySelector<HTMLMetaElement>(
          'meta[name="color-scheme"]'
        );
        if (meta) {
          meta.content = e.newValue ?? 'light dark';
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleAddCustomNode = (node: HistoricalNode) => {
    setCustomNodes((prev) => {
      const next = [...prev, node];
      try {
        localStorage.setItem(CUSTOM_NODES_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    setSelectedNode(node);
    setSelectedPolityId(null);
    setSelectedBand(null);
    if (!visibleRegionIds.includes(node.regionId)) {
      setVisibleRegionIds((prev) => [...prev, node.regionId]);
    }
    jumpToYearAndRegion(node.year, node.regionId);
  };

  const selectedPolity = selectedPolityId
    ? POLITY_BY_ID[selectedPolityId] || null
    : null;

  return (
    <div className="chronos-app-shell">
      {/* TOP COMMAND HEADER */}
      <header className="chronos-top-bar">
        <div className="brand-cluster">
          <div className="brand-emblem" aria-hidden="true">
            <span className="bar-1" />
            <span className="bar-2" />
            <span className="bar-3" />
          </div>
          <div className="brand-titles">
            <h1>TIMELINE OF WORLD HISTORY</h1>
            <p>Interactive Synchronoptic Atlas • 3300 BCE – Present</p>
          </div>
        </div>

        {/* Search Trigger (Cmd+K) */}
        <button
          type="button"
          className="cmd-search-trigger"
          onClick={() => setSearchOpen(true)}
        >
          <Search size={14} />
          <span>Search empires, rulers, years…</span>
          <kbd>⌘K</kbd>
        </button>

        {/* Region Comparison Presets */}
        <div className="toolbar-group">
          <label className="toolbar-select-label" title="Comparative History Region Presets">
            <Columns size={14} />
            <select
              value={activePresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              aria-label="Region Comparison Preset"
            >
              {COMPARISON_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              {activePresetId === 'custom' && (
                <option value="custom">
                  Custom Columns ({visibleRegionIds.length}/11)
                </option>
              )}
            </select>
          </label>

          {visibleRegionIds.length < REGIONS.length && (
            <button
              type="button"
              className="toolbar-chip-btn is-accent"
              onClick={() => handleSelectPreset('all_regions')}
              title="Restore all 11 global regions"
            >
              <RotateCcw size={12} /> Show All 11
            </button>
          )}
        </div>

        {/* Thematic Lenses */}
        <div className="toolbar-group">
          <label className="toolbar-select-label" title="Switch Thematic Analytical Lens">
            <Layers size={14} />
            <select
              value={lensMode}
              onChange={(e) => setLensMode(e.target.value as LensMode)}
              aria-label="Thematic Lens"
            >
              <option value="ALL">Lens: All Historical Layers</option>
              <option value="GEOPOLITICS">Lens: Empires, Rulers & Wars</option>
              <option value="TRADE_MIGRATION">
                Lens: Trade Routes & Migrations
              </option>
              <option value="CLIMATE_PANDEMIC">
                Lens: Climate Shocks & Pandemics
              </option>
              <option value="SCIENCE_WRITING">
                Lens: Science, Writing & Tech
              </option>
              <option value="PHILOSOPHY_ART">
                Lens: Philosophy, Law & Monuments
              </option>
            </select>
          </label>
        </div>

        {/* Guided Story Tours Dropdown */}
        <div className="toolbar-group">
          <label className="toolbar-select-label" title="Launch Guided Scrollytelling Tour">
            <Compass size={14} />
            <select
              value={activeTour?.id || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  handleExitTour();
                } else {
                  const t = STORY_TOURS.find((st) => st.id === val);
                  if (t) handleStartTour(t);
                }
              }}
              aria-label="Guided Story Tours"
            >
              <option value="">Guided Story Tours…</option>
              {STORY_TOURS.map((t) => (
                <option key={t.id} value={t.id}>
                  Tour: {t.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Zoom & Scale Controls */}
        <div className="toolbar-group zoom-controls">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setZoom((z) => Math.max(0.65, +(z - 0.2).toFixed(2)))}
            title="Zoom Out (Macro Epoch View)"
            aria-label="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <span className="zoom-readout">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setZoom((z) => Math.min(2.25, +(z + 0.2).toFixed(2)))}
            title="Zoom In (Semantic Detail View)"
            aria-label="Zoom In"
          >
            <ZoomIn size={15} />
          </button>

          <button
            type="button"
            className="toolbar-chip-btn"
            onClick={() =>
              setTimeScaleMode((m) =>
                m === 'POSTER_WARPED' ? 'LINEAR' : 'POSTER_WARPED'
              )
            }
            title="Toggle between UsefulCharts Warped Modern Scale and Uniform Linear Time"
          >
            <Scale size={12} />
            <span>
              {timeScaleMode === 'POSTER_WARPED' ? 'Poster Scale' : 'Linear Scale'}
            </span>
          </button>
        </div>

        {/* Map, Custom Event & Theme Toggle */}
        <div className="toolbar-group right-actions">
          <button
            type="button"
            className={`toolbar-chip-btn ${showWorldMap ? 'is-active' : ''}`}
            onClick={() => setShowWorldMap((v) => !v)}
            title="Toggle Synchronized World Atlas Map"
          >
            <Globe size={13} />
            <span>Atlas Map</span>
          </button>

          <button
            type="button"
            className="toolbar-chip-btn"
            onClick={() => setAddNodeOpen(true)}
            title="Add Custom Milestone or Research Note"
          >
            <Plus size={13} />
            <span>Add Event</span>
          </button>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={handleToggleColorScheme}
            title="Switch between Archival Parchment (Light) and Obsidian Observatory (Dark)"
          >
            <span className="theme-option-light">
              <Sun size={14} aria-hidden="true" />
              <span className="sr-only">Switch to Archival Light theme</span>
            </span>
            <span className="theme-option-dark">
              <Moon size={14} aria-hidden="true" />
              <span className="sr-only">Switch to Obsidian Dark theme</span>
            </span>
          </button>
        </div>
      </header>

      {/* ACTIVE GUIDED STORY TOUR BANNER */}
      {activeTour && (
        <div className="story-tour-banner" role="region" aria-label="Active Guided Story Tour">
          <div className="story-tour-meta">
            <span className="tour-badge">
              <Sparkles size={12} /> {activeTour.badge}
            </span>
            <strong>{activeTour.title}</strong>
            <span className="tour-step-counter">
              Stop {tourStepIndex + 1} of {activeTour.waypoints.length}
            </span>
          </div>

          {activeTour.waypoints[tourStepIndex] && (
            <div className="story-waypoint-content">
              <h3>{activeTour.waypoints[tourStepIndex].title}</h3>
              <p>{activeTour.waypoints[tourStepIndex].narrative}</p>
              <div className="story-takeaway">
                <strong>Key Insight:</strong>{' '}
                {activeTour.waypoints[tourStepIndex].keyTakeaway}
              </div>
            </div>
          )}

          <div className="story-tour-controls">
            <button
              type="button"
              className="btn-secondary"
              disabled={tourStepIndex === 0}
              onClick={() => handleStepTour(-1)}
            >
              <ChevronLeft size={14} /> Previous Stop
            </button>
            <button
              type="button"
              className="btn-primary-action"
              disabled={tourStepIndex === activeTour.waypoints.length - 1}
              onClick={() => handleStepTour(1)}
            >
              Next Stop <ChevronRight size={14} />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={handleExitTour}
              title="Exit Guided Tour"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE AREA */}
      <main className="chronos-workspace">
        <TimelineCanvas
          visibleRegions={visibleRegions}
          polities={ALL_POLITIES}
          polityById={POLITY_BY_ID}
          nodes={allNodes}
          bands={CROSS_CUTTING_BANDS}
          routes={TRADE_AND_MIGRATION_ROUTES}
          eras={HISTORICAL_ERAS}
          zoom={zoom}
          timeScaleMode={timeScaleMode}
          lensMode={lensMode}
          activeYear={activeYear}
          yearLocked={yearLocked}
          onChangeActiveYear={setActiveYear}
          onToggleYearLock={() => setYearLocked((l) => !l)}
          selectedPolityId={selectedPolityId}
          selectedNodeId={selectedNode?.id || null}
          selectedBandId={selectedBand?.id || null}
          onSelectPolity={(polity) => {
            setSelectedPolityId(polity.id);
            setSelectedNode(null);
            setSelectedBand(null);
          }}
          onSelectNode={(node) => {
            setSelectedNode(node);
            setSelectedPolityId(null);
            setSelectedBand(null);
          }}
          onSelectBand={(band) => {
            setSelectedBand(band);
            setSelectedPolityId(null);
            setSelectedNode(null);
          }}
          onMoveRegionColumn={handleMoveRegionColumn}
          onHideRegionColumn={handleHideRegionColumn}
          onSoloRegionColumn={handleSoloRegionColumn}
          scrollContainerRef={scrollContainerRef}
        />

        {/* FLOATING SYNCHRONIZED WORLD MAP PANEL */}
        {showWorldMap && (
          <WorldMapPanel
            regions={REGIONS}
            visibleRegionIds={visibleRegionIds}
            polities={ALL_POLITIES}
            routes={TRADE_AND_MIGRATION_ROUTES}
            activeYear={activeYear}
            selectedPolityId={selectedPolityId}
            onSelectPolity={(id) => {
              setSelectedPolityId(id);
              setSelectedNode(null);
              setSelectedBand(null);
            }}
            onFocusRegion={(regionId) => {
              if (!visibleRegionIds.includes(regionId)) {
                setVisibleRegionIds((prev) => [...prev, regionId]);
              }
              jumpToYearAndRegion(activeYear, regionId);
            }}
            expanded={mapExpanded}
            onToggleExpand={() => setMapExpanded((v) => !v)}
            onClose={() => setShowWorldMap(false)}
          />
        )}

        {/* RIGHT SLIDE-OVER DOSSIER DRAWER */}
        <DossierDrawer
          selectedPolity={selectedPolity}
          selectedNode={selectedNode}
          selectedBand={selectedBand}
          polityById={POLITY_BY_ID}
          regions={REGIONS}
          allNodes={allNodes}
          onSelectPolity={(id) => {
            const p = POLITY_BY_ID[id];
            if (p) {
              setSelectedPolityId(id);
              setSelectedNode(null);
              setSelectedBand(null);
              jumpToYearAndRegion(
                Math.round((p.startYear + p.endYear) / 2),
                p.primaryRegionId
              );
            }
          }}
          onSelectNode={(node) => {
            setSelectedNode(node);
            setSelectedPolityId(null);
            setSelectedBand(null);
            jumpToYearAndRegion(node.year, node.regionId);
          }}
          onJumpToYear={(yr, regId) => jumpToYearAndRegion(yr, regId)}
          onClose={() => {
            setSelectedPolityId(null);
            setSelectedNode(null);
            setSelectedBand(null);
          }}
        />
      </main>

      {/* BOTTOM HORIZONTAL SYNCHRONISM SNAPSHOT BAR */}
      <YearSnapshotBar
        activeYear={activeYear}
        onChangeYear={(yr) => {
          setActiveYear(yr);
          setYearLocked(true);
        }}
        isPlaying={isPlayingTimelapse}
        onTogglePlay={() => setIsPlayingTimelapse((p) => !p)}
        visibleRegions={visibleRegions}
        polities={ALL_POLITIES}
        eras={HISTORICAL_ERAS}
        bands={CROSS_CUTTING_BANDS}
        selectedPolityId={selectedPolityId}
        onSelectPolity={(id) => {
          setSelectedPolityId(id);
          setSelectedNode(null);
          setSelectedBand(null);
        }}
        onJumpToYearAndRegion={(yr, regId) => jumpToYearAndRegion(yr, regId)}
        collapsed={snapshotCollapsed}
        onToggleCollapse={() => setSnapshotCollapsed((c) => !c)}
      />

      {/* NATIVE LIGHT-DISMISS DIALOG MODALS */}
      <SearchCommandDialog
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        polities={ALL_POLITIES}
        nodes={allNodes}
        bands={CROSS_CUTTING_BANDS}
        regions={REGIONS}
        onSelectPolity={(p) => {
          setSelectedPolityId(p.id);
          setSelectedNode(null);
          setSelectedBand(null);
          if (!visibleRegionIds.includes(p.primaryRegionId)) {
            setVisibleRegionIds((prev) => [...prev, p.primaryRegionId]);
          }
          jumpToYearAndRegion(
            Math.round((p.startYear + p.endYear) / 2),
            p.primaryRegionId
          );
        }}
        onSelectNode={(n) => {
          setSelectedNode(n);
          setSelectedPolityId(null);
          setSelectedBand(null);
          if (!visibleRegionIds.includes(n.regionId)) {
            setVisibleRegionIds((prev) => [...prev, n.regionId]);
          }
          jumpToYearAndRegion(n.year, n.regionId);
        }}
        onSelectBand={(b) => {
          setSelectedBand(b);
          setSelectedPolityId(null);
          setSelectedNode(null);
        }}
        onJumpToYear={(yr, regId) => jumpToYearAndRegion(yr, regId)}
      />

      <AddCustomNodeDialog
        isOpen={addNodeOpen}
        onClose={() => setAddNodeOpen(false)}
        regions={REGIONS}
        polities={ALL_POLITIES}
        defaultYear={activeYear}
        onAddNode={handleAddCustomNode}
      />
    </div>
  );
}
