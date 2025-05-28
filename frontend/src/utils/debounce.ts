export default function debounce<T extends (...args: any[]) => void>(
  func: T,
  time: number
) {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      func(...args);
    }, time);
  };
  const cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
  };
  return { debounced, cancel };
}
