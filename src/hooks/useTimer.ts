import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(isActive: boolean) {
  const [timer, setTimer] = useState(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isActive]);

  const resetTimer = useCallback(() => {
    setTimer(0);
  }, []);

  const setTimerValue = useCallback((value: number) => {
    setTimer(value);
  }, []);

  return { timer, resetTimer, setTimerValue };
}
