import { useState } from 'react';

import { Button, OrderedList } from '@amsterdam/design-system-react';

import { ErfpachtCanon } from '../../../../server/services/simple-connect/erfpacht';

const MAX_CANONS_VISIBLE_INITIALLY = 2;

interface DatalistCanonsProps {
  canons?: ErfpachtCanon[];
}

export function DatalistCanons({ canons }: DatalistCanonsProps) {
  const canonLength = canons?.length ?? 0;
  const shouldCollapse = canonLength > MAX_CANONS_VISIBLE_INITIALLY;
  const [isCollapsed, setIsCollapsed] = useState(shouldCollapse);
  const displayCanons =
    (shouldCollapse && isCollapsed
      ? canons?.slice(0, MAX_CANONS_VISIBLE_INITIALLY)
      : canons) ?? [];

  if (displayCanons.length) {
    return (
      <>
        <OrderedList markers={false}>
          {displayCanons.map((canon) => {
            return (
              <OrderedList.Item key={canon.samengesteld}>
                {canon.samengesteld}
              </OrderedList.Item>
            );
          })}
        </OrderedList>
        {shouldCollapse && (
          <Button
            variant="tertiary"
            style={{ transform: 'translateX(-0.9rem)' }}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? 'Toon meer' : 'Verberg'}
          </Button>
        )}
      </>
    );
  }
  return '-';
}
