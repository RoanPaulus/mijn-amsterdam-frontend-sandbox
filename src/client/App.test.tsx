/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render, screen } from '@testing-library/react';
import App from './App';
import { useSessionApi, useSessionValue } from './hooks/api/useSessionApi';

jest.mock('./hooks/api/useSessionApi', () => {
  const module = jest.requireActual('./hooks/api/useSessionApi');

  return {
    __esModule: true,
    ...module,
    useSessionApi: jest.fn(),
    useSessionValue: jest.fn(),
  };
});

describe('App', () => {
  it('Renders pristine App', () => {
    (useSessionApi as jest.Mock).mockReturnValue({
      isPristine: true,
    });

    render(<App />);
    expect(screen.getByText(/Welkom/i)).toBeInTheDocument();
  });

  it('Renders Landing Page', async () => {
    (useSessionApi as jest.Mock).mockReturnValue({
      isPristine: false,
      isAuthenticated: false,
    });

    render(<App />);

    expect(screen.getByText('Mijn Amsterdam')).toBeInTheDocument();
    await screen.findByText('Voor particulieren en eenmanszaken');
    expect(
      screen.getByText('Voor particulieren en eenmanszaken')
    ).toBeInTheDocument();
  });

  it('Renders Dashboard', async () => {
    (window as any).scrollTo = jest.fn();
    const session = {
      isPristine: false,
      isAuthenticated: true,
      isDirty: true,
    };
    (useSessionValue as jest.Mock).mockReturnValue(session);
    (useSessionApi as jest.Mock).mockReturnValue(session);

    render(<App />);

    expect(screen.getByText('Mijn Amsterdam')).toBeInTheDocument();

    await screen.findByRole('heading', { name: /actueel/i });

    expect(screen.getByRole('heading', { name: /actueel/i })).toHaveTextContent(
      'Actueel'
    );
    expect(
      screen.getByRole('heading', { name: /mijn thema's/i })
    ).toHaveTextContent(/Mijn thema's/gi);
  });
});
