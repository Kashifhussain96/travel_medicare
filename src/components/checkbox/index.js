import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../utils/colors';
import { AsyncStorage } from 'react-native';


export default class CheckBoxComponent extends React.Component {


    state = {
        isChecked : false
    }


    async componentDidMount(){

        console.log(this.props.value)
        this.setState({
            isChecked : this.props.value
        })
        if(this.props.isLogin){
            let isRemember = await AsyncStorage.getItem("isRemember")
            this.setState({
                isChecked : isRemember === "true" ? true : false
            })
        }

     
       
    }

    onClickPress = () => {
        this.setState({
            isChecked : !this.state.isChecked
        },()=>{
            this.props.onClickPress(this.state.isChecked)

        })
    }

    render() {
        let {isChecked} = this.state;
        return (
            <TouchableOpacity onPress={()=> this.onClickPress()} activeOpacity={0.7} style={[styles.container,this.props.style]}>
                <Image source={isChecked ? require('../../assets/checkbox.png') :  require('../../assets/unCheck.png')}
                    style={[styles.arrow]} />
                <Text style={styles.title}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}



const styles = StyleSheet.create({

    container: {
        padding:12,
        borderRadius:60,
        flexDirection:'row',
        alignItems:'center',
        marginTop:15,
        marginStart:10
    
    },
    title: {
        alignSelf: 'center',
        fontSize: 20,
        marginStart:10
    },
    arrow: {
        width: 20,
        height: 20
    }
})
