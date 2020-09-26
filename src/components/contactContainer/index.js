import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../utils/colors';


export default class ContactContainer extends React.Component {

    render() {


        return (
            <View style={styles.container}>
                <Text style={styles.title}>Travel Medicare</Text>
                <Text style={styles.contactDetails}>Contact Details</Text>
                <Text style={styles.address}>Unit No. 30, 7895, Tranmere Dr{"\n"}Mississauga, Ontario, Canada{"\n"}Postal Code: L5S 1V9</Text>
                <Text style={styles.address}>Toll Free Number  : +1-844-844-3272{"\n"}Fax Number          : +1-844-844-0572{"\n"}info@travelmedicare.com</Text>
                {/* <Text style={styles.address}></Text> */}
                {/* <Text style={styles.email}>info@travelmedicare.com</Text> */}
                <Text style={styles.copyRight}>Copyright © 2019 Travel medicare All Rights Reserved</Text>
            </View>
        )
    }
}



const styles = StyleSheet.create({

    container: {
        alignSelf:'center',
        padding:12,
        width:'90%',
        justifyContent:'center',
        backgroundColor:'white',
        borderRadius:20,
        marginTop:30,
        marginBottom:50,
        backgroundColor:'white',
        shadowColor: "#010000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius:3,
        shadowOpacity: 4,
        elevation:5
    },
    title: {
        fontSize: 26,
        marginStart:5,
        color:"#5bb2b5",
        textAlign:'center',
        fontWeight: '600',
    },
    email: {
        fontSize: 20,
        marginStart:5,
        color:'#869294',
        marginTop:10,
        fontWeight: '600',
    },
    contactDetails:{
        fontSize: 20,
        marginStart:5,
        marginTop:10,
        // color:'#869294',
        fontWeight: '600',
    },
    copyRight:{
        marginTop:10,
        fontSize:14,
        marginStart:5
    },
    address:{
        fontSize: 18,
        marginStart:5,
        marginTop:10,
        color:'#869294',
        // fontFamily:'DINRoundPro-Light'
        // fontWeight:"bold"
    },  
   
    arrow: {
        width: 15,
        height: 15
    }
})
