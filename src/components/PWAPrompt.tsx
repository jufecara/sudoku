import React, { useCallback, useEffect, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useTranslation } from '../hooks/useTranslation';

const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;

export const PWAPrompt: React.FC = () => {
  const { t } = useTranslation();
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  const checkForUpdate = useCallback(() => {
    if (!registrationRef.current || document.visibilityState !== 'visible') {
      return;
    }

    registrationRef.current.update().catch((error) => {
      console.error('Error checking for app updates: ', error);
    });
  }, []);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_swScriptUrl, registration) {
      if (!registration) {
        return;
      }

      registrationRef.current = registration;
      checkForUpdate();
      console.log('SW registrado con éxito: ', registration);
    },
    onRegisterError(error) {
      console.error('Error al registrar el SW: ', error);
    },
  });

  useEffect(() => {
    const handleFocus = () => checkForUpdate();
    const handleOnline = () => checkForUpdate();
    const intervalId = window.setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [checkForUpdate]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="pwa-toast glass-panel">
      <div className="toast-message">
        {offlineReady ? <span>{t.pwa.offlineReady}</span> : <span>{t.pwa.updateAvailable}</span>}
      </div>
      <div className="toast-actions">
        {needRefresh && (
          <button className="toast-btn toast-btn-primary" onClick={() => updateServiceWorker(true)}>
            {t.pwa.update}
          </button>
        )}
        <button className="toast-btn toast-btn-secondary" onClick={close}>
          {t.pwa.close}
        </button>
      </div>
    </div>
  );
};
export default PWAPrompt;
