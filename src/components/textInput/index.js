import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import colors from '../../utils/colors';


const drawables = [
    require('../../assets/images/user.png'),
    require('../../assets/images/padlock.png'),
    require('../../assets/images/eye.png'),
    require('../../assets/images/invisible.png'),

]

export default class TextInputComponent extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isShowText: props.isSecure,
        }
    }



    onClickSecure = () => {
        this.setState({
            isShowText: !this.state.isShowText
        })
    }





    render() {

        return (
            <View style={[styles.container,this.props.styles]}>
                <View style={styles.inputContainer}>
                    {this.props.isShowDrawable && <Image source={drawables[this.props.icon]}
                        style={[styles.logo]} />}

                    <TextInput
                        secureTextEntry={this.state.isShowText}
                        placeholder={this.props.placeholder}
                        maxLength={this.props.maxLength}
                        autoCapitalize="none"
                        editable={!this.props.disable}
                        value={this.props.value}
                        onBlur={this.props.onBlur}
                        placeholderTextColor={"gray"}
                        onChangeText={this.props.onChangeText}
                        keyboardType={this.props.keyboardType}
                        style={[styles.input,{color:'black',marginStart: this.props.isShowDrawable ? 10 :5}]} />

                </View>


                {this.props.isSecure && <TouchableOpacity onPress={() => this.onClickSecure()}>
                    <Image source={this.state.isShowText ? drawables[2] : drawables[3]}
                        style={[styles.secure]} />
                </TouchableOpacity>}

            </View>
        )
    }
}



const styles = StyleSheet.create({
    input: {
        flex:1,
        marginEnd:10,
    },
    container: {
        width: '90%',
        borderRadius: 10,
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 15,
        height:50,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'gray'

    },
    inputContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex:1
    },
    logo: {
        width: 20,
        height: 20,
        marginStart: 5
    },
    secure: {
        width: 20,
        height: 20,
        marginEnd:5
    }

})
