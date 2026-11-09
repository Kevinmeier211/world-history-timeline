import { createElement, type ComponentProps } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { DossierLoader } from './DossierLoader';

const props = {
  corpus: {
    subjects: [
      { id: 'han', name: 'Eastern Han' },
      { id: 'mali', name: 'Mali' },
    ],
  },
  location: { subject: 'han' },
  close: vi.fn(),
  onReady: vi.fn(),
} as unknown as ComponentProps<typeof DossierLoader>;
afterEach(() => {
  cleanup();
  vi.doUnmock('./Dossier');
  vi.clearAllMocks();
});

it('identifies the selected case while loading and passes the latest selection to the reader', async () => {
  let resolve!: (value: { Dossier: ReturnType<typeof vi.fn> }) => void;
  const pending = new Promise<{ Dossier: ReturnType<typeof vi.fn> }>((done) => {
    resolve = done;
  });
  vi.doMock('./Dossier', () => pending);
  const view = render(createElement(DossierLoader, props));
  expect(screen.getByRole('heading', { name: 'Eastern Han' })).toBeVisible();
  expect(screen.getByRole('status')).toHaveTextContent(
    'Opening the researched dossier',
  );
  expect(screen.getByRole('complementary')).toHaveAttribute(
    'data-reading-ready',
    'false',
  );
  expect(props.onReady).not.toHaveBeenCalled();
  const latest = { ...props, location: { ...props.location, subject: 'mali' } };
  view.rerender(createElement(DossierLoader, latest));
  expect(screen.getByRole('heading', { name: 'Mali' })).toBeVisible();
  const reader = vi.fn((received: ComponentProps<typeof DossierLoader>) =>
    createElement('p', null, 'Full reading for ' + received.location.subject),
  );
  await act(async () => resolve({ Dossier: reader }));
  expect(await screen.findByText('Full reading for mali')).toBeVisible();
  expect(reader.mock.calls[0]![0]).toEqual(latest);
});

it('explains a chunk failure and retains return and reload recovery', async () => {
  vi.doMock('./Dossier', () => Promise.reject(new Error('offline')));
  render(createElement(DossierLoader, props));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'reading controls could not load',
  );
  await waitFor(() => expect(props.onReady).toHaveBeenCalledTimes(1));
  expect(screen.getByRole('complementary')).toHaveAttribute(
    'data-reading-ready',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Reload atlas' })).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Back to atlas' }));
  expect(props.close).toHaveBeenCalledTimes(1);
});

it('does not signal readiness after leaving an unresolved reading', async () => {
  let reject!: (reason: Error) => void;
  vi.doMock(
    './Dossier',
    () =>
      new Promise((_, fail) => {
        reject = fail;
      }),
  );
  const view = render(createElement(DossierLoader, props));
  await waitFor(() => expect(reject).toBeTypeOf('function'));
  view.unmount();
  await act(async () => reject(new Error('late failure')));
  expect(props.onReady).not.toHaveBeenCalled();
});
