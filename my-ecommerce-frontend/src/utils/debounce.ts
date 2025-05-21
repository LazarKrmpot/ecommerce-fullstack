export function debounce<A extends unknown[], R>(
  func: (...args: A) => R,
  wait: number,
  immediate = false
): (...args: A) => Promise<R | undefined> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: A): Promise<R | undefined> => {
    return new Promise((resolve) => {
      const callNow = immediate && !timer;

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        timer = null;
        if (!immediate) {
          resolve(func(...args));
        }
      }, wait);

      if (callNow) {
        resolve(func(...args));
      }
    });
  };
}
