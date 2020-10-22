import { mount, shallow } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GenericDocument } from '../../../universal/types/App.types';
import * as analytics from '../../hooks/analytics.hook';
import * as Sentry from '@sentry/browser';
import DocumentList from './DocumentList';
import { act } from 'react-dom/test-utils';

const ITEMS: GenericDocument[] = [
  {
    datePublished: '2019-03-23T00:00:00+01:00',
    id: '24078091',
    title: 'Uitkeringsspecificatie',
    type: 'pdf',
    url: '/api/focus/document?id=24078091&isBulk=false&isDms=false',
  },
  {
    datePublished: '2014-01-24T00:00:00+01:00',
    id: '30364921',
    title: 'Uitkeringsspecificatie',
    type: 'pdf',
    url: '/api/focus/document?id=30364921&isBulk=false&isDms=false',
  },
];

describe('DocumentList', () => {
  const track = ((analytics as any).trackPageView = jest.fn());
  const captureException = ((Sentry as any).captureException = jest.fn());
  const fetch = ((global as any).fetch = jest
    .fn()
    .mockResolvedValueOnce({ status: 200 })
    .mockResolvedValueOnce({ status: 404 }));

  beforeEach(() => {
    fetch.mockClear();
    track.mockClear();
  });

  it('Renders without crashing', () => {
    shallow(<DocumentList documents={ITEMS} />);
  });

  it('Has x download links', () => {
    const component = shallow(<DocumentList documents={ITEMS} />);
    expect(component.find('li')).toHaveLength(2);
  });

  it('Clicking a link fires tracking call', async () => {
    const component = mount(
      <BrowserRouter>
        <DocumentList documents={ITEMS} />
      </BrowserRouter>
    );
    const Linkd = component
      .find('li')
      .at(0)
      .find('Linkd');

    expect(Linkd).toHaveLength(1);
    expect(Linkd.prop('href')).toEqual(ITEMS[0].url);

    await act(async () => {
      Linkd.simulate('click');
    });
    expect(fetch).toHaveBeenCalledWith(ITEMS[0].url);
    expect(track).toHaveBeenCalledWith(
      ITEMS[0].title,
      // The additional leading / is representing window.location.pathname
      '//downloads/' + ITEMS[0].title + '.pdf'
    );
  });
  it('Clicking a link fires tracking call', async () => {
    const component = mount(
      <BrowserRouter>
        <DocumentList documents={ITEMS} />
      </BrowserRouter>
    );
    const Linkd = component
      .find('li')
      .at(0)
      .find('Linkd');

    await act(async () => {
      Linkd.simulate('click');
    });

    expect(track).not.toHaveBeenCalled();
    expect(captureException).toHaveBeenCalledWith(
      'Could not download document',
      {
        extra: {
          title: ITEMS[0].title,
          url: ITEMS[0].url,
        },
      }
    );
  });
});
