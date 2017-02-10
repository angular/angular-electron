import {Inject, Injector, Injectable, PlatformRef, ApplicationRef, ComponentFactoryResolver} from '@angular/core'
import {ELECTRON_API} from './api'
import * as electron from 'electron'
import {Observable} from 'rxjs/Observable'

export class ElectronAppRef {
  app = electron.app
  appReady:Promise<Electron.App> =
    new Promise((resolve, reject) => {
      electron.app.once('ready', () => resolve(electron.app));
    });
  constructor(public appRef:PlatformRef){

  }
  createWindow(options){
     this.appReady.then(app => {
       console.log(app.getAppPath());
     })
  }



  bootstrapComponent(componentType, resolver){
    console.log('boostrapping')
    //let factory = resolver.resolveComponentFactory(componentType);
    //console.log(factory.selector)
    //factory.create(this.injector, [], {foo: 'bar'})
  }
}
