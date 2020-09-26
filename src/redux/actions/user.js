import UserConstant from '../constants/user';

export function storeAccessToken(token){
    return {
        type: UserConstant.UPDATE_TOKEN,
        payload: token
    }
}  

export function loginStatus(status){
    return {
        type: UserConstant.USER_LOGIN,
        payload: status
    }
}  


export function storeDetails(data){
    return {
        type: UserConstant.USER_DETAILS,
        payload: data
    }
}  

export function storeCreds(data){
    return {
        type: UserConstant.USER_CREDS,
        payload: data
    }
}  


export function clearData() {
    return {
        type: UserConstant.CLEAR_DATA,
        payload: null,
    }
}