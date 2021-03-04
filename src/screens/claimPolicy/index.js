
import React from 'react';
import { View, Image, Text, StatusBar,ScrollView, Animated, Easing, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import TextInputComponent from '../../components/textInput'
import CalenderView from '../../components/textInput/calenderView';
import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import ScreenName from '../../navigation/screenNames'
import colors from '../../utils/colors';
import Modal from '../../utils/modal';
import * as SSOServices from '../../services/SSOService'
import WebView from 'react-native-webview';
import DropDownView from '../../components/textInput/dropDown'
import DatePicker from '../../components/datePicker'
import ModalAlert from '../../utils/modal'

import { getDateStringFromDate } from '../../utils';



class PolicyClaimScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.navigation.state.params.data,
            insuredList: [],
            dateIncident: '',
            maxDate: Date(),
            minDate: Date(),
            illNessValue:""
        };

    }



    async componentDidMount() {
        console.log(this.state.data)

        this.formInsuredList(this.state.data)
    }


    formInsuredList = (data) => {
        let arr = []
        for (let index = 0; index < data.poilcy_details.table_data.length; index++) {
            const element = data.poilcy_details.table_data[index];
            arr.push({ label: element["0"], value: element["0"] })
        }



        //calculate min max date
        let firstDate = this.state.data.poilcy_details.first_date_of_cover
        let lastDate = this.state.data.poilcy_details.last_date_of_cover



        this.setState({
            insuredList: arr,
            phone: data.poilcy_details.policy_holder_phone,
            address: data.poilcy_details.policy_holder_address+", "+data.poilcy_details.policy_holder_city+", Ontario, "+data.poilcy_details.policy_holder_postal_code,
            minDate: Date.parse(firstDate),
            maxDate: Date.parse(lastDate)
        })
    }

    handleDatePicked = (data) => {
        let date = getDateStringFromDate(data);
        this.setState({
            dateIncident: date,
            fromDate: false 
        })
    }

    onPressSubmit= ()=>{
        if(this.validateFields()){
            let {data} = this.state;
            let formData = new FormData();

            let modal = ModalAlert.createProgressModal('Please wait...',false)
      
            formData.append("user_id",this.props.userData.userData.user_id);
            formData.append("policy_id", data.poilcy_details.id);
            formData.append("policy_no", data.poilcy_details.policy_no);
            formData.append("claimant_name",this.state.userName);
            formData.append("policy_holder_addr", this.state.address);
            formData.append("phone", this.state.phone);
            formData.append("date_incident", this.state.dateIncident);
            formData.append("illness_details", this.state.illNessValue);
            SSOServices.reportClaim(formData).then(res => {
              ModalAlert.hide(modal)
              ModalAlert.createModal({ text: 'Alert' }, { text: res.message }, false,
              ModalAlert.createSecondaryButton('Ok', () => {
                  this.props.navigation.goBack();
                 
                  ModalAlert.hideAll()
              }))
            }).catch(err => {
                ModalAlert.hide(modal)
            })
        }
    }

    validateFields=()=>{
        if(this.state.userName == null){
            ModalAlert.error("Please select Insured Persion")
            return false
        }

        if(this.state.dateIncident.trim() == ''){
            ModalAlert.error("Please select Date of Incident")
            return false
        }

        if(this.state.illNessValue.trim() == ''){
            ModalAlert.error("Please enter Illness Details")
            return false
        }

        return true;
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>

                <ScrollView>


                <View style={styles.toolbar}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={require('../../assets/images/arrow.png')}
                            style={[styles.logo]} />
                    </TouchableOpacity>
                    <Text style={styles.home}>Report a Claim</Text>
                </View>

                <View>
                    <Text style={{
                        marginTop: 20, marginStart: 20, fontWeight: 'bold', fontSize: 20, lineHeight:
                            30
                    }}>Policy Transaction No. ({this.state.data.poilcy_details.policy_no})</Text>

                    <View style={{ height: 1, width: '90%', backgroundColor: 'gray', alignSelf: 'center', marginTop: 20 }} />
                    <DropDownView
                        styles={{ alignSelf: 'flex-start', width: '100%', marginTop: 20 }}
                        childData={this.state.insuredList}
                        textstyles={{ marginStart: 24 }}
                        value={this.state.financialInsuredName}
                        onItemSelected={(value) => this.setState({ userName: value })}
                        dropDownTitle={"Select Insured Name:"} />
                    <Text style={{
                        marginTop: 10, marginStart: 24, fontWeight: 'bold', fontSize: 14
                    }}>Policy Holder Address:</Text>
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Policy Holder Address"}
                        maxLength={30}
                        disable={true}
                        styles={{ marginTop: 5 }}
                        value={this.state.address}
                        isShowDrawable={false}
                    />

                    <Text style={{
                        marginTop: 10, marginStart: 24, fontWeight: 'bold', fontSize: 14
                    }}>Policy Holder Phone:</Text>
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Policy Holder Phone"}
                        maxLength={30}
                        styles={{ marginTop: 5 }}
                        disable={true}
                        value={this.state.phone}
                        isShowDrawable={false}
                    />

                    <View>
                        <Text style={{
                            fontWeight: '700', marginStart: 24, fontSize: 15, marginTop: 10, color: 'black'
                        }} >Date of Incident:</Text>
                        <CalenderView
                            showCalender={true}
                            style={{ width: '90%', marginTop: 10, alignSelf: 'center', }}
                            onPress={() => this.setState({ fromDate: true })}
                            title={this.state.dateIncident} />

                    </View>

                    <DatePicker
                        datePicked={(data) => this.handleDatePicked(data)}
                        dateCanceled={() => this.setState({ fromDate: false })}
                        minimumDate={this.state.minDate}
                        maximumDate={this.state.maxDate}
                        showDate={this.state.fromDate} />

                    <Text style={{
                        marginTop: 10, marginStart: 24, fontWeight: 'bold', fontSize: 14
                    }}>Illness Details:</Text>
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Illness Details:"}
                        maxLength={30}
                        styles={{ marginTop: 5 }}
                        onChangeText={(value)=>this.setState({
                            illNessValue: value
                        })}
                        value={this.state.illNessValue}
                        isShowDrawable={false}
                    />
                </View>

                

                <TouchableOpacity onPress={() => this.onPressSubmit()} style={{ padding: 10, height: 50, marginBottom: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', marginStart: 10, marginTop: 20, marginRight: 12, width: '45%', borderRadius: 10, backgroundColor: 'rgb(62, 185, 186)' }}>
                        <Text style={{ textAlign: 'center', color: 'white', fontWeight: '800', fontSize: 16 }}>Submit</Text>
                    </TouchableOpacity>

                </ScrollView>

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
    webView: {
        flex: 1, marginTop: 20
    },
    container: {
        flex: 1
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



export default connect(mapStateToProps, null)(PolicyClaimScreen);