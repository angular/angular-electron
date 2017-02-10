import {NgModule, ModuleWithProviders, InjectionToken} from '@angular/core'

import {ElectronMainModule} from './electron_main'
import {ElectronRenderClient} from './electron_render'

export const ELECTRON_WINDOW = new InjectionToken('ELECTRON_WINDOW');

@NgModule()
export class ElectronModule {
  static forMain(){
    return {
      ngModule: ElectronMainModule,
      providers: []
    }
  }
  static provideWindow(id:string, options:Electron.BrowserWindowOptions){
    return { provide: ELECTRON_WINDOW, useValue: {id,options}}
  }
}
