const f = '\u0192'
const fnReplacer = (a, b) => typeof b === 'function' ? f : b
export const prettyStr = (x) =>
  Array.isArray(x)
  ? JSON.stringify(x, fnReplacer)
        .replace(/,/g, ', ')
        .replace(new RegExp(`"(${f})"`, 'g'), '$1')
  : JSON.stringify(x, fnReplacer, 2)
        .replace(new RegExp(`"(${f})"`, 'g'), '$1')
