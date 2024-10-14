import { render, screen } from '@testing-library/react';

import Alert from './Alert';

it('Renders without crashing', () => {
  render(<Alert>O nee!</Alert>);
  expect(screen.getByText('O nee!')).toBeInTheDocument();
});
