var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _JellyCommands_client, _JellyCommands_options;
import { EventManager } from '../events/EventManager';
import { defaults, schema } from './options';
export class JellyCommands {
    constructor(client, options = {}) {
        _JellyCommands_client.set(this, void 0);
        _JellyCommands_options.set(this, void 0);
        if (!client)
            throw new SyntaxError('Expected a instance of Discord.Client, recieved none');
        __classPrivateFieldSet(this, _JellyCommands_client, client, "f");
        const { error, value } = schema.validate(Object.assign(defaults, options));
        if (error)
            throw error.annotate();
        else
            __classPrivateFieldSet(this, _JellyCommands_options, value, "f");
        this.eventManager = new EventManager(this);
    }
    get client() {
        return __classPrivateFieldGet(this, _JellyCommands_client, "f");
    }
    get options() {
        return Object.freeze({ ...__classPrivateFieldGet(this, _JellyCommands_options, "f") });
    }
    get events() {
        return this.eventManager;
    }
}
_JellyCommands_client = new WeakMap(), _JellyCommands_options = new WeakMap();
