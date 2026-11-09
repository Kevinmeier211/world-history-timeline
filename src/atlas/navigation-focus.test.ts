import { createElement } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useAtlasNavigation } from './use-atlas-navigation';

let readyFonts: () => void;
let fonts: Promise<void>;
function Reader() {
  const navigation = useAtlasNavigation(true);
  return createElement(
    'main',
    { tabIndex: -1 },
    createElement(
      'h1',
      { 'data-reading-title': true, tabIndex: -1 },
      navigation.location.compare ? 'Comparison' : 'Reading',
    ),
    createElement(
      'button',
      {
        id: 'comparison-trigger',
        onClick: () => navigation.navigate({ ...navigation.location, compare: 'rome' }),
      },
      'Compare',
    ),
    createElement(
      'button',
      { onClick: () => navigation.navigate({ ...navigation.location, compare: null }) },
      'Return',
    ),
    createElement(
      'button',
      { onClick: () => navigation.navigate({ ...navigation.location, year: 300 }) },
      'Change year',
    ),
    createElement('output', null, String(navigation.location.year)),
  );
}
beforeEach(() => {
  history.replaceState(null, '', '?subject=han&year=200');
  fonts = new Promise<void>((resolve) => {
    readyFonts = resolve;
  });
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: { ready: fonts },
  });
  HTMLElement.prototype.scrollIntoView = vi.fn();
  window.scrollTo = vi.fn();
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(0), 0),
  );
  vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('restores the comparison origin after a return and preserves the chosen year', async () => {
  render(createElement(Reader));
  await act(async () => readyFonts());
  await waitFor(() => expect(screen.getByRole('heading')).toHaveFocus());
  const origin = screen.getByText('Compare');
  origin.focus();
  fireEvent.click(origin);
  await waitFor(() =>
    expect(screen.getByRole('heading')).toHaveTextContent('Comparison'),
  );
  await waitFor(() => expect(screen.getByRole('heading')).toHaveFocus());
  fireEvent.click(screen.getByText('Return'));
  await waitFor(() => expect(origin).toHaveFocus());
  expect(screen.getByRole('status')).toHaveTextContent('200');
});

it('cancels deferred focus on unmount while fonts are pending', async () => {
  const view = render(createElement(Reader));
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
  view.unmount();
  const outside = document.createElement('button');
  document.body.append(outside);
  outside.focus();
  await act(async () => readyFonts());
  expect(outside).toHaveFocus();
  outside.remove();
});

it('leaves an open dialog focus alone after late font readiness', async () => {
  render(createElement(Reader));
  const dialog = document.createElement('dialog');
  dialog.open = true;
  const button = document.createElement('button');
  dialog.append(button);
  document.body.append(dialog);
  button.focus();
  await act(async () => readyFonts());
  expect(button).toHaveFocus();
  dialog.remove();
});

it('does not add duplicate browser history entries for the same route', async () => {
  render(createElement(Reader));
  await act(async () => readyFonts());
  const push = vi.spyOn(history, 'pushState');
  fireEvent.click(screen.getByText('Change year'));
  fireEvent.click(screen.getByText('Change year'));
  expect(push).toHaveBeenCalledTimes(1);
  push.mockRestore();
});

it('remembers a pointer-activated control when the browser blurs it before click', async () => {
  render(createElement(Reader));
  await act(async () => readyFonts());
  await waitFor(() => expect(screen.getByRole('heading')).toHaveFocus());
  const origin = screen.getByText('Compare');
  fireEvent.pointerDown(origin);
  screen.getByRole('main').focus();
  fireEvent.click(origin);
  await waitFor(() =>
    expect(screen.getByRole('heading')).toHaveTextContent('Comparison'),
  );
  await waitFor(() => expect(screen.getByRole('heading')).toHaveFocus());
  fireEvent.click(screen.getByText('Return'));
  await waitFor(() => expect(origin).toHaveFocus());
});

it('gives a subsequent focus movement priority over an earlier pointer origin', async () => {
  render(createElement(Reader));
  await act(async () => readyFonts());
  await waitFor(() => expect(screen.getByRole('heading')).toHaveFocus());
  fireEvent.pointerDown(screen.getByText('Return'));
  const origin = screen.getByText('Compare');
  origin.focus();
  fireEvent.click(origin);
  await waitFor(() =>
    expect(screen.getByRole('heading')).toHaveTextContent('Comparison'),
  );
  await waitFor(() => expect(screen.getByRole('heading')).toHaveFocus());
  fireEvent.click(screen.getByText('Return'));
  await waitFor(() => expect(origin).toHaveFocus());
});
