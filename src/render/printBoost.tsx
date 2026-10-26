import { createContext, useContext, type ReactNode } from 'react';

const PrintBoostContext = createContext(1);

/** Print type multiplier. The screen chart leaves this at 1. */
export function PrintBoostProvider({
  boost,
  children,
}: {
  boost: number;
  children: ReactNode;
}) {
  return (
    <PrintBoostContext.Provider value={boost}>{children}</PrintBoostContext.Provider>
  );
}

export function usePrintBoost(): number {
  const boost = useContext(PrintBoostContext);
  return boost > 0 ? boost : 1;
}
