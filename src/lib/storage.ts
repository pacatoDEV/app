export function saveToLocalStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  const saved = localStorage.getItem(key);
  if (!saved) return defaultValue;
  try {
    return JSON.parse(saved) as T;
  } catch (e) {
    return defaultValue;
  }
}
