import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../utils/colors';
import GetQuote from '../button/getQuote';


export default class VisitContainer extends React.Component {

    render() {


        return (
            <View style={styles.container}>
                   <Text style={styles.title}>Visitors To Canada</Text>
                    <GetQuote
                        onPress={this.props.onPress}/>
            </View>
        )
    }
}



const styles = StyleSheet.create({
   
    container:{
        backgroundColor:colors.primary,
        paddingTop:15,
        paddingBottom:15,
    },
    title:{
        alignSelf:'center',
        fontSize:20,
        marginTop:5,
        fontWeight:'600',
        color:colors.white
    }
})
