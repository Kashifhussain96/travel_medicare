
import React from 'react';
import { View, Image, Text, StatusBar, ScrollView, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'
import moment from 'moment';

import { createAppContainer, createSwitchNavigator, SafeAreaView } from "react-navigation";
// import DateTimePicker from "react-native-modal-datetime-picker";
import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import ScreenName from '../../navigation/screenNames'
import ToolBarComponent from '../../components/toolbar'
import TextInputComponent from '../../components/textInput'
import CheckBoxComponent from '../../components/checkbox';
import DatePicker from '../../components/datePicker'
import colors from '../../utils/colors';
import UploadImage from '../../components/uploadContainer';
import CalenderView from '../../components/textInput/calenderView';
import RBSheet from "react-native-raw-bottom-sheet";
import * as SSOServices from '../../services/SSOService'
import ImagePicker from 'react-native-image-crop-picker';
const MAX_IMAGE_HEIGHT = 1024
const MAX_IMAGE_WIDTH = 1024
const IMAGE_QUALITY = 1

import { getDateStringFromDate } from '../../utils'
import Modal from '../../utils/modal';

class SignUpStageTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLicence: false,
            licenceText: 'Licence Expiry Date',
            ePolicyDate: 'E&O Policy Expiry Date',
            showEpolicy: false,
            uploadPhoto: null,
            ePolicyNum: '',
            licenceNum: '',
            imageData:null,
        };

    }

    componentDidMount() {
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

        this.setState({
            imageSize: image.size,
            imageData: image,
            uploadPhoto: image.data
        });



    }


    onClickNext = () => {
        if (this.isValidateFields()) {

            let modal = Modal.createProgressModal("Please wait...", false);



            let formdata = new FormData();
            formdata.append("licence_no", this.state.licenceNum);
            formdata.append("licence_expiry_date", this.state.licenceText);
            formdata.append("e_o_policy_no", this.state.ePolicyNum);
            formdata.append("e_o_policy_expiry_date", this.state.ePolicyDate);
            formdata.append("user_id", "" + this.props.userData.userData.user_id);

            if (this.state.imageData !== null) {
                formdata.append("Provider", {
                    uri: this.state.imageData.path,
                    type: this.state.imageData.mime,
                    name: 'image',

                })
            }

            console.log(formdata)

            SSOServices.stage2Api(formdata).then(res => {
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


    isValidateFields = () => {
        switch (true) {
            case this.state.licenceNum === '':
                Modal.error('Please enter Licence Number')
                return false;
            case this.state.licenceText === 'Licence Expiry Date':
                Modal.error('Please select Licence Expiry Date.')
                return false;
            case this.state.ePolicyNum === '':
                Modal.error('Please enter E&O Policy No.')
                return false;
            case this.state.ePolicyDate === 'E&O Policy Expiry Date':
                Modal.error('Please select E&O Policy expiry date.')
                return false;
            default:
                return true;
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

    handleDatePicked = (data, status) => {
        let date = getDateStringFromDate(data)

        if (status === 1) {
            this.setState({
                licenceText: date,
                showLicence: false
            })
        } else {
            this.setState({
                ePolicyDate: date,
                showEpolicy: false
            })
        }
    }


    render() {
        return (
            <ScrollView>
                <View style={{ flex: 1 }}>

                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Advisor License No"}
                        maxLength={100}
                        onChangeText={(text) => this.setState({ licenceNum: text })}
                        isShowDrawable={false}
                    />
                    <CalenderView
                        showCalender={true}
                        onPress={() => this.setState({ showLicence: true })}
                        title={this.state.licenceText} />

                    <DatePicker
                        datePicked={(data) => this.handleDatePicked(data, 1)}
                        dateCanceled={() => this.setState({ showLicence: false })}
                        minimumDate={new Date()}
                        showDate={this.state.showLicence} />

                    <TextInputComponent
                        isSecure={false}
                        placeholder={"E&O Policy No"}
                        maxLength={100}
                        onChangeText={(text) => this.setState({ ePolicyNum: text })}
                        isShowDrawable={false}
                    />
                    <CalenderView
                        showCalender={true}
                        onPress={() => this.setState({ showEpolicy: true })}
                        title={this.state.ePolicyDate} />

                    <DatePicker
                        datePicked={(data) => this.handleDatePicked(data, 2)}
                        dateCanceled={() => this.setState({ showEpolicy: false })}
                        minimumDate={new Date()}
                        showDate={this.state.showEpolicy} />

                    <UploadImage
                        onPress={() => this.RBSheet.open()}
                        image={this.state.uploadPhoto}
                        title={"Upload Copy Of Advisor License"} />

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
        userData: state.user
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
        marginBottom: 150,
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



export default connect(mapStateToProps, null)(SignUpStageTwo);