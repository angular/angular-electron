import {NgModule, ErrorHandler, Injectable, InjectionToken, Injector, NgZone, PLATFORM_INITIALIZER, PlatformRef, Provider, RootRenderer, Testability, createPlatformFactory, isDevMode, platformCore} from '@angular/core';
import {AnimationDriver, DOCUMENT, EVENT_MANAGER_PLUGINS, EventManager, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';

export const platformElectronRender = createPlatformFactory(platformCore, 'platformElectronRender');

@Injectable()
export class ElectronRenderClient {

}

@NgModule({
  providers: [
    ElectronRenderClient
  ]
})
export class ElectronRenderModule {}
