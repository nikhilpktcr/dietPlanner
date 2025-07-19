import { useEffect, useRef } from "react";

interface UsePollingOptions {
  interval: number;
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const usePolling = (
  callback: () => Promise<any>,
  options: UsePollingOptions
) => {
  const { interval, enabled = true, onSuccess, onError } = options;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const poll = async () => {
      try {
        const res = await callback();
        onSuccess?.(res);
      } catch (error) {
        onError?.(error);
      }
    };

    // Initial call
    poll();

    // Set up interval
    intervalRef.current = setInterval(poll, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [callback, interval, enabled, onSuccess, onError]);

  return {
    stop: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
  };
};
