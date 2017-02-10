import {NgModule, Component, ApplicationRef, Input, ComponentFactoryResolver} from '@angular/core'
import {ElectronMainModule, ElectronAppRef, ElectronModule} from '../platform-electron'


@Component({
  selector: 'demo-app',
  templateUrl: './demo-app.html',
  providers: [

  ]
})
export class DemoAppView {
  @Input() foo: string;
}


@NgModule({
  declarations: [DemoAppView],
  entryComponents: [DemoAppView],
  imports: [
    ElectronModule.forMain(),

  ],
  providers: [
    ElectronModule.provideWindow('main', {})
  ]
})
export class ElectronDemoApp {
  constructor(public electronApp:ElectronAppRef){}
  ngDoBootstrap(applicationRef:ApplicationRef){
    const appView = applicationRef.bootstrap(DemoAppView);


  }
}
