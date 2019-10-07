const TOOL_NAME = '[framework-x-redux-devtools-middleware]'
const DEBUG = false
const PAGE_SOURCE = '@devtools-page'
const EXTENSION_SOURCE = '@devtools-extension'


const libConfig = {
  name: '[framework-x] ' + (typeof document === 'undefined' ? '' : document.title),
  features: {
    jump: true,
    skip: false,
    dispatch: true
  }
}

const noExtensionFallbackMiddleware = () => {
  console.warn(`${TOOL_NAME} You are trying to use redux-devtools without the extension installed.`)
  return () => {}
}

const makeFrameworkXEventListener = ctx => (env, event) => {
  ctx.env = Object.assign({}, env)
  notifyReduxDevtools(ctx, event)
}

const init = ({ instanceId = 1, maxAge = 50 } = {}) => {
  let ctx = {
    started: false,
    eventBuffer: [],
    actionId: 0,
    instanceId,
    maxAge
  }
  reduxDevtoolsMessage({
    type: 'INIT_INSTANCE',
    instanceId,
    source: PAGE_SOURCE
  })
  startListenToReduxDevtools(ctx)
  return makeFrameworkXEventListener(ctx)
}


const reduxDevtoolsMessage = msg =>
  typeof window !== 'undefined'
  ? window.postMessage(msg, '*')
  : null

const notifyReduxDevtools = (ctx, event) => {
  if (!ctx.started) {
    ctx.eventBuffer.push(event)
    return
  }

  const action = Object.assign({ type: event[0] }, event[1] ? { payload: event[1] } : {})

  reduxDevtoolsMessage({
    type: 'ACTION',
    action: JSON.stringify({
      type: 'PERFORM_ACTION',
      action,
      timestamp: Date.now()
    }),
    instanceId: ctx.instanceId,
    maxAge: ctx.maxAge,
    nextActionId: ++ctx.actionId,
    libConfig,
    payload: JSON.stringify(ctx.env.state.db),
    source: PAGE_SOURCE
  })
}

const makeReduxDevtoolsHandler = ctx => message => {
  if (message.data && message.data.source !== EXTENSION_SOURCE) return
  const { type, payload } = message.data
  DEBUG && console.log(type, message.data)
  switch (type) {
    case 'START': {
      ctx.started = true
      ctx.eventBuffer.forEach(x => notifyReduxDevtools(ctx, x))
      delete ctx.eventBuffer
      return
    }
    case 'STOP': {
      ctx.started = false
      return
    }
    case 'ACTION': {
      // const expression = payload.replace('this.', '').split('(')
      // if (typeof actions[expression[0]] === 'function') {
      //   const args = expression[1] ? expression[1].slice(0, -1).split(',') : []
      //   actions[expression[0]](...args)
      //   return
      // }
      console.warn(`${TOOL_NAME} The ACTION '${payload}' was not recognized.`)
      return
    }
    case 'DISPATCH': {
      switch (payload.type) {
        case 'COMMIT': {
          break // ?
        }
        case 'RESET': {
          ctx.env.fx.setDb(ctx.env, {})
          return
        }
        case 'ROLLBACK':
        case 'JUMP_TO_STATE':
        case 'JUMP_TO_ACTION': {
          const newState = message.data.state && JSON.parse(message.data.state)
          ctx.env.fx.setDb(ctx.env, newState)
          return
        }
        default:
          break
      }
      break
    }
    default:
      break
  }
  console.warn(`${TOOL_NAME} The action ${type}.${payload
                                                  ? payload.type
                                                  : 'N/A'} is unsupported`)
}

const startListenToReduxDevtools = ctx =>
  typeof window !== 'undefined'
  && window.addEventListener('message', makeReduxDevtoolsHandler(ctx))

const extension = typeof window !== 'undefined' && (window.__REDUX_DEVTOOLS_EXTENSION__ ||
                                                    window.devToolsExtension)

export default extension ? init : noExtensionFallbackMiddleware

