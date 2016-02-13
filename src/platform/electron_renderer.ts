import * as electron from 'electron';
import {ElectronMessageBus, ElectronMessageBusSink, ElectronMessageBusSource, ELECTRON_READY} from './electron_message_bus';
import {MessageBus} from 'angular2/src/web_workers/shared/message_bus';
import {APP_INITIALIZER, provide, platform} from 'angular2/core';
import {Injector, Injectable, Provider} from 'angular2/src/core/di';
import {MessageBasedRenderer} from 'angular2/src/web_workers/ui/renderer';
import {MessageBasedXHRImpl} from 'angular2/src/web_workers/ui/xhr_impl';
import {
  WORKER_RENDER_APPLICATION_COMMON,
  WORKER_RENDER_MESSAGING_PROVIDERS,
  WORKER_SCRIPT,
  WORKER_RENDER_PLATFORM,
  initializeGenericWorkerRenderer
} from './electron_renderer_common';
import {BaseException} from 'angular2/src/facade/exceptions';
import {CONST_EXPR} from 'angular2/src/facade/lang';

/**
 * Wrapper class that exposes the Worker
 * and underlying {@link MessageBus} for lower level message passing.
 */
@Injectable()
export class WebWorkerInstance {
  public worker: Worker;
  public bus: MessageBus;

  /** @internal */
  public init(worker: Worker, bus: MessageBus) {
    this.worker = worker;
    this.bus = bus;
  }
}

/**
 * An array of providers that should be passed into `application()` when initializing a new Worker.
 */
export const WORKER_RENDER_APPLICATION: Array<any /*Type | Provider | any[]*/> = CONST_EXPR([
  WORKER_RENDER_APPLICATION_COMMON,
  WebWorkerInstance,
  new Provider(APP_INITIALIZER,
               {
                 useFactory: (injector) => () => initWebWorkerApplication(injector),
                 multi: true,
                 deps: [Injector]
               }),
  new Provider(MessageBus, {useFactory: initMessageBus})
]);

function initMessageBus(){
  var sink = new ElectronMessageBusSink(electron.ipcRenderer);
  var source = new ElectronMessageBusSource(electron.ipcRenderer);
  var bus = new ElectronMessageBus(sink, source);
  return bus;
}

function initWebWorkerApplication(injector: Injector): void {
  initializeGenericWorkerRenderer(injector);
  
}

export const bootstrapElectronRenderer = () => {
  electron.ipcRenderer.sendSync(ELECTRON_READY);
  platform([WORKER_RENDER_PLATFORM]).application([WORKER_RENDER_APPLICATION])
}
