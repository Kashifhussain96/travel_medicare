import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../utils/colors';


export default class GreenButton extends React.Component {

    render() {


        return (
            <TouchableOpacity activeOpacity={1} style={styles.container}>
                <Text style={styles.title}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}



const styles = StyleSheet.create({

    container: {
        backgroundColor:colors.primary,
        alignSelf:'center',
        padding:12,
        marginTop:30,
        width:'90%',
        alignItems:'center',
        justifyContent:'center',
        shadowColor: "#010000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 2.5,
        shadowOpacity: 1,
        elevation: 10
    },
    title: {
        alignSelf: 'center',
        fontSize: 18,
        marginStart:5,
        fontWeight: '600',
        color: colors.white
    },
    arrow: {
        width: 15,
        height: 15
    }
})
