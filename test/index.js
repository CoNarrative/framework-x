"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createStoreTyped_1 = require("../src/createStore");
const myevt = { 'evt1': 'evt-1111' };
const myargs = {
    state: { db: { foo: 42 } },
    fx: {
        'foo': (x, y) => {
            return null;
        },
    },
    events: myevt
};
const foo = createStoreTyped_1.createStore(myargs);
foo.regEventFx('evt-1111', ({ db: { foo } }, _) => {
    // return [['foo', 42]]
    return { dispatch: [42, 42] };
});
foo.env.fx.dispatch(foo.env, ['a']);
foo.dispatch('a');
foo.regFx('hey', (e, a) => {
    e.fx.eval(foo.env, ['setDb', () => { }]);
});
const myenv = {
    // errorFx: {},
    // eventFx: {},
    events: { "foo": "foo/fooo" },
    // fx: {},
    // reduceFx: {},
    state: { mys: {} }
};
const nullEffect = ({ state, events }, foo) => {
    return;
};
const myFx = { nullEffect };
const identityReduce = ({ state, }, args) => {
    return state;
};
const fxh = createStoreTyped_1.createFxDescriptors(myFx);
const fxDescriptor = fxh.nullEffect('', 42);
const myEfx = {
    'foo/fooo': [({ mys }, args) => {
            // return { nullEffect: ['a', 42] }
            // return [['nullEffect', ['a', 42]]]
            return [fxh.nullEffect('', 42)];
        }]
};
