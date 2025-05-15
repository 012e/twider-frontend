import { useMemo, useRef, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("resize", callback);
  };
}

export function useDimensions<T extends HTMLElement>(
  ref:
    | ReturnType<typeof useRef<T | null>>
    | ReturnType<typeof useRef<T>>
    | ReturnType<typeof useRef<T | undefined>>,
) {
  if (!ref) {
    return { width: 0, height: 0 };
  }

  const getServerSnapshot = () =>
    JSON.stringify({
      width: 0,
      height: 0,
    });

  const dimensions = useSyncExternalStore(
    subscribe,
    () =>
      JSON.stringify({
        width: ref.current?.offsetWidth ?? 0, // 0 is default width
        height: ref.current?.offsetHeight ?? 0, // 0 is default height
      }),
    getServerSnapshot,
  );
  return useMemo(() => JSON.parse(dimensions), [dimensions]);
}
