import * as R from 'ramda';
import { evt } from '../eventTypes';
import { regEventFx, regFx } from '../store';
import { updateIn } from '../util';
regFx('notification', (env, { type, message, duration = 900 }) => {
    const { fx: { dispatch } } = env;
    const id = type + '/' + performance.now();
    const timeout = setTimeout(() => dispatch(env, [evt.HIDE_NOTIFICATION, { id }]), duration);
    dispatch(env, [evt.SHOW_NOTIFICATION, { id, type, message, timeout }]);
});
regFx('clearTimeout', (_, n) => {
    clearTimeout(n);
});
regEventFx(evt.SHOW_NOTIFICATION, ({ db }, { id, type, message, timeout }) => [
    ['db', updateIn(['notifications'], R.append({ id, type, message, timeout }))]
]);
regEventFx(evt.HIDE_NOTIFICATION, ({ db }, { id }) => {
    const notification = R.find(x => x.id === id, R.path(['notifications'], db));
    return [
        ['db', updateIn(['notifications'], R.reject(R.propEq('id', id)))],
        ['clearTimeout', notification.timeout]
    ];
});
