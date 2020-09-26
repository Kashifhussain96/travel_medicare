import EventEmitter from 'events';
import {safeGet} from "./index";

let emitter = new EventEmitter();
let allEvents = {};
let allListeners = {};

export function addListener(listenerName, eventName, callback, listenAlways = false) {

    function createListener() {

        let name = safeGet(allListeners[listenerName], 'name');

        // Don't add duplicate listeners
        if (name === eventName) {
            return false;
        }

        return true;
    }

    let hasEvent = allEvents.hasOwnProperty(eventName);

    // Event already triggered or has values??
    if (hasEvent) {
        callback(allEvents[eventName]);

        if (listenAlways) {

            if (createListener()) {
                // Create new fresh listener
                allListeners[listenerName] = {
                    name: eventName,
                    listener: callback
                };
                emitter.addListener(eventName, callback);
            }
        }

        return;
    }

    // Create new listener and listen for the event
    if (createListener()) {
        let listener = (data) => {
            callback(data);

            if (!listenAlways) {
                emitter.removeListener(eventName, listener);
            }
        };

        // Create new fresh listener
        allListeners[listenerName] = {
            name: eventName,
            listener: listener
        };
        emitter.addListener(eventName, listener);
    }
}

export function removeAllListeners() {
    allEvents = {};
    allListeners = {};
    emitter.removeAllListeners();

}

export function removeEvent(eventName) {
    delete allEvents[eventName];
}

export function removeListener(listenerName) {
    let name = safeGet(allListeners[listenerName], 'name');
    let listener = safeGet(allListeners[listenerName], 'listener');
    if (name && listener) {
        emitter.removeListener(name, listener);
        delete allEvents[name];
        delete allListeners[listenerName];

    }
}

export function removeListeners(...listenerNames) {
    if (listenerNames) {
        listenerNames.forEach((listenerName) => {
            removeListener(listenerName);
        })
    }
}

export function emit(eventName, data) {
    allEvents[eventName] = data;
    emitter.emit(eventName, data);
}

export const events = {
   load : 'load'
};
