
import React from 'react';
import { View, Image, Text, StatusBar, Animated, TouchableOpacity, SafeAreaView, StyleSheet, ImageBackground, FlatList, ScrollView } from 'react-native';
import { connect } from "react-redux";
import ToolBarComponent from '../../components/toolbar'
import colors from '../../utils/colors';
import RNPickerSelect from 'react-native-picker-select';
import CalenderView from '../../components/textInput/calenderView';
import * as SSOServices from '../../services/SSOService'
import ModalAlert from '../../utils/modal'
import moment from 'moment';
import DatePicker from '../../components/datePicker'
import { getDateStringFromDate } from '../../utils';
import InfinityScrollView from "../../components/infinityScrollView";


var isLoad = false;
class CommisssionDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.navigation.state.params.data.title,
            dropDownTitle: props.navigation.state.params.data.title.includes('ASA') ? 'Select ASA' : props.navigation.state.params.data.title.includes('Advisors') ? 'Select Advisors' : '',
            toDate: '',
            fromDate: '',
            data: [],
            requestData: props.navigation.state.params.requestData,
            pageNo: 1,
            from: moment().format('YYYY-MM-DD'),
            to: moment().format('YYYY-MM-DD'),

        };

    }

    async componentDidMount() {


        this.getCommissionDetailList(this.state.from, this.state.to, 0)
    }

    getCommissionDetailList(fromDate, toDate, page) {
        let modal = ModalAlert.createProgressModal("Fetching Data...", false);

        let formData = new FormData();


        let pageNo = page + 1;
        for (var key in this.state.requestData) {
            formData.append(key, this.state.requestData[key])
        }

        formData.append("from_data", fromDate)
        formData.append("to_data", toDate)
        formData.append("page_no", pageNo)

        SSOServices.getAllMyCommissionList(formData).then(res => {
            isLoad = false;



            if (pageNo == 1) {
                this.setState({
                    data: res.data,
                    pageNo: pageNo
                })
            } else {
                let array = [...this.state.data, ...res.data]
                console.log(pageNo, this.state.data, array)
                this.setState({
                    data: array,
                    pageNo: pageNo
                })
            }
            ModalAlert.hide(modal)
        }).catch(err => {
            ModalAlert.hide(modal)
        })
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


    renderItem = ({ item, index }) => {
        return (
            <View style={styles.listItem}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <Text style={styles.leftText}>Customer Name: </Text>

                    <Text style={styles.rightText}>{item.policy_holder_name}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text style={styles.leftText}>Policy No:</Text>

                    <Text style={styles.rightText}>{item.policy_no}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text style={styles.leftText}>Policy Issue Date:</Text>

                    <Text style={styles.rightText}>{item.date_of_issue}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text style={styles.leftText}>Comm. Amt (CAD): </Text>

                    <Text style={styles.rightText}>{item.commission_amount}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text style={styles.leftText}>Premium Amt (CAD):</Text>

                    <Text style={styles.rightText}>{item.quote_amount}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text style={styles.leftText}>Comm %:</Text>

                    <Text style={styles.rightText}>{item.percentage}%</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text style={styles.leftText}>Description</Text>

                    <Text style={[styles.rightText]}>{item.description}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text style={styles.leftText}>Settled Status</Text>

                    <Text style={[styles.rightText, { color: item.is_settled === 0 ? 'red' : 'black' }]}>{item.is_settled === 1 ? 'Settled' : 'Pending'}</Text>
                </View>



            </View>
        )
    }

    renderDropDown = () => {
        return (
            <View>
                <Text style={styles.dropDownTitle}>{this.state.dropDownTitle}</Text>
                <View style={styles.dropDownContainer}>
                    <RNPickerSelect
                        onValueChange={(value) => console.log(value)}
                        style={StyleSheet.create({

                            inputAndroid: {
                                width: '100%',
                            },
                            inputIOS: {
                                width: '100%',
                            },
                            inputIOSContainer: {
                                width: '100%',
                            },
                            viewContainer: {
                                width: '100%',
                            }
                        })}

                        items={[
                            { label: 'Football', value: 'football' },
                            { label: 'Baseball', value: 'baseball' },
                            { label: 'Hockey', value: 'hockey' },
                        ]}
                    />
                    <Image source={require('../../assets/images/drop-down-arrow.png')} style={styles.arrow} />
                </View>
            </View>

        )
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

    onPressSearch = () => {
        if (this.state.fromDate == '') {
            ModalAlert.error("Please select From Date")
            return
        }

        if (this.state.toDate == '') {
            ModalAlert.error("Please select To Date")
            return
        }

        var d1 = Date.parse(this.state.fromDate);
        var d2 = Date.parse(this.state.toDate);
        if (d2 < d1) {
            ModalAlert.error("From Date should be lesser than To Date")
            return
        }

        this.getCommissionDetailList(this.state.fromDate, this.state.toDate, 0)
    }

    onPressReset = () => {
        this.setState({
            data: []
        })
        this.getCommissionDetailList(this.state.from, this.state.to, 0)
    }

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


    _onScrollReachedEnd = () => {

        if (!isLoad) {
            isLoad = true;
            this.setState({
                pageNo: this.state.pageNo + 1
            })

            this.getCommissionDetailList(this.state.fromDate, this.state.toDate, this.state.pageNo)
        }

    }



    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>

                <ToolBarComponent
                    title={this.state.title}
                    navigation={this.props.navigation} />

                {this.state.dropDownTitle ? this.renderDropDown() : null}

                {this.renderDatesContainer()}

                {this.renderButtons()}


                <InfinityScrollView onScrollReachedEnd={this._onScrollReachedEnd}>
                    <View>

                        {this.state.data.length > 0 ?

                            <FlatList
                                data={this.state.data}
                                scrollEnabled={false}
                                renderItem={this.renderItem} />
                            : <Text style={{ flex: 1, alignSelf: 'center', fontSize: 30, fontWeight: '600', marginTop: 100 }}>No Data</Text>}

                    </View>

                </InfinityScrollView>



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
    listItem: {
        borderWidth: 1,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 10,
        borderColor: colors.green,
        width: '90%'
    },
    listData: {
        width: '50%',
        marginStart: 20,
    },
    leftText: {
        marginTop: 10,
        marginBottom: 10,
        fontWeight: "600",
        fontSize: 18,
        marginStart: 10,
        width: '60%'
    },
    rightText: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        width: '50%',
        flex: 1, marginEnd: 10
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
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '90%',
        alignSelf: 'center',
        marginTop: 20
    },
    dropDownContainer: {
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        borderColor: colors.gray,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    picker: {
        width: '100%'
    },
    arrow: {
        width: 10,
        height: 10,
        marginStart: -20
    },
    dropDownTitle: {
        marginStart: 20,
        marginBottom: 10,
        fontSize: 18,
        marginTop: 10
    }
})



export default connect(mapStateToProps, null)(CommisssionDetail);