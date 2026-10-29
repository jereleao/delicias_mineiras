"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

const StoreScopeContext = createContext<number | null>(null);

export function StoreScopeProvider({
  storeId,
  children,
}: {
  storeId: number;
  children: ReactNode;
}) {
  return (
    <StoreScopeContext.Provider value={storeId}>
      {children}
    </StoreScopeContext.Provider>
  );
}

export function useStoreScopeId() {
  return useContext(StoreScopeContext);
}
