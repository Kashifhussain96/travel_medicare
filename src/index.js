import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './navigation/AppNavigator';
import Store from './redux/store';
import { Provider } from 'react-redux';

const { store, persistor } = Store(); 

console.disableYellowBox =  true


const App = () => {
    return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <AppNavigator />
        </PersistGate>
    </Provider>
    )
}

export default App;