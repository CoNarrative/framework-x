export const fxErrorTypes = [
  'event-fx/unhandled',
  'fx/unhandled',
  'fx.dispatch/arguments',
  'fx.db/arguments'
]

export type FxErrorType = typeof fxErrorTypes | string

export  type FxErrorData = any & {
  message: string
  expected: any
  received: any
  suggestions: (any & { code: string })[]
}

export class FxError extends Error {
  public namespace = 'framework-x'
  public name = 'error'
  public type: FxErrorType
  public data: FxErrorData
  public isRecoverable = true

  constructor(type: string, data?: any) {
    super()
    this.type = type
    this.data = data
  }
}
