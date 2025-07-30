export function shortAddress(address) {
  if (!address) return '';
  return `${address.toString().slice(0, 6)}...${address.toString().slice(-4)}`;
}