import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity,Dimensions } from 'react-native';
import colors from '../../utils/colors';
import GetQuote from '../button/getQuote';
import DateTimePicker from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
const { width, height } = Dimensions.get('window')

export default class DropDown extends React.Component {

    render() {


        return (
            <View>
                <RNPickerSelect
                    placeholder={{
                        label: this.props.hint,
                        value: null,
                        color: 'red',
                    }}

                    items={this.props.pickerList}
                    onValueChange={(value,index) => {
                        this.props.onPickerSelected(value,index)
                    }}
                    value={this.props.defaultValue}
                    style={StyleSheet.create({
                        inputAndroid: {
                            width: width - 70,
                            paddingVertical: 8,
                            marginLeft: 7,
                            fontSize: 13,
                           // ...fonts.P1,
                            height: '100%',
                            lineHeight: 18,
                            color: this.props.isEnable ? 'black' : 'grey',
                        },
                        inputIOS: {
                            width: width - 70,
                            paddingHorizontal: 10,
                            marginLeft: 2,

                            fontSize: 13,
                            lineHeight: 18,
                            color: this.props.isEnable ? 'black' : 'grey',
                        }
                    })}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => {
                        return <View />;
                    }}
                    testID={this.props.testID}
                    accessibilityLabel={this.props.accessibilityLabel}

                />
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
