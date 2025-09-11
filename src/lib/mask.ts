export function maskAddress(addr: string, head = 6, tail = 4) {
  if (!addr?.startsWith('0x') || addr.length < head + tail + 2) return addr
  return `${addr.slice(0, 2 + head)}…${addr.slice(-tail)}`
}
