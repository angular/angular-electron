# Angular Electron

Electron Platform for Angular 2. Work in progress.

## Testing the demo

Make sure to have NodeJS version 5.x.x installed.

Start off by running `npm run setup`. That command will install the dependencies and the required TypeScript typings (using the [typings](https://www.npmjs.com/package/typings) package).

Since the demo application is not apart of the plugin, angular2 and
its peer dependencies also need to be installed manually via npm. Run
the following command to install everything required for the demo: `npm run setup-demo`.

That command will install the following:
* angular2
* es6-promise
* es6-shim
* reflect-metadata
* rxjs
* zone.js

Then execute `npm start` to see the demo application in action!
