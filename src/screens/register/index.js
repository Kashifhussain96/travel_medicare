
import React from 'react';
import { View, Image, Text, StatusBar, Animated, TouchableOpacity, ImageBackground, StyleSheet, AsyncStorage } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'

import { createAppContainer, createSwitchNavigator, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import ScreenName from '../../navigation/screenNames'
import ToolBarComponent from '../../components/toolbar'
import TextInputComponent from '../../components/textInput'
import CheckBoxComponent from '../../components/checkbox';
import colors from '../../utils/colors';
import * as UserAction from '../../redux/actions/user'
import { bindActionCreators } from "redux";
import * as SSOServices from '../../services/SSOService'

import Modal from '../../utils/modal';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            cPassword: "",
            tncChecked: false,
        };

    }

    componentDidMount() {

    }

    signUp = async () => {
        if (this.validateDetails()) {
            let data = {
                "first_name": this.state.firstName,
                "last_name": this.state.lastName,
                "email": this.state.email,
                "password": this.state.password,
                "password_confirmation": this.state.cPassword
            }
            let modal = Modal.createProgressModal('Signing Up...',false);
            SSOServices.register(data).then(res=>{
                Modal.hideAll();
                this.storeData(res);
            }).catch(err=>{
                Modal.hideAll();
                Modal.error(err.message)
            })
        }
    }


    storeData = async(res)=>{
        await AsyncStorage.setItem('token',res.data.token)

        this.props.actions.storeDetails(res.data)


        this.props.navigation.navigate('SignUpStage',{data : { userFields : res.data,stage : 0,fromLogin : false}})
    }


    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }



    validateDetails = () => {
        switch (true) {
            case this.state.firstName.trim() === "": {
                Modal.error("Enter first name.")
                return false
            }
            case this.state.lastName.trim() === "": {
                Modal.error("Enter last name.")
                return false
            }
            case this.state.email.trim() === "": {
                Modal.error("Enter email address.")
                return false
            }
            case (!this.validateEmail(this.state.email)): {
                Modal.error("Invalid email.")
                return false
            }
            case this.state.password.trim() === "": {
                Modal.error("Enter Password.")
                return false
            }
            case this.state.password.trim().length < 6: {
                Modal.error("Password length must be 6 character long")
                return false
            }

            case this.state.cPassword.trim() === "": {
                Modal.error("Enter Confirm password.")
                return false
            }
            case this.state.cPassword.trim().length < 6: {
                Modal.error("Confirm password length must be 6 character long")
                return false
            }
            case !this.state.tncChecked: {
                Modal.error("Please check terms & conditions")
                return false
            }
            case (this.state.password.trim() !== this.state.cPassword.trim()): {
                Modal.error("Password and Confirm Password does not match.")
                return false
            }
            default : {
                return true;
            }

        }
    }


    render() {
        return (
            <ImageBackground source={require('../../assets/images/bg.png')}
                style={[styles.logo]}>
                <SafeAreaView style={{flex:1}}>
                    <View style={{marginTop:30}}/>
                    <ToolBarComponent
                        title={"SignUp"}
                        navigation={this.props.navigation} />

                    <View style={styles.loginViews}>
                        <TextInputComponent
                            isSecure={false}
                            placeholder={"First Name"}
                            maxLength={100}
                            value={this.state.firstName}
                            onChangeText={(text) => this.setState({ firstName: text })}
                            isShowDrawable={false}
                        />
                        <TextInputComponent
                            isSecure={false}
                            placeholder={"Last Name"}
                            maxLength={100}
                            value={this.state.lastName}
                            onChangeText={(text) => this.setState({ lastName: text })}
                            isShowDrawable={false}
                        />
                        <TextInputComponent
                            isSecure={false}
                            placeholder={"Email"}
                            value={this.state.email}
                            maxLength={100}
                            onChangeText={(text) => this.setState({ email: text })}
                            isShowDrawable={false}
                        />
                        <TextInputComponent
                            isSecure={true}
                            placeholder={"Password"}
                            value={this.state.password}
                            maxLength={100}
                            onChangeText={(text) => this.setState({ password: text })}
                            isShowDrawable={false}
                        />
                        <TextInputComponent
                            isSecure={true}
                            value={this.state.cPassword}
                            placeholder={"Confirm Password"}
                            maxLength={100}
                            onChangeText={(text) => this.setState({ cPassword: text })}
                            isShowDrawable={false}
                        />
                        <CheckBoxComponent
                            onClickPress={(status) => this.setState({ tncChecked: status })}
                            style={{ alignSelf: 'flex-end', marginEnd: 10 }}
                            value={this.state.tncChecked}
                            title={"Terms & Conditions"} />
                    </View>

                    <TouchableOpacity onPress={() => this.signUp()} style={styles.signInContainer}>
                        <Text style={styles.signInText}>Sign Up</Text>
                        <Image source={require('../../assets/images/Next_Button.png')}
                            style={[styles.nextButton]} />
                    </TouchableOpacity>

                    <View style={styles.signInView}>
                        <Text style={styles.signDesc}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Text style={styles.signIn}>SignIn</Text>
                        </TouchableOpacity>
                    </View>


                </SafeAreaView>



            </ImageBackground>



        );
    }
}
const mapStateToProps = state => {
    return {
        userData: state.user
    }
};

const styles = StyleSheet.create({
    signIn: {
        textDecorationLine: 'underline',
        color: colors.primary,
        fontSize: 20,
        fontWeight: '600'
    },
    signDesc: {
        fontWeight: '600',
        fontSize: 20
    },
    signInView: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 50,
        alignItems: 'center'
    },
    container: {
    },
    loginViews: {
        marginTop: 20
    },
    logo: {
        height: '100%',
        width: '100%',
    },
    signInContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 30,
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
})

const mapDispatchToProps = (dispatch) => {
    return {
       actions: bindActionCreators(UserAction, dispatch)
    }
 }


export default connect(mapStateToProps, mapDispatchToProps)(Register);