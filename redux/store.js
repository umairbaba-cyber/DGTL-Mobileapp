import { createStore, combineReducers } from 'redux';
import Root_Reducers from './Root_Reducers';
const rootReducer = combineReducers(
{ Main: Root_Reducers }
);
const configureStore = () => {
return createStore(rootReducer);
}
export default configureStore;