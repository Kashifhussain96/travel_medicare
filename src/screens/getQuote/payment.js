
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { connect } from "react-redux";
import TopBanner from '../../components/topBanner'
import Modal from '../../utils/modal';
import * as UserAction from '../../redux/actions/user'
import { bindActionCreators } from "redux";
import StatusBar from '../../components/statusbar';
import * as SSOServices from '../../services/SSOService'
import VisitContainer from '../../components/visitorsContainer';
import GreenButton from '../../components/button/greenButton';
import colors from '../../utils/colors';
import Underline from '../../components/underline';
import ImageTextContainer from '../../components/imageTextContainer';
import GetQuote from '../../components/button/getQuote';
import ContactContainer from '../../components/contactContainer';
import ToolBarComponent from '../../components/toolbar'
import TextInputComponent from '../../components/textInput'
import CheckBoxComponent from '../../components/checkbox';

import { StackActions, NavigationActions } from 'react-navigation';
class PaymentScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quotedAmount: "",
            isSelected: false,
            firstName: '',
            lastName: '',
            email: '',
            custAddress: '',
            postalCode: '',
            phoneNumber: '',
            card: '',
            month: '',
            cvv: '',
            year: '',
            insuranceType: props.navigation.state.params.insuranceType,
            secondaryCard: false,
            amount: '',
            sec_firstName: '',
            sec_lastName: '',
            sec_email: '',
            sec_custAddress: '',
            sec_postalCode: '',
            sec_phoneNumber: '',
            sec_card: '',
            sec_month: '',
            sec_cvv: '',
            sec_year: '',
            sec_amount: '',
            primardCardCons: false,
            sec_secondaryCard: false
        };



    }


    componentDidMount() {
        Modal.hideAll()
        let data = this.props.navigation.state.params.data



        this.setState({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            custAddress: data.address,
            postalCode: data.postalCode,
            quotedAmount: "CAD " + data.finalAmount,
            finalAmount: data.finalAmount,
            firstDate: data.firstDate,
            paymentFrequency: data.paymentFrequency,
            id: data.id,
            insuranceType: data.insuranceType,
            secCardStatus: data.secondaryCardStatus
        })


        this.setSecCard(data.secondaryCardStatus)


    }


    setSecCard = (data) => {
        if (data != null || data != undefined) {
            this.setState({
                secondaryCard: true
            })
        }
    }


    navigateToHome = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'HomeInitial' })],
        });
        this.props.navigation.dispatch(resetAction);
    }


    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    onPressPayment = () => {
        if (this.isValidate()) {


            if (this.state.insuranceType == 1) {

                if (this.state.secondaryCard) {
                    if (!this.state.primardCardCons) {
                        Modal.error("Please accept primary card consent")
                        return false
                    }
                    if (this.validateSecondCard()) {

                        if ((parseInt(this.state.amount) + parseInt(this.state.sec_amount)) != parseInt(this.state.finalAmount)) {
                            Modal.error("Addition of amount must be equal to quote amount. !")
                            return false
                        }

                        if (!this.state.isSelected) {
                            Modal.error("Please accept payment terms and condition")
                            return false
                        }
                        let modal = Modal.createProgressModal('Please Wait...', false);
                        let formData = new FormData();
                        formData.append("user_id", this.props.userData.user_id);
                        formData.append("first_name", this.state.firstName)
                        formData.append("last_name", this.state.lastName)
                        formData.append("email", this.state.email)
                        formData.append("mobile", this.state.phoneNumber)
                        formData.append("zip", this.state.postalCode)
                        formData.append("cardNumber", this.state.card)
                        formData.append("month", this.state.month)
                        formData.append("year", this.state.year)
                        formData.append("code", this.state.cvv)
                        formData.append("amount", parseInt(this.state.finalAmount))
                        formData.append("first_amount", parseInt(this.state.amount))
                        formData.append("address", this.state.custAddress)
                        formData.append("first_date_of_cover", this.state.firstDate)
                        formData.append("payment_frequency", this.state.paymentFrequency)
                        formData.append("quotation_id", this.state.id)
                        formData.append("secondary_first_name", this.state.sec_firstName)
                        formData.append("secondary_last_name", this.state.sec_lastName)
                        formData.append("secondary_email", this.state.sec_email)
                        formData.append("multicard_option", 1)
                        formData.append("secondary_address", this.state.sec_custAddress)
                        formData.append("secondary_zip", this.state.sec_postalCode)
                        formData.append("second_amt", parseInt(this.state.sec_amount))
                        formData.append("secondary_mobile", this.state.sec_phoneNumber)
                        formData.append("secondary_cardNumber", this.state.sec_card)
                        formData.append("secondary_month", this.state.sec_month)
                        formData.append("secondary_code", this.state.sec_cvv)
                        formData.append("secondary_year", this.state.sec_year)

                        SSOServices.savePaymentMulticard(formData).then(res => {
                            Modal.hide(modal)
                            let modalAl = Modal.createModal({ text: '' }, { text: res.message }, true, Modal.createSecondaryButton('Ok', () => {
                                this.navigateToHome();
                                Modal.hide(modalAl)
                            }))
                        }).catch(err => {
                            Modal.error(err.message)
                            Modal.hide(modal)
                        })
                    }

                } else {

                    if (this.state.amount == '') {
                        Modal.error("Please enter amount")
                        return false
                    }
                    if (!this.state.primardCardCons) {
                        Modal.error("Please accept primary card consent")
                        return false
                    }
                    if (!this.state.isSelected) {
                        Modal.error("Please accept payment terms and condition")
                        return false
                    }
                    let modal = Modal.createProgressModal('Please Wait...', false);
                    let formData = new FormData();
                    formData.append("user_id", this.props.userData.user_id);
                    formData.append("first_name", this.state.firstName)
                    formData.append("last_name", this.state.lastName)
                    formData.append("email", this.state.email)
                    formData.append("mobile", this.state.phoneNumber)
                    formData.append("zip", this.state.postalCode)
                    formData.append("cardNumber", this.state.card)
                    formData.append("month", this.state.month)
                    formData.append("address", this.state.custAddress)
                    formData.append("year", this.state.year)
                    formData.append("code", this.state.cvv)
                    formData.append("multicard_option", 1)
                    formData.append("first_date_of_cover", this.state.firstDate)
                    formData.append("payment_frequency", this.state.paymentFrequency)
                    formData.append("quotation_id", this.state.id)
                    formData.append("amount", parseInt(this.state.finalAmount))
                    formData.append("first_amount", parseInt(this.state.amount))
                    SSOServices.savePolicy(formData).then(res => {
                        Modal.hide(modal)
                        let modalAl = Modal.createModal({ text: '' }, { text: res.message }, true, Modal.createSecondaryButton('Ok', () => {
                            this.navigateToHome();
                            Modal.hide(modalAl)
                        }))
                    }).catch(err => {
                        Modal.error(err.message)
                        Modal.hide(modal)
                    })
                }

            } else {
                if (!this.state.isSelected) {
                    Modal.error("Please accept payment terms and condition")
                    return false
                }
                let modal = Modal.createProgressModal('Please Wait...', false);
                let formData = new FormData();
                formData.append("user_id", this.props.userData.user_id);
                formData.append("first_name", this.state.firstName)
                formData.append("last_name", this.state.lastName)
                formData.append("email", this.state.email)
                formData.append("mobile", this.state.phoneNumber)
                formData.append("address", this.state.custAddress)
                formData.append("zip", this.state.postalCode)
                formData.append("cardNumber", this.state.card)
                formData.append("month", this.state.month)
                formData.append("year", this.state.year)
                formData.append("code", this.state.cvv)
                formData.append("amount", this.state.finalAmount)
                formData.append("first_date_of_cover", this.state.firstDate)
                formData.append("payment_frequency", this.state.paymentFrequency)
                formData.append("quotation_id", this.state.id)


                SSOServices.savePolicySTC(formData).then(res => {
                    Modal.hide(modal)
                    let modalAl = Modal.createModal({ text: '' }, { text: res.message }, true, Modal.createSecondaryButton('Ok', () => {
                        this.navigateToHome();
                        Modal.hide(modalAl)
                    }))
                }).catch(err => {
                    Modal.error(err.message)
                    Modal.hide(modal)
                })
            }



        }
    }

    isValidate = () => {
        if (this.state.firstName == '') {
            Modal.error("Enter first name")
            return false
        }

        if (this.state.lastName == '') {
            Modal.error("Enter last name")
            return false
        }

        if (this.state.email == '') {
            Modal.error("Enter email address")
            return false
        }

        if (!this.validateEmail(this.state.email)) {
            Modal.error("Please enter valid Email ID")
            return false
        }

        if (this.state.postalCode == '') {
            Modal.error("Enter postal code")
            return false
        }

        if (this.state.postalCode.length != 6) {
            Modal.error("Invalid  postal code, it must contain 6 digit")
            return false
        }

        if (this.state.phoneNumber == '') {
            Modal.error("Enter phone number")
            return false
        }

        if (this.state.phoneNumber.length != 10) {
            Modal.error("Invalid phone number, it must contain 10 digit")
            return false
        }


        if (this.state.card == '') {
            Modal.error("Enter card number")
            return false
        }

        if (this.state.card.length != 16) {
            Modal.error("Invalid card number, it must contain 16 digit")
            return false
        }


        if (this.state.month == '') {
            Modal.error("Enter Month")
            return false
        }

        if (this.state.year == '') {
            Modal.error("Enter Year")
            return false
        }

        if (this.state.year.length != 4) {
            Modal.error("Year should be in 4 digit")
            return false
        }



        if (this.state.cvv == '') {
            Modal.error("Enter CVV")
            return false
        }

        return true
    }



    validateSecondCard = () => {
        if (this.state.sec_firstName == '') {
            Modal.error("Enter first name")
            return false
        }

        if (this.state.sec_lastName == '') {
            Modal.error("Enter last name")
            return false
        }

        if (this.state.sec_email == '') {
            Modal.error("Enter email address")
            return false
        }

        if (!this.validateEmail(this.state.sec_email)) {
            Modal.error("Please enter valid Email ID")
            return false
        }

        if (this.state.sec_postalCode == '') {
            Modal.error("Enter postal code")
            return false
        }

        if (this.state.sec_postalCode.length != 6) {
            Modal.error("Invalid  postal code, it must contain 6 digit")
            return false
        }

        if (this.state.sec_phoneNumber == '') {
            Modal.error("Enter phone number")
            return false
        }

        if (this.state.sec_phoneNumber.length != 10) {
            Modal.error("Invalid phone number, it must contain 10 digit")
            return false
        }


        if (this.state.sec_card == '') {
            Modal.error("Enter card number")
            return false
        }

        if (this.state.sec_card.length != 16) {
            Modal.error("Invalid card number, it must contain 16 digit")
            return false
        }


        if (this.state.sec_month == '') {
            Modal.error("Enter Month")
            return false
        }

        if (this.state.sec_year == '') {
            Modal.error("Enter Year")
            return false
        }

        if (this.state.sec_year.length != 4) {
            Modal.error("Year should be in 4 digit")
            return false
        }



        if (this.state.sec_cvv == '') {
            Modal.error("Enter CVV")
            return false
        }



        if (this.state.sec_amount == '') {
            Modal.error("Enter secondary amount")
            return false
        }

        if (!this.state.sec_secondaryCard) {
            Modal.error("Please accept secondary card consent")
            return false
        }


        return true
    }

    renderSecondaryCard = () => {
        return (
            <View style={{ marginTop: 20 }}>
                <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', marginStart: 10 }}>Secondary Card Details</Text>



                <View style={{ borderWidth: 1, margin: 10, borderRadius: 10, borderColor: '#ddd' }}>

                    <View style={{ backgroundColor: '#f5f5f5', borderTopEndRadius: 10, borderTopStartRadius: 10, height: 50, justifyContent: "center" }}>
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', marginStart: 10 }}>Customer Information</Text>
                    </View>

                    <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                        <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>First Name</Text>

                        <TextInputComponent
                            isSecure={false}
                            styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                            placeholder={""}
                            disable={this.state.disableAll}
                            maxLength={30}
                            value={this.state.sec_firstName}
                            onChangeText={(text) => this.setState({ sec_firstName: text })}
                            isShowDrawable={false}
                        />
                    </View>
                    <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                        <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Last Name</Text>

                        <TextInputComponent
                            isSecure={false}
                            styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                            placeholder={""}
                            disable={this.state.disableAll}
                            maxLength={30}
                            value={this.state.sec_lastName}
                            onChangeText={(text) => this.setState({ sec_lastName: text })}
                            isShowDrawable={false}
                        />
                    </View>
                    <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                        <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Email Address</Text>

                        <TextInputComponent
                            isSecure={false}
                            styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                            placeholder={""}
                            disable={this.state.disableAll}
                            maxLength={50}
                            value={this.state.sec_email}
                            onChangeText={(text) => this.setState({ sec_email: text })}
                            isShowDrawable={false}
                        />
                    </View>
                    <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                        <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Customer Address</Text>

                        <TextInputComponent
                            isSecure={false}
                            styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                            placeholder={""}
                            disable={this.state.disableAll}
                            maxLength={50}
                            value={this.state.sec_custAddress}
                            onChangeText={(text) => this.setState({ sec_custAddress: text })}
                            isShowDrawable={false}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Postal Code</Text>

                            <TextInputComponent
                                isSecure={false}
                                styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                                placeholder={""}
                                disable={this.state.disableAll}
                                maxLength={6}
                                keyboardType={'numeric'}
                                value={this.state.sec_postalCode}
                                onChangeText={(text) => this.setState({ sec_postalCode: text })}
                                isShowDrawable={false}
                            />
                        </View>
                        <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Phone Number</Text>

                            <TextInputComponent
                                isSecure={false}
                                styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                                placeholder={""}
                                disable={this.state.disableAll}
                                maxLength={13}
                                keyboardType={'numeric'}
                                value={this.state.sec_phoneNumber}
                                onChangeText={(text) => this.setState({ sec_phoneNumber: text })}
                                isShowDrawable={false}
                            />
                        </View>
                    </View>
                </View>

                <View style={{ borderWidth: 1, margin: 10, borderRadius: 10, borderColor: '#ddd' }}>

                    <View style={{ backgroundColor: '#f5f5f5', borderTopEndRadius: 10, borderTopStartRadius: 10, height: 50, justifyContent: "center" }}>
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', marginStart: 10 }}>Payment Details</Text>
                    </View>

                    <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                        <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Card Number</Text>

                        <TextInputComponent
                            isSecure={false}
                            styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                            placeholder={"Valid Card Number"}
                            disable={this.state.disableAll}
                            maxLength={16}
                            keyboardType={'numeric'}
                            value={this.state.sec_card}
                            onChangeText={(text) => this.setState({ sec_card: text })}
                            isShowDrawable={false}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Month</Text>

                            <TextInputComponent
                                isSecure={false}
                                styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                                placeholder={"MM"}
                                disable={this.state.disableAll}
                                maxLength={2}
                                keyboardType={'numeric'}
                                value={this.state.sec_month}
                                onChangeText={(text) => this.setState({ sec_month: text })}
                                isShowDrawable={false}
                            />
                        </View>
                        <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Year</Text>

                            <TextInputComponent
                                isSecure={false}
                                styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                                placeholder={"YYYY"}
                                disable={this.state.disableAll}
                                maxLength={4}
                                keyboardType={'numeric'}
                                value={this.state.sec_year}
                                onChangeText={(text) => this.setState({ sec_year: text })}
                                isShowDrawable={false}
                            />
                        </View>
                        <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>CVV</Text>

                            <TextInputComponent
                                isSecure={false}
                                styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                                placeholder={"CV"}
                                disable={this.state.disableAll}
                                maxLength={3}
                                keyboardType={'numeric'}
                                value={this.state.sec_cvv}
                                onChangeText={(text) => this.setState({ sec_cvv: text })}
                                isShowDrawable={false}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 1, marginEnd: 10, }}>
                        <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>CVV</Text>

                        <TextInputComponent
                            isSecure={false}
                            styles={{ marginStart: 10, height: 45 }}
                            placeholder={"Amount"}
                            disable={this.state.disableAll}
                            maxLength={10}
                            keyboardType={'numeric'}
                            value={this.state.sec_amount}
                            onChangeText={(text) => this.setState({ sec_amount: text })}
                            isShowDrawable={false}
                        />
                    </View>
                    <CheckBoxComponent
                        onClickPress={(status) => {
                            this.setState({
                                sec_secondaryCard: status
                            })
                        }}
                        titleStyles={{ fontSize: 16 }}
                        style={{ marginEnd: 10, marginTop: -10 }}
                        value={this.state.sec_secondaryCard}
                        title={"By checking the box, I / We confirm that i/we have given permission to use my credit card for the specified amount"} />
                </View>
            </View>
        )
    }


    render() {

        return (
            <SafeAreaView style={styles.container}>
                <ToolBarComponent
                    title={"Payment"}
                    navigation={this.props.navigation} />
                <ScrollView vertical style={styles.scrollContainer}>
                    {
                        this.state.insuranceType == 2 && <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', marginStart: 10 }}>Primary Card Details</Text>
                    }


                    <View style={{ borderWidth: 1, margin: 10, borderRadius: 10, borderColor: '#ddd' }}>

                        <View style={{ backgroundColor: '#f5f5f5', borderTopEndRadius: 10, borderTopStartRadius: 10, height: 50, justifyContent: "center" }}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', marginStart: 10 }}>Customer Information</Text>
                        </View>

                        <View style={{ flex: 1, marginTop: 20 }}>
                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>First Name</Text>

                            <TextInputComponent
                                isSecure={false}
                                styles={{ marginTop: 8, height: 45 }}
                                placeholder={""}
                                disable={this.state.disableAll}
                                maxLength={30}
                                value={this.state.firstName}
                                onChangeText={(text) => this.setState({ firstName: text })}
                                isShowDrawable={false}
                            />
                        </View>
                        <View style={{ flex: 1, marginTop: 20 }}>
                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Last Name</Text>

                            <TextInputComponent
                                isSecure={false}
                                styles={{ marginTop: 8, height: 45 }}
                                placeholder={""}
                                disable={this.state.disableAll}
                                maxLength={30}
                                value={this.state.lastName}
                                onChangeText={(text) => this.setState({ lastName: text })}
                                isShowDrawable={false}
                            />
                        </View>
                        <View style={{ flex: 1, marginTop: 20 }}>
                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Email Address</Text>

                            <TextInputComponent
                                isSecure={false}
                                styles={{ marginTop: 8, height: 45 }}
                                placeholder={""}
                                disable={this.state.disableAll}
                                maxLength={50}
                                value={this.state.email}
                                onChangeText={(text) => this.setState({ email: text })}
                                isShowDrawable={false}
                            />
                        </View>
                        <View style={{ flex: 1, marginTop: 20 }}>
                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Customer Address</Text>

                            <TextInputComponent
                                isSecure={false}
                                styles={{ marginTop: 8, height: 45 }}
                                placeholder={""}
                                disable={this.state.disableAll}
                                maxLength={50}
                                value={this.state.custAddress}
                                onChangeText={(text) => this.setState({ custAddress: text })}
                                isShowDrawable={false}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                            <View style={{ flex: 1, marginTop: 20 }}>
                                <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Postal Code</Text>

                                <TextInputComponent
                                    isSecure={false}
                                    styles={{ marginTop: 8, height: 45 }}
                                    placeholder={""}
                                    disable={this.state.disableAll}
                                    maxLength={6}
                                    keyboardType={'numeric'}
                                    value={this.state.postalCode}
                                    onChangeText={(text) => this.setState({ postalCode: text })}
                                    isShowDrawable={false}
                                />
                            </View>
                            <View style={{ flex: 1, marginTop: 20 }}>
                                <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Phone Number</Text>

                                <TextInputComponent
                                    isSecure={false}
                                    styles={{ marginTop: 8, height: 45 }}
                                    placeholder={""}
                                    disable={this.state.disableAll}
                                    maxLength={13}
                                    keyboardType={'numeric'}
                                    value={this.state.phoneNumber}
                                    onChangeText={(text) => this.setState({ phoneNumber: text })}
                                    isShowDrawable={false}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ borderWidth: 1, margin: 10, borderRadius: 10, borderColor: '#ddd' }}>

                        <View style={{ backgroundColor: '#f5f5f5', borderTopEndRadius: 10, borderTopStartRadius: 10, height: 50, justifyContent: "center" }}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', marginStart: 10 }}>Payment Details</Text>
                        </View>

                        {
                            this.state.secCardStatus == null || this.state.secCardStatus == undefined

                                ?
                                <View>

                                    <View style={{ flex: 1, marginTop: 20 }}>
                                        <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Card Number</Text>

                                        <TextInputComponent
                                            isSecure={false}
                                            styles={{ marginTop: 8, height: 45 }}
                                            placeholder={"Valid Card Number"}
                                            disable={this.state.disableAll}
                                            maxLength={16}
                                            keyboardType={'numeric'}
                                            value={this.state.card}
                                            onChangeText={(text) => this.setState({ card: text })}
                                            isShowDrawable={false}
                                        />
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Month</Text>

                                            <TextInputComponent
                                                isSecure={false}
                                                styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                                                placeholder={"MM"}
                                                disable={this.state.disableAll}
                                                maxLength={2}
                                                keyboardType={'numeric'}
                                                value={this.state.month}
                                                onChangeText={(text) => this.setState({ month: text })}
                                                isShowDrawable={false}
                                            />
                                        </View>
                                        <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Year</Text>

                                            <TextInputComponent
                                                isSecure={false}
                                                styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                                                placeholder={"YYYY"}
                                                disable={this.state.disableAll}
                                                maxLength={4}
                                                keyboardType={'numeric'}
                                                value={this.state.year}
                                                onChangeText={(text) => this.setState({ year: text })}
                                                isShowDrawable={false}
                                            />
                                        </View>
                                        <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>CVV</Text>

                                            <TextInputComponent
                                                isSecure={false}
                                                styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                                                placeholder={"CV"}
                                                disable={this.state.disableAll}
                                                maxLength={3}
                                                keyboardType={'numeric'}
                                                value={this.state.cvv}
                                                onChangeText={(text) => this.setState({ cvv: text })}
                                                isShowDrawable={false}
                                            />
                                        </View>


                                    </View>
                                    {
                                        this.state.insuranceType == 1 &&
                                        <View style={{ flex: 1, marginTop: 10 }}>
                                            <Text style={{ fontWeight: 'bold', marginStart: 20 }}>Amount</Text>

                                            <TextInputComponent
                                                isSecure={false}
                                                styles={{ marginTop: 5, height: 45 }}
                                                placeholder={"Amount"}
                                                disable={this.state.disableAll}
                                                maxLength={10}
                                                keyboardType={'numeric'}
                                                value={this.state.amount}
                                                onChangeText={(text) => this.setState({ amount: text })}
                                                isShowDrawable={false}
                                            />
                                        </View>
                                    }

                                    {
                                        this.state.insuranceType == 2 ? <View style={{ flexDirection: 'row', }}>
                                            <CheckBoxComponent
                                                onClickPress={(status) => {
                                                    this.setState({
                                                        isSelected: status
                                                    })
                                                }}
                                                style={{ marginEnd: 10, marginTop: -20 }}
                                                value={this.state.isSelected}
                                                title={""} />
                                            <View style={{ marginStart: -20, marginBottom: 20 }}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>By Checking the box, I/We agree to the </Text>
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate('CommonScreen', { data: 1 })}><Text style={{ color: '#2B6FAE', fontSize: 18, fontWeight: 'bold' }}>terms and conditions</Text></TouchableOpacity>
                                            </View>
                                        </View>

                                            :
                                            <CheckBoxComponent
                                                onClickPress={(status) => {
                                                    this.setState({
                                                        primardCardCons: status
                                                    })
                                                }}
                                                titleStyles={{ fontSize: 16 }}
                                                style={{ marginEnd: 10, marginTop: -10 }}
                                                value={this.state.primardCardCons}
                                                title={"By checking the box, I / We confirm that i/we have given permission to use my credit card for the specified amount"} />
                                    }

                                </View>

                                :

                                <Text style={{
                                    marginStart: 10,
                                    marginTop: 10,
                                    marginBottom: 20,
                                    fontSize: 16
                                }}>We received CAD {parseInt(this.state.finalAmount) - parseInt(this.state.secCardStatus)} from your primary card. Please pay pending amount to complete this transaction.</Text>

                        }
                    </View>


                    {
                        this.state.insuranceType == 1 &&

                        <View>
                            <TouchableOpacity disabled={this.state.secCardStatus != null || this.state.secCardStatus !=undefined } onPress={() => this.setState({
                                secondaryCard: !this.state.secondaryCard
                            })} activeOpacity={0.7} style={{
                                padding: 12,
                                borderRadius: 60,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 15,
                                marginStart: 10
                            }}>
                                <Image source={this.state.secondaryCard ? require('../../assets/checkbox.png') : require('../../assets/unCheck.png')}
                                    style={{
                                        width: 20,
                                        height: 20
                                    }} />
                                <Text style={{
                                    alignSelf: 'center',
                                    fontSize: 20,
                                    marginStart: 10,
                                    marginEnd: 10
                                }}>If you dont have higher limits on card, add another card details to make payment</Text>
                            </TouchableOpacity>
                        </View>

                    }


                    {this.state.secondaryCard && this.renderSecondaryCard()}

                    <View style={{ backgroundColor: '#2B6FAE', flexDirection: 'row', padding: 10, justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', width: '95%', marginTop: 20, borderRadius: 10, alignSelf: 'center' }}>
                        <Text style={{ fontWeight: '600', color: 'white', fontSize: 20, marginStart: 10, marginTop: 10, marginBottom: 10, }}>Final Payment</Text>
                        <Text style={{ fontWeight: '600', color: 'white', fontSize: 20, marginEnd: 10, marginTop: 10, marginBottom: 10, }}>{this.state.quotedAmount}</Text>
                    </View>


                    {
                        this.state.insuranceType == 1 &&
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <CheckBoxComponent
                                onClickPress={(status) => {
                                    this.setState({
                                        isSelected: status
                                    })
                                }}
                                style={{ marginEnd: 10, marginTop: -20 }}
                                value={this.state.isSelected}
                                title={""} />
                            <View style={{ marginStart: -20, marginBottom: 20 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>By Checking the box, I/We agree to the </Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('CommonScreen', { data: 1 })}><Text style={{ color: '#2B6FAE', fontSize: 18, fontWeight: 'bold' }}>terms and conditions</Text></TouchableOpacity>
                            </View>
                        </View>
                    }

                    <TouchableOpacity onPress={() => this.onPressPayment()} style={{ backgroundColor: '#52B052', marginTop: 30, flexDirection: 'row', padding: 10, justifyContent: 'center', marginBottom: 100, alignItems: 'center', alignContent: 'center', width: '95%', borderRadius: 10, alignSelf: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Final Payment</Text>
                    </TouchableOpacity>


                </ScrollView>

            </SafeAreaView>

        );
    }
}
const mapStateToProps = state => {
    return {
        userData: state.user.userData
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(UserAction, dispatch)
    }
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },

})


export default connect(mapStateToProps, mapDispatchToProps)(PaymentScreen);