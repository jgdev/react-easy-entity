import { useRef } from "react";

export const useDebounce = (ms: number, fn: (...args: any[]) => any) => {
  const handler = useRef<NodeJS.Timeout | null>();
  return (...args: any[]) => {
    if (handler.current) {
      clearTimeout(handler.current!);
    }
    handler.current = setTimeout(() => {
      fn.call(null, ...args);
      handler.current = null;
    }, ms);
  };
};
