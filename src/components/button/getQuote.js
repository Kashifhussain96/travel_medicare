import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../utils/colors';


export default class GetQuote extends React.Component {

    render() {


        return (
            <TouchableOpacity onPress={this.props.onPress} activeOpacity={0.7} style={styles.container}>
                <Image source={require('../../assets/right.png')}
                    style={[styles.arrow]} />
                <Text style={styles.title}>GET A QUOTE</Text>
            </TouchableOpacity>
        )
    }
}



const styles = StyleSheet.create({

    container: {
        backgroundColor:"#3c7f82",
        width:150,
        alignSelf:'center',
        padding:12,
        borderRadius:60,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:15,
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
        fontSize: 14,
        marginStart:5,
        fontWeight: '600',
        color: colors.white
    },
    arrow: {
        width: 15,
        height: 15
    }
})
