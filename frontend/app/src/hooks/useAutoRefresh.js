import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for auto-refreshing data without showing loading indicators
 * @param {Function} refreshFunction - Function to call for refreshing data
 * @param {number} interval - Refresh interval in milliseconds (default: 10000ms = 10s)
 * @param {boolean} enabled - Whether auto-refresh is enabled (default: true)
 * @param {Array} dependencies - Additional dependencies to trigger refresh
 */
const useAutoRefresh = (
  refreshFunction,
  interval = 10000,
  enabled = true,
  dependencies = []
) => {
  const intervalRef = useRef(null);
  const isInitialMount = useRef(true);

  const refresh = useCallback(
    async (showLoading = false) => {
      try {
        await refreshFunction(showLoading);
      } catch (error) {
        console.error("Auto-refresh error:", error);
      }
    },
    [refreshFunction]
  );

  useEffect(() => {
    // Skip auto-refresh on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!enabled) {
      return;
    }

    // Set up interval for auto-refresh
    intervalRef.current = setInterval(() => {
      refresh(false); // Don't show loading on auto-refresh
    }, interval);

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, refresh, ...dependencies]);

  // Manual refresh function that shows loading
  const manualRefresh = useCallback(() => {
    refresh(true);
  }, [refresh]);

  return { manualRefresh };
};

export default useAutoRefresh;
