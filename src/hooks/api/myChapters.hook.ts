import { Chapters } from 'App.constants';
import {
  MenuItem,
  myChaptersMenuItems,
} from 'components/MainNavBar/MainNavBar.constants';
import { useEffect, useState } from 'react';
import { ErfpachtApiState } from './api.erfpacht';
import { FocusApiState } from './api.focus';
import { GarbageApiState } from './api.garbage';
import { WmoApiState } from './api.wmo';

function isChapterActive(
  item: MenuItem,
  { WMO, FOCUS, ERFPACHT, GARBAGE }: useMyChaptersProps
) {
  switch (item.id) {
    case Chapters.INKOMEN:
      return (
        !FOCUS.isLoading &&
        !!Object.values(FOCUS.data.products).some(
          product => !!product.items.length
        )
      );

    case Chapters.ZORG:
      return !WMO.isLoading && !!WMO.data.items.length;

    case Chapters.BELASTINGEN:
      return true; // SSO to belastingen, always visible for now.

    case Chapters.AFVAL:
      return !GARBAGE.isLoading && GARBAGE.isDirty;

    case Chapters.WONEN:
      return !ERFPACHT.isLoading && ERFPACHT.data.status === true;
  }

  return false;
}

interface useMyChaptersProps {
  WMO: WmoApiState;
  FOCUS: FocusApiState;
  ERFPACHT: ErfpachtApiState;
  GARBAGE: GarbageApiState;
}

export interface MyChaptersApiState {
  items: MenuItem[];
  isLoading: boolean;
}

export default function useMyChapters(
  apiStates: useMyChaptersProps
): MyChaptersApiState {
  const { WMO, FOCUS, ERFPACHT, GARBAGE } = apiStates;

  const [{ items, isLoading }, setItems] = useState<MyChaptersApiState>({
    items: [],
    isLoading: true,
  });

  useEffect(() => {
    const items = myChaptersMenuItems.filter(item => {
      // Check to see if Chapter has been loaded or if it is directly available
      return isChapterActive(item, apiStates);
    });
    const isLoading =
      WMO.isLoading ||
      FOCUS.isLoading ||
      ERFPACHT.isLoading ||
      GARBAGE.isPristine;
    setItems({ items, isLoading });
  }, [WMO.isLoading, FOCUS.isLoading, ERFPACHT.isLoading, GARBAGE.isLoading]);

  return {
    items,
    isLoading,
  };
}
