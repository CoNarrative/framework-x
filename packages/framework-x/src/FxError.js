export const fxErrorTypes = [
    'event-fx/unhandled',
    'fx/unhandled',
    'fx.dispatch/arguments',
    'fx.db/arguments'
];
export class FxError extends Error {
    constructor(type, data) {
        super();
        this.namespace = 'framework-x';
        this.name = 'error';
        this.isRecoverable = true;
        this.type = type;
        this.data = data;
    }
}
