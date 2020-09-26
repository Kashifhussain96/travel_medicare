import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import colors from '../../utils/colors';


const drawables = [
    require('../../assets/images/calendar.png'),
    require('../../assets/images/drop-down-arrow.png'),

]

export default class CalenderView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isShowText: false,
        }
    }



    onClickSecure = () => {
        this.setState({
            isShowText: !this.state.isShowText
        })
    }





    render() {


        return (
            <TouchableOpacity disabled={this.props.disabled} onPress={()=> this.props.onPress()} style={[styles.container,this.props.style]}>
                  
                <Text style={[styles.input,{color : (this.props.title.includes("-") || this.props.title.includes("Yes") || this.props.title.includes("No")) ? 
                        'black' : 'gray'}]}>{this.props.title}</Text>



                   {this.props.showCalender && <Image source={drawables[0]}
                        style={[styles.secure]} />}

                   {this.props.showArrow && <Image source={drawables[1]}
                        style={[styles.secure]} />}

            </TouchableOpacity>
        )
    }
}



const styles = StyleSheet.create({
    input: {
        padding: 10,
        flex:1,
        fontSize:11,
        marginEnd:10,
        color:'gray'
    },
    container: {
        width: '90%',
        padding: 5,
        borderRadius: 10,
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 10,
        height:45,
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
        width: 15,
        height: 15,
        marginStart: 5
    },
    secure: {
        width: 20,
        height: 20,
        marginEnd:5
    }

})
