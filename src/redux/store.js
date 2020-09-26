
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
import logger from 'redux-logger'
import thunk from 'redux-thunk';

import rootReducer from './reducers'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel1
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const enhancer = compose(
    applyMiddleware(thunk),
    applyMiddleware(logger)
);

export default () => {
    let store = createStore(persistedReducer, enhancer)
    let persistor = persistStore(store)
    return { store, persistor }
}