import {platformElectronRender} from '../platform-electron/src/electron_render'

function main(){
  console.log('starting renderer')
  const platform = platformElectronRender();
}

main();
