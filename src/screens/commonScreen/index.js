
import React from 'react';
import { View, Image, Text, StatusBar, Animated, Easing, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'

import { createAppContainer, createSwitchNavigator } from "react-navigation";

import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import ScreenName from '../../navigation/screenNames'
import colors from '../../utils/colors';
import Modal from '../../utils/modal';
import * as SSOServices from '../../services/SSOService'
import WebView from 'react-native-webview';




class CommonScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isApp: false,
            status: this.props.navigation.state.params.data,
            title: "",
            htmlContent: ""
        };

    }

    getData = (endPoint) => {
        let modal = Modal.createProgressModal("Fetching Data...", false);
        SSOServices.getPageData(endPoint).then(res => {
            Modal.hide(modal)

            this.setState({
                title: res.data.page_title,
                htmlContent: '<meta name="viewport" content="width=device-width, initial-scale=1">'+res.data.page_text,
            })
        }).catch(err => {
            Modal.hide(modal)

        })
    }

    async componentDidMount() {
        switch (this.state.status) {
            case 1:
                this.getData("get_page/1")
                break;
            case 2:
                this.getData("get_page/2")
                break;
            case 3:
                this.getData("get_page/3")
                break;

            default:
                break;
        }
    }



    render() {
        return (
            <SafeAreaView style={styles.container}>

                <View style={styles.toolbar}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={require('../../assets/images/arrow.png')}
                            style={[styles.logo]} />
                    </TouchableOpacity>
                    <Text style={styles.home}>{this.state.title}</Text>
                </View>
                <WebView
                        style={styles.webView}
                        originWhitelist={['*']} source={{ html:this.state.htmlContent }} />


            </SafeAreaView>

        );
    }
}
const mapStateToProps = state => {
    return {
        userData: state.user
    }
};

const styles = StyleSheet.create({
    webView:{
        flex: 1, marginTop:20
    },
    container: {
        flex:1
    },
    home: {
        marginStart: 20,
        fontSize: 18,
        fontWeight: '600'
    },
    image: {
        height: 100,
        width: 100
    },
    toolbar: {
        backgroundColor: colors.white,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        shadowColor: "#010000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 2.5,
        shadowOpacity: 1,
        elevation: 10
    },
    logo: {
        height: 20,
        width: 20,
        marginStart: 20
    },
})



export default connect(mapStateToProps, null)(CommonScreen);