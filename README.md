# Angular Electron

Electron Platform for Angular 2. Work in progress.

## Testing the demo

Make sure to have NodeJS version 5.x.x installed.

Start off by running `npm install`.

Then install typings globally:

```
npm install typings -g
```

And then run the `typings install` command in the root directory.

Since the demo application is not apart of the plugin, angular2 and
it's peer dependencies also need to be installed manually via npm. Run
the following command to install everything:

```
npm install angular2@2.0.0-beta.6 \
            es6-promise@^3.0.2 \
            es6-shim@^0.33.3 \
            reflect-metadata@0.1.2 \
            rxjs@5.0.0-beta.0 \
            zone.js@0.5.14
```

Then run `npm run demo` to see the demo application in action!
