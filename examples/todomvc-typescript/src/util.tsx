import * as R from 'ramda'
import {Selector as ReselectSelector} from "reselect"

export const updateIn = R.curry((ks, f, m) => R.assocPath(ks, f(R.path(ks, m)), m))
