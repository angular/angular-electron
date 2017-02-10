/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable, NgZone, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable'
import {ElectronMessageBus, MessageBusSink, MessageBusSource} from './message_bus';
import * as electron from 'electron'



export class ElectronIpcMessageBusSink implements MessageBusSink {
  private _zone: NgZone;
  private _channels: {[key: string]: _Channel} = {};
  private _messageBuffer: Array<Object> = [];

  constructor() {}

  attachToZone(zone: NgZone): void {
    this._zone = zone;
    this._zone.runOutsideAngular(
        () => { this._zone.onStable.subscribe({next: () => { this._handleOnEventDone(); }}); });
  }

  initChannel(channel: string, runInZone: boolean = true): void {
    if (this._channels.hasOwnProperty(channel)) {
      throw new Error(`${channel} has already been initialized`);
    }

    const emitter = new EventEmitter(false);
    const channelInfo = new _Channel(emitter, runInZone);
    this._channels[channel] = channelInfo;
    emitter.subscribe((data: Object) => {
      const message = {channel: channel, message: data};
      if (runInZone) {
        this._messageBuffer.push(message);
      } else {
        this._sendMessages([message]);
      }
    });
  }

  to(channel: string): EventEmitter<any> {
    if (this._channels.hasOwnProperty(channel)) {
      return this._channels[channel].emitter;
    } else {
      throw new Error(`${channel} is not set up. Did you forget to call initChannel?`);
    }
  }

  private _handleOnEventDone() {
    if (this._messageBuffer.length > 0) {
      this._sendMessages(this._messageBuffer);
      this._messageBuffer = [];
    }
  }

  private _sendMessages(messages: Array<Object>) { messages.forEach(message => console.log(message['message'])) }
}

export class ElectronIpcMessageBusSource implements MessageBusSource {
  private _zone: NgZone;
  private _channels: {[key: string]: _Channel} = {};

  constructor() {

  }

  attachToZone(zone: NgZone) { this._zone = zone; }

  initChannel(channel: string, runInZone: boolean = true) {
    if (this._channels.hasOwnProperty(channel)) {
      throw new Error(`${channel} has already been initialized`);
    }

    const emitter = new Observable(obs => {
      electron.ipcMain.on(channel, (ev) => obs.next(obs))
    });
    const channelInfo = new _Channel(emitter, runInZone);
    this._channels[channel] = channelInfo;
  }

  from(channel: string): EventEmitter<any> {
    if (this._channels.hasOwnProperty(channel)) {
      return this._channels[channel].emitter;
    } else {
      throw new Error(`${channel} is not set up. Did you forget to call initChannel?`);
    }
  }

  private _handleMessages(ev: MessageEvent): void {
    const messages = ev.data;
    for (let i = 0; i < messages.length; i++) {
      this._handleMessage(messages[i]);
    }
  }

  private _handleMessage(data: any): void {
    const channel = data.channel;
    if (this._channels.hasOwnProperty(channel)) {
      const channelInfo = this._channels[channel];
      if (channelInfo.runInZone) {
        this._zone.run(() => { channelInfo.emitter.emit(data.message); });
      } else {
        channelInfo.emitter.emit(data.message);
      }
    }
  }
}

/**
 * A TypeScript implementation of {@link MessageBus} for communicating via JavaScript's
 * postMessage API.
 */
@Injectable()
export class ElectronIpcMessageBus implements ElectronMessageBus {
  constructor(public sink: ElectronIpcMessageBusSink, public source: ElectronIpcMessageBusSource) {}

  attachToZone(zone: NgZone): void {
    this.source.attachToZone(zone);
    this.sink.attachToZone(zone);
  }

  initChannel(channel: string, runInZone: boolean = true): void {
    this.source.initChannel(channel, runInZone);
    this.sink.initChannel(channel, runInZone);
  }

  from(channel: string): EventEmitter<any> { return this.source.from(channel); }

  to(channel: string): EventEmitter<any> { return this.sink.to(channel); }
}

/**
 * Helper class that wraps a channel's {@link EventEmitter} and
 * keeps track of if it should run in the zone.
 */
class _Channel {
  constructor(public emitter: any, public runInZone: boolean) {}
}

export function createMainRenderBus(ngZone:NgZone){
  let sink = new ElectronIpcMessageBusSink();
  let source = new ElectronIpcMessageBusSource();
  let bus = new ElectronIpcMessageBus(sink, source);
  bus.attachToZone(ngZone)
  return bus;
}
