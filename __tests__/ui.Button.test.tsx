import { render, screen } from '@testing-library/react';
import React from 'react';

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} data-testid="primary-btn" />;
}

test('renders button and handles click', () => {
  const onClick = jest.fn();
  render(<PrimaryButton onClick={onClick}>Revoke</PrimaryButton>);
  const btn = screen.getByTestId('primary-btn');
  btn.click();
  expect(onClick).toHaveBeenCalled();
  expect(btn).toHaveTextContent('Revoke');
});
