import 'zone.js/dist/zone-node'
import 'zone.js/dist/long-stack-trace-zone'
import {enableProdMode} from '@angular/core'
import {platformElectronMain, whenReady} from '../platform-electron'
import {ElectronDemoAppNgFactory} from '../ngfactory/modules/demo-app/demo-app.ngfactory'
enableProdMode();
const platform = platformElectronMain();

  platform.bootstrapModuleFactory(ElectronDemoAppNgFactory).then(moduleRef => {
    //moduleRef.instance.
  });
