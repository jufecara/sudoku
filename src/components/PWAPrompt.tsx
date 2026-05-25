import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const PWAPrompt: React.FC = () => {
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
          <span>¡La aplicación está lista para funcionar sin conexión! 📶</span>
        ) : (
          <span>Hay contenido nuevo disponible, por favor actualiza para ver los cambios. ✨</span>
        )}
      </div>
      <div className="toast-actions">
        {needRefresh && (
          <button
            className="toast-btn toast-btn-primary"
            onClick={() => updateServiceWorker(true)}
          >
            Actualizar
          </button>
        )}
        <button
          className="toast-btn toast-btn-secondary"
          onClick={close}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
export default PWAPrompt;
