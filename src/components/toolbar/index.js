import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../utils/colors';


export default class ToolBarComponent extends React.Component {

    
    render() {


        return (

            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Image source={require('../../assets/images/arrow.png')}
                        style={[styles.arrow]} />
                </TouchableOpacity>
                <View style={{ width: '85%' }}>
                    <Text style={styles.title}>{this.props.title}</Text>

                </View>

            </View>

        )
    }
}



const styles = StyleSheet.create({

    container: {
        padding: 12,
        borderRadius: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 10,
    },
    title: {
        alignSelf: 'center',
        fontSize: 24,
        marginStart: 10,
        fontWeight: '600'
    },
    arrow: {
        width: 20,
        height: 20
    }
})
