import { fireEvent, render, waitFor } from '@testing-library/react';
import { RegistrationHome } from './RegistrationHome';
import { MemoryRouter } from 'react-router';

test('it should render registration home page', async () => {
  const { getByText } = render(
    <MemoryRouter>
      <RegistrationHome />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(getByText('Set up your NGO on Glific')).toBeInTheDocument();
  });

  fireEvent.click(getByText('Get started'));
});
