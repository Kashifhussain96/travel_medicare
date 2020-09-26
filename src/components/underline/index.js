import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../utils/colors';


export default class Underline extends React.Component {

    render() {


        return (
            <View style={styles.container}/>
        )
    }
}



const styles = StyleSheet.create({

    container: {
        backgroundColor:colors.underline,
        height:4,
        borderRadius:50,
        width:'90%',
        alignSelf:'center'
    },
    
})
