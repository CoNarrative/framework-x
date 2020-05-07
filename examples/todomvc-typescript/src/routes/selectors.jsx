import { derive } from 'framework-x';
import * as R from 'ramda';
export const getRoute = R.path(['router', 'match']);
export const getRouteParams = derive([getRoute], R.path(['params']));
