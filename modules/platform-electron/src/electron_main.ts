import * as electron from 'electron'
import { CommonModule } from '@angular/common';
import { ServerModule } from '@angular/platform-server'
import { BROWSER_SANITIZATION_PROVIDERS, BrowserDomAdapter, BrowserGetTestability, DomEventsPlugin, DomRootRenderer, DomRootRenderer_, DomSharedStylesHost, HammerGesturesPlugin, KeyEventsPlugin, SharedStylesHost,WebAnimationsDriver, getDOM} from './private_import_platform-browser';
import { NgModuleRef, InjectionToken, APP_INITIALIZER, ComponentFactoryResolver, PLATFORM_INITIALIZER ,APP_BOOTSTRAP_LISTENER, ApplicationModule,ApplicationRef,ErrorHandler, NgModule, NgZone, PlatformRef, Provider, RootRenderer, createPlatformFactory, platformCore, Injector} from '@angular/core';
import { ElectronRootRenderer } from './main/renderer'
import { ElectronRendererManager } from './main/renderer_manager'
import { ELECTRON_API } from './shared/api'
import { ElectronMainDomAdapter } from './main/dom_adapter'
import { ElectronAppRef } from './shared/electron_app_ref'
import { Serializer } from './shared/serializer'
import { RenderStore } from './shared/render_store'
import { ElectronMessageBus, MessageBusSink, MessageBusSource } from './shared/message_bus'
import { ClientMessageBroker, ClientMessageBrokerFactory, ClientMessageBroker_, ClientMessageBrokerFactory_} from './shared/client_message_broker'
import { ServiceMessageBroker, ServiceMessageBroker_, ServiceMessageBrokerFactory, ServiceMessageBrokerFactory_} from './shared/service_message_broker'
import { ElectronIpcMessageBus, createMainRenderBus } from './shared/electron_ipc_message_bus'

export class ElectronPlatformRef implements PlatformRef {
  get destroyed(){ return this._platformRef.destroyed }
  constructor(private _platformRef:PlatformRef){}
  bootstrapModuleFactory(factory):Promise<NgModuleRef<any>>{
    return Promise.resolve(this._platformRef.bootstrapModuleFactory(factory));
  }
  bootstrapModule(moduleType, providers?){
    return this._platformRef.bootstrapModule(moduleType, providers);
  }
  onDestroy(fn){}
  get injector(){
    return this._platformRef.injector;
  }
  destroy(){
    this._platformRef.destroy()
  }
}

export function electronPlatform(providers){
  const platform = platformCore(providers);
  return new ElectronPlatformRef(platform);
}

export const ELECTRON_APP_READY = new InjectionToken('ELECTRON_APP_READY')
export const platformElectronMain = createPlatformFactory(
  electronPlatform,
  'platformElectronMain',
  [
    {provide: ELECTRON_APP_READY, useFactory:whenReady },
    Serializer,
    RenderStore,
    { provide: ELECTRON_API, useValue: electron },
  ]
);

export function createElectronAppRef(platformRef){
  return new ElectronAppRef(platformRef);
}

export function whenReady(  ){
  return new Promise((resolve, reject) => {
    electron.app.once('ready', (...args) => {
      resolve(electron.app)
    });
  });
}

export function initializeElectronPlatform(electronAppRef){

  return function(){
    console.log('initializing electron platform')
  }
}
export function errorHandler(): ErrorHandler {
  return new ErrorHandler();
}

export function waitForElectronAppReady(rootRenderer:ElectronRootRenderer){
  console.log('APP_BOOTSTRAP_LISTENER')
  rootRenderer.createWindow()
  return function startup(ref){
    console.log(ref)
  }
}

export function setUpRenderFlushing(zone: NgZone, renderer: ElectronRootRenderer) {
  ElectronMainDomAdapter.makeCurrent();
  return () => {
    zone.onStable.subscribe(() => {
      console.log('stable')
    });
  };
}


@NgModule({
  imports: [

  ],
  providers: [

    ElectronRootRenderer,
    { provide: RootRenderer, useExisting: ElectronRootRenderer},

    {provide: ElectronMessageBus, useFactory: createMainRenderBus, deps: [NgZone]  },
    {provide: ClientMessageBrokerFactory, useClass: ClientMessageBrokerFactory_},
    {provide: ServiceMessageBrokerFactory, useClass: ServiceMessageBrokerFactory_},

    ElectronRendererManager,
    BROWSER_SANITIZATION_PROVIDERS,
     { provide: ElectronAppRef, useFactory: createElectronAppRef, deps: [PlatformRef]},
    { provide: ErrorHandler, useFactory: errorHandler},
    { provide: APP_BOOTSTRAP_LISTENER, useFactory: waitForElectronAppReady, multi: true, deps: [RootRenderer]},
    { provide: APP_INITIALIZER, multi: true, useFactory: setUpRenderFlushing, deps: [NgZone, RootRenderer]},

  ],
  exports: [CommonModule, ApplicationModule]
})
export class ElectronMainModule {}
