
import React from 'react';
import { View, Image, Text, StatusBar, Animated, Easing, SafeAreaView, StyleSheet, AsyncStorage } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'

import { createAppContainer, createSwitchNavigator } from "react-navigation";

import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import ScreenName from '../../navigation/screenNames'


class SplashScreen extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isApp: false
      };
      this.springValue = new Animated.Value(1);
      this.fadeInOpacity = new Animated.Value(0);

   }

   async componentDidMount() {
      await this.onLoad();
      await this.spring();
      setTimeout(() => {
         this.navigateToHome()
      }, 3000)
   }

   navigateToHome = async () => {

      if(this.props.userData.token != null){
         this.props.navigation.navigate('HomeInitial')
      }else{
         this.props.navigation.navigate('Landing')
      }
   }

   onLoad = () => {
      this.fadeInOpacity.setValue(0);
      Animated.timing(this.fadeInOpacity, {
         toValue: 1,
         duration: 2000,
         useNativeDriver: true
      }).start();
   };

   spring = () => {
      this.springValue.setValue(0.9)
      Animated.spring(
         this.springValue,
         {
            toValue: 1,
            friction: 1
         }
      ).start()
   }


   render() {
      return (
         <View style={styles.container}>

            <Image source={require('../../assets/images/TravelMedicareSplashBG.png')}
               style={[styles.logo]} />

            <Image source={require('../../assets/images/TravelMedicareSplashLogo.png')}
               style={[styles.icon]} />

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
   },
   icon: {
      height: 200,
      width: 200, position: 'absolute',
      alignSelf: 'center',
      top: 100
   },
   paragraph: {
      textAlign: 'center',
      marginTop: 0,
      fontSize: 24,
      color: 'black',
      fontWeight: '600'
   },

   logo: {
      height: '100%',
      width: '100%'
   }
})



export default connect(mapStateToProps, null)(SplashScreen);