import { maskAddress } from '../src/lib/mask';

test('shortens address safely', () => {
  const out = maskAddress('0x1234567890abcdef1234567890abcdef12345678');
  expect(out).toBe('0x123456…5678');
});

test('handles short addresses', () => {
  const out = maskAddress('0x1234');
  expect(out).toBe('0x1234');
});

test('handles empty address', () => {
  const out = maskAddress('');
  expect(out).toBe('');
});

test('handles non-0x address', () => {
  const out = maskAddress('1234567890abcdef1234567890abcdef12345678');
  expect(out).toBe('1234567890abcdef1234567890abcdef12345678');
});
