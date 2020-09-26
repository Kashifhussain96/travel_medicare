import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../utils/colors';
import { AsyncStorage } from 'react-native';
import { FlatList } from 'react-native';


export default class RadioButtonComponent extends React.Component {


    state = {
        isChecked : ""
    }


    async componentDidMount() {

        this.setState({
            isChecked : this.props.isChecked
        })

    }


    onPressItem=(item,index)=>{
        this.setState({
            isChecked : item.value
        },()=>{
            this.props.onClickItem(item,index)
        })
    }


    renderItem = ({ item, index }) => {
        let {isChecked} = this.state;
        return (
            <TouchableOpacity onPress={()=> this.onPressItem(item,index)} style={styles.container}>
                <Image style={{ width: 20, height: 20 }} source={isChecked == item.value ? require('../../assets/radio_on.png') : require('../../assets/radio_off.png')} />
                <Text style={{ marginStart: 10, marginEnd: 20,fontSize:20 }}>{item.label}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, marginTop: 20 }}>

                <FlatList
                    data={this.props.data}
                    horizontal
                    keyExtractor={(id) => this.keyExtractor = id}
                    style={{ flex: 1 }}
                    renderItem={this.renderItem} />
            </View>

        )
    }
}



const styles = StyleSheet.create({

    container: {
        flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'

    },
    title: {
        alignSelf: 'center',
        fontSize: 20,
        marginStart: 10,
        marginEnd: 10
    },
    arrow: {
        width: 20,
        height: 20
    }
})
