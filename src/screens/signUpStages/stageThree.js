
import React from 'react';
import { View, Image, Text, StatusBar, ScrollView, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'

import { createAppContainer, createSwitchNavigator, SafeAreaView } from "react-navigation";
import DropDownPicker from 'react-native-dropdown-picker';
import DropDownView from '../../components/textInput/dropDown'

import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import ScreenName from '../../navigation/screenNames'
import ToolBarComponent from '../../components/toolbar'
import TextInputComponent from '../../components/textInput'
import CheckBoxComponent from '../../components/checkbox';
import colors from '../../utils/colors';
import UploadImage from '../../components/uploadContainer';
import CalenderView from '../../components/textInput/calenderView';
import RBSheet from "react-native-raw-bottom-sheet";
import * as SSOServices from '../../services/SSOService'
import ImagePicker from 'react-native-image-crop-picker';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from '../../components/datePicker'

import { getDateStringFromDate } from '../../utils'
import DropDown from '../../components/dropDown'
import Modal from '../../utils/modal';
const MAX_IMAGE_HEIGHT = 1024
const MAX_IMAGE_WIDTH = 1024
const IMAGE_QUALITY = 1

const { width, height } = Dimensions.get('window')
class SignUpStageThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            corpPaper: null,
            corpLicence: null,
            firm: "",
            expDate: 'Date of Expiry',
            corpExpDate: 'Corportaion E&O Exipry Date',
            corporation: '',
            eoCorporationName: '',
            corpName : '',
            firm :1
        };

    }

    componentDidMount() {

    }

    onClickDropDown = () => {

    }



    onClickOpenCamera = () => {
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

            alert(JSON.stringify(e))

        });
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

        if (this.state.imageStatus === 2) {
            this.setState({
                corpLicence: image,
            });
        } else {
            this.setState({
                corpPaper: image,
            });
        }

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


    onPressCamera = (status) => {
        this.setState({
            imageStatus: status
        })

        this.RBSheet.open();
    }


    renderValues = () => {
        return (
            <View>
                <TouchableOpacity onPress={() => {
                    this.setState({ firm: "Yes" })
                    Modal.hideAll()
                }}>
                    <Text style={{ marginTop: 0, fontSize: 20, textAlign: 'center' }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.setState({ firm: "No" })
                    Modal.hideAll()
                }}>
                    <Text style={{ marginTop: 20, fontSize: 20, textAlign: 'center' }}>No</Text>
                </TouchableOpacity>
            </View>
        )
    }


    isValidate = () => {
        switch (true) {
            case this.state.corpName == "":
                Modal.error("Please Corporation Name")
                return false;

            case this.state.corporation == "":
                Modal.error("Bin Number of the Corporation")
                return false;
            case this.state.expDate == "Date of Expiry":
                Modal.error("Please select Date of Expiry")
                return false;
            case this.state.eoCorporationName == "":
                Modal.error("Please enter E&O Updated with Corporation Name")
                return false;
            case this.state.corpExpDate == "Corportaion E&O Exipry Date":
                Modal.error("Please select Corportaion E&O Exipry Date")
                return false;
            case this.state.corpPaper == null:
                Modal.error("Please upload Corporation Paper")
                return false;
            case this.state.corpLicence == null:
                Modal.error("Please upload Corporation Licence")
                return false;
            default:
                return true;
        }
    }


    onClickModal = () => {
        Modal.createOptionModal(this.renderValues(), true)
    }


    handleDatePicked = (data, status) => {
        let date = getDateStringFromDate(data)
        if (status === 1) {
            this.setState({
                expDate: date,
                showExpDate: false
            })
        } else {
            this.setState({
                corpExpDate: date,
                showCorpExpDate: false
            })
        }
    }

    onClickNext = () => {

        if (this.state.firm == 0) {
            let modal = Modal.createProgressModal("Please wait...", false);
            let formdata = new FormData();
            formdata.append("is_firm", this.state.firm);
            formdata.append("corporation_name", this.state.corpName);
            formdata.append("bin_no_of_corporation", this.state.corporation);
            formdata.append("corporation_licence_expiry_date", '');
            formdata.append("e_o_corporation_name", this.state.eoCorporationName);
            formdata.append("corporation_e_o_policy_expiry_date", '');
            formdata.append("user_id", "" + this.props.userData.user_id);
            formdata.append("corporation_paper_doc ", undefined)
            formdata.append("corporation_licence_doc ", undefined)

            console.log(formdata)

            SSOServices.stage3Api(formdata).then(res => {
                Modal.hide(modal);
                this.props.onClickNext(1)
                console.log(res)
            }).catch(err => {
                Modal.hide(modal);
                Modal.error(err.message)
                console.log(err);
            })
        }else{
            if (this.isValidate()) {



                let modal = Modal.createProgressModal("Please wait...", false);
                let formdata = new FormData();
                formdata.append("is_firm", this.state.firm);
                formdata.append("corporation_name", this.state.corpName);
                formdata.append("bin_no_of_corporation", this.state.corporation);
                formdata.append("corporation_licence_expiry_date", this.state.expDate);
                formdata.append("e_o_corporation_name", this.state.eoCorporationName);
                formdata.append("corporation_e_o_policy_expiry_date", this.state.corpExpDate);
                formdata.append("user_id", "" + this.props.userData.user_id);
                formdata.append("corporation_paper_doc", {
                    uri: this.state.corpPaper.path,
                    type: this.state.corpPaper.mime,
                    name: 'image',
    
                })
                formdata.append("corporation_licence_doc", {
                    uri: this.state.corpLicence.path,
                    type: this.state.corpLicence.mime,
                    name: 'image',
    
                })
    
                console.log(formdata)
    
                SSOServices.stage3Api(formdata).then(res => {
                    Modal.hide(modal);
                    this.props.onClickNext(1)
                    console.log(res)
                }).catch(err => {
                    Modal.hide(modal);
                    Modal.error(err.message)
                    console.log(err);
                })
            }
        }
       
    }


    render() {
        return (
            <ScrollView>
                <View style={{ flex: 1 }}>
                    {/* <CalenderView
                        showArrow={true}
                        onPress={() => this.onClickModal()}
                        title={this.state.firm} /> */}

                    <DropDownView
                        styles={{ width: "100%" }}
                        textstyles={{ marginStart: 20 }}
                        value={this.state.firm}
                        childData={[
                            { label: 'Yes', value: 1 },
                            { label: 'No', value: 0 },
                        ]}
                        onItemSelected={(value) => this.setState({ firm: value })}
                        dropDownTitle={"Firm/Corporation/Prop:"} />







                    {
                        this.state.firm === 1 ?
                            <View>
                                <TextInputComponent
                                    isSecure={false}
                                    placeholder={"Corporation Name"}
                                    maxLength={100}
                                    onChangeText={(text) => this.setState({ corpName: text })}
                                    isShowDrawable={false}
                                />

                                <TextInputComponent
                                    isSecure={false}
                                    placeholder={"Bin Number of the Corporation"}
                                    maxLength={100}
                                    onChangeText={(text) => this.setState({ corporation: text })}
                                    isShowDrawable={false}
                                />

                                <CalenderView
                                    showCalender={true}
                                    onPress={() => this.setState({ showExpDate: true })}
                                    title={this.state.expDate} />

                                <DatePicker
                                    datePicked={(data) => this.handleDatePicked(data, 1)}
                                    dateCanceled={() => this.setState({ showExpDate: false })}
                                    showDate={this.state.showExpDate} />


                                <DatePicker
                                    datePicked={(data) => this.handleDatePicked(data, 2)}
                                    dateCanceled={() => this.setState({ showCorpExpDate: false })}
                                    showDate={this.state.showCorpExpDate} />

                                <TextInputComponent
                                    isSecure={false}
                                    placeholder={"E&O Updated with Corporation Name"}
                                    maxLength={100}
                                    onChangeText={(text) => this.setState({ eoCorporationName: text })}
                                    isShowDrawable={false}
                                />

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


                                <CalenderView
                                    showCalender={true}
                                    onPress={() => this.setState({ showCorpExpDate: true })}
                                    title={this.state.corpExpDate} />

                                <UploadImage
                                    onPress={() => this.onPressCamera(1)}
                                    image={this.state.corpPaper ? this.state.corpPaper.data : null}
                                    title={"Upload Copy Of Corporation Paper"} />
                                <UploadImage
                                    onPress={() => this.onPressCamera(2)}
                                    image={this.state.corpLicence ? this.state.corpLicence.data : null}
                                    title={"Upload Copy Of Corporation License"} />



                            </View>
                            : <View></View>}




                    <TouchableOpacity onPress={() => this.onClickNext()} activeOpacity={0.7} style={styles.nextButton}>
                        <Text style={styles.next}>Next</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

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
        padding: 12,
        borderRadius: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 10,
    },
    nextButton: {
        backgroundColor: '#3F6183',
        width: 150,
        marginTop: 20,
        marginBottom: 200,
        height: 50,
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
    gallery: {
        fontSize: 20,
        marginBottom: 20,
        padding: 5
    },
})



export default connect(mapStateToProps, null)(SignUpStageThree);