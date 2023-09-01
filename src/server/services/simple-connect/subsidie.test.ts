import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { Chapters } from '../../../universal/config';
import { AuthProfileAndToken } from '../../helpers/app';
import { fetchSubsidieNotifications } from './subsidie';
import { remoteApi } from '../../../test-utils';

describe('Subsidie', () => {
  const authProfileAndToken: AuthProfileAndToken = {
    profile: { authMethod: 'digid', profileType: 'private' },
    token: 'xxxxxx',
  };

  const content = {
    isKnown: true,
    notifications: [
      {
        title: 'Test title',
        link: {
          to: 'http://localhost/to/subsidies',
          title: 'More about this',
        },
      },
    ],
  };

  test('fetchSubsidieNotifications digid', async () => {
    remoteApi
      .get(/\/subsidies\/*\/*/)
      .times(1)
      .reply(200, { content, status: 'OK' });

    const result = await fetchSubsidieNotifications(
      'xx22xx',
      authProfileAndToken
    );

    expect(result.content).toEqual({
      notifications: [
        {
          title: 'Test title',
          chapter: Chapters.SUBSIDIE,
          link: {
            to: 'http://localhost/to/subsidies?authMethod=digid',
            title: 'More about this',
          },
        },
      ],
    });
  });

  test('fetchSubsidieNotifications eherkenning', async () => {
    remoteApi
      .get(/\/subsidies\/*\/*/)
      .times(1)
      .reply(200, { content, status: 'OK' });

    const result = await fetchSubsidieNotifications('xx22xx', {
      ...authProfileAndToken,
      profile: { ...authProfileAndToken.profile, authMethod: 'eherkenning' },
    });

    expect(result.content).toEqual({
      notifications: [
        {
          title: 'Test title',
          chapter: Chapters.SUBSIDIE,
          link: {
            to: 'http://localhost/to/subsidies?authMethod=eherkenning',
            title: 'More about this',
          },
        },
      ],
    });
  });

  test('fetchSubsidieNotifications error 500', async () => {
    remoteApi
      .get(/\/subsidies\/citizen\/*/)
      .reply(500, { content: null, message: 'Error!', status: 'ERROR' });

    const result = await fetchSubsidieNotifications(
      'xx22xxNx',
      authProfileAndToken
    );

    expect(result.content).toEqual(null);
    expect(result.status).toBe('ERROR');
  });
});
