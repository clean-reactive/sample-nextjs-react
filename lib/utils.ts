export function must<T>(value: T | undefined | null, message?: string): T {
  if (value === undefined || value === null) {
    throw new Error(message ?? 'value must be defined');
  }
  return value;
}
