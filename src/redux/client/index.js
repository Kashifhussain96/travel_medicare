// store
import Store from '../store';

const {store, persistor} = Store();

export function getToken() {
    return store.getState().user.userData.token
}

