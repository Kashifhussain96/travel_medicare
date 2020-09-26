import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, TextInput, Platform } from 'react-native';
import colors from '../../utils/colors';
import RNPickerSelect from 'react-native-picker-select';


const drawables = [
    require('../../assets/images/calendar.png'),
    require('../../assets/images/drop-down-arrow.png'),

]

export default class DropDownView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
        }
    }







    render() {
        return (
            <View style={[{width:'50%',alignSelf:'center'},this.props.styles]}>
                <Text style={[styles.dropDownTitle,this.props.textstyles]}>{this.props.dropDownTitle}</Text>
                <View style={[styles.dropDownContainer,{padding: Platform.OS == 'ios' ? 12 : 0}]}>
                    <RNPickerSelect
                        disabled={this.props.disabled}
                        onValueChange={(value) => this.props.onItemSelected(value)}
                        style={StyleSheet.create({

                            inputAndroid: {
                                width: '100%',
                                color:'black'
                            },
                            inputIOS: {
                                width: '100%',
                                color:'black'
                            },
                            inputIOSContainer: {
                                width: '100%',
                            },
                            viewContainer: {
                                width: '100%',
                            }
                        })}
                        value={this.props.value}
                        items={this.props.childData}
                    />
                   {Platform.OS  == "ios" &&  <Image source={require('../../assets/images/drop-down-arrow.png')} style={styles.arrow} />}
                </View>
            </View>

        )
    }
}



const styles = StyleSheet.create({
    arrow: {
        width: 10,
        height: 10,
        marginStart: -20
    },
    dropDownTitle: {
        marginBottom: 5,
        marginStart:12,
        marginTop:5,
        fontSize: 14,
        fontWeight:"bold"
    },
    dropDownContainer: {
        width: '90%',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.gray,
        alignSelf:'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    picker: {
        width: '100%'
    },
})
