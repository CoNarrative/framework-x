const toolName = '[react-waterfall-redux-devtools-middleware]';
const DEBUG = false;

const extension = typeof window !== 'undefined' && (window.__REDUX_DEVTOOLS_EXTENSION__
                                                    || window.devToolsExtension);
const pageSource = '@devtools-page';
const extensionSource = '@devtools-extension';
const libConfig = {
  name: '[react-waterfall] ' + document.title,
  features: {
    jump: true,
    skip: false,
    dispatch: true,
  },
};
const noExtensionFallbackMiddleware = (/*store, self*/) => {
  DEBUG
  && console.warn(`${toolName} You are trying to use redux-devtools without the extension installed.`);
  return (/*action*/) => {};
};

const reduxDevTools = ({ instanceId = 1, maxAge = 50 } = {}) => !extension
  ? noExtensionFallbackMiddleware
  : (store, self, actions) => {

    const mwState = {
      started: false,
      queuedActions: [],
    };

    window.addEventListener('message', message => {
      if (message.data && message.data.source !== extensionSource) return;
      const { type, payload } = message.data;
      // console.log('<-', type, message.data)
      DEBUG && console.log(type, message.data);
      switch (type) {
        case 'START': {
          mwState.started = true;
          let actionArgs = mwState.queuedActions.shift();
          while (actionArgs) {
            mockReduxDevToolsAction.apply(window, actionArgs);
            actionArgs = mwState.queuedActions.shift()
          }
          return;
        }
        case 'STOP': {
          mwState.started = false;
          return;
        }
        case 'ACTION': {
          const expression = payload.replace('this.', '').split('(');
          if (typeof actions[expression[0]] === 'function') {
            const args = expression[1] ? expression[1].slice(0, -1).split(',') : [];
            actions[expression[0]](...args);
            return;
          }
          console.warn(`${toolName} The ACTION '${payload}' was not recognized.`);
          return;
        }
        case 'DISPATCH': {
          switch (payload.type) {
            case 'COMMIT': {
              break; // ?
            }
            case 'RESET': {
              self.setState(store.initialState);
              return;
            }
            case 'ROLLBACK':
            case 'JUMP_TO_STATE':
            case 'JUMP_TO_ACTION': {
              const newState = message.data.state && JSON.parse(message.data.state);
              self.setState(newState);
              return;
            }
            default:
              break;
          }
          break;
        }
        default:
          break;
      }
      console.warn(`${toolName} The action ${type}.${payload
        ? payload.type
        : 'N/A'} is unsupported`);
    });

    let actionId = 0;
    const getNextActionId = () => ++actionId;
    const mockReduxDevToolsAction = (type, args, nextState) => {
      if (!mwState.started) {
        mwState.queuedActions.push([type, args, nextState]);
        return;
      }
      // console.log('->', type, args, payload)
      window.postMessage({
        type: 'ACTION',
        action: JSON.stringify({
          type: "PERFORM_ACTION",
          action: {
            ...args,
            type,
          },
          timestamp: Date.now(),
        }),
        instanceId,
        maxAge,
        nextActionId: getNextActionId(),
        libConfig,
        payload: nextState,
        source: pageSource,
      }, '*');
    };

    window.postMessage({
      type: 'INIT_INSTANCE',
      instanceId,
      source: pageSource,
    }, '*');
    mockReduxDevToolsAction('@@INIT', store.initialState);

    return (type, args, rawEffects, count) => {
      const formattedSubs = Object
      .entries(self.subs)
      .reduce((acc, [name, subs]) => {
        const { display, counters } = acc
        subs.forEach(sub => {
          let key = sub.merged.id
          if (!key) {
            counters[name] = counters[name] || 0
            counters[name]++
            key = counters[name]
          }
          display[`${name}-${key}`] = sub.merged
        })
        return acc
      }, { display: {}, counters: {} })

      //get rid of value in db effect
      const effects = Object.entries(rawEffects || {}).reduce((acc, [key, value]) => {
        acc[key] = key === 'db' ? '-' : value
        return acc
      }, {})
      const enhArgs = Object.assign({}, args)
      if (enhArgs.type) {
        enhArgs.__type = enhArgs.type
      }
      if (Object.keys(effects).length > 0) {
        enhArgs['EFFECTS'] = effects
      }
      const finalType = count === 0 ? type : `${type} [${count + 1}]`
      mockReduxDevToolsAction(finalType, enhArgs, JSON.stringify(
        {
          STATE: self.state,
          SUBS: formattedSubs.display,
        }));
    };
  };

export default reduxDevTools;
