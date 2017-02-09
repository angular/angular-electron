import * as electron from 'electron'
import {CommonModule} from '@angular/common';
import {ServerModule} from '@angular/platform-server'
import {APP_INITIALIZER, ApplicationModule, ErrorHandler, NgModule, NgZone, PlatformRef, Provider, RootRenderer, createPlatformFactory, platformCore} from '@angular/core';
import {ElectronRootRenderer} from './app/electron_app_renderer'
import {BROWSER_SANITIZATION_PROVIDERS} from './private_import_platform-browser';

export const platformElectronApp = createPlatformFactory(platformCore, 'platformElectronApp');

export function whenReady(fn){
  electron.app.once('ready', (...args) => {
    fn.apply(args)
  });
}

export function setupElectronApp(){

  return 'ok'
}
export function errorHandler(): ErrorHandler {
  return new ErrorHandler();
}

export function setUpRenderFlushing(zone: NgZone, renderer: ElectronRootRenderer) {
  return () => {
    zone.onStable.subscribe(() => {
      console.group("render");

      console.groupEnd();
    });
  };
}


@NgModule({
  providers: [
    BROWSER_SANITIZATION_PROVIDERS,
    {provide: APP_INITIALIZER, multi: true, useFactory: setUpRenderFlushing, deps: [NgZone, RootRenderer]},
    { provide: ErrorHandler, useFactory: errorHandler},
    { provide: APP_INITIALIZER, useValue: setupElectronApp, multi: true},
    { provide: RootRenderer, useClass: ElectronRootRenderer}
  ],
  exports: [CommonModule, ApplicationModule]
})
export class ElectronAppModule {}
