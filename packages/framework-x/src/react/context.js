import { createContext } from 'react';
// @ts-ignore
if (typeof window !== 'undefined' && window._frameworkXContext) {
    throw new Error('You have multiple Framework-X contexts in this app, which will cause nothing but trouble.');
}
export var Context = createContext(undefined);
if (typeof window !== 'undefined') {
    // @ts-ignore
    window._frameworkXContext = Context;
}
export var subs = {};
