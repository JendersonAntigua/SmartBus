// Utilidades para PWA
export class PWAUtils {
  static isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  static isInstallable(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  static async checkForUpdates(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return registration.waiting !== null;
      }
    }
    return false;
  }

  static async getInstallPrompt(): Promise<any> {
    return new Promise((resolve) => {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        resolve(e);
      });
    });
  }

  static showInstallBanner(): void {
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1e40af, #3b82f6);
        color: white;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(30, 64, 175, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      ">
        <div style="flex: 1; margin-right: 16px;">
          <div style="font-weight: 600; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
            🚌 Instalar SMARTBUS
          </div>
          <div style="font-size: 14px; opacity: 0.9; line-height: 1.3;">
            Accede más rápido desde tu pantalla de inicio
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="install-pwa-btn" style="
            background: white;
            color: #1e40af;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Instalar
          </button>
          <button id="close-banner-btn" style="
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 10px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
          " onmouseover="this.style.background='rgba(255, 255, 255, 0.2)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'">
            ✕
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);

    // Agregar eventos
    document.getElementById('close-banner-btn')?.addEventListener('click', () => {
      banner.remove();
      localStorage.setItem('pwa-install-dismissed', 'true');
    });
  }

  static shouldShowInstallBanner(): boolean {
    return !this.isStandalone() && 
           !localStorage.getItem('pwa-install-dismissed') &&
           this.isInstallable();
  }

  static async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  static showNotification(title: string, options?: NotificationOptions): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options
      });
    }
  }

  static async registerBackgroundSync(tag: string): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
    }
  }

  static getNetworkStatus(): boolean {
    return navigator.onLine;
  }

  static onNetworkChange(callback: (isOnline: boolean) => void): void {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }
}