import {NgModule, Component, ApplicationRef, Input} from '@angular/core'
import {ElectronAppModule} from '../platform-electron'

@Component({
  selector: 'demo-app',
  template: 'hello world'
})
export class DemoAppView {
  @Input() foo: string;
}


@NgModule({
  declarations: [DemoAppView],
  entryComponents: [DemoAppView],
  imports: [ElectronAppModule]
})
export class ElectronDemoApp {
  ngDoBootstrap(applicationRef:ApplicationRef){
    applicationRef.bootstrap(DemoAppView)
  }
}
