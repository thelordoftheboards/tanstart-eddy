export function getInitials(name: string | undefined) {
  if (!name) {
    return '??';
  }

  let names = name.split(' ');
  if (names.length === 1) {
    names = name.split(',');
  }
  if (names.length === 1) {
    names = name.split('-');
  }

  // biome-ignore lint/style/useAtIndex: Allow
  return (names[0][0] + (names.length > 1 ? names[names.length - 1][0] : '')).toUpperCase();
}
