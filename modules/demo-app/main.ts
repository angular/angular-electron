import 'zone.js/dist/zone-node'
import 'zone.js/dist/long-stack-trace-zone'
import {platformElectronApp, whenReady} from '../platform-electron'
import {ElectronDemoAppNgFactory} from '../ngfactory/modules/demo-app/demo-app.ngfactory'

whenReady(() => {
  const platform = platformElectronApp();
  platform.bootstrapModuleFactory(ElectronDemoAppNgFactory);
});
