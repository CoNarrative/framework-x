"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const checkType = (op, type) => {
    if (typeof (type) !== 'string')
        throw new Error(`${op} requires a string as the fx key`);
    if (type.length === 0)
        throw new Error(`${op} fx key cannot be a zero-length string`);
};
exports.regFx = (env, type, fn) => {
    env.fx[type] = fn;
};
exports.regEventFx = (env, type, fn) => {
    env.eventFx[type] = [...env.eventFx[type] || [], fn];
};
exports.regReduceFx = (env, type, fn) => {
    env.reduceFx[type] = fn;
};
/**
 * Evaluates an effect definition using the handler defined in the provided environment.
 * May perform computation that alters the environment. Returns the result of the effect handler.
 * @param env
 * @param fxName
 * @param args
 * @returns {*}
 */
exports.evalFx = (env, [fxName, args]) => {
    const effect = env.fx[fxName];
    if (!effect) {
        throw new Error(`No fx handler for effect "${fxName}". Try registering a handler using "regFx('${fxName}', ({ effect }) => ({...some side-effect})"`);
    }
    return effect(env, args);
};
/**
 * Returns a list of effect definitions called with f
 * with the result of calling f on the effect definitions or the effect definition
 * unchanged if the result is null or undefined
 * @param env
 * @param f
 * @param effects
 * @returns {*}
 */
const applyFx = (env, f, effects) => {
    return effects.reduce((a, effect) => {
        const ret = f(env, effect);
        a.push(ret != null ? ret : effect);
        return a;
    }, []);
};
const applyFxImpure = (env, f, acc) => {
    const len = acc.queue.length;
    const q = Object.assign({}, acc.queue);
    for (let i = 0; i < len; i++) {
        const effect = q[i];
        f(env, effect);
        acc.stack.push(effect);
        acc.queue.shift();
    }
};
const setDb = (x, newStateOrReducer) => {
    if (typeof newStateOrReducer !== 'function') {
        x.state.db = newStateOrReducer;
    }
    else {
        x.state.db = newStateOrReducer(x.state.db);
        if (typeof x.state.db === 'function') {
            throw new Error('db fxReg request was a reducer function that returned a function. '
                + 'If you are using ramda, you probably didn\'t finish currying all the args');
        }
    }
};
const createAccum = (env) => ({
    state: Object.assign({}, env.state),
    reductions: [],
    stack: [],
    queue: []
});
/**
 * Reduces an event's effects recursively, modifying the provided accumulator with the results of the execution
 * ReduceFx are called with `acc.state` and pushed to `acc.stack`.
 * All other effects are queued to `acc.queue`.
 * @param env
 * @param acc
 * @param event
 */
const reduceEventEffects = (env, acc, event) => {
    acc.queue.push(['notifyEventListeners', event]);
    const [type, args] = event;
    const eventHandlers = env.eventFx[type];
    if (!eventHandlers)
        throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`);
    eventHandlers.forEach((handler) => {
        const effects = handler(Object.assign({}, acc.state), args);
        if (!effects) {
            return;
        }
        const effectsList = Array.isArray(effects) ? effects : Object.entries(effects);
        effectsList.forEach((effect) => {
            const [k, v] = effect;
            let rfx = env.reduceFx[k];
            if (rfx) {
                const ret = rfx(env, acc, v);
                acc.reductions.push(effect, ret);
            }
            else if (k !== 'dispatch') {
                acc.queue.push(effect);
            }
            else {
                return reduceEventEffects(env, acc, v);
            }
        });
    });
};
const dispatchFx = (env, event) => {
    if (!Array.isArray(event)) {
        throw new Error('fx.dispatch requires an event tuple');
    }
    let acc = createAccum(env);
    try {
        reduceEventEffects(env, acc, event);
        acc.queue.unshift(['setDb', acc.state.db], ['notifyStateListeners']);
        env.fx.applyImpure(env, env.fx.eval, acc);
    }
    catch (e) {
        if (env.errorFx && Object.keys(env.errorFx).length > 0) {
            Object.entries(env.errorFx).forEach(([_, handler]) => {
                handler(env, acc, e);
            });
            return;
        }
        console.error(e);
    }
};
/**
 * Returns a map of functions with typed effect descriptions suitable for returning from EventFx
 *
 * @param fx
 */
exports.createFxDescriptors = (fx) => {
    return Object.entries(fx).reduce((a, [k, _]) => {
        a[k] = (x) => [k, x];
        return a;
    }, {});
};
exports.defaultEnv = () => ({
    state: { db: {} },
    reduceFx: {
        db: ({ fx, }, acc, newStateOrReducer) => {
            fx.setDb(acc, newStateOrReducer);
            return Object.assign({}, acc.state);
        }
    },
    fx: {
        apply: applyFx,
        applyImpure: applyFxImpure,
        setDb,
        // todo.  Eval/all effects could have statically registered other effects if passed in
        eval: exports.evalFx,
        // todo. This could be enriched with event types (would need to pass in)
        // to allow typed event names in return from regEventFx
        dispatch: dispatchFx,
        //todo. @types/reselect
        notifyStateListeners: util_1.derive([
            x => x.dbListeners,
            x => x.state && x.state.db,
        ], (a, b) => {
            a && a.forEach((f) => f(b));
        }),
        // todo. only useful when events
        notifyEventListeners: (env, event) => env.eventListeners.forEach((f) => f(event)),
    },
    errorFx: {
        'dispatch-error': (env, acc, e) => {
            acc.queue.shift();
            env.fx.applyImpure(env, env.fx.eval, acc.queue);
        }
    },
    events: {},
    eventFx: {},
    dbListeners: [],
    eventListeners: [],
});
const mergeEnv = (args) => {
    const defaultEnvValue = exports.defaultEnv();
    if (typeof args !== 'undefined') {
        const merged = Object.entries(defaultEnvValue).reduce((a, [k, v]) => {
            if (defaultEnvValue.hasOwnProperty(k) && args.hasOwnProperty(k)) {
                if (Array.isArray(defaultEnvValue[k])) {
                    a[k] = args[k];
                    return a;
                }
                a[k] = Object.assign({}, defaultEnvValue[k], args[k]);
                return a;
            }
            a[k] = v;
            return a;
        }, {});
        return merged;
    }
    else {
        return defaultEnvValue;
    }
};
exports.createStore = (args) => {
    const env = mergeEnv(args);
    /* Hacked a bit to support redux devtools  */
    env.eventListeners.forEach(m => m({}, {
        setState(state) {
            env.fx.eval(env, ['setDb', state]);
        },
        get subs() {
            return [];
        },
        get state() {
            return env.state.db;
        }
    }, {}));
    return {
        env,
        dispatch: (eventName, args) => {
            env.fx.dispatch(env, args ? [eventName, args] : [eventName]);
        },
        getState: () => env.state.db,
        setState: (newStateOrReducer, notify = true) => {
            env.fx.apply(env, env.fx.eval, [
                ['setDb', newStateOrReducer],
            ].concat(notify ? [['notifyStateListeners']] : []));
        },
        regEventFx: (eventName, fn) => {
            checkType('regEventFx', eventName);
            env.eventFx[eventName] = [...env.eventFx[eventName] || [], fn];
        },
        regFx: (type, fn) => {
            checkType('regFx', type);
            env.fx[type] = fn;
        },
        regReduceFx: (type, fn) => {
            checkType('regReduceFx', type);
            env.reduceFx[type] = fn;
        },
        subscribeToState: f => env.dbListeners.push(f)
    };
};
