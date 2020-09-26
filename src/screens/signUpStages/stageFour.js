
import React from 'react';
import { View, Image, Text, StatusBar, Animated, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, FlatList, ScrollView } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'

import { createAppContainer, createSwitchNavigator, SafeAreaView } from "react-navigation";
import Modal from '../../utils/modal';

import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import ScreenName from '../../navigation/screenNames'
import ToolBarComponent from '../../components/toolbar'
import TextInputComponent from '../../components/textInput'
import CheckBoxComponent from '../../components/checkbox';
import colors from '../../utils/colors';

import * as SSOServices from '../../services/SSOService'

class SignUpStageFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           refName1:'',
           refEmail1:'',
           refContact1:'',
           refAddress1:'',
           refName2:'',
           refEmail2:'',
           refContact2:'',
           refAddress2:'',
           refName3:'',
           refEmail3:'',
           refContact3:'',
           refAddress3:''
        };

    }

    componentDidMount() {

    }


 
    onClickNext = () =>{

        let modal = Modal.createProgressModal("Please wait...", false);
        let formData = new FormData()
        formData.append("user_id", "" + this.props.userData.user_id);
        this.state.refName1 !== '' && formData.append("reference_name_1", "" + this.state.refName1);
        this.state.refName2 !== '' && formData.append("reference_name_2", "" + this.state.refName2);
        this.state.refName3 !== '' && formData.append("reference_name_3", "" + this.state.refName3);
        this.state.refEmail1 !== '' && formData.append("reference_email_1", "" + this.state.refEmail1);
        this.state.refEmail2 !== '' && formData.append("reference_email_2", "" + this.state.refEmail2);
        this.state.refEmail3 !== '' && formData.append("reference_email_3", "" + this.state.refEmail3);
        this.state.refContact1 !== '' && formData.append("reference_contact_no_1", "" + this.state.refContact1);
        this.state.refContact2 !== '' && formData.append("reference_contact_no_2", "" + this.state.refContact2);
        this.state.refContact3 !== '' && formData.append("reference_contact_no_3", "" + this.state.refContact3);
        this.state.refAddress1 !== '' && formData.append("reference_address_1", "" + this.state.refAddress1);
        this.state.refAddress2 !== '' && formData.append("reference_address_2", "" + this.state.refAddress2);
        this.state.refAddress3 !== '' && formData.append("reference_address_3", "" + this.state.refAddress3);

        console.log(formData)


        SSOServices.stage4Api(formData).then(res => {
            Modal.hide(modal);
            this.props.onClickNext(1)
            console.log(res)
        }).catch(err => {
            Modal.hide(modal);
            Modal.error(err.message)
            console.log(err);
        })
    }

    render() {
        return (
                <ScrollView>    
                    <View style={{flex:1}}>

                    <View style={{ marginTop: 20 }}>
                <Text style={styles.reference}>Reference Person {0 + 1}</Text>
                <TextInputComponent
                    isSecure={false}
                    placeholder={"Name"}
                    maxLength={100}
                    onChangeText={(text) => this.setState({ refName1: text })}
                    isShowDrawable={false}
                />
                <TextInputComponent
                    isSecure={false}
                    placeholder={"Email"}
                    maxLength={100}
                    onChangeText={(text) => this.setState({ refEmail1: text })}
                    isShowDrawable={false}
                />
                <TextInputComponent
                    isSecure={false}
                    placeholder={"Contact No."}
                    maxLength={100}
                    onChangeText={(text) => this.setState({ refContact1: text })}
                    isShowDrawable={false}
                />
                <TextInputComponent
                    isSecure={false}
                    placeholder={"Address"}
                    maxLength={100}
                    onChangeText={(text) => this.setState({ refAddress1: text })}
                    isShowDrawable={false}
                />
            </View>

            <View style={{ marginTop: 20 }}>
                <Text style={styles.reference}>Reference Person {1 + 1}</Text>
                <TextInputComponent
                    isSecure={false}
                    placeholder={"Name"}
                    maxLength={100}
                    onChangeText={(text) => this.setState({ refName2: text })}
                    isShowDrawable={false}
                />
                <TextInputComponent
                    isSecure={false}
                    placeholder={"Email"}
                    maxLength={100}
                    onChangeText={(text) => this.setState({ refEmail2: text })}
                    isShowDrawable={false}
                />
                <TextInputComponent
                    isSecure={false}
                    placeholder={"Contact No."}
                    maxLength={100}
                    onChangeText={(text) => this.setState({ refContact2: text })}
                    isShowDrawable={false}
                />
                <TextInputComponent
                    isSecure={false}
                    placeholder={"Address"}
                    maxLength={100}
                    onChangeText={(text) => this.setState({ refAddress2: text })}
                    isShowDrawable={false}
                />
            </View>

            <View style={{ marginTop: 20 }}>
                <Text style={styles.reference}>Reference Person {2 + 1}</Text>
                <TextInputComponent
                    isSecure={false}
                    placeholder={"Name"}
                    maxLength={100}
                    onChangeText={(text) => this.setState({ refName3: text })}
                    isShowDrawable={false}
                />
                <TextInputComponent
                    isSecure={false}
                    placeholder={"Email"}
                    maxLength={100}
                    onChangeText={(text) => this.setState({ refEmail3: text })}
                    isShowDrawable={false}
                />
                <TextInputComponent
                    isSecure={false}
                    placeholder={"Contact No."}
                    maxLength={100}
                    onChangeText={(text) => this.setState({ refContact3: text })}
                    isShowDrawable={false}
                />
                <TextInputComponent
                    isSecure={false}
                    placeholder={"Address"}
                    maxLength={100}
                    onChangeText={(text) => this.setState({ refAddress3: text })}
                    isShowDrawable={false}
                />
            </View>

                    
                    <TouchableOpacity onPress={() => this.onClickNext()} activeOpacity={0.7} style={styles.nextButton}>
                        <Text style={styles.next}>Next</Text>
                    </TouchableOpacity>
                    </View>

                </ScrollView>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 10,
    },
    nextButton: {
        backgroundColor: '#3F6183',
        width: 150,
        marginBottom:200,
        height: 50,
        marginTop: 20,
        alignSelf: 'center',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    next: {
        color: colors.white,
        fontSize: 20,
        fontWeight: '600'
    },
    reference: {
        marginStart: 20,
        fontSize: 18,
        fontWeight: '600'
    }

})

const mapStateToProps = state => {
    return {
        userData: state.user.userData
    }
};

export default connect(mapStateToProps, null)(SignUpStageFour);