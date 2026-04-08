import {ApplicationRef, inject, Injectable} from '@angular/core';
import {SwUpdate, VersionReadyEvent} from '@angular/service-worker';
import {concat, first, interval} from 'rxjs';
import {hoursToMilliseconds} from 'date-fns';
import {SettingConst} from '../configs/settings.config';

/**
 * PwaService
 * -----------------------------------------
 * Handles:
 * - Periodic service worker update checks
 * - Update lifecycle events (detect, ready, fail)
 * - User prompt for new version activation
 * - Unrecoverable service worker errors
 *
 * Best Practices:
 * - Waits for app stabilization before polling
 * - Uses configurable interval
 * - Guards against disabled service worker
 */
@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private readonly appRef = inject(ApplicationRef);
  private readonly swUpdate = inject(SwUpdate);

  constructor() {
    if (!this.swUpdate.isEnabled) {
      console.warn('[PWA] Service Worker is not enabled.');
      return;
    }

    this.initializeUpdateChecks();
    this.listenForVersionUpdates();
    this.handleUnrecoverableErrors();
  }

  /**
   * Starts periodic update checks after app stabilization.
   */
  private initializeUpdateChecks(): void {
    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable === true));

    const interval$ = interval(
      hoursToMilliseconds(SettingConst.PWA_CHECK_FOR_UPDATES_INTERVAL_HOURS)
    );

    const updateCheck$ = concat(appIsStable$, interval$);

    updateCheck$.subscribe(() => this.checkForUpdates());
  }

  /**
   * Manually triggers service worker update check.
   */
  private async checkForUpdates(): Promise<void> {
    try {
      const hasUpdate = await this.swUpdate.checkForUpdate();

      console.log(hasUpdate ? '[PWA] New version detected.' : '[PWA] Application is up to date.');
    } catch (error) {
      console.error('[PWA] Update check failed:', error);
    }
  }

  /**
   * Subscribes to service worker version lifecycle events.
   */
  private listenForVersionUpdates(): void {
    this.swUpdate.versionUpdates.subscribe((event) => {
      switch (event.type) {
        case 'VERSION_DETECTED':
          console.log(`[PWA] Downloading new version: ${event.version.hash}`);
          break;

        case 'VERSION_READY':
          this.handleVersionReady(event);
          break;

        case 'VERSION_INSTALLATION_FAILED':
          console.error(`[PWA] Failed to install version ${event.version.hash}:`, event.error);
          break;

        case 'NO_NEW_VERSION_DETECTED':
          console.log(`[PWA] No new version found (${event.version.hash})`);
          break;
      }
    });
  }

  /**
   * Handles when a new version is ready.
   */
  private handleVersionReady(event: VersionReadyEvent): void {
    console.log(`[PWA] Current version: ${event.currentVersion.hash}`);
    console.log(`[PWA] New version ready: ${event.latestVersion.hash}`);

    if (this.promptUserForUpdate()) {
      this.activateUpdate();
    }
  }

  /**
   * Prompts user for update confirmation.
   * Replace with custom UI (Snackbar/Modal) in production.
   */
  private promptUserForUpdate(): boolean {
    return confirm('A new version is available. Update now?');
  }

  /**
   * Activates the new version and reloads the app.
   */
  private activateUpdate(): void {
    this.reloadApp();
  }

  /**
   * Reloads the application (extracted for testing).
   */
  reloadApp(): void {
    window.location.reload();
  }

  /**
   * Handles unrecoverable service worker errors.
   */
  private handleUnrecoverableErrors(): void {
    this.swUpdate.unrecoverable.subscribe((event) => {
      console.error('[PWA] Unrecoverable error:', event.reason);

      alert('An unexpected error occurred. Please reload the application.');
    });
  }
}
