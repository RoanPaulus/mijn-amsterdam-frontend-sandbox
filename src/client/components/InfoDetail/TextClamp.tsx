import classNames from 'classnames';
import { ReactNode, useCallback, useState } from 'react';
import styles from './TextClamp.module.scss';

// The difference between maxHeight and actualHeight should be at least this number in pixels
const TEXT_CLAMP_HEIGHT_DELTA_THRESHOLD = 10;

interface TextClampProps {
  children: ReactNode;
  tagName?: keyof JSX.IntrinsicElements;
  maxHeight?: `${number}px`;
  startClamped?: boolean;
}

export function TextClamp({
  children,
  tagName = 'div',
  maxHeight = '45px',
  startClamped = true,
}: TextClampProps) {
  const WrapperEL = tagName;
  const [isClamped, setIsClamped] = useState<boolean>(startClamped);
  const [hasOverflow, setHasOverflow] = useState<boolean | undefined>(
    undefined
  );

  const callBackRef = useCallback((domNode) => {
    if (typeof hasOverflow === 'boolean' || !domNode) {
      return;
    }
    setHasOverflow(
      domNode.getBoundingClientRect().height - parseInt(maxHeight, 10) >
        TEXT_CLAMP_HEIGHT_DELTA_THRESHOLD
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleClamp = () => {
    setIsClamped((isClamped) => !isClamped);
  };

  if (hasOverflow === false) {
    return <>{children}</>;
  }

  return (
    <WrapperEL
      className={classNames(
        styles.TextClamp,
        hasOverflow && isClamped && styles.isClamped,
        hasOverflow && styles.hasOverflow
      )}
      style={{ ['--maxHeight' as string]: maxHeight }}
    >
      <span ref={callBackRef} className={styles.textWrap}>
        {children}
      </span>
      {hasOverflow && (
        <button
          onClick={() => toggleClamp()}
          className={classNames(
            styles.ReadMoreButton,
            isClamped && styles.isClamped
          )}
        >
          <span className={styles.label}>
            Toon {isClamped ? 'alle tekst' : 'minder'}
          </span>
        </button>
      )}
    </WrapperEL>
  );
}
