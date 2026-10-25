# Chronos Atlas — Interactive Timeline of World History (3300 BCE – Present)

An interactive, synchronoptic world history web application inspired by the *UsefulCharts Timeline of World History*. Built with **React 19**, **TypeScript**, and **Vite**.

## Project documents

- [Implementation plan](docs/CURSOR_PLAN.md)
- [Run configuration](docs/RUN_CONFIG.md) (approvals; all default off)
- [Progress](docs/PROGRESS.md)
- [Decisions](docs/DECISIONS.md)
- [Questions](docs/QUESTIONS.md)
- [Unverified claims](docs/UNVERIFIED.md)
- [Context for the next session](docs/CONTEXT.md)
- [Design](docs/DESIGN.md)
- [Data protocol](docs/DATA_PROTOCOL.md)

## Core Features

- **11 Global Macro-Regions**: Andean Peoples, Mesoamerica, North America, Sub-Saharan Africa, Western Europe, Aegean & Eastern Europe, Egypt & The Levant, Mesopotamia & Persia, Indus & Indian Subcontinent, China & Steppe Frontier, and Korea, Japan, SE Asia & Pacific.
- **Procedural Sankey & Multi-Column Empire Streams**: Automatically renders single-column dynasties, trans-regional imperial bridges (*Achaemenid Empire*, *Empire of Alexander*, *Roman Empire*, *Umayyad/Abbasid Caliphates*, *Mongol Empire*, *Ottoman Empire*, *British Empire*), and parent-to-child succession transitions.
- **Column Reordering, Soloing & Comparative Presets**: Move any regional column left/right, hide or solo columns, or switch presets (*Rome vs. Han China*, *Cradles of Civilization*, *Pre-Columbian Americas*, *Medieval Silk & Gold*) with live re-routing of cross-column connectors.
- **Semantic Zoom (3 LOD Tiers) & Dual Time Scale**: Zoom from macro epochs down to individual milestones, and switch between the **Poster Warped Scale** and **Uniform Linear Time**.
- **Synchronized World Atlas Map**: Interactive geopolitical world map panel that illuminates active empires, trans-regional bridges, and animated trade/migration routes for the currently scrubbed year.
- **"World in Year X" Synchronism Strip & Time-Lapse Player**: Scrub through 5,325 years of history or press **Time-Lapse** to watch simultaneous civilizations, global crises, and the Holocene paleoclimate temperature anomaly curve evolve together.
- **Deep-Dive Encyclopedia & Lineage Dossier**: Slide-over drawer with clickable ancestor/descendant lineage chips, ruler timelines, territorial span breakdowns, and live Wikipedia REST API summaries/thumbnails.
- **Guided Story Mode Tours, `⌘K` Instant Search & Custom Milestone Authoring**.

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```
