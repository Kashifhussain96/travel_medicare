
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, AsyncStorage } from 'react-native';
import { connect } from "react-redux";

import Modal from '../../utils/modal';
import * as UserAction from '../../redux/actions/user'
import { bindActionCreators } from "redux";
import colors from '../../utils/colors';
import FloatLabelTextField from '../../components/floatingInput';
import TextInputComponent from '../../components/textInput'
import CheckBoxComponent from '../../components/checkbox';
import DropDown from '../../components/dropDown'
import * as SSOServices from '../../services/SSOService'



class ForgotpasswordScreen extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         email: "",
         data:[]
         // email: "asd3@gma.com",
         // password: "123456",
      };



   }


   async componentDidMount() {
      
    
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
     
      return true;
   }

   resetpass = async () => {
      if (this.isValidFields()) {
         let data = {
            email: this.state.email,
         }

         let modal = Modal.createProgressModal('Loading...', false)

         SSOServices.forgotPassword(data).then(res => {
            Modal.hide(modal);


            if(res.status){
               Modal.alert("Password Reset Successfully. Please check the Email ID")
            }


//alert(JSON.stringify(res.data))
            // if(Object.keys(res.data).length === 0){
            //    //this.props.navigation.navigate('Otp', {email:this.state.email,password:this.state.password})

            // }else{
            //       this.validateUser(res.data);

            // }
            this.setState({
                data:res
            })
//alert(res.data.success+"sjnfj")


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


//    validateUser = async (data) => {
//       await AsyncStorage.setItem('token', data.token);
//       this.props.actions.storeDetails(data);
//       if (this.state.isRememberMe) {
//          await AsyncStorage.setItem("email", this.state.email)
//          await AsyncStorage.setItem("password", this.state.password)
//          await AsyncStorage.setItem("isRemember", "true")
//       } else {
//          await AsyncStorage.setItem("email", "")
//          await AsyncStorage.setItem("password", "")
//          await AsyncStorage.setItem("isRemember", "false")
//       }
//       if (data.is_profile_complete === 1) {
//          await AsyncStorage.setItem("isLoggedIn", "true")
//          this.props.actions.storeDetails(data);
//          if (data.is_approved === 0) {
//             this.props.navigation.navigate('Loading');
//          } else {
//             this.props.navigation.navigate('HomeInitial');
//          }
//       } else if (data.is_profile_complete === 0 && data.page_status === 5) {
//          this.props.navigation.navigate('Loading');
//       } else {
//          switch (data.page_status) {
//             case 0:
//                this.props.navigation.navigate('SignUpStage', { data: { userData: data, stage: 0, fromLogin: false } })
//                break;
//             case 1:
//                this.props.navigation.navigate('SignUpStage', { data: { userData: data, stage: 1, fromLogin: true } })
//                break;
//             case 2:
//                this.props.navigation.navigate('SignUpStage', { data: { userData: data, stage: 2, fromLogin: true } })
//                break;
//             case 3:
//                this.props.navigation.navigate('SignUpStage', { data: { userData: data, stage: 3, fromLogin: true } })
//                break;
//             case 4:
//                this.props.navigation.navigate('SignUpStage', { data: { userData: data, stage: 4, fromLogin: true } })
//                break;
//          }

//       }
//    }




   validateEmail = (email) => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
   }


   render() {

      return (
        <SafeAreaView style={styles.container}>
         <View style={styles.toolbar}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={require('../../assets/images/arrow.png')}
                            style={[styles.logo]} />
                    </TouchableOpacity>
                    <Text style={styles.home}>Reset Password</Text>
                </View>

         {/* <ImageBackground source={require('../../assets/images/bg.png')}
            style={[styles.logo]}> */}


            
            {/* <Text style={styles.hello}>Hello</Text> */}
            {/* <Text style={styles.signIn}>Reset Password</Text> */}
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
             

              

               {/* <TouchableOpacity onPress={() => this.login()}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
               </TouchableOpacity> */}

               <View style={styles.buttonContainer}>
                  {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                     <Text style={styles.register}>Register</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity onPress={() => this.resetpass()} style={styles.signInContainer}>
                     <Text style={styles.signInText}>Reset Password</Text>
                     <Image source={require('../../assets/images/Next_Button.png')}
                        style={[styles.nextButton]} />
                  </TouchableOpacity>



               </View>



            </View>




</SafeAreaView>


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
      flex:1
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
    height: 20,
    width: 20,
    marginStart: 20
 },
   toolbar: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:50,
    width: '100%',
    
 },
 home: {
    marginStart: 20,
    fontSize: 24,
    fontWeight: '600'
 },
})


export default connect(mapStateToProps, mapDispatchToProps)(ForgotpasswordScreen);