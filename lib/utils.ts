type ClassValue = string | number | boolean | undefined | null | { [key: string]: any };

export function cn(...inputs: ClassValue[]) {
  return inputs
    .flat()
    .filter(Boolean)
    .map(input => {
      if (typeof input === 'string') return input;
      if (input && typeof input === 'object') {
        return Object.entries(input)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}
