
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
            year: ''
        };



    }


    componentDidMount() {
        Modal.hideAll()
        let data = this.props.navigation.state.params.data

        this.setState({
            firstName: data.firstName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            custAddress: data.address,
            postalCode: data.postalCode,
            quotedAmount: "CAD " + data.finalAmount,
            finalAmount: data.finalAmount,
            firstDate: data.firstDate,
            paymentFrequency: data.paymentFrequency,
            id: data.id,
        })


    }






    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    onPressPayment = () => {
        if (this.isValidate()) {
            let modal = Modal.createProgressModal('Please Wait...',false);
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
            formData.append("amount", this.state.finalAmount)
            formData.append("first_date_of_cover", this.state.firstDate)
            formData.append("payment_frequency", this.state.paymentFrequency)
            formData.append("quotation_id", this.state.id)


            SSOServices.savePolicy(formData).then(res => {
                Modal.hide(modal)
                let modalAl = Modal.createModal({ text: '' }, { text: res.message }, true, Modal.createSecondaryButton('Ok', () => {
                        this.props.navigation.navigate('MyPolicy');
                        Modal.hide(modalAl)
                }))
            }).catch(err => {
                Modal.error(err.message)
                Modal.hide(modal)
            })
            console.log(formData)
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

        if (!this.state.isSelected) {
            Modal.error("Please select the terms and Conditions")
            return false
        }


        return true
    }


    render() {

        return (
            <SafeAreaView style={styles.container}>
                <ToolBarComponent
                    title={"Payment"}
                    navigation={this.props.navigation} />
                <ScrollView vertical style={styles.scrollContainer}>

                    <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                        <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>First Name</Text>

                        <TextInputComponent
                            isSecure={false}
                            styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                            placeholder={""}
                            disable={this.state.disableAll}
                            maxLength={30}
                            value={this.state.firstName}
                            onChangeText={(text) => this.setState({ firstName: text })}
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
                            value={this.state.lastName}
                            onChangeText={(text) => this.setState({ lastName: text })}
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
                            value={this.state.email}
                            onChangeText={(text) => this.setState({ email: text })}
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
                            value={this.state.custAddress}
                            onChangeText={(text) => this.setState({ custAddress: text })}
                            isShowDrawable={false}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                            <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Postal Code</Text>

                            <TextInputComponent
                                isSecure={false}
                                styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                                placeholder={""}
                                disable={this.state.disableAll}
                                maxLength={6}
                                keyboardType={'numeric'}

                                value={this.state.postalCode}
                                onChangeText={(text) => this.setState({ postalCode: text })}
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
                                value={this.state.phoneNumber}
                                onChangeText={(text) => this.setState({ phoneNumber: text })}
                                isShowDrawable={false}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                        <Text style={{ marginStart: 10, fontWeight: 'bold', marginStart: 20 }}>Card Number</Text>

                        <TextInputComponent
                            isSecure={false}
                            styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                            placeholder={""}
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
                                placeholder={""}
                                disable={this.state.disableAll}
                                maxLength={3}
                                value={this.state.cvv}
                                onChangeText={(text) => this.setState({ cvv: text })}
                                isShowDrawable={false}
                            />
                        </View>
                    </View>

                    <View style={{ backgroundColor: '#2B6FAE', flexDirection: 'row', padding: 10, justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', width: '95%', marginTop: 20, borderRadius: 10, alignSelf: 'center' }}>
                        <Text style={{ fontWeight: '600', color: 'white', fontSize: 20, marginStart: 10, marginTop: 10, marginBottom: 10, }}>Final Payment</Text>
                        <Text style={{ fontWeight: '600', color: 'white', fontSize: 20, marginEnd: 10, marginTop: 10, marginBottom: 10, }}>{this.state.quotedAmount}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <CheckBoxComponent
                            onClickPress={(status) => {
                                this.setState({
                                    isSelected: status
                                })
                            }}
                            style={{ marginEnd: 10 }}
                            value={this.state.isSelected}
                            title={""} />
                        <View style={{ marginTop: 20, marginStart: -20 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>By Checking the box, I/We agree to the </Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CommonScreen', { data: 1 })}><Text style={{ color: '#2B6FAE', fontSize: 18, fontWeight: 'bold' }}>terms and conditions</Text></TouchableOpacity>
                        </View>
                    </View>

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