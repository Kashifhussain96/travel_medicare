
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, AsyncStorage, ScrollView } from 'react-native';
import { connect } from "react-redux";

import Modal from '../../utils/modal';
import * as UserAction from '../../redux/actions/user'
import { bindActionCreators } from "redux";
import FloatLabelTextField from '../../components/floatingInput';
import TextInputComponent from '../../components/textInput'
import CheckBoxComponent from '../../components/checkbox';
import DropDown from '../../components/dropDown'
import * as SSOServices from '../../services/SSOService'



class LoginScreen extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         // email: "dalbir@riskcare.ca",
         // password: "7895@Tranmere",
         email: "aravindh@kitkattech.com",
         password: "123@aravindh",
         // email: "",
         // password: ""
      };



   }


   async componentDidMount() {
      let isRemember = await AsyncStorage.getItem("isRemember");
      if (isRemember === "true") {
         this.setState({
            isRememberMe: true,
            email: await AsyncStorage.getItem('email'),
            password: await AsyncStorage.getItem('password'),
         }, () => {
            this.render();
         })
      }

   }


   isValidFields = () => {
      if (this.state.email.trim() == "") {
         Modal.error("Enter email address.")
         return false
      }

      if (!this.validateEmail(this.state.email)) {
         Modal.error("Email is not valid.")
         return false
      }
      if (this.state.password == "") {
         Modal.error("Enter password")
         return false
      }
      if (this.state.password.trim().length < 6) {
         Modal.error("Password must upto 6 character long")
         return false
      }
      return true;
   }

   login = async () => {
      if (this.isValidFields()) {
         let data = {
            email: this.state.email,
            password: this.state.password,
         }

         let modal = Modal.createProgressModal('Signing In...', false)

         SSOServices.loginApi(data).then(res => {
            Modal.hide(modal);


            if (Object.keys(res.data).length === 0) {
               this.props.navigation.navigate('Otp', { email: this.state.email, password: this.state.password })
            } else {
               this.validateUser(res.data);
            }

         }).catch(err => {
            Modal.hide(modal)
            Modal.error(err.message)
         })
      }
   }

   // forgotpassword = async () => {
   //    if (this.isValidFields()) {
   //       let data = {
   //          email: this.state.email,
   //          password: this.state.password,
   //       }

   //       let modal = Modal.createProgressModal('Signing In...', false)

   //       SSOServices.loginApi(data).then(res => {
   //          Modal.hide(modal);



   //          if(Object.keys(res.data).length === 0){
   //             this.props.navigation.navigate('Otp', {email:this.state.email,password:this.state.password})

   //          }else{
   //                this.validateUser(res.data);

   //          }




   //       }).catch(err => {
   //          Modal.hide(modal)
   //          Modal.error(err.message)
   //       })
   //    }
   // }


   validateUser = async (data) => {
      await AsyncStorage.setItem('token', data.token);
      this.props.actions.storeDetails(data);
      if (this.state.isRememberMe) {
         await AsyncStorage.setItem("email", this.state.email)
         await AsyncStorage.setItem("password", this.state.password)
         await AsyncStorage.setItem("isRemember", "true")
      } else {
         await AsyncStorage.setItem("email", "")
         await AsyncStorage.setItem("password", "")
         await AsyncStorage.setItem("isRemember", "false")
      }
      if (data.is_profile_complete === 1) {
         await AsyncStorage.setItem("isLoggedIn", "true")
         this.props.actions.storeDetails(data);
         if (data.is_approved === 0) {
            this.props.navigation.navigate('Loading');
         } else {
            this.props.navigation.navigate('HomeInitial');
         }
      } else if (data.is_profile_complete === 0 && data.page_status === 5) {
         this.props.navigation.navigate('Loading');
      } else {
         switch (data.page_status) {
            case 0:
               this.props.navigation.navigate('SignUpStage', { data: { userData: data, stage: 0, fromLogin: false } })
               break;
            case 1:
               this.props.navigation.navigate('SignUpStage', { data: { userData: data, stage: 1, fromLogin: true } })
               break;
            case 2:
               this.props.navigation.navigate('SignUpStage', { data: { userData: data, stage: 2, fromLogin: true } })
               break;
            case 3:
               this.props.navigation.navigate('SignUpStage', { data: { userData: data, stage: 3, fromLogin: true } })
               break;
            case 4:
               this.props.navigation.navigate('SignUpStage', { data: { userData: data, stage: 4, fromLogin: true } })
               break;
         }

      }
   }




   validateEmail = (email) => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
   }


   render() {

      return (

         <ImageBackground source={require('../../assets/images/bg.png')} style={[styles.logo]}>


         <ScrollView keyboardShouldPersistTaps="always">


            <Text style={styles.hello}>Hello</Text>
            <Text style={styles.signIn}>Sign in to your account</Text>
            <View style={styles.loginViews}>
               <TextInputComponent
                  isSecure={false}
                  placeholder={"Email"}
                  maxLength={100}
                  icon={0}
                  value={this.state.email}
                  onChangeText={(text) => this.setState({ email: text })}
                  isShowDrawable={true}
               />
               <TextInputComponent
                  isSecure={true}
                  placeholder={"Password"}
                  value={this.state.password}
                  maxLength={100}
                  icon={1}
                  onChangeText={(text) => this.setState({ password: text })}
                  isShowDrawable={true}
               />

               <CheckBoxComponent
                  onClickPress={(status) => this.setState({ isRememberMe: status })}
                  value={this.state.isRememberMe}
                  isLogin={true}
                  title={"Remember Me"} />

               <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
               </TouchableOpacity>

               <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                     <Text style={styles.register}>Register</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.login()} style={styles.signInContainer}>
                     <Text style={styles.signInText}>SignIn</Text>
                     <Image source={require('../../assets/images/Next_Button.png')}
                        style={[styles.nextButton]} />
                  </TouchableOpacity>



               </View>



            </View>



            </ScrollView>



         </ImageBackground>






      );
   }
}
const mapStateToProps = state => {
   return {
      user: state.user
   }
};

const mapDispatchToProps = (dispatch) => {
   return {
      actions: bindActionCreators(UserAction, dispatch)
   }
}
const styles = StyleSheet.create({
   forgotPassword: {
      alignSelf: 'center',
      marginTop: 20,
      fontWeight: '600',
      fontSize: 18,
      textDecorationLine: 'underline'
   },
   signInContainer: {
      flexDirection: 'row',
      alignItems: 'center'
   },
   nextButton: {
      width: 40,
      marginStart: 10,
      height: 40
   },
   signInText: {
      color: '#000000',
      fontSize: 24,
      fontWeight: '600'
   },
   buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 30,
      justifyContent: 'space-evenly'
   },
   register: {
      textDecorationLine: 'underline',
      color: '#000000',
      fontSize: 24,
      fontWeight: '600'
   },
   loginViews: {
      marginTop: 80
   },
   signIn: {
      fontSize: 24,
      marginStart: 20
   },
   loginContainer: {
      position: 'absolute',
      top: 100
   },
   container: {
   },
   hello: {
      fontWeight: '600',
      fontSize: 45,
      marginTop: 150,
      marginStart: 20
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
      width: '100%',
   }
})


export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);