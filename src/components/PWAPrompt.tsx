import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface PWAPromptStrings {
    offlineReady: string;
    updateAvailable: string;
    update: string;
    close: string;
}
interface PWAPromptProps {
    strings: PWAPromptStrings
}

export const PWAPrompt: React.FC<PWAPromptProps> = ({ strings }) => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW registrado con éxito: ', r);
    },
    onRegisterError(error) {
      console.error('Error al registrar el SW: ', error);
    },
  });

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
        {offlineReady ? (
          <span>{strings.offlineReady}</span>
        ) : (
          <span>{strings.updateAvailable}</span>
        )}
      </div>
      <div className="toast-actions">
        {needRefresh && (
          <button
            className="toast-btn toast-btn-primary"
            onClick={() => updateServiceWorker(true)}
          >
            {strings.update}
          </button>
        )}
        <button
          className="toast-btn toast-btn-secondary"
          onClick={close}
        >
          {strings.close}
        </button>
      </div>
    </div>
  );
};
export default PWAPrompt;
