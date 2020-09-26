import UserConstant from '../constants/user'

const DEFAULT_STATE = {
    userData: {},
    userCreds:{}
}


export default function User(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case UserConstant.UPDATE_TOKEN:
            return {
                ...state,
                token: action.payload
            }
        case UserConstant.USER_DETAILS:
            return {
                ...state,
                userData: action.payload
            }
        case UserConstant.USER_CREDS:
            return {
                ...state,
                userCreds: action.payload
            }
        case UserConstant.USER_LOGIN:
            return {
                ...state,
                isLoggedIn: action.payload
            }
        case UserConstant.CLEAR_DATA:
            return {
                ...DEFAULT_STATE,
            }
        default:
            return state
    }
}