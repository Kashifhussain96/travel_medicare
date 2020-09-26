import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../utils/colors';
import GetQuote from '../button/getQuote';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';


export default class DatePicker extends React.Component {

    render() {


        return (
            <View style={styles.container}>
                <DateTimePicker
                    cancelTextStyle={{ color: '#173154' }}
                    isVisible={this.props.showDate}
                    onConfirm={ (data)=> this.props.datePicked(data)}
                    title={"Select Date"}
                    mode={"date"}
                    minimumDate={this.props.minimumDate}
                    onCancel={ ()=> this.props.dateCanceled()}
                    isDarkModeEnabled={false} />
            </View>
        )
    }
}



const styles = StyleSheet.create({

    container: {
    },
    title: {
        alignSelf: 'center',
        fontSize: 20,
        marginTop: 5,
        fontWeight: '600',
        color: colors.white
    }
})
