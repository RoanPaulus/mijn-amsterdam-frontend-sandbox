import React, { useEffect } from 'react';
import styles from './StatusLine.module.scss';
import classnames from 'classnames';
import { ProcessStep } from 'data-formatting/focus';
import { IconButtonLink } from 'components/ButtonLink/ButtonLink';
import { Document } from '../DocumentList/DocumentList';
import { ReactComponent as DownloadIcon } from 'assets/icons/Download.svg';
import { defaultDateFormat } from 'helpers/App';
import useRouter from 'use-react-router';
import { useSessionStorage } from 'hooks/storage.hook';
import { itemClickTogglePayload } from 'hooks/analytics.hook';
import { ReactComponent as CaretLeft } from 'assets/icons/Chevron-Left.svg';

const DEFAULT_TRACK_CATEGORY = 'Metro_lijn';

export type StatusLineItem = ProcessStep;

interface StatusLineProps {
  items: StatusLineItem[];
  trackCategory?: string;
}

interface StatusLineItemProps {
  item: StatusLineItem;
  stepNumber: number;
}

interface DownloadLinkProps {
  item: Document;
}

function DownloadLink({ item }: DownloadLinkProps) {
  return (
    <IconButtonLink
      className={styles.DownloadLink}
      to={item.url}
      download={item.title}
    >
      <DownloadIcon />
      {item.title}
    </IconButtonLink>
  );
}

function StatusLineItem({ item, stepNumber }: StatusLineItemProps) {
  const { location } = useRouter();

  return (
    <li
      key={item.id}
      id={item.id}
      className={classnames(
        styles.ListItem,
        location.hash.substring(1) === item.id && styles.Highlight,
        styles[item.status.replace(/[^a-z]/gi, '').toLocaleLowerCase()]
      )}
    >
      <div className={styles.Panel} data-stepnumber={stepNumber}>
        <strong className={styles.StatusTitle}>{item.status}</strong>
        <time className={styles.StatusDate}>
          {defaultDateFormat(item.datePublished)}
        </time>
      </div>
      <div className={styles.Panel}>{item.description}</div>
      <div className={styles.Panel}>
        <p>
          {item.documents.map(document => (
            <DownloadLink key={document.id} item={document} />
          ))}
        </p>
      </div>
    </li>
  );
}

export default function StatusLine({
  items,
  trackCategory = DEFAULT_TRACK_CATEGORY,
}: StatusLineProps) {
  const { location } = useRouter();
  const [isCollapsed, setCollapsed] = useSessionStorage(
    'STATUS_LINE_' + location.pathname,
    true
  );

  function toggleCollapsed() {
    setCollapsed(!isCollapsed);
  }

  useEffect(() => {
    const id = location.hash.substring(1);
    const step = id && document.getElementById(id);

    if (step) {
      window.scroll({
        top: step.getBoundingClientRect().top,
        behavior: 'smooth',
      });
    }
  }, [location.hash]);

  return (
    <>
      <div className={styles.StatusLine}>
        <ul className={styles.List}>
          {items
            .filter(
              (item, index) =>
                !isCollapsed || (isCollapsed && index === items.length - 1)
            )
            .map((item, index) => (
              <StatusLineItem
                key={item.id}
                item={item}
                stepNumber={items.length - index}
              />
            ))}
        </ul>
      </div>
      {!items.length && <p>Er is geen status beschikbaar.</p>}
      {items.length > 1 && (
        <button
          className={classnames(styles.MoreStatus, {
            [styles.MoreStatusClosed]: isCollapsed,
          })}
          data-track={itemClickTogglePayload(
            `${trackCategory}/MetroLijn`,
            'Toon alles/minder',
            isCollapsed ? 'alles' : 'minder'
          )}
          onClick={toggleCollapsed}
        >
          <CaretLeft />
          {isCollapsed ? 'Toon alles' : 'Toon minder'}
        </button>
      )}
    </>
  );
}
