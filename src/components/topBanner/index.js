import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../utils/colors';


export default class TopBanner extends React.Component {

    render() {


        return (
            <View style={styles.container}>
                   <Image source={require('../../assets/images/homelogo.png')}
               style={[styles.logo]} />

            </View>
        )
    }
}



const styles = StyleSheet.create({
   
    container:{
        backgroundColor:colors.darkBlue,
        paddingTop:15,
        paddingBottom:15,
    },
    logo:{
        alignSelf:'center'
    }
})
