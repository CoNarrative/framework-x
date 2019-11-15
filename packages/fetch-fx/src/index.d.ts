// Type definitions for fetch API
// Spec: https://fetch.spec.whatwg.org/
// Polyfill: https://github.com/github/fetch
// Definitions by: Ryan Graham <https://github.com/ryan-codingintrigue>

interface FetchOptions {
  method?: "GET" | "POST" | "DELETE" | "PATCH" | "PUT" | "HEAD" | "OPTIONS" | "CONNECT"
  headers?: any
  body?: any
  mode?: "cors" | "no-cors" | "same-origin"
  credentials?: "omit" | "same-origin" | "include"
  cache?: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached"
  redirect?: "follow" | "error" | "manual"
  referrer?: string
  referrerPolicy?: "referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "unsafe-url"
  integrity?: any
}

declare enum ResponseType {
  Basic,
  Cors,
  Default,
  Error,
  Opaque
}

interface Headers {
  append(name: string, value: string): void

  delete(name: string): void

  get(name: string): string

  getAll(name: string): Array<string>

  has(name: string): boolean

  set(name: string, value: string): void
}

interface Body {
  bodyUsed: boolean

  arrayBuffer(): Promise<ArrayBuffer>

  blob(): Promise<Blob>

  formData(): Promise<FormData>

  json(): Promise<JSON>

  text(): Promise<string>
}

interface Response extends Body {
  error(): Response

  redirect(url: string, status?: number): Response

  type: ResponseType
  url: string
  status: number
  ok: boolean
  statusText: string
  headers: Headers

  clone(): Response
}

interface Fetch {
  (url: string): Promise<Response>

  (url: string, options: FetchOptions): Promise<Response>
}

export type EventName = string
export type EventVector = [string, any]


export function fetchFx(
  { dispatch, fetch }: { dispatch: (eventName: string) => void, fetch: Fetch },
  [urlOrReq, successEventOrEventVector, failureEventOrEventVector]:
    [string | { url: string } & FetchOptions, EventName | EventVector, EventName | EventVector]
): void

export function fetchFx(
  { dispatch, fetch }: { dispatch: (eventName: string) => void, fetch: Fetch },
): ([
      urlOrReq,
      successEventOrEventVector,
      failureEventOrEventVector
    ]: [
  string | { url: string } & FetchOptions,
  EventName | EventVector,
  EventName | EventVector
]) => void

export function createFx (
  { dispatch, fetch }: { dispatch: (eventName: string) => void, fetch?: Fetch }) :
  ([
     urlOrReq,
     successEventOrEventVector,
     failureEventOrEventVector
   ]: [
    string | { url: string } & FetchOptions,
    EventName | EventVector,
    EventName | EventVector
  ]) => void
