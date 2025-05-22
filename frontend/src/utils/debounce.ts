export default function debounce<T extends (...args: any[]) => void>(func: T, time: number) {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if(timerId !== null) {
        clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
        func(...args)
    }, time)
  }
}
