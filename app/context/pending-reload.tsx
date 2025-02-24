'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type PendingNavigationActions = {
  itemDeleted: string;
  back: boolean;
  refresh: boolean;
};
const initialValue: {
  isPendingNavigationAction: PendingNavigationActions;
  setPendingNavigationAction: React.Dispatch<
    React.SetStateAction<PendingNavigationActions>
  >;
} = {
  isPendingNavigationAction: { itemDeleted: '', back: false, refresh: false },
  setPendingNavigationAction: () => {},
};

type Props = {
  children: React.ReactNode;
};
export const PendingReloadContext = React.createContext(initialValue);

const PendingReloadProvider = ({ children }: Props) => {
  const { back, refresh } = useRouter();

  const [isPendingNavigationAction, setPendingNavigationAction] =
    useState<PendingNavigationActions>(initialValue.isPendingNavigationAction);

  useEffect(() => {
    if (isPendingNavigationAction.back) {
      back();
      setPendingNavigationAction((prev) => ({
        ...prev,
        back: false,
        refresh: false,
      }));
    }
  }, [isPendingNavigationAction, back, refresh]);

  return (
    <PendingReloadContext.Provider
      value={{ isPendingNavigationAction, setPendingNavigationAction }}
    >
      {children}
    </PendingReloadContext.Provider>
  );
};

export default PendingReloadProvider;
