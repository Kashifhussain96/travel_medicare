import React from 'react';
import {
    StatusBar, StyleSheet,Platform,
    View
} from 'react-native';
import colors from '../../utils/colors';
import DeviceInfo from 'react-native-device-info';

const isNotch = DeviceInfo.hasNotch()

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? (isNotch ? 35 : 20) : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;


export default class StatusBarComponent extends React.Component {

    render() {

        return (
            <View style={[styles.container]}>
                <StatusBar translucent backgroundColor={colors.darkBlue} />
            </View>
        )
    }
}



const styles = StyleSheet.create({

    container: {
        backgroundColor: colors.darkBlue,
        height: STATUSBAR_HEIGHT,
    },
    
})
