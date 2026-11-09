import { createElement, type ComponentProps } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { WorldContextLoader } from './WorldContextLoader';
import { useAtlasNavigation } from './use-atlas-navigation';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
const worldProps = {
  corpus: {},
  year: 200,
  region: 'Europe',
  selected: 'han',
  pack: {},
  openSubject: vi.fn(),
  goYear: vi.fn(),
  previewSubject: vi.fn(),
  showTimeline: vi.fn(),
} as unknown as ComponentProps<typeof WorldContextLoader>;
function Reader() {
  const navigation = useAtlasNavigation(true);
  return createElement(
    'main',
    null,
    createElement(WorldContextLoader, {
      ...worldProps,
      onReady: navigation.focusReading,
    }),
  );
}
beforeEach(() => {
  vi.clearAllMocks();
  history.replaceState(null, '', '?subject=han&view=world&year=200');
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
  HTMLElement.prototype.scrollIntoView = vi.fn();
  window.scrollTo = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.doUnmock('./WorldContext');
});

it('waits for the world module before moving reading focus and preserves current props', async () => {
  const pending = deferred<{
    WorldContext: (props: typeof worldProps) => ReturnType<typeof createElement>;
  }>();
  vi.doMock('./WorldContext', () => pending.promise);
  render(createElement(Reader));
  const loading = screen.getByRole('heading', { name: 'Opening the world view…' });
  expect(loading.closest('section')).toHaveAttribute('data-reading-ready', 'false');
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  expect(loading).not.toHaveFocus();
  const world = vi.fn((props: typeof worldProps) =>
    createElement(
      'h1',
      {
        'data-context-title': true,
        tabIndex: -1,
      },
      `World at ${props.year}`,
    ),
  );
  await act(async () => pending.resolve({ WorldContext: world }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: 'World at 200' })).toHaveFocus(),
  );
  expect(world.mock.calls[0]![0]).toEqual(worldProps);
});

it('focuses an explained failure and keeps timeline recovery available', async () => {
  vi.doMock('./WorldContext', () => Promise.reject(new Error('Chunk offline')));
  render(createElement(Reader));
  const heading = await screen.findByRole('heading', {
    name: 'The world view could not open',
  });
  await waitFor(() => expect(heading).toHaveFocus());
  expect(heading.closest('section')).toHaveAttribute('data-reading-ready', 'true');
  expect(screen.getByRole('button', { name: 'Reload atlas' })).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: '← Living timeline' }));
  expect(worldProps.showTimeline).toHaveBeenCalledWith(200, 'han');
});

it('does not signal readiness after leaving a pending world view', async () => {
  const pending = deferred<{ WorldContext: () => null }>();
  vi.doMock('./WorldContext', () => pending.promise);
  const onReady = vi.fn();
  const view = render(createElement(WorldContextLoader, { ...worldProps, onReady }));
  view.unmount();
  await act(async () => pending.resolve({ WorldContext: () => null }));
  expect(onReady).not.toHaveBeenCalled();
});
