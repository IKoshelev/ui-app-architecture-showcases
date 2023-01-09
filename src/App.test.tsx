import React from 'react';
import { render } from '@testing-library/react';
import { App } from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const logoElem = getByText(/Welcome to Hetman Motors/i);
  expect(logoElem).toBeInTheDocument();
});
