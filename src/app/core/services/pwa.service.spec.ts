import {TestBed} from '@angular/core/testing';
import {ApplicationRef} from '@angular/core';
import {SwUpdate, VersionReadyEvent} from '@angular/service-worker';
import {Subject, of} from 'rxjs';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';

import {PwaService} from './pwa.service';

describe('PwaService (Vitest)', () => {
  let service: PwaService;

  let versionUpdates$: Subject<unknown>;
  let unrecoverable$: Subject<{reason: string}>;
  let confirmMock: ReturnType<typeof vi.fn>;
  let alertMock: ReturnType<typeof vi.fn>;

  const createSwUpdateMock = () => ({
    isEnabled: true,
    checkForUpdate: vi.fn().mockResolvedValue(true),
    versionUpdates: versionUpdates$.asObservable(),
    unrecoverable: unrecoverable$.asObservable()
  });

  beforeEach(() => {
    versionUpdates$ = new Subject();
    unrecoverable$ = new Subject();

    alertMock = vi.fn();
    confirmMock = vi.fn(() => false);
    vi.stubGlobal('alert', alertMock);
    vi.stubGlobal('confirm', confirmMock);

    TestBed.configureTestingModule({
      providers: [
        PwaService,
        {
          provide: SwUpdate,
          useValue: createSwUpdateMock()
        },
        {
          provide: ApplicationRef,
          useValue: {
            isStable: of(true)
          }
        }
      ]
    });

    service = TestBed.inject(PwaService);
  });

  afterEach(() => {
    versionUpdates$.complete();
    unrecoverable$.complete();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ---------------------------
  // Update Check
  // ---------------------------
  it('should initialize update checks after service creation', () => {
    const swUpdate = TestBed.inject(SwUpdate);

    // Service constructor initializes and triggers update checks
    expect(swUpdate.checkForUpdate).toHaveBeenCalled();
  });

  // ---------------------------
  // Version Events
  // ---------------------------
  it('should handle VERSION_DETECTED', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    versionUpdates$.next({
      type: 'VERSION_DETECTED',
      version: {hash: '123'}
    });

    expect(logSpy).toHaveBeenCalledWith('[PWA] Downloading new version: 123');
  });

  it('should reload when user confirms update', () => {
    confirmMock.mockReturnValue(true);

    // Spy on reloadApp and mock it to prevent actual reload
    const reloadSpy = vi.spyOn(service, 'reloadApp').mockImplementation(() => undefined);

    const event: VersionReadyEvent = {
      type: 'VERSION_READY',
      currentVersion: {hash: 'old'},
      latestVersion: {hash: 'new'}
    };

    versionUpdates$.next(event);

    expect(confirmMock).toHaveBeenCalledWith('A new version is available. Update now?');
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should not reload if user cancels update', () => {
    confirmMock.mockReturnValue(false);

    const event: VersionReadyEvent = {
      type: 'VERSION_READY',
      currentVersion: {hash: 'old'},
      latestVersion: {hash: 'new'}
    };

    versionUpdates$.next(event);

    expect(confirmMock).toHaveBeenCalledWith('A new version is available. Update now?');
  });

  // ---------------------------
  // Unrecoverable Error
  // ---------------------------
  it('should handle unrecoverable errors', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    unrecoverable$.next({reason: 'fatal'});

    expect(errorSpy).toHaveBeenCalledWith('[PWA] Unrecoverable error:', 'fatal');
    expect(alertMock).toHaveBeenCalled();
  });

  // ---------------------------
  // SW Disabled
  // ---------------------------
  it('should warn if service worker is disabled', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        PwaService,
        {
          provide: SwUpdate,
          useValue: {
            isEnabled: false,
            versionUpdates: of(),
            unrecoverable: of()
          }
        },
        {
          provide: ApplicationRef,
          useValue: {isStable: of(true)}
        }
      ]
    });

    TestBed.inject(PwaService);

    expect(warnSpy).toHaveBeenCalledWith('[PWA] Service Worker is not enabled.');
  });
});
