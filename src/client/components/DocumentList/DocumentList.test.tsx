import * as Sentry from '@sentry/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { GenericDocument } from '../../../universal/types/App.types';
import * as analytics from '../../hooks/analytics.hook';
import { trackPageViewWithCustomDimension } from '../../hooks/analytics.hook';
import DocumentList from './DocumentList';

jest.mock('../../hooks/analytics.hook');

const ITEMS: GenericDocument[] = [
  {
    datePublished: '2019-03-23T00:00:00+01:00',
    id: '24078091',
    title: 'Uitkeringsspecificatie',
    url: '/wpi/document?id=24078091&isBulk=false&isDms=false',
  },
  {
    datePublished: '2014-01-24T00:00:00+01:00',
    id: '30364921',
    title: 'Uitkeringsspecificatie',
    url: '/wpi/document?id=30364921&isBulk=false&isDms=false',
  },
];

describe('DocumentList', () => {
  Object.defineProperty(window, 'location', {
    value: {
      ...window.location,
    },
    writable: true,
  });

  it('Clicking a link fires tracking call', async () => {
    const originalFn = console.error;
    console.error = jest.fn(); // Hide warnings about navigation not implemented exceptions.

    const fetch = ((global as any).fetch = jest
      .fn()
      .mockResolvedValueOnce({ status: 200, blob: () => null }));

    (trackPageViewWithCustomDimension as jest.Mock).mockReturnValue(null);

    render(
      <RecoilRoot>
        <BrowserRouter>
          <DocumentList documents={ITEMS} />
        </BrowserRouter>
      </RecoilRoot>
    );

    expect(screen.getAllByText(ITEMS[0].title).length).toBe(2);
    userEvent.click(screen.getAllByText(ITEMS[0].title)[0]);
    expect(fetch).toHaveBeenCalledWith(ITEMS[0].url, {
      credentials: 'include',
    });

    await waitFor(() =>
      expect(trackPageViewWithCustomDimension).toHaveBeenCalledWith(
        ITEMS[0].title,
        // The additional leading / is representing window.location.pathname
        '//downloads/' + ITEMS[0].title + '.pdf',
        'private',
        ''
      )
    );

    console.error = originalFn;
  });

  it('trackPath function is used to create the link sent to the tracking call', async () => {
    const originalFn = console.error;
    console.error = jest.fn(); // Hide warnings about navigation not implemented exceptions.

    (global as any).fetch = jest
      .fn()
      .mockResolvedValueOnce({ status: 200, blob: () => null });

    (trackPageViewWithCustomDimension as jest.Mock).mockReturnValue(null);

    render(
      <RecoilRoot>
        <BrowserRouter>
          <DocumentList
            documents={ITEMS}
            trackPath={(document) => {
              return '/compleet/ander/pad';
            }}
          />
        </BrowserRouter>
      </RecoilRoot>
    );

    userEvent.click(screen.getAllByText(ITEMS[0].title)[0]);

    await waitFor(() =>
      expect(trackPageViewWithCustomDimension).toHaveBeenCalledWith(
        ITEMS[0].title,
        // The additional leading / is representing window.location.pathname
        '/compleet/ander/pad',
        'private',
        ''
      )
    );

    console.error = originalFn;
  });

  it('Clicking a link does not fire a tracking call when the link returns a 404 status', async () => {
    const fetch = ((global as any).fetch = jest
      .fn()
      .mockResolvedValueOnce({ status: 404, statusText: 'not found' }));
    const track = ((analytics as any).trackPageViewWithCustomDimension = jest.fn());
    const captureException = ((Sentry as any).captureException = jest.fn());

    render(
      <RecoilRoot>
        <BrowserRouter>
          <DocumentList documents={ITEMS} />
        </BrowserRouter>
      </RecoilRoot>
    );

    userEvent.click(screen.getAllByText(ITEMS[0].title)[0]);

    expect(fetch).toHaveBeenCalledWith(ITEMS[0].url, {
      credentials: 'include',
    });

    await waitFor(() => expect(track).not.toHaveBeenCalled());
    await screen.findByText('Download mislukt');
    await waitFor(() =>
      expect(captureException).toHaveBeenCalledWith(
        new Error(`Failed to download document. Error: not found, Code: 404`),
        {
          extra: {
            title: ITEMS[0].title,
            url: ITEMS[0].url,
          },
        }
      )
    );
  });
});
