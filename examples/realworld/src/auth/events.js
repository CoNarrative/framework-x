import * as R from 'ramda'
import { failure, regResultFx, success } from '../api'
import { evt } from '../eventTypes'
import { regEventFx } from '../store'
import { fx } from '../fx'
regEventFx(evt.USER_REQUESTS_LOGIN,(_,__,{email,password})=>{
  return [
    fx.dispatch(evt.API_REQUEST,evt.LOGIN_REQUEST,)
  ]
})



