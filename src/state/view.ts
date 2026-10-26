import { create } from 'zustand';

import { publishView, readLocationView, type ViewLink } from './hashUrl.ts';

interface ViewState {
  link: ViewLink;
  /** Record a view and push it on the address bar. */
  setLink: (link: ViewLink, mode?: 'push' | 'replace') => void;
  /** Take the view from the address bar. Used for the first load and for back/forward. */
  readHash: () => void;
}

export const useView = create<ViewState>((set) => ({
  link: readLocationView(),
  setLink: (link, mode = 'push') => {
    set({ link });
    publishView(link, mode);
  },
  readHash: () => set({ link: readLocationView() }),
}));

export function resetView(): void {
  useView.setState({ link: { fold: [] } });
}
