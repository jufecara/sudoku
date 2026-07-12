import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useTimer', () => {
  it('starts at 0', () => {
    const { result } = renderHook(() => useTimer(true));
    expect(result.current.timer).toBe(0);
  });

  it('increments every second when active', () => {
    const { result } = renderHook(() => useTimer(true));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.timer).toBe(3);
  });

  it('does not increment when not active', () => {
    const { result } = renderHook(() => useTimer(false));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.timer).toBe(0);
  });

  it('stops incrementing when deactivated', () => {
    const { result, rerender } = renderHook(({ active }: { active: boolean }) => useTimer(active), {
      initialProps: { active: true },
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.timer).toBe(2);

    rerender({ active: false });

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.timer).toBe(2);
  });

  it('resets timer when resetTimer is called', () => {
    const { result } = renderHook(() => useTimer(true));
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(result.current.timer).toBe(4);

    act(() => {
      result.current.resetTimer();
    });
    expect(result.current.timer).toBe(0);
  });

  it('sets timer value when setTimerValue is called', () => {
    const { result } = renderHook(() => useTimer(true));
    act(() => {
      result.current.setTimerValue(42);
    });
    expect(result.current.timer).toBe(42);
  });

  it('clears interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = renderHook(() => useTimer(true));
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
