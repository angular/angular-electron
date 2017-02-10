import {NgZone, EventEmitter} from '@angular/core'

export abstract class ElectronMessageBus implements MessageBusSink, MessageBusSource {
  initChannel(channel: string, runInZone: boolean): void {}

  /**
   * Assigns this source to the given zone.
   * Any channels which are initialized with runInZone set to true will emit events that will be
   * executed within the given zone.
   */
  attachToZone(zone: NgZone): void {}

  /**
   * Returns an {@link EventEmitter} that emits every time a message
   * is received on the given channel.
   */
  from(channel: string): EventEmitter<any> { throw 'unimplemented'}
  to(channel: string): EventEmitter<any> { throw 'unimplemented'}
}

/**
 * @experimental WebWorker support in Angular is currenlty experimental.
 */
export interface MessageBusSource {
  /**
   * Sets up a new channel on the MessageBusSource.
   * MUST be called before calling from on the channel.
   * If runInZone is true then the source will emit events inside the angular zone.
   * if runInZone is false then the source will emit events inside the global zone.
   */
  initChannel(channel: string, runInZone: boolean): void;

  /**
   * Assigns this source to the given zone.
   * Any channels which are initialized with runInZone set to true will emit events that will be
   * executed within the given zone.
   */
  attachToZone(zone: NgZone): void;

  /**
   * Returns an {@link EventEmitter} that emits every time a message
   * is received on the given channel.
   */
  from(channel: string): EventEmitter<any>;
}

/**
 * @experimental WebWorker support in Angular is currenlty experimental.
 */
export interface MessageBusSink {
  /**
   * Sets up a new channel on the MessageBusSink.
   * MUST be called before calling to on the channel.
   * If runInZone is true the sink will buffer messages and send only once the zone exits.
   * if runInZone is false the sink will send messages immediatly.
   */
  initChannel(channel: string, runInZone: boolean, sendSync: boolean): void;

  /**
   * Assigns this sink to the given zone.
   * Any channels which are initialized with runInZone set to true will wait for the given zone
   * to exit before sending messages.
   */
  attachToZone(zone: NgZone): void;

  /**
   * Returns an {@link EventEmitter} for the given channel
   * To publish methods to that channel just call next on the returned emitter
   */
  to(channel: string): EventEmitter<any>;
}
