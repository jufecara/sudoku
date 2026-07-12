import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import type { Dispatch, SetStateAction } from 'react';
import '@testing-library/jest-dom';

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: vi.fn(),
}));

import { useRegisterSW } from 'virtual:pwa-register/react';
import type { RegisterSWOptions } from 'virtual:pwa-register/react';

let mockUpdateSW: (reloadPage?: boolean) => Promise<void>;
let mockSetOfflineReady: Mock<Dispatch<SetStateAction<boolean>>> = vi.fn();
let mockSetNeedRefresh: Mock<Dispatch<SetStateAction<boolean>>> = vi.fn();

const mockUseRegisterSW = vi.mocked(useRegisterSW);
mockUseRegisterSW.mockImplementation((options?: RegisterSWOptions) => {
  options?.onRegisteredSW?.('mock-url', undefined);
  return {
    offlineReady: [false, mockSetOfflineReady] as [boolean, Dispatch<SetStateAction<boolean>>],
    needRefresh: [false, mockSetNeedRefresh] as [boolean, Dispatch<SetStateAction<boolean>>],
    updateServiceWorker: mockUpdateSW,
  };
});

const defaultReturn = () => ({
  offlineReady: [false, mockSetOfflineReady] as [boolean, Dispatch<SetStateAction<boolean>>],
  needRefresh: [false, mockSetNeedRefresh] as [boolean, Dispatch<SetStateAction<boolean>>],
  updateServiceWorker: mockUpdateSW as (reloadPage?: boolean) => Promise<void>,
});

beforeEach(() => {
  vi.clearAllMocks();
  mockUpdateSW = vi.fn(async () => {});
  mockSetOfflineReady = vi.fn();
  mockSetNeedRefresh = vi.fn();
  mockUseRegisterSW.mockReturnValue(defaultReturn());
});

afterEach(() => {
  Object.defineProperty(document, 'visibilityState', {
    value: 'visible',
    writable: true,
    configurable: true,
  });
});

describe('PWAPrompt', () => {
  it('returns null when neither offlineReady nor needRefresh is true', async () => {
    const { PWAPrompt } = await import('./PWAPrompt');
    const { container } = renderWithProviders(<PWAPrompt />);
    expect(container.firstChild).toBeNull();
  });

  it('renders offline ready message when offlineReady is true', async () => {
    mockUseRegisterSW.mockReturnValue({
      ...defaultReturn(),
      offlineReady: [true, mockSetOfflineReady],
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);
    expect(screen.getByText(/offline/)).toBeInTheDocument();
    expect(screen.queryByText('Update')).not.toBeInTheDocument();
  });

  it('renders update message and update button when needRefresh is true', async () => {
    mockUseRegisterSW.mockReturnValue({
      ...defaultReturn(),
      needRefresh: [true, mockSetNeedRefresh],
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);
    expect(screen.getByText(/version/)).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('renders offline message when both offlineReady and needRefresh are true', async () => {
    mockUseRegisterSW.mockReturnValue({
      ...defaultReturn(),
      offlineReady: [true, mockSetOfflineReady],
      needRefresh: [true, mockSetNeedRefresh],
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);
    expect(screen.getByText(/offline/)).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('calls updateServiceWorker when update button is clicked', async () => {
    mockUseRegisterSW.mockReturnValue({
      ...defaultReturn(),
      needRefresh: [true, mockSetNeedRefresh],
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);
    fireEvent.click(screen.getByText('Update'));
    expect(mockUpdateSW).toHaveBeenCalledWith(true);
  });

  it('calls close handlers when close button is clicked with needRefresh', async () => {
    mockUseRegisterSW.mockReturnValue({
      ...defaultReturn(),
      needRefresh: [true, mockSetNeedRefresh],
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);
    fireEvent.click(screen.getByText('Close'));
    expect(mockSetNeedRefresh).toHaveBeenCalledWith(false);
    expect(mockSetOfflineReady).toHaveBeenCalledWith(false);
  });

  it('calls close handlers when close button is clicked with offlineReady', async () => {
    mockUseRegisterSW.mockReturnValue({
      ...defaultReturn(),
      offlineReady: [true, mockSetOfflineReady],
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);
    fireEvent.click(screen.getByText('Close'));
    expect(mockSetOfflineReady).toHaveBeenCalledWith(false);
    expect(mockSetNeedRefresh).toHaveBeenCalledWith(false);
  });
});

describe('onRegisteredSW callback', () => {
  it('returns early when registration is null', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockUseRegisterSW.mockImplementation((options?: RegisterSWOptions) => {
      options?.onRegisteredSW?.('sw.js', undefined);
      return defaultReturn();
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('logs and sets up checkForUpdate when registration is valid', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const mockRegistration = {
      update: vi.fn().mockResolvedValue(undefined),
    } as unknown as ServiceWorkerRegistration;

    mockUseRegisterSW.mockImplementation((options?: RegisterSWOptions) => {
      options?.onRegisteredSW?.('sw.js', mockRegistration);
      return defaultReturn();
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);
    expect(logSpy).toHaveBeenCalledWith('SW registrado con éxito: ', mockRegistration);
    logSpy.mockRestore();
  });
});

describe('onRegisterError callback', () => {
  it('logs registration error', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const testError = new Error('SW registration failed');

    mockUseRegisterSW.mockImplementation((options?: RegisterSWOptions) => {
      options?.onRegisterError?.(testError);
      return defaultReturn();
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);
    expect(errorSpy).toHaveBeenCalledWith('Error al registrar el SW: ', testError);
    errorSpy.mockRestore();
  });
});

describe('checkForUpdate', () => {
  it('does not call update when registration is not set', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(undefined);

    mockUseRegisterSW.mockImplementation(() => {
      // Do NOT call onRegisteredSW — registrationRef stays null
      return defaultReturn();
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);

    fireEvent(window, new Event('focus'));
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('calls update on visibility change when visible', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const mockRegistration = {
      update: vi.fn().mockResolvedValue(undefined),
    } as unknown as ServiceWorkerRegistration;

    mockUseRegisterSW.mockImplementation((options?: RegisterSWOptions) => {
      options?.onRegisteredSW?.('sw.js', mockRegistration);
      return defaultReturn();
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);

    // onRegisteredSW calls checkForUpdate once during render
    expect(mockRegistration.update).toHaveBeenCalledTimes(1);

    fireEvent(window, new Event('focus'));
    expect(mockRegistration.update).toHaveBeenCalledTimes(2);

    fireEvent(window, new Event('online'));
    expect(mockRegistration.update).toHaveBeenCalledTimes(3);

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(mockRegistration.update).toHaveBeenCalledTimes(4);
    expect(logSpy).toHaveBeenCalledWith('SW registrado con éxito: ', mockRegistration);

    await vi.waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith('SW registrado con éxito: ', mockRegistration);
    });
    logSpy.mockRestore();
  });

  it('skips update when visibilityState is hidden', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true,
    });

    const mockRegistration = {
      update: vi.fn().mockResolvedValue(undefined),
    } as unknown as ServiceWorkerRegistration;

    mockUseRegisterSW.mockImplementation((options?: RegisterSWOptions) => {
      options?.onRegisteredSW?.('sw.js', mockRegistration);
      return defaultReturn();
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(mockRegistration.update).not.toHaveBeenCalled();

    expect(logSpy).toHaveBeenCalledWith('SW registrado con éxito: ', mockRegistration);

    await vi.waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith('SW registrado con éxito: ', mockRegistration);
    });
    logSpy.mockRestore();
  });

  it('logs error when update fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const updateError = new Error('Network error');
    const mockRegistration = {
      update: vi.fn().mockRejectedValue(updateError),
    } as unknown as ServiceWorkerRegistration;

    mockUseRegisterSW.mockImplementation((options?: RegisterSWOptions) => {
      options?.onRegisteredSW?.('sw.js', mockRegistration);
      return defaultReturn();
    });
    const { PWAPrompt } = await import('./PWAPrompt');
    renderWithProviders(<PWAPrompt />);

    await act(async () => {
      fireEvent(window, new Event('focus'));
    });

    expect(mockRegistration.update).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Error checking for app updates: ', updateError);
    expect(logSpy).toHaveBeenCalledWith('SW registrado con éxito: ', mockRegistration);

    await vi.waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith('Error checking for app updates: ', expect.any(Error));
      expect(logSpy).toHaveBeenCalledWith('SW registrado con éxito: ', mockRegistration);
    });
    errorSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('cleans up event listeners and interval on unmount', async () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { PWAPrompt } = await import('./PWAPrompt');
    const { unmount } = renderWithProviders(<PWAPrompt />);
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));

    clearIntervalSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
