import { BaseLayerType } from '@amsterdam/arm-core/lib/components/BaseLayerToggle';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SIAItem } from '../../../server/services/sia';
import { AppRoutes, ChapterTitles } from '../../../universal/config';
import { LOCATION_ZOOM } from '../../../universal/config/buurt';
import {
  defaultDateFormat,
  isError,
  isLoading,
} from '../../../universal/helpers';
import { formatDurationInWords } from '../../../universal/helpers/date';
import {
  Alert,
  ChapterIcon,
  DetailPage,
  LoadingContent,
  Modal,
  PageContent,
  PageHeading,
} from '../../components';
import { Button, LinkdInline } from '../../components/Button/Button';
import InfoDetail, {
  InfoDetailGroup,
} from '../../components/InfoDetail/InfoDetail';
import MyAreaLoader from '../../components/MyArea/MyAreaLoader';
import StatusLine, {
  StatusLineItem,
} from '../../components/StatusLine/StatusLine';
import { useAppStateGetter } from '../../hooks/useAppState';
import styles from './SiaDetail.module.scss';

function useSiaMeldingStatusLineItems(SiaItem?: SIAItem) {
  const statusLineItems: StatusLineItem[] = useMemo(() => {
    if (!SiaItem) {
      return [];
    }

    const isPending = SiaItem.status === 'Gemeld';
    const isDone = SiaItem.status === 'Afgesloten';
    const isInProgress = SiaItem.status === 'Ingepland';
    return [
      {
        id: 'item-1',
        status: 'Gemeld',
        datePublished: SiaItem.datePublished,
        description: '',
        documents: [],
        isActive: isPending,
        isChecked: true,
      },
      {
        id: 'item-2',
        status: 'Ingepland',
        datePublished:
          isInProgress && !isDone && SiaItem.dateModified
            ? SiaItem.dateModified
            : '',
        description: '',
        documents: [],
        isActive: isInProgress,
        isChecked: isDone || isInProgress,
      },
      {
        id: 'item-3',
        status: 'Afgesloten',
        datePublished: isDone ? SiaItem.dateClosed || '' : '',
        description: '',
        documents: [],
        isActive: isDone,
        isChecked: isDone,
      },
    ];
  }, [SiaItem]);

  return statusLineItems;
}

export default function SiaDetail() {
  const { SIA } = useAppStateGetter();
  const { id } = useParams<{ id: string }>();
  const SiaItem = SIA.content?.find((item) => item.identifier === id);
  const noContent = !isLoading(SIA) && !SiaItem;
  const statusLineItems = useSiaMeldingStatusLineItems(SiaItem);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);

  return (
    <DetailPage>
      <PageHeading
        icon={<ChapterIcon />}
        backLink={{
          to: AppRoutes.SIA,
          title: ChapterTitles.SIA,
        }}
        isLoading={isLoading(SIA)}
      >
        Meldingsnummer {SiaItem?.identifier || ''}
      </PageHeading>

      <PageContent className={styles.DetailPageContent}>
        {(isError(SIA) || noContent) && (
          <Alert type="warning">
            <p>We kunnen op dit moment geen gegevens tonen.</p>
          </Alert>
        )}
        {isLoading(SIA) && (
          <LoadingContent className={styles.LoadingContentInfo} />
        )}
        {!isLoading(SIA) && (
          <>
            <InfoDetailGroup>
              <InfoDetail
                label="Status"
                value={SiaItem?.status || 'Ontvangen'}
              />
              <InfoDetail
                label="Meldingsnummer"
                value={SiaItem?.identifier || '-'}
              />
            </InfoDetailGroup>
            <InfoDetail
              label="Omschrijving"
              value={SiaItem?.description || '-'}
            />
            <InfoDetailGroup>
              <InfoDetail
                label="Ontvangen op"
                value={
                  SiaItem?.datePublished
                    ? defaultDateFormat(SiaItem.datePublished)
                    : '-'
                }
              />
              <InfoDetail
                label="Datum overlast"
                value={
                  <>
                    {SiaItem?.dateIncidentStart &&
                      defaultDateFormat(SiaItem.dateIncidentStart)}
                    {SiaItem?.dateIncidentEnd && (
                      <> &mdash; {defaultDateFormat(SiaItem.dateIncidentEnd)}</>
                    )}
                  </>
                }
              />
            </InfoDetailGroup>
            <InfoDetailGroup>
              <InfoDetail label="Categorie" value={SiaItem?.category || '-'} />
              <InfoDetail
                className={styles.LocationInfo}
                label="Locatie"
                value={
                  <>
                    {SiaItem?.address || '-'}{' '}
                    {SiaItem?.latlon && (
                      <>
                        <Button
                          className={styles.MapLink}
                          variant="inline"
                          lean={true}
                          onClick={() => setLocationModalOpen(true)}
                        >
                          Bekijk op de kaart
                        </Button>
                      </>
                    )}
                  </>
                }
              />
            </InfoDetailGroup>
            <InfoDetailGroup>
              <InfoDetail label="Urgentie" value={SiaItem?.priority} />
              {SiaItem?.deadline && (
                <InfoDetail
                  label="Verwerkingstijd"
                  value={formatDurationInWords(SiaItem?.deadline)}
                />
              )}
            </InfoDetailGroup>
            <InfoDetailGroup>
              <InfoDetail label="E-mail melder" value={SiaItem?.email || '-'} />
              <InfoDetail
                label="Telefoonnummer"
                value={SiaItem?.phone || '-'}
              />
            </InfoDetailGroup>
            <p className={styles.DetailInfo}>
              U hebt uw mailadres en telefoonnummer doorgegeven zodat u op de
              hoogte wordt gehouden over de voortgang van uw melding. U kunt
              deze gegevens hier niet meer wijzigen. 12 maanden na ontvangst van
              uw melding worden deze gegevens automatisch verwijderd uit ons
              systeem.
            </p>
            <p className={styles.DetailInfo}>
              Wilt u informatie toevoegen? Of is het probleem nog niet opgelost?
              <br />
              <LinkdInline
                external={true}
                href="https://meldingen.amsterdam.nl"
              >
                Maak een nieuwe melding
              </LinkdInline>
            </p>
            {!!SiaItem?.attachments.length && (
              <InfoDetail
                valueWrapperElement="div"
                label="Foto's"
                value={
                  <div className={styles.Images}>
                    {SiaItem.attachments.map((photo, index) => (
                      <div key={index} className={styles.ImgContainer}>
                        <img
                          className={styles.Img}
                          src={photo}
                          alt="Bijgevoegde foto"
                        />
                      </div>
                    ))}
                  </div>
                }
              />
            )}
          </>
        )}
      </PageContent>
      {!!statusLineItems.length && (
        <StatusLine
          className={styles.SiaStatus}
          trackCategory={`SiaMeldingen detail / status`}
          items={statusLineItems}
          showToggleMore={false}
          id={`sia-detail-${id}`}
        />
      )}
      {SiaItem && (
        <Modal
          isOpen={isLocationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          title={`Locatie van melding ${SiaItem.identifier}`}
          contentWidth={'62rem'}
        >
          <MyAreaLoader
            showHeader={false}
            showPanels={false}
            zoom={LOCATION_ZOOM}
            datasetIds={[]}
            activeBaseLayerType={BaseLayerType.Aerial}
            centerMarker={{
              latlng: {
                lat: SiaItem.latlon[0],
                lng: SiaItem.latlon[1],
              },
              label: SiaItem.address,
            }}
            height="40rem"
          />
        </Modal>
      )}
    </DetailPage>
  );
}
