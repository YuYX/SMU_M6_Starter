import { combineReducers, createStore } from 'redux';
import accountPrefReducer from './ducks/accountPref';
import blogAuthReducer from './ducks/blogAuth';

const reducer = combineReducers({
    auth: blogAuthReducer,
    accountPref: accountPrefReducer,
});

const store = createStore (reducer);

export default store;