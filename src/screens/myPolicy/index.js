
import React from 'react';
import { View, Image, Text, StatusBar, TouchableOpacity, Easing, SafeAreaView, StyleSheet, ScrollView, FlatList, Linking } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'
import ToolBarComponent from '../../components/toolbar'
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import colors from '../../utils/colors';
import * as SSOServices from '../../services/SSOService'
import ModalAlert from '../../utils/modal'
import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import DatePicker from '../../components/datePicker'
import { getDateStringFromDate } from '../../utils';

import CalenderView from '../../components/textInput/calenderView';
import DropDownView from '../../components/textInput/dropDown'
import Modal from '../../utils/modal';

import * as Listeners from "../../utils/listeners";

class MyPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            userList: [],
            toDate: '',
            fromDate: '',
            user: '',
            role: ''
        };

    }


    async componentDidMount() {
        this.getData();
    }





    getData = () => {
        let modal = ModalAlert.createProgressModal('Fetching Data...', false)
        let formData = new FormData();
        formData.append("user_id", this.props.userData.user_id);
        formData.append("role", this.props.userData.role);
        formData.append("from_data", this.state.fromDate)
        formData.append("to_data", this.state.toDate)
        formData.append("selected_role", this.state.user)
        SSOServices.getPolicy(formData).then(res => {
            this.setState({
                data: res.data
            })
            ModalAlert.hideAll()
        }).catch(err => {
            ModalAlert.hideAll()
        })
    }

    // getCancel = () =>{
    //     let modal = ModalAlert.createProgressModal('Fetching Data...', false)
    //     let formData = new FormData();
    //     formData.append("user_id", this.props.userData.user_id);
    //     formData.append("role", this.props.userData.role);
    //             SSOServices.getCancel(formData).then(res => {
    //                 this.setState({
    //                     data:res.data
    //                 })
    //         ModalAlert.hide(modal)
    //     }).catch(err => {
    //         ModalAlert.hide(modal)
    //     })

    // }

    renderButtons = () => {
        return (
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity onPress={() => this.onPressSearch()} activeOpacity={0.7} style={styles.nextButton}>
                    <Text style={styles.next}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onPressReset()} activeOpacity={0.7} style={styles.nextButton}>
                    <Text style={styles.next}>Reset</Text>
                </TouchableOpacity>
            </View>
        )
    }


    onPressReset = () => {
        this.setState({
            fromDate: '',
            toDate: '',
            user: '',
            role: ''
        }, () => {
            this.getData()
        })
    }

    onPressSearch = () => {

        // if ((this.state.role == '')  || (this.state.fromDate == '' && this.state.toDate == '')) {
        //    // ModalAlert.error("Please select Role or From Date to To Date")
        //     // alert((this.state.role == '')  || (this.state.fromDate == '' && this.state.toDate == ''))
        //     alert(this.state.role == '')
        //     return
        // }



        if (this.state.role == "") {
            if (this.state.fromDate == '' && this.state.toDate == '') {
                ModalAlert.error("Please select Role or From Date to To Date")
                return
            }
        }



        var d1 = Date.parse(this.state.fromDate);
        var d2 = Date.parse(this.state.toDate);
        if (d2 < d1) {
            ModalAlert.error("From Date should be lesser than To Date")
            return
        }

        this.getData()
    }


    renderDatesContainer = () => {
        return (
            <View style={styles.datesContainer}>
                <View style={{ width: '50%' }}>
                    <Text>From Date</Text>
                    <CalenderView
                        style={{ width: '90%', marginEnd: 20 }}
                        showCalender={true}
                        onPress={() => this.setState({ showPicker: true })}
                        title={this.state.fromDate} />
                </View>
                <View style={{ width: '50%' }}>
                    <Text>To Date</Text>
                    <CalenderView
                        style={{ width: '90%', marginEnd: 20 }}
                        showCalender={true}
                        onPress={() => this.setState({ showPickerToDate: true })}
                        title={this.state.toDate} />
                </View>

                <DatePicker
                    datePicked={(data) => this.handleDatePicked(data, 1)}
                    dateCanceled={() => this.setState({ showPicker: false })}
                    showDate={this.state.showPicker} />

                <DatePicker
                    datePicked={(data) => this.handleDatePicked(data, 2)}
                    dateCanceled={() => this.setState({ showPickerToDate: false })}
                    showDate={this.state.showPickerToDate} />
            </View>
        )
    }

    handleDatePicked = (data, status) => {
        let date = getDateStringFromDate(data)

        if (status === 1) {
            this.setState({
                fromDate: date,
                showPicker: false
            })
        } else {
            this.setState({
                toDate: date,
                showPickerToDate: false
            })
        }
    }


    onPressAction = (item, status) => {
        switch (status) {
            case 0:
                this.props.navigation.navigate('CancelPolicy', { id: item.id, quotation_id: item.quotation_id, status: item.status })
                break;
            case 1:
                this.props.navigation.navigate('PolicyDetails', { id: item.quotation_id ,policy_id: item.id})
                break;
            case 2:
                this.emailPolicy(item.quotation_id)
                break;
            case 4:
                this.reissueData(item.quotation_id)
                break;

        }
    }

    reissueData = (id) =>{
        this.props.navigation.navigate('GetQuote', { id: id,isCopy:true,isReissue : true })

    }

    getStatus = (status) => {
        if (status == 2) {
            return "Pending Cancellation"
        } else if (status == 3) {
            return "Cancelled"
        } else if (status == 4) {
            return "Pending Void"
        } else if (status == 1) {
            return "Active"
        } else if (status == 6) {
            return "Policy Change Pending"
        }else if (status == 7) {
            return "Matured"
        }else if(status == 5){
            return "Void"
        }
    }


    onPressDocument = (index, item) => {
        ModalAlert.createOptionModal(this.renderDownloadButtons(item), false, { height:"60%" })
    }


    renderDownloadButtons = (item) => {
        return (
            <View>
                <Text style={{ fontSize: 20 }}>Document Policy No.</Text>
                <Text style={{ fontSize: 18, marginTop: 10, fontWeight: '600' }}>{item.policy_no}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.policy_docs[0].document_name}</Text>
                    <TouchableOpacity onPress={() => { Linking.openURL(item.policy_docs[0].doc) }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../assets/download.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.policy_docs[1].document_name}</Text>
                    <TouchableOpacity onPress={() => { Linking.openURL(item.policy_docs[1].doc) }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../assets/download.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.policy_docs[2].document_name}</Text>
                    <TouchableOpacity onPress={() => { Linking.openURL(item.policy_docs[2].doc) }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../assets/download.png')} />
                    </TouchableOpacity>
                </View>

            </View>

        )
    }

    renderItem = ({ item, index }) => {

        let arr = [
            { label: "View", value: "1" },
            { label: "Email Policy", value: "2" },
            { label: "Endorsement", value: "3" },
            { label: "Re-Issue", value: "4" }
        ]

        if(item.status != 1) {
            arr.pop() 
            arr.pop() 
        } 

        return (
            <View style={[styles.itemView]}>
                <Text style={styles.listItemText}>{item.user_name}</Text>
                <View style={{ height: 80, backgroundColor: 'black', width: 1 }} />
                <Text style={styles.listItemText}>{item.role_name}</Text>
                <View style={{ height: 80, backgroundColor: 'black', width: 1 }} />
                <Text style={styles.listItemText}>{item.policy_no}</Text>
                <View style={{ height: 80, backgroundColor: 'black', width: 1 }} />
                <Text style={styles.listItemText}>{item.date_of_issue}</Text>
                <View style={{ height: 80, backgroundColor: 'black', width: 1 }} />
                <Text style={styles.listItemText}>{item.policy_holder_name}</Text>
                <View style={{ height: 80, backgroundColor: 'black', width: 1 }} />
                <Text style={styles.listItemText}>{item.policy_type}</Text>
                <View style={{ height: 80, backgroundColor: 'black', width: 1 }} />
                <Text style={styles.listItemText}>{'CAD ' + item.quote_amount}</Text>
                <View style={{ height: 80, backgroundColor: 'black', width: 1 }} />
                <Text style={styles.listItemText}>{this.getStatus(item.status)}</Text>
                <View style={{ height: 80, backgroundColor: 'black', width: 1 }} />
                <TouchableOpacity onPress={() => this.onPressDocument(index, item)} style={[styles.listItemText, { alignContent: 'center', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }]}>
                    <Image style={{ height: 20, width: 20 }} source={require('../../assets/download.png')} />
                </TouchableOpacity>
                <View style={{ height: 80, backgroundColor: 'black', width: 1 }} />
                {/* <View
                    style={{ flexDirection: 'row', marginStart: 10, marginEnd: 10, alignItems: 'center' }}>

                    <TouchableOpacity disabled={item.status != 1} onPress={() => this.onPressAction(item, 0)} style={{ padding: 10, backgroundColor: 'red',opacity:item.status == 1 ? 1 : 0.1 }}>
                        <Text style={{ color: 'white', fontWeight: '600' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressAction(item, 1)} style={{ padding: 10, paddingEnd: 15, paddingStart: 15, backgroundColor: colors.blue, marginStart: 10 }}>
                        <Text style={{ color: 'white', fontWeight: '600' }}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressAction(item, 2)} style={{ paddingStart: 20, paddingEnd: 20, padding: 2, backgroundColor: colors.green, marginStart: 10 }}>
                        <Text style={{ color: 'white', fontWeight: '600' }}>Email{"\n"}Policy</Text>
                    </TouchableOpacity>
                </View> */}

                <View style={{ flexDirection: 'row', marginStart: 0, marginEnd: 0,marginTop:-30,width:'20%', alignItems: 'center' }}>
                    <DropDownView
                        childData={arr}
                        onItemSelected={(value) => {
                            if(value == "1"){
                                this.onPressAction(item, 1)
                            }else if(value == "2"){
                                this.onPressAction(item, 2)
                            }else if(value == "3"){
                                this.onPressAction(item, 0)
                            }else if(value == "4"){
                                this.onPressAction(item, 4)
                            }
                        }}
                        value={''}
                    />
                </View>
            </View>
        )
    }



    renderTableView = () => {
        return (
            <View>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                    <View style={{ flex: 1 }}>

                        <View style={[styles.tableView]}>
                            <Text style={styles.itemText}>Employee Name</Text>
                            <Text style={styles.itemText}>Designation</Text>
                            <Text style={styles.itemText}>Policy No</Text>
                            <Text style={styles.itemText}>Date of Issue</Text>
                            <Text style={styles.itemText}>Customer Name</Text>
                            <Text style={styles.itemText}>Policy Type</Text>
                            <Text style={styles.itemText}>Policy Amount</Text>
                            <Text style={styles.itemText}>Status</Text>
                            <Text style={styles.itemText}>Doc Download</Text>
                            <Text style={[styles.itemText, { marginStart: 10 }]}>Action</Text>
                        </View>


                        <FlatList
                            data={this.state.data}
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            renderItem={this.renderItem} />
                    </View>

                </ScrollView>





            </View>
        )
    }


    emailPolicy = (id) => {
        let modal = ModalAlert.createProgressModal('Sending Email...', false)
        let formData = new FormData();
        formData.append("user_id", this.props.userData.user_id);
        formData.append("quotation_id", id);
        SSOServices.emailPolicy(formData).then(res => {
            ModalAlert.hide(modal)
            ModalAlert.createModal({ text: 'Alert' }, { text: res.message }, false,
                    ModalAlert.createSecondaryButton('Ok', () => {
                        
                        ModalAlert.hideAll()
                    }))
        }).catch(err => {
            ModalAlert.hide(modal)
            ModalAlert.error(err)
        })
    }



    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>

                <ToolBarComponent
                    title={"My Policy"}
                    navigation={this.props.navigation} />
                <ScrollView>

                    <View style={styles.flexDirection}>
                        <DropDownView
                            childData={[
                                { label: 'MGA', value: 'MGA' },
                                { label: 'AGA', value: 'AGA' },
                                { label: 'Advisor', value: 'Advisor' },
                            ]}
                            onItemSelected={(value) => this.setState({ role: value })}
                            value={this.state.role}
                            dropDownTitle={"Select Role:"} />
                        <DropDownView
                            childData={this.state.userList}
                            value={this.state.user}
                            onItemSelected={(value) => this.setState({ user: value })}
                            dropDownTitle={"Select User:"} />
                    </View>

                    {this.renderDatesContainer()}

                    {this.renderButtons()}

                    {this.renderTableView()}

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

const styles = StyleSheet.create({
    container: {

    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        marginStart: 20,
        marginTop: 20
    },
    flexDirection: {
        flexDirection: 'row',
        width: '95%',
        alignSelf: 'center'
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
    },
    nextButton: {
        backgroundColor: '#3F6183',
        width: 140,
        marginTop: 20,
        height: 45,
        marginStart: 10,
        marginEnd: 10,
        alignSelf: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    next: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600'
    },


    tableView: {
        backgroundColor: colors.primary,
        marginStart: 20, marginEnd: 20,
        flexDirection: 'row',
        marginTop: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    itemText: {
        color: colors.white,
        width: 160,
        padding: 20,
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 16
    },
    itemView: {
        flexDirection: 'row',
        borderWidth: 1,
        borderTopWidth: 0,
        marginStart: 20,
        height: 80,
        marginEnd: 20,
    },
    listItemText: {
        width: 160,
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 16
    },
})



export default connect(mapStateToProps, null)(MyPolicy);