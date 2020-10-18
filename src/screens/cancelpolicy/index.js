
import React from 'react';
import { View, Image, Text, StatusBar, TouchableOpacity, Easing, SafeAreaView, StyleSheet, ScrollView, FlatList } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'
import ToolBarComponent from '../../components/toolbar'
import DatePicker from '../../components/datePicker'
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import colors from '../../utils/colors';
import UploadImage from '../../components/uploadContainer';
import CheckBoxComponent from '../../components/checkbox';
import TextInputComponent from '../../components/textInput'
import { StackActions, NavigationActions } from 'react-navigation';
import * as SSOServices from '../../services/SSOService'
import ModalAlert from '../../utils/modal'
import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import CalenderView from '../../components/textInput/calenderView';
import DropDownView from '../../components/textInput/dropDown'
import { getDateStringFromDate } from '../../utils';
import RBSheet from "react-native-raw-bottom-sheet";
import moment from 'moment'
import ImagePicker from 'react-native-image-crop-picker';
import reducers from '../../redux/reducers';

import * as Listeners from "../../utils/listeners";
import Modal from '../../utils/modal';
const MAX_IMAGE_HEIGHT = 1024
const MAX_IMAGE_WIDTH = 1024
const IMAGE_QUALITY = 1


class cancelpolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            policydata: {
                policy_holder_name: '',
            },
            cancelDate: '',
            uploadPhoto: null,
            isVisa: false,
            showVisa: false,
            visaRefusal: 'Choose File',
            passportImageText: 'Choose File',
            boardingPassText: 'Choose File',
            refusalImage: null,
            passportImage: null,
            boardingPass: null,
            financialInsuredName: '',
            financeType: "correction_insured",
            remarks: '',
            status: props.navigation.state.params.status,
            cancelled: false,
            options: 'Select Options',
            financial: "",
            insuredList: [],
            refundMidTermData: [],
            midTermCancelDate: '',
            refundList: [],
            finDepartureDate: '',
            refundSelectedList: '',
            finProof: null,
            finProofName: 'Choose File',
            isCheck: false,
            nonFinEmail: '',
            nonFinCity: '',
            nonFinPostalCode: '',
            nonFinAddress: '',
            nonFinPhone: '',
            showCancelDocs: false,
            isEditEmail: false,
            isEditCity: false,
            isEditPostalCode: false,
            isEditPhone: false,
            isEditAddress: false,
            nonFinRemarks: '',
            finInsuredDOB: '',
            voidList: [],
        };

    }


    async componentDidMount() {
        this.getActiveEnsured()
        this.getVoidDocument()
        this.getCancel();
        this.onPressCancelOptions()
    }


    getVoidDocument = () => {
        SSOServices.getVoidDocument().then(res => {

        }).catch(err => {

        })
    }

    getCancel = () => {
        let modal = ModalAlert.createProgressModal('Fetching Data...', false)

        let id = this.props.navigation.state.params.id

        SSOServices.getPolicyById(id).then(res => {
            ModalAlert.hide(modal);
            this.setState({
                policydata: res.data,
                cancelled: res.data.policy_status != 1,
                cancelDate: res.data.cancellation_date != null ? res.data.cancellation_date : ''
            })
        }).catch(err => {
            ModalAlert.hide(modal)
        })
    }


    _onClickImagePicker = () => {
        ImagePicker.openPicker({
            includeBase64: true,
            compressImageQuality: IMAGE_QUALITY,
            compressImageMaxWidth: MAX_IMAGE_WIDTH,
            compressImageMaxHeight: MAX_IMAGE_HEIGHT,
            mediaType: 'photo',
            cropping: false,
            includeExif: true
        }).then(image => {
            this._validateImage(image)
        }).catch(e => {
            if (Platform.OS === 'ios' && (e.code === 'E_PICKER_NO_CAMERA_PERMISSION' || e.code === 'E_PERMISSION_MISSING')) {
                this._showIosSettingsPopup("You must change the photo access privileges. To do this, go to Settings > Privacy > Photos")
            }
        });

    }

    isValidate = () => {
        if (this.state.cancelDate == '') {
            ModalAlert.error("Please select the Cancellation Date.");
            return false
        }

        if (this.state.remarks == '') {
            ModalAlert.error("Please enter Remarks.");
            return false
        }

        if (this.state.showCancelDocs) {
            if (this.state.passportImage == null) {
                ModalAlert.error("Please select Passport copy.");
                return false
            }

            if (this.state.boardingPass == null) {
                ModalAlert.error("Please select boarding passes copy.");
                return false
            }
        }

        return true;
    }



    _onClickOpenCamera = () => {
        ImagePicker.openCamera({
            includeBase64: true,
            sImageQuality: IMAGE_QUALITY,
            compressImageMaxWidth: MAX_IMAGE_WIDTH,
            compressImageMaxHeight: MAX_IMAGE_HEIGHT,
            mediaType: 'photo',
            cropping: false,
            includeExif: true,
            waitAnimationEnd: false
        }).then(image => {
            this._validateImage(image)
        }).catch(e => {
            if (Platform.OS === 'ios' && (e.code === 'E_PICKER_NO_CAMERA_PERMISSION' || e.code === 'E_PERMISSION_MISSING')) {
                this._showIosSettingsPopup("You must change the camer access privileges. To do this, go to Settings > Privacy > Camera")
            }

            alert(e)

        });
    }

    onPressUpload = (type) => {
        this.RBSheet.close()
        setTimeout(() => {
            switch (type) {
                case 1:
                    this._onClickOpenCamera()
                    break;
                case 2:
                    this._onClickImagePicker()
                    break;
            }
        }, 500)
    }



    _showIosSettingsPopup(msg) {
        let modal = Modal.createModal({
            text: 'Info'
        }, {
            text: msg
        }, false,
            Modal.createPrimaryButton('Settings', () => {
                Modal.hide(modal);
                Linking.openURL('app-settings:');
            })
        );
    }
    _validateImage(image) {

        console.log(image)

        switch (this.state.imageStatus) {
            case 2: {
                let name = ''
                if (image.path) {
                    name = image.path.slice(image.path.length - 16, image.path.length)
                }


                this.setState({
                    passportImage: image,
                    passportImageText: name
                });
                break;
            }

            case 3: {
                this.setState({
                    boardingPass: image,
                    boardingPassText: image.filename
                });
                break;

            }

            case 4: {
                let name = ''
                if (image.path) {
                    name = image.path.slice(image.path.length - 16, image.path.length)
                }
                this.setState({
                    finProof: image,
                    finProofName: name
                });
                break;

            }


            case 8: {
                let name = ''
                if (image.path) {
                    name = image.path.slice(image.path.length - 16, image.path.length)
                }

                let list = [...this.state.voidList]
                list[this.state.voidIndex].copyPassPort = image
                list[this.state.voidIndex].copyPassPortText = name

                this.setState({
                    voidList: list
                });
                break;

            }


            case 9: {
                let name = ''
                if (image.path) {
                    name = image.path.slice(image.path.length - 16, image.path.length)
                }

                let list = [...this.state.voidList]
                list[this.state.voidIndex].visaDoc = image
                list[this.state.voidIndex].visaDocName = name

                this.setState({
                    voidList: list
                });
                break;

            }
            case 10: {
                let name = ''
                if (image.path) {
                    name = image.path.slice(image.path.length - 16, image.path.length)
                }

                let list = [...this.state.refundList]
                list[this.state.midIndex].copyPassPort = image
                list[this.state.midIndex].copyPassPortText = name

                this.setState({
                    refundList: list
                });
                break;

            }


            case 11: {
                let name = ''
                if (image.path) {
                    name = image.path.slice(image.path.length - 16, image.path.length)
                }

                let list = [...this.state.refundList]
                list[this.state.midIndex].boardingPass = image
                list[this.state.midIndex].boardingPassText = name

                this.setState({
                    refundList: list
                });
                break;

            }

            default: {
                this.setState({
                    refusalImage: image,
                    visaRefusal: image.filename
                });
                break;
            }


        }


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

    // renderButtons = () => {
    //     return (
    //         <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
    //             <TouchableOpacity onPress={() => { }} activeOpacity={0.7} style={styles.nextButton}>
    //                 <Text style={styles.next}>Search</Text>
    //             </TouchableOpacity>
    //             <TouchableOpacity onPress={() => { }} activeOpacity={0.7} style={styles.nextButton}>
    //                 <Text style={styles.next}>Reset</Text>
    //             </TouchableOpacity>
    //         </View>
    //     )
    // }


    handleDatePicked = (data, status) => {
        let date = getDateStringFromDate(data);


        switch (status) {
            case 1: {
                var dd = new Date(data)
                var ddw = new Date();
                var time = ddw.getTime() - dd.getTime();

                var days = time / (1000 * 3600 * 24);


                if (Math.round(days) > 0) {
                    this.setState({
                        fromDate: false,
                        cancelDate: date,
                        showCancelDocs: true
                    })
                } else {
                    this.setState({
                        fromDate: false,
                        cancelDate: date,
                        showCancelDocs: false
                    })
                }


                break;
            }

            case 2: {
                var dd = new Date(data)
                var ddw = new Date();
                var time = ddw.getTime() - dd.getTime();

                var days = time / (1000 * 3600 * 24);
                let list = [...this.state.refundList];
                let isCheck = false
                for (let index = 0; index < list.length; index++) {
                    if (Math.round(days) > 0) {
                        list[index].isCheck = true
                        isCheck = true
                    } else {
                        list[index].isCheck = false
                        isCheck = false
                    }
                }
                this.setState({
                    midTermDate: false,
                    midTermCancelDate: date,
                    refundList: list,
                    isCheck: isCheck
                })

                break;
            }

            case 3: {
                this.setState({
                    finDeparture: false,
                    finDepartureDate: date
                })

                break;
            }

            case 4: {
                this.setState({
                    finDob: false,
                    finInsuredDOB: date
                })

                break;
            }
        }


        // let date2 = moment(moment().format('YYYY-MM-DD'));
        // let date3 = moment(date)


        // if (date2.diff(date3, 'days') > 0) {
        //     this.setState({
        //         showVisa: true
        //     })
        // } else {
        //     this.setState({
        //         showVisa: false
        //     })
        // }

    }


    onPressCamera = (status) => {
        this.setState({
            imageStatus: status
        })

        this.RBSheet.open();
    }

    onPressCameraVoid = (status, index) => {
        this.setState({
            imageStatus: status,
            voidIndex: index
        })

        this.RBSheet.open();
    }

    onPressCameraMid = (status, index) => {
        this.setState({
            imageStatus: status,
            midIndex: index
        })

        this.RBSheet.open();
    }


    cancellationApi = () => {

        if (this.isValidate()) {
            let modal = ModalAlert.createProgressModal('Cancelling Please wait...')
            let formData = new FormData();
            formData.append("user_id", this.props.userData.user_id);
            formData.append("policy_id", this.props.navigation.state.params.id);
            formData.append("cancel_date_endorsement", this.state.cancelDate);
            formData.append("cancel_remarks", this.state.remarks);
            if (this.state.showCancelDocs) {
                formData.append("passport_copy", {
                    uri: this.state.passportImage.path,
                    type: this.state.passportImage.mime,
                    name: 'image',

                })
                formData.append("boarding_passes", {
                    uri: this.state.boardingPass.path,
                    type: this.state.boardingPass.mime,
                    name: 'image',

                })
            }


            SSOServices.cancelPolicy(formData).then(res => {
                ModalAlert.hide(modal)
                ModalAlert.createModal({ text: 'Alert' }, { text: res.message }, false,
                    ModalAlert.createSecondaryButton('Ok', () => {
                        this.props.navigation.goBack();
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'HomeInitial' })],
                        });
                        this.props.navigation.dispatch(resetAction);
                        ModalAlert.hideAll()
                    }))
            }).catch(err => {
                ModalAlert.hide(modal)
                if (err) {
                    ModalAlert.error(err.message)
                } else {
                    ModalAlert.error('Something went wrong.')
                }
            })
        }
    }

    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    isValidateNonFinancialFields = () => {

        if (this.state.nonFinEmail == "") {
            ModalAlert.error('Please enter email')
            return false
        }

        if (!this.validateEmail(this.state.nonFinEmail)) {
            ModalAlert.error("Please enter valid email address");
            return false;
        }
        if (this.state.nonFinCity == "") {
            ModalAlert.error('Please enter city')
            return false
        }
        if (this.state.nonFinPostalCode == "") {
            ModalAlert.error('Please enter Postal code')
            return false
        }
        if (this.state.nonFinPostalCode.length != 6) {
            ModalAlert.error('Postal code should be length of 6')
            return false
        }
        if (this.state.nonFinAddress == "") {
            ModalAlert.error('Please enter Address')
            return false
        }
        if (this.state.nonFinPhone == "") {
            ModalAlert.error('Please enter Phone Number')
            return false
        }

        if (this.state.nonFinPhone.length != 10) {
            ModalAlert.error('Phone Number should be length of 10')
            return false
        }

        if (this.state.nonFinRemarks == "") {
            ModalAlert.error('Please enter remarks')
            return false
        }



        return true



    }


    financialForm = () => {
        if (this.validateFinancial()) {
            if (this.state.financeType == "correction_insured") {
                let modal = ModalAlert.createProgressModal('Please wait...')
                let formData = new FormData();
                formData.append("user_id", this.props.userData.user_id);
                formData.append("policy_id", this.props.navigation.state.params.id);
                formData.append("correction_remarks", this.state.finRemarks);
                formData.append("correction_type", "Finance");
                formData.append("finance_type", this.state.financeType);
                formData.append("correction_insured_person", this.state.financialInsuredName);
                formData.append("correction_name", this.state.correctionName);
                formData.append("dob_change", this.state.finInsuredDOB);
                formData.append("proof_doc", {
                    uri: this.state.finProof.path,
                    type: this.state.finProof.mime,
                    name: 'Image ' + this.state.finProofName,
                });

                SSOServices.cancelCorrectionFin(formData).then(res => {
                    ModalAlert.hide(modal)
                    ModalAlert.createModal({ text: 'Alert' }, { text: res.message }, false,
                        ModalAlert.createSecondaryButton('Ok', () => {
                            this.props.navigation.goBack();
                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'HomeInitial' })],
                            });
                            this.props.navigation.dispatch(resetAction);
                            ModalAlert.hideAll()
                        }))
                }).catch(err => {
                    ModalAlert.hide(modal)
                    console.log(err)
                    if (err) {
                        ModalAlert.error(err.message)
                    } else {
                        ModalAlert.error('Something went wrong.')
                    }
                })
            } else {
                let modal = ModalAlert.createProgressModal('Please wait...')
                let formData = new FormData();
                formData.append("user_id", this.props.userData.user_id);
                formData.append("policy_id", this.props.navigation.state.params.id);
                formData.append("departure_date", this.state.finDepartureDate);
                formData.append("correction_remarks", this.state.finRemarks);
                formData.append("correction_type", "Finance");
                formData.append("finance_type", this.state.financeType);


                SSOServices.cancelCorrectionFin(formData).then(res => {
                    ModalAlert.hide(modal)
                    ModalAlert.createModal({ text: 'Alert' }, { text: res.message }, false,
                        ModalAlert.createSecondaryButton('Ok', () => {
                            this.props.navigation.goBack();
                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'HomeInitial' })],
                            });
                            this.props.navigation.dispatch(resetAction);
                            ModalAlert.hideAll()
                        }))
                }).catch(err => {
                    ModalAlert.hide(modal)
                    if (err) {
                        ModalAlert.error(err.message)
                    } else {
                        ModalAlert.error('Something went wrong.')
                    }
                })
            }
        }
    }


    validateFinancial = () => {
        if (this.state.financeType == "correction_insured") {

            if (this.state.financialInsuredName == "") {
                ModalAlert.error("Please select Name of Insured.")
                return false
            }

            if (this.state.correctionName == "") {
                ModalAlert.error("Please enter Correction Name.")
                return false
            }

            if (this.state.finProof == null) {
                ModalAlert.error("Please upload document for verification!")
                return false
            }

            if (this.state.finRemarks == null) {
                ModalAlert.error("Please enter Remarks.")
                return false
            }
            return true


        } else {
            if (this.state.finDepartureDate == "") {
                ModalAlert.error("Please select Departure Date.")
                return false
            }

            if (this.state.finRemarks == "") {
                ModalAlert.error("Please enter Remarks.")
                return false
            }

            return true
        }
    }

    nonFinancialForm = () => {
        if (this.isValidateNonFinancialFields()) {
            let modal = ModalAlert.createProgressModal('Please wait...')
            let formData = new FormData();
            formData.append("user_id", this.props.userData.user_id);
            formData.append("policy_id", this.props.navigation.state.params.id);
            formData.append("correction_type", "Non-Finance");
            formData.append("correction_remarks", this.state.nonFinRemarks);
            formData.append("policy_holder_email", this.state.nonFinEmail);
            formData.append("policy_holder_city", this.state.nonFinCity);
            formData.append("policy_holder_postal_code", this.state.nonFinPostalCode);
            formData.append("policy_holder_address", this.state.nonFinAddress);
            formData.append("policy_holder_phone", this.state.nonFinPhone);
            formData.append("edit_policy_holder_email_chk", this.state.isEditEmail ? 1 : 0);
            formData.append("edit_policy_holder_city_chk", this.state.isEditCity ? 1 : 0);
            formData.append("edit_policy_holder_postal_code_chk", this.state.isEditPostalCode ? 1 : 0);
            formData.append("edit_policy_holder_address_chk", this.state.isEditAddress ? 1 : 0);
            formData.append("edit_policy_holder_phone_chk", this.state.isEditPhone ? 1 : 0);

            SSOServices.cancelCorrectionNonFin(formData).then(res => {
                ModalAlert.hide(modal)
                ModalAlert.createModal({ text: 'Alert' }, { text: res.message }, false,
                    ModalAlert.createSecondaryButton('Ok', () => {
                        this.props.navigation.goBack();
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'HomeInitial' })],
                        });
                        this.props.navigation.dispatch(resetAction);
                        ModalAlert.hideAll()
                    }))
            }).catch(err => {
                ModalAlert.hide(modal)
                console.log(err)
                if (err) {
                    ModalAlert.error(err.message)
                } else {
                    ModalAlert.error('Something went wrong.')
                }
            })

        }
    }

    cancelMidtermApi = () => {
        if (this.validateRefund()) {
            let modal = ModalAlert.createProgressModal('Please wait...', false)
            let formData = new FormData()

            formData.append("user_id", this.props.userData.user_id);
            formData.append("policy_id", this.props.navigation.state.params.id);

            formData.append("refund_cancellation_date", this.state.midTermCancelDate);

            for (let index = 0; index < this.state.refundList.length; index++) {
                const element = this.state.refundList[index];

                formData.append('refund_insured_name[]', element.insuredId);
                formData.append('refund_remarks[]', element.remarks);
                if (element.isCheck) {
                    formData.append("refund_passport_copy[]", {
                        uri: element.copyPassPort.path,
                        type: element.copyPassPort.mime,
                        name: 'Image ' + element.copyPassPortText,
                    });
                    formData.append("refund_boarding_pass[]", {
                        uri: element.boardingPass.path,
                        type: element.boardingPass.mime,
                        name: 'Image ' + element.boardingPassText,
                    });
                }

            }


            SSOServices.cancelMidtermApi(formData).then(res => {
                ModalAlert.hide(modal)
                ModalAlert.createModal({ text: 'Alert' }, { text: res.message }, false,
                    ModalAlert.createSecondaryButton('Ok', () => {
                        this.props.navigation.goBack();
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'HomeInitial' })],
                        });
                        this.props.navigation.dispatch(resetAction);
                        ModalAlert.hideAll()
                    }))
            }).catch(err => {
                ModalAlert.hide(modal)
                if (err) {
                    ModalAlert.error(err.message)
                } else {
                    ModalAlert.error('Something went wrong.')
                }
            })
        }
    }

    voidApi = () => {
        if (this.validateVoidList()) {
            let modal = ModalAlert.createProgressModal('Please wait...')
            let formData = new FormData();
            formData.append("user_id", this.props.userData.user_id);
            formData.append("policy_id", this.props.navigation.state.params.id);
            for (let index = 0; index < this.state.voidList.length; index++) {
                const element = this.state.voidList[index];

                formData.append("insured[]", element.userName);
                formData.append("remark[]", element.remarks);
                formData.append("visa_type", 1);
                formData.append("copyofpassport[]", {
                    uri: element.copyPassPort.path,
                    type: element.copyPassPort.mime,
                    name: 'Image ' + element.copyPassPortText,
                });
                formData.append("visadocument[]", {
                    uri: element.visaDoc.path,
                    type: element.visaDoc.mime,
                    name: 'Image ' + element.visaDocName,
                });
            }

            SSOServices.cancelVoid(formData).then(res => {
                ModalAlert.hide(modal)
                ModalAlert.createModal({ text: 'Alert' }, { text: res.message }, false,
                    ModalAlert.createSecondaryButton('Ok', () => {
                        this.props.navigation.goBack();
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'HomeInitial' })],
                        });
                        this.props.navigation.dispatch(resetAction);
                        ModalAlert.hideAll()
                    }))
            }).catch(err => {
                ModalAlert.hide(modal)
                if (err) {
                    ModalAlert.error(err.message)
                } else {
                    ModalAlert.error('Something went wrong.')
                }
            })

        }
    }

    onPressCancel = () => {
        switch (this.state.options) {
            case 'void':
                this.voidApi()
                break;
            case 'cancellation':
                this.cancellationApi()
                break;
            case 'refund mid-term':
                this.cancelMidtermApi()
                break;
            case 'corrections': {

                if (this.state.financial == "") {
                    ModalAlert.error("Please select Type of Correction")
                    return false
                }

                if (this.state.financial == "fin") {
                    this.financialForm()
                } else {
                    this.nonFinancialForm()
                }


                break;
            }
            default: {
                Modal.error("Please select an option.")
                break;
            }
        }

    }

    getActiveEnsured = () => {

        let id = this.props.navigation.state.params.quotation_id
        SSOServices.getActiveEnsured(id).then(res => {
            let list = []
            let listRefund = []

            let voidList = []

            this.setState({
                nonFinEmail: res.data.getquoteData.policy_holder_email,
                nonFinCity: res.data.getquoteData.policy_holder_city,
                nonFinPostalCode: res.data.getquoteData.policy_holder_postal_code,
                nonFinAddress: res.data.getquoteData.policy_holder_address,
                nonFinPhone: res.data.getquoteData.policy_holder_phone,
            })


            for (let index = 0; index < res.data.list_active_insured.length; index++) {
                const element = res.data.list_active_insured[index];
                list.push({ label: element.insured_name, value: element.id })
                let obj = {
                    insuredName: element.insured_name,
                    insuredId: element.id,
                    insuredDob: element.insured_DOB,
                    premiumAmount: '',
                    remarks: '',
                    isCheck: false,
                    premiumAmountTemp: element.selected_key == 2 ? element.cost_with_pre_existing : element.cost_without_pre_existing,
                    copyPassPort: null,
                    copyPassPortText: 'Choose File',
                    boardingPass: null,
                    boardingPassText: 'Choose File',
                }
                listRefund.push(obj)

                let voidObj = {
                    userName: '',
                    copyPassPort: null,
                    copyPassPortText: 'Choose File',
                    visaDoc: null,
                    visaDocName: 'Choose File',
                    remarks: ''
                }
                voidList.push(voidObj)
            }

            console.log(listRefund)

            this.setState({
                insuredList: list,
                refundMidTermData: listRefund,
                refundList: [listRefund[0]],
                voidList: [voidList[0]],
                voidListTemp: voidList
            })
        }).catch(err => {

        })
    }


    getStatus = (status) => {
        if (status == 2) {
            return "Pending Cancellation";
        } else if (status == 3) {
            return "Cancelled";
        }
    }

    renderCancelOption = () => {
        switch (this.state.options) {
            case 'cancellation': {
                var d = new Date();
                d.setDate(d.getDate() - 1);
                var d1 = new Date(d);
                return (
                    <View>
                        <Text style={{ marginStart: 20, color: 'red', marginTop: 20 }}>*The minimum premium is $20 per policy.</Text>
                        <Text style={{ fontSize: 20, marginStart: 25, marginTop: 20 }}>Type : <Text style={{ color: 'rgb(62, 185, 186)', fontWeight: '600' }}>{this.state.showCancelDocs ? "Cancellation Backdated" : "Cancellation"}</Text></Text>

                        <View style={[styles.singleitem, { justifyContent: 'flex-start' }]}>
                            <Text style={{ fontWeight: '700', marginStart: 20, fontSize: 15, color: 'black' }} > Cancellation Date : </Text>
                            <CalenderView
                                showCalender={true}
                                disabled={this.state.cancelled}
                                style={{ width: '40%', marginTop: -10, marginStart: 25 }}
                                onPress={() => this.setState({ fromDate: true })}
                                title={this.state.cancelDate} />

                        </View>

                        <DatePicker
                            datePicked={(data) => this.handleDatePicked(data, 1)}
                            dateCanceled={() => this.setState({ fromDate: false })}
                            showDate={this.state.fromDate} />
                        <View style={[styles.singleitem, { justifyContent: 'flex-start' }]}>
                            <Text style={{ fontWeight: '700', marginStart: 20, width: '50%', marginStart: 25, fontSize: 15, color: 'black' }}>Remarks *: </Text>
                            <View style={{ width: '40%', marginStart: -40, marginTop: -30 }}>
                                <TextInputComponent
                                    isSecure={false}
                                    placeholder={""}
                                    keyboardType={"default"}
                                    icon={-1}
                                    disable={this.state.cancelled}
                                    styles={{ width: '100%', alignSelf: 'flex-start', alignContent: 'flex-start', justifyContent: 'flex-start', marginStart: 0 }}
                                    value={this.state.otp}
                                    onChangeText={(text) => this.setState({ remarks: text })}
                                    isShowDrawable={false}
                                />
                            </View>

                        </View>
                        {
                            (this.state.showCancelDocs) &&

                            <View>

                                <View style={styles.singleitem}>
                                    <Text style={{ fontWeight: '700', marginStart: 10, width: '50%', marginStart: 24, fontSize: 15, color: 'black' }} > Passport Copy *: </Text>
                                    <TouchableOpacity onPress={() => this.onPressCamera(2)} style={{ width: '35%', borderRadius: 5, borderWidth: 1, marginEnd: 20 }}>
                                        <Text style={{ paddingTop: 10, paddingStart: 10, paddingBottom: 10 }} >{this.state.passportImageText}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.singleitem}>
                                    <Text style={{ fontWeight: '700', marginStart: 24, width: '50%', fontSize: 15, color: 'black' }} > Boarding Passes Copy *: </Text>
                                    <TouchableOpacity onPress={() => this.onPressCamera(3)} style={{ width: '35%', borderRadius: 5, borderWidth: 1, marginEnd: 20 }}>
                                        <Text style={{ paddingTop: 10, paddingStart: 10, paddingBottom: 10 }} >{this.state.boardingPassText}</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>}
                    </View>
                )
            }
            case 'void': {
                return this.renderVoid();
            }
            case 'refund mid-term': {
                return this.renderMidterm();
            }
            case 'corrections': {
                return this.renderCorrections();
            }
        }
    }

    selectUserVoid = (value, item, i) => {
        let list = [...this.state.voidList]


        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.userName == value) {
                ModalAlert.error("Insured Person already selected.")
                return
            }
        }

        list[i].userName = value


        this.setState({
            voidList: list
        })

    }



    renderVoidList = ({ item, index }) => {
        return (
            <View>
                <DropDownView
                    styles={{ alignSelf: 'flex-start', marginStart: 10, marginTop: 20 }}
                    childData={this.state.insuredList}
                    value={item.userName}
                    onItemSelected={(value) => this.selectUserVoid(value, item, index)}
                    dropDownTitle={"Select an Insured:"} />

                <View>

                    <View style={[styles.singleitem, { justifyContent: 'space-evenly' }]}>
                        <Text style={{ fontWeight: '700', marginStart: 10, width: '50%', marginStart: 10, fontSize: 15, color: 'black' }} >Copy of Passport*: </Text>
                        <TouchableOpacity onPress={() => this.onPressCameraVoid(8, index)} style={{ width: '35%', borderRadius: 5, borderWidth: 1, marginEnd: 20 }}>
                            <Text style={{ paddingTop: 10, paddingStart: 10, paddingBottom: 10 }} >{item.copyPassPortText}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.singleitem, { justifyContent: 'space-evenly' }]}>
                        <Text style={{ fontWeight: '700', marginStart: 10, width: '50%', fontSize: 15, color: 'black' }}>Visa Rejection Document*: </Text>
                        <TouchableOpacity onPress={() => this.onPressCameraVoid(9, index)} style={{ width: '35%', borderRadius: 5, borderWidth: 1, marginEnd: 20 }}>
                            <Text style={{ paddingTop: 10, paddingStart: 10, paddingBottom: 10 }} >{item.visaDocName}</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={[styles.singleitem, { justifyContent: 'flex-start' }]}>
                    <Text style={{ fontWeight: '700', marginStart: 20, width: '50%', marginStart: 25, fontSize: 15, color: 'black' }}>Remarks *: </Text>
                    <View style={{ width: '40%', marginTop: -30 }}>
                        <TextInputComponent
                            isSecure={false}
                            placeholder={""}
                            keyboardType={"default"}
                            icon={-1}
                            disable={this.state.cancelled}
                            styles={{ width: '100%', alignSelf: 'flex-start', alignContent: 'flex-start', justifyContent: 'flex-start', marginStart: 0 }}
                            value={item.remarks}
                            onChangeText={(text) => {
                                let list = [...this.state.voidList]
                                list[index].remarks = text
                                this.setState({
                                    voidList: list
                                })
                            }}
                            isShowDrawable={false}
                        />
                    </View>

                </View>
            </View>
        )
    }


    onPressAddVoid = () => {
        if (this.validateVoidList()) {
            let list = [...this.state.voidList]

            if (list.length == this.state.voidListTemp.length) {
                ModalAlert.error("All Insured list were added.")
                return
            }

            list.push(this.state.voidListTemp[list.length])

            this.setState({
                voidList: list
            })
        }
    }

    validateVoidList = () => {
        for (let index = 0; index < this.state.voidList.length; index++) {
            const element = this.state.voidList[index];

            console.log(this.state.voidList)

            if (element.userName == '') {
                ModalAlert.error('Please select the user')
                return false
            }


            if (element.copyPassPort == null) {
                ModalAlert.error('Please upload the Passport copy')
                return false
            }

            if (element.visaDoc == null) {
                ModalAlert.error('Please upload the Visa Rejection Document')
                return false
            }

            if (element.remarks == '') {
                ModalAlert.error('Please enter Remarks')
                return false
            }

        }

        return true;
    }

    renderVoid = () => {
        return (
            <View>

                <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'space-between', width: '90%', alignSelf: 'center' }}>
                    <Text style={{ fontSize: 20 }}>Type : <Text style={{ color: 'rgb(62, 185, 186)', fontWeight: '600' }}>SVVTC</Text></Text>
                    <TouchableOpacity onPress={() => this.onPressAddVoid()} style={{ backgroundColor: 'rgb(62, 185, 186)', paddingStart: 20, paddingEnd: 20, paddingTop: 10, paddingBottom: 10, borderRadius: 10 }}>
                        <Text style={{ color: 'white', fontWeight: '600' }}>Add New</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    renderItem={this.renderVoidList}
                    data={this.state.voidList} />
            </View>
        )
    }

    selectUser = (value, item, i) => {
        let list = [...this.state.refundMidTermData]

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (value == element.insuredId) {
                let list2 = [...this.state.refundList]


                if (this.state.refundSelectedList.includes(value)) {
                    ModalAlert.error("Insured Person already selected.")
                    return
                }


                list2[i].insuredName = value
                list2[i].premiumAmount = list[index].premiumAmountTemp
                this.setState({
                    refundList: list2,
                    refundSelectedList: this.state.refundSelectedList + value + ","
                })

            }

        }


    }



    renderRefundMidTerm = ({ item, index }) => {
        return (
            <View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <DropDownView
                        styles={{ alignSelf: 'flex-start', marginStart: 10, marginTop: 20 }}
                        childData={this.state.insuredList}
                        value={item.insuredName}
                        onItemSelected={(value) => this.selectUser(value, item, index)}
                        dropDownTitle={"Select an Insured:"} />
                </View>

                <Text style={{ fontWeight: '600', marginStart:20, marginTop: 20, fontSize: 20, marginEnd: 20 }}>Premium Amount:{"   "}$ {item.premiumAmount}</Text>

                {
                    item.isCheck &&

                    <View>

                        <View style={styles.singleitem}>
                            <Text style={{ fontWeight: '700', marginStart: 10, width: '50%', marginStart: 24, fontSize: 15, color: 'black' }} > Passport Copy *: </Text>
                            <TouchableOpacity onPress={() => this.onPressCameraMid(10, index)} style={{ width: '35%', borderRadius: 5, borderWidth: 1, marginEnd: 20 }}>
                                <Text style={{ paddingTop: 10, paddingStart: 10, paddingBottom: 10 }} >{item.copyPassPortText}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.singleitem}>
                            <Text style={{ fontWeight: '700', marginStart: 24, width: '50%', fontSize: 15, color: 'black' }} > Boarding Passes Copy *: </Text>
                            <TouchableOpacity onPress={() => this.onPressCameraMid(11, index)} style={{ width: '35%', borderRadius: 5, borderWidth: 1, marginEnd: 20 }}>
                                <Text style={{ paddingTop: 10, paddingStart: 10, paddingBottom: 10 }} >{item.boardingPassText}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>}

                <View style={[styles.singleitem, { justifyContent: 'flex-start' }]}>
                    <Text style={{ fontWeight: '700', marginStart: 20, width: '50%', marginStart: 25, fontSize: 15, color: 'black' }}>Remarks *: </Text>
                    <View style={{ width: '40%', marginTop: -30 }}>
                        <TextInputComponent
                            isSecure={false}
                            placeholder={""}
                            keyboardType={"default"}
                            icon={-1}
                            styles={{ width: '100%', alignSelf: 'flex-start', alignContent: 'flex-start', justifyContent: 'flex-start', marginStart: 0 }}
                            value={item.remarks}
                            onChangeText={(text) => this.setRefunRemarks(text, index)}
                            isShowDrawable={false}
                        />
                    </View>

                </View>
            </View>

        )
    }

    setRefunRemarks = (value, index) => {
        let list = [...this.state.refundList]
        list[index].remarks = value

        this.setState({
            refundList: list
        })
    }

    onPressRefundNew = () => {


        if (this.validateRefund()) {
            let list = [...this.state.refundList]

            if (list.length == this.state.refundMidTermData.length) {
                ModalAlert.error("All Insured list were added.")
                return
            }

            for (let index = 0; index < list.length; index++) {
                if (this.state.isCheck) {
                    list[index].isCheck = true
                    this.state.refundMidTermData[list.length].isCheck = true

                } else {
                    list[index].isCheck = false
                    this.state.refundMidTermData[list.length].isCheck = false

                }

            }

            list.push(this.state.refundMidTermData[list.length])

            this.setState({
                refundList: list
            })
        }

    }

    validateRefund = () => {
        if (this.state.midTermCancelDate == '') {
            ModalAlert.error('Please select Cancel Date')
            return false
        }


        for (let index = 0; index < this.state.refundList.length; index++) {
            const element = this.state.refundList[index];

            if (element.insuredName == '') {
                ModalAlert.error('Please select Insured Name')
                return false
            }


            if (element.remarks == '') {
                ModalAlert.error('Please enter remarks')
                return false
            }

        }

        return true



    }

    renderMidterm = () => {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        var d1 = new Date(d);
        return (
            <View>
                <Text style={{ marginStart: 20, color: 'red', marginTop: 20 }}>*The minimum premium is $20 per policy.</Text>

                <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'space-between', width: '90%', alignSelf: 'center' }}>
                    <Text style={{ fontSize: 20 }}>Type : <Text style={{ color: 'rgb(62, 185, 186)', marginEnd: 10, fontWeight: '600' }}>{this.state.isCheck ? "Cancellation Backdated" : "Cancellation"}</Text></Text>

                </View>
                <TouchableOpacity onPress={() => {
                    this.onPressRefundNew()
                }} style={{ backgroundColor: 'rgb(62, 185, 186)', paddingStart: 20, paddingEnd: 20, paddingTop: 10, paddingBottom: 10, width: 150, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20, marginStart: 20 }}>
                    <Text style={{ color: 'white', fontWeight: '600' }}>Add New</Text>
                </TouchableOpacity>
                <View style={[styles.singleitem, { justifyContent: 'flex-start' }]}>
                    <Text style={{ fontWeight: '700', marginStart: 20, fontSize: 15, color: 'black' }} > Cancellation Date : </Text>
                    <CalenderView
                        showCalender={true}
                        style={{ width: '40%', marginTop: -10, marginStart: 25 }}
                        onPress={() => this.setState({ midTermDate: true })}
                        title={this.state.midTermCancelDate} />

                    <DatePicker
                        datePicked={(data) => this.handleDatePicked(data, 2)}
                        dateCanceled={() => this.setState({ midTermDate: false })}
                        // minimumDate={d1}
                        showDate={this.state.midTermDate} />

                </View>

                <FlatList
                    renderItem={this.renderRefundMidTerm}
                    data={this.state.refundList} />

            </View>
        )
    }

    finNameOfInsured = (value) => {
        for (let index = 0; index < this.state.refundMidTermData.length; index++) {
            const element = this.state.refundMidTermData[index];
            console.log(value, element)

            if (value == element.insuredId) {

                this.setState({
                    correctionName: element.insuredName,
                    finInsuredDOB: element.insuredDob,
                    financialInsuredName: value
                })
                return
            }

        }
    }

    renderCorrections = () => {
        return (
            <View>
                <Text style={{ marginStart: 20, color: 'red', marginTop: 20 }}>*The minimum premium is $20 per policy.</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <DropDownView
                        styles={{ alignSelf: 'flex-start', marginStart: 10, marginTop: 20 }}
                        childData={[
                            { label: 'Financial Fields', value: "fin" },
                            { label: 'Non Financial Fields', value: "non_fin" }
                        ]}
                        value={this.state.financial}
                        onItemSelected={(value) => this.setState({ financial: value })}
                        dropDownTitle={"Type of corrections:"} />


                    <Text style={{ fontSize: 20, marginTop: 20, marginEnd: 20 }}>Type : <Text style={{ color: 'rgb(62, 185, 186)', fontWeight: '600', marginEnd: 20 }}>{this.state.financial === "fin" ? 'Policy Change' : 'Correction'}</Text></Text>

                </View>

                {this.state.financial === "non_fin" && <View>
                    <View style={{ marginEnd: 12, alignSelf: 'flex-end' }}>
                        <CheckBoxComponent
                            onClickPress={(status) => this.setState({ isEditEmail: status })}
                            value={this.state.isEditEmail}
                            isLogin={false}
                            title={"Edit"} />
                    </View>
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Email"}
                        disable={!this.state.isEditEmail}
                        styles={{ marginTop: 0, backgroundColor: this.state.isEditEmail ? 'white' : '#d0cfcf' }}
                        maxLength={30}
                        value={this.state.nonFinEmail}
                        onChangeText={(text) => this.setState({ nonFinEmail: text })}
                        isShowDrawable={false}
                    />
                    <View style={{ marginEnd: 12, alignSelf: 'flex-end' }}>
                        <CheckBoxComponent
                            onClickPress={(status) => this.setState({ isEditCity: status })}
                            value={this.state.isEditCity}
                            isLogin={false}
                            title={"Edit"} />
                    </View>
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"City"}
                        maxLength={30}
                        disable={!this.state.isEditCity}
                        styles={{ marginTop: 0, backgroundColor: this.state.isEditCity ? 'white' : '#d0cfcf' }}
                        value={this.state.nonFinCity}
                        onChangeText={(text) => this.setState({ nonFinCity: text })}
                        isShowDrawable={false}
                    />
                    <View style={{ marginEnd: 12, alignSelf: 'flex-end' }}>
                        <CheckBoxComponent
                            onClickPress={(status) => this.setState({ isEditPostalCode: status })}
                            value={this.state.isEditPostalCode}
                            isLogin={false}
                            title={"Edit"} />
                    </View>
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Postal Code"}
                        maxLength={30}
                        disable={!this.state.isEditPostalCode}
                        styles={{ marginTop: 0, backgroundColor: this.state.isEditPostalCode ? 'white' : '#d0cfcf' }}
                        value={this.state.nonFinPostalCode}
                        onChangeText={(text) => this.setState({ nonFinPostalCode: text })}
                        isShowDrawable={false}
                    />

                    <View style={{ marginEnd: 12, alignSelf: 'flex-end' }}>
                        <CheckBoxComponent
                            onClickPress={(status) => this.setState({ isEditAddress: status })}
                            value={this.state.isEditAddress}
                            isLogin={false}
                            title={"Edit"} />
                    </View>
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Address"}
                        maxLength={30}
                        disable={!this.state.isEditAddress}
                        styles={{ marginTop: 0, backgroundColor: this.state.isEditAddress ? 'white' : '#d0cfcf' }}
                        value={this.state.nonFinAddress}
                        onChangeText={(text) => this.setState({ nonFinAddress: text })}
                        isShowDrawable={false}
                    />

                    <View style={{ marginEnd: 12, alignSelf: 'flex-end' }}>
                        <CheckBoxComponent
                            onClickPress={(status) => this.setState({ isEditPhone: status })}
                            value={this.state.isEditPhone}
                            isLogin={false}
                            title={"Edit"} />
                    </View>
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Phone"}
                        maxLength={30}
                        disable={!this.state.isEditPhone}
                        styles={{ marginTop: 0, backgroundColor: this.state.isEditPhone ? 'white' : '#d0cfcf' }}
                        value={this.state.nonFinPhone}
                        onChangeText={(text) => this.setState({ nonFinPhone: text })}
                        isShowDrawable={false}
                    />
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Remarks"}
                        maxLength={30}
                        value={this.state.nonFinRemarks}
                        onChangeText={(text) => this.setState({ nonFinRemarks: text })}
                        isShowDrawable={false}
                    />
                </View>
                }


                {
                    this.state.financial === "fin" &&
                    <View>

                        <Text style={{ fontSize: 20, marginStart: 20, marginTop: 20 }}>Finance Type or Corrections*</Text>
                        <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                            <TouchableOpacity onPress={() => this.onPressValueRadio("correction_insured")} style={{ width: '45%', flexDirection: 'row', marginStart: 10, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <Image source={this.state.financeType === "correction_insured" ? require('../../assets/on.png') : require('../../assets/off.png')} style={{ height: 20, width: 20 }} />
                                <Text style={{ fontSize: 16, marginStart: 5 }}>Correction in insured details</Text>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onPressValueRadio("correction_arrival")} style={{ width: '45%', marginStart: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <Image source={this.state.financeType === "correction_arrival" ? require('../../assets/on.png') : require('../../assets/off.png')} style={{ height: 20, width: 20 }} />
                                <Text style={{ fontSize: 16, marginStart: 5 }}>Extension of departure date</Text>

                            </TouchableOpacity>
                        </View>

                        {
                            this.state.financeType == "correction_insured" ?

                                <View>
                                    <DropDownView
                                        styles={{ alignSelf: 'flex-start', width: '100%', marginTop: 20 }}
                                        childData={this.state.insuredList}
                                        value={this.state.financialInsuredName}
                                        onItemSelected={(value) => this.finNameOfInsured(value)}
                                        dropDownTitle={"Name of Insured:"} />

                                    <TextInputComponent
                                        isSecure={false}
                                        placeholder={"Correction Name"}
                                        maxLength={30}
                                        value={this.state.correctionName}
                                        onChangeText={(text) => this.setState({ correctionName: text })}
                                        isShowDrawable={false}
                                    />
                                    <View style={[styles.singleitem, { justifyContent: 'flex-start', alignSelf: 'center' }]}>
                                        <CalenderView
                                            showCalender={true}
                                            style={{ width: '90%', marginTop: -10, }}
                                            onPress={() => {
                                                if (this.state.financialInsuredName) {
                                                    this.setState({
                                                        finDob: true
                                                    })
                                                }
                                            }}
                                            title={this.state.finInsuredDOB} />

                                        <DatePicker
                                            datePicked={(data) => this.handleDatePicked(data, 4)}
                                            dateCanceled={() => this.setState({ finDob: false })}
                                            showDate={this.state.finDob} />

                                    </View>

                                    <View style={styles.singleitem}>
                                        <Text style={{ fontWeight: '700', marginStart: 10, width: '50%', marginStart: 10, fontSize: 15, color: 'black' }} >Proof:</Text>
                                        <TouchableOpacity onPress={() => this.onPressCamera(4)} style={{ width: '35%', borderRadius: 5, borderWidth: 1, marginEnd: 20 }}>
                                            <Text style={{ paddingTop: 10, paddingStart: 10, paddingBottom: 10 }} >{this.state.finProofName}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                :

                                <View style={[styles.singleitem, { justifyContent: 'flex-start' }]}>
                                    <Text style={{ fontWeight: '700', marginStart: 20, fontSize: 15, color: 'black' }} > Departure Date : </Text>
                                    <CalenderView
                                        showCalender={true}
                                        style={{ width: '40%', marginTop: -10, marginStart: 25 }}
                                        onPress={() => this.setState({ finDeparture: true })}
                                        title={this.state.finDepartureDate} />

                                    <DatePicker
                                        datePicked={(data) => this.handleDatePicked(data, 3)}
                                        dateCanceled={() => this.setState({ finDeparture: false })}
                                        minimumDate={new Date()}
                                        showDate={this.state.finDeparture} />

                                </View>

                        }
                        <TextInputComponent
                            isSecure={false}
                            placeholder={"Remarks"}
                            maxLength={30}
                            value={this.state.finRemarks}
                            onChangeText={(text) => this.setState({ finRemarks: text })}
                            isShowDrawable={false}
                        />

                    </View>
                }


            </View>
        )
    }

    onPressValueRadio = (value) => {
        this.setState({
            financeType: value
        })
    }




    onPressCancelOptions = () => {
        ModalAlert.createOptionModal(this.renderOptions(), 'white', { backgroundColor: 'white', height: 250 })
    }

    onPressOptions = (status) => {
        this.setState({ options: status })
        ModalAlert.hideAll()
    }

    renderOptions = () => {
        return (
            <View>
                <Text style={{ alignSelf: 'center', fontWeight: '600', fontSize: 20, marginTop: 15 }}>Select an Options:</Text>
                <TouchableOpacity onPress={() => this.onPressOptions('void')}>
                    <Text style={{ alignSelf: 'center', fontWeight: '500', fontSize: 18, marginTop: 20 }}>Void</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onPressOptions('cancellation')}>
                    <Text style={{ alignSelf: 'center', fontWeight: '500', fontSize: 18, marginTop: 20 }}>Cancellation</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onPressOptions('refund mid-term')}>
                    <Text style={{ alignSelf: 'center', fontWeight: '500', fontSize: 18, marginTop: 20 }}>Refund mid-term</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onPressOptions('corrections')}>
                    <Text style={{ alignSelf: 'center', fontWeight: '500', fontSize: 18, marginTop: 20 }}>Corrections</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>

                <ToolBarComponent
                    title={"Policy Cancellation"}
                    navigation={this.props.navigation} />

                <ScrollView>

                    <View style={styles.listContainer}>

                        <Text style={styles.texthead}>*Minimum charges of Cancellation will be CAD 20</Text>
                    </View >

                    <View style={styles.listContainer}>
                        <View style={styles.singleitem}>
                            <Text style={{ fontWeight: '700', marginStart: 10, fontSize: 15, color: 'black' }} > Policy Holder Name : </Text>
                            <Text style={styles.inputcvv} >{this.state.policydata.policy_holder_name}</Text>
                        </View>


                        <View style={styles.singleitem}>
                            <Text style={{ fontWeight: '700', marginStart: 10, fontSize: 15, color: 'black' }} > Policy Created Date : </Text>
                            <Text style={styles.inputcvv} >{this.state.policydata.first_date_of_cover}</Text>
                        </View>


                        <View style={styles.singleitem}>
                            <Text style={{ fontWeight: '700', marginStart: 10, fontSize: 15, color: 'black' }} > Policy Amount : </Text>
                            <Text style={styles.inputcvv} >{(this.state.policydata.quote_amount) ? 'CAD ' + this.state.policydata.quote_amount : ''}</Text>
                        </View>

                        <View style={styles.singleitem}>
                            <Text style={{ fontWeight: '700', marginStart: 10, fontSize: 15, color: 'black' }} > First Date of Cover : </Text>
                            <Text style={styles.inputcvv} >{this.state.policydata.first_date_of_cover}</Text>
                        </View>


                        <View style={styles.singleitem}>
                            <Text style={{ fontWeight: '700', marginStart: 10, fontSize: 15, color: 'black' }} > Last Date of cover : </Text>
                            <Text style={styles.inputcvv} >{this.state.policydata.last_date_of_cover}</Text>
                        </View>

                        <View style={styles.singleitem}>
                            <Text style={{ fontWeight: '700', marginStart: 10, fontSize: 15, color: 'black' }} > Duration : </Text>
                            <Text style={styles.inputcvv} >{this.state.policydata.duration}</Text>
                        </View>




                        {/* {this.state.showVisa &&   
                     <View style={[styles.singleitem, { justifyContent: 'flex-start', marginTop: 5 }]}>
                            <Text style={{ fontWeight: '700', marginStart: 10, marginTop: 28, fontSize: 15, color: 'black' }} > Do you have visa ? </Text>
                            <CheckBoxComponent
                                onClickPress={(status) => this.setState({ isVisa: status })}
                                value={this.state.isVisa}
                                isLogin={false}
                                title={""} />
                        </View>} */}
                        {/* 
                        {
                            (this.state.showVisa &&!this.state.isVisa) &&
                            <View style={[styles.singleitem]}>
                                <Text style={{ fontWeight: '700', marginStart: 10, fontSize: 15, color: 'black' }} > Visa Refusal Letter *: </Text>
                                <TouchableOpacity onPress={()=> this.onPressCamera(1)} style={{ width: '100%', marginStart: 20 }}>
                                    <Text style={styles.inputcvv} >{this.state.visaRefusal}</Text>
                                </TouchableOpacity>
                            </View>
                        } */}

                        {/* <View style={[styles.singleitem, { justifyContent: 'flex-start' }]}>
                            <Text style={{ fontWeight: '700', marginStart: 10, width: '50%', marginStart: 10, fontSize: 15, color: 'black' }} > Remarks *: </Text>
                            <View style={{ width: '40%', marginStart: -16, marginTop: -30 }}>
                                <TextInputComponent
                                    isSecure={false}
                                    placeholder={""}
                                    keyboardType={"default"}
                                    icon={-1}
                                    disable={this.state.cancelled}
                                    styles={{ width: '100%', alignSelf: 'flex-start', alignContent: 'flex-start', justifyContent: 'flex-start', marginStart: 0 }}
                                    value={this.state.otp}
                                    onChangeText={(text) => this.setState({ remarks: text })}
                                    isShowDrawable={false}
                                />
                            </View>

                        </View> */}





                        {
                            (this.state.cancelled && this.state.policydata.refund_amount != null) &&
                            <View>
                                <View style={styles.singleitem}>
                                    <Text style={{ fontWeight: '700', marginStart: 10, fontSize: 15, color: 'black' }} > Refund Amount : </Text>
                                    <Text style={styles.inputcvv} >{`CAD ` + this.state.policydata.refund_amount}</Text>
                                </View>

                                <View style={styles.singleitem}>
                                    <Text style={{ fontWeight: '700', marginStart: 10, fontSize: 15, color: 'black' }} > Status : </Text>
                                    <Text style={styles.inputcvv} >{this.getStatus(this.state.policydata.policy_status)}</Text>
                                </View>
                            </View>
                        }





                        {/* 
                        <UploadImage
                            onPress={() => this.onPressCamera(1)}
                            image={this.state.passportImage ? this.state.passportImage.data : null}
                            title={"Upload Passport Copy"}  />
                        <UploadImage
                            onPress={() => this.onPressCamera(2)}
                            image={this.state.boardingPass ? this.state.boardingPass.data : null}
                            title={"Upload Boarding Passes"}  /> */}
                        <View style={{ marginTop: 20 }} />
                    </View>
                    {/* 

                    <DropDownView
                        styles={{ alignSelf: 'flex-start', marginStart: 10, marginTop: 10 }}
                        childData={[
                            { label: 'Void', value: 'void' },
                            { label: 'Cancellation', value: 'cancellation' },
                            { label: 'Refund mid-term', value: 'midTerm' },
                            { label: 'Corrections', value: 'corrections' },
                        ]}
                        ref={(ref)=> this.options = ref}
                        value={this.state.options}
                        disabled={this.state.disableAll}
                        onItemSelected={(value) => this.setState({ options: value })}
                        dropDownTitle={"Select Options:"} /> */}




                    <TouchableOpacity onPress={() => this.onPressCancelOptions()}>
                        <Text style={{ borderColor: 'gray', borderWidth: 1, width: '40%', marginStart: 20, marginTop: 20, padding: 10, borderRadius: 10, textTransform: 'capitalize' }}>{this.state.options}</Text>
                    </TouchableOpacity>



                    {
                        this.renderCancelOption()
                    }


                    <RBSheet
                        ref={ref => {
                            this.RBSheet = ref;
                        }}
                        height={150}
                        openDuration={250}
                        customStyles={{
                            container: {
                                justifyContent: "center",
                                alignItems: "center"
                            }
                        }}
                    >
                        <View>

                            <TouchableOpacity onPress={() => this.onPressUpload(1)}>
                                <Text style={styles.gallery}>Open Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onPressUpload(2)}>
                                <Text style={styles.gallery}>Open Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </RBSheet>
                    {/* <View style={styles.flexDirection}>
                    <DropDownView
                        childData={[
                            { label: 'MGA', value: 'MGA' },
                            { label: 'AGA', value: 'AGA' },
                            { label: 'Advisor', value: 'Advisor' },
                        ]}
                        dropDownTitle={"Select Role:"} />
                    <DropDownView
                        childData={[
                            { label: 'Football', value: 'football' },
                            { label: 'Baseball', value: 'baseball' },
                            { label: 'Hockey', value: 'hockey' },
                        ]}
                        dropDownTitle={"Select User:"} />
                </View>

                <View style={styles.datesContainer}>
                    <View style={{ width: '50%' }}>
                        <Text>From Date</Text>
                        <CalenderView
                            style={{ width: '95%', marginEnd: 20 }}
                            onPress={() => { }}
                            showCalender={true}
                            title={""} />
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text>To Date</Text>
                        <CalenderView
                            style={{ width: '95%', marginEnd: 10 }}
                            showCalender={true}
                            onPress={() => { }}
                            title={""} />
                    </View>
                </View> */}

                    {/* {this.renderButtons()} */}
                    {/* 
                {this.renderTableView()} */}



                    <TouchableOpacity onPress={() => this.onPressCancel()} style={{ padding: 10, height: 50, marginBottom: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', marginStart: 10, marginTop: 20, marginRight: 12, width: '45%', borderRadius: 10, backgroundColor: 'rgb(62, 185, 186)' }}>
                        <Text style={{ textAlign: 'center', color: 'white', fontWeight: '800', fontSize: 16 }}>{this.state.options == "corrections" ? 'Submit' : 'Submit'}</Text>
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

const styles = StyleSheet.create({

    inputcvv: {
        width: '50%'
    },

    container: {

    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        marginStart: 20,
        marginTop: 20
    },
    listContainer: {
        backgroundColor: colors.white,
        marginTop: 10,
        marginStart: 20,
        marginRight: 20,
        width: '90%',
        paddingTop: 10,
        paddingBottom: 10,
        shadowColor: "#010000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 1,
        shadowOpacity: 1,
        elevation: 5
    },
    flexDirection: {
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'center'
    },
    inputWrap: {
        marginLeft: 10,
        marginRight: 10,
    },
    inputWrap1: {
        marginLeft: 10,
        marginRight: 10,
    },
    icon: {
        height: 200,
        width: 200, position: 'absolute',
        alignSelf: 'center',
        top: 100
    },
    singleitem: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, },
    paragraph: {
        marginTop: 0,
        fontSize: 24,
        color: 'black',
        fontWeight: '600'
    },
    gallery: {
        fontSize: 20,
        marginBottom: 20,
        padding: 5
    },
    texthead: {
        textAlign: 'center',
        marginTop: 0,
        fontSize: 14,
        color: 'red',
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
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginStart: 20, marginEnd: 20,
    },
    listItemText: {
        width: 160,
        alignContent: 'center',
        alignItems: 'center',
        padding: 20,
        textAlign: 'center',
        fontSize: 16
    },
})



export default connect(mapStateToProps, null)(cancelpolicy);