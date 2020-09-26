
import React from 'react';
import { View, Image, Text, StatusBar,AsyncStorage, Animated, Easing, SafeAreaView, StyleSheet } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'
import { bindActionCreators } from "redux";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import * as UserAction from '../../redux/actions/user'

import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import ScreenName from '../../navigation/screenNames'


class LoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isApp: false
        };
        this.springValue = new Animated.Value(1);
        this.fadeInOpacity = new Animated.Value(0);

    }

    async componentDidMount() {
  

        setTimeout(() => {
            this.clearData()
        }, 1000)


    }


    clearData = async () =>{
        await AsyncStorage.setItem("isLoggedIn","false");
        await AsyncStorage.setItem("token","");
        this.props.actions.clearData();
        this.props.navigation.navigate('Landing')
    }





    render() {
        return (
            <View style={styles.container}>
                <Image resizeMode='contain' source={require('../../assets/images/Loading.png')}
                    style={[styles.logo]} />
                <Text style={styles.paragraph}>Your application has been submitted for approval. For any details call +1-844-844-3272 or Email - info@travelmedicare.com</Text>


            </View>

        );
    }
}
const mapStateToProps = state => {
    return {
        userData: state.user.userData
    }
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center'
    },
    icon: {
        height: 200,
        width: 200, position: 'absolute',
        alignSelf: 'center',
        top: 100
    },
    paragraph: {
        textAlign: 'center',
        marginTop: 20,
        marginStart:10,
        marginEnd:10,
        color:"#869294",
        fontSize: 20,
    },

    logo: {
        height: 150,
        width: 150
    }
})
const mapDispatchToProps = (dispatch) => {
    return {
       actions: bindActionCreators(UserAction, dispatch)
    }
 }



export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);