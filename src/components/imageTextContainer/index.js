import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../utils/colors';


export default class ImageTextContainer extends React.Component {

    render() {


        return (
            <View style={styles.container}>
                <Image source={this.props.image}
                    resizeMode={'contain'}
                        style={[styles.logo,this.props.imageStyle]} />
                <Text style={styles.title}>{this.props.title}</Text>
            </View>
        )
    }
}



const styles = StyleSheet.create({

    container: {
        alignContent:'center',
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center',
        height:150,width:'50%'
    },
    title: {
        fontSize: 16,
        marginTop:10
    },
    logo: {
        width: 80,
        height: 80
    }
})
