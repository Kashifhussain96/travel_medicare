import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import colors from '../../utils/colors';


export default class UploadImage extends React.Component {

    render() {

        return (
            <View style={{ marginTop: 20 }}>
                <Text style={styles.title}>{this.props.title}</Text>
                {
                    this.props.image === null &&
                    <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
                        <Image source={require('../../assets/images/photo-camera.png')} style={styles.image} />
                    </TouchableOpacity>
                }

                {
                    this.props.image !== null &&
                    <TouchableOpacity onPress={this.props.onPress}>
                        <Image
                            style={{ height: 150, alignSelf: 'center', width: '90%' }}
                            source={{ uri: "data:image/png;base64," + this.props.image }} />
                    </TouchableOpacity>

                }

            </View>

        )
    }
}



const styles = StyleSheet.create({
    image: {
        width: 40,
        height: 40
    },
    title: {
        marginStart: 20,
        marginBottom: 10,
        fontWeight: '600',
        fontSize: 18
    },
    container: {
        backgroundColor: colors.white,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        shadowColor: "#010000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        marginStart: 20,
        shadowRadius: 2.5,
        shadowOpacity: 1,
        elevation: 10
    },

})
