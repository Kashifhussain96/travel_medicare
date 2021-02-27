import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import ModalAlert from '../utils/modal'
import Config from 'react-native-config';
import { getFormatterError } from '../utils/getFormatterMessage'
import { Platform, AsyncStorage } from 'react-native';
import { getBaseUrl } from './index';
import { getToken } from '../redux/client'


const requestMultiPart = async function (options, raiseFullError = false) {
    return AsyncStorage.getItem('token').then(res => {
        const client = axios.create({
            baseURL: getBaseUrl(true),

            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "device-type": Platform.OS,
                "Authorization": "Bearer "+res
            },
        });

        console.log("Base URL::::>", getBaseUrl(true))
        console.log("Request Data:::>", options)
        console.log("Bearer Data:::>", "Bearer "+res)

        const onSuccess = function (response) {
            console.log("Response Data Multipart:::>", response.data)
            if (response.data.status) {
                return Promise.resolve(response.data);
            } else {
                return Promise.reject(response);
            }
        };

        const onError = function (error) {
            console.log("Response Error Multipart:::>", error);
            if (error.data) {
                return Promise.reject(error.data);
            } else {
                ModalAlert.error("Something went wrong")
            }
        };

        return NetInfo.fetch().then(state => {
            if (state.isConnected) {
                return client(options).then(onSuccess).catch(onError);
            } else {
                ModalAlert.error('Please check your internet connection.')
                return
            }
        });
    })
      
  
};



export function responseLog(tag, baseUrl, options, response) {
    LogTracker.debug(tag, {
        baseUrl,
        options,
        response
    });
}


export function cancelAll(message) {
    source.cancel(message);
    source = axios.CancelToken.source();
}

// export default request;
export default requestMultiPart;


