import { Selector as ReselectSelector } from "reselect"
import { VisibilityFilter } from "./constants"

export type Todo = { id: string, done?: boolean }
export type Db = {
  todos: Todo[]
}
export type RouteParam = VisibilityFilter

export type Selector<T> = ReselectSelector<Db, T>
