
import React from 'react';
import { View, AsyncStorage, Text, StatusBar, Animated, TouchableOpacity, Linking, StyleSheet, Platform, ScrollView } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'

import { createAppContainer, createSwitchNavigator, SafeAreaView, ThemeColors } from "react-navigation";

import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import ScreenName from '../../navigation/screenNames'
import ToolBarComponent from '../../components/toolbar'
import TextInputComponent from '../../components/textInput'
import CheckBoxComponent from '../../components/checkbox';
import colors from '../../utils/colors';
import UploadImage from '../../components/uploadContainer';
import Modal from '../../utils/modal';
import RBSheet from "react-native-raw-bottom-sheet";
import * as SSOServices from '../../services/SSOService'
import ImagePicker from 'react-native-image-crop-picker';


const MAX_IMAGE_HEIGHT = 1024
const MAX_IMAGE_WIDTH = 1024
const IMAGE_QUALITY = 1

class SignUpStageOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            website: "",
            phone: "",
            pLicense: "",
            dLicense: "",
            sinNo: "",
            fax: "",
            uploadPhoto: null,
            imageData:null
        };

    }

    componentDidMount() {
        if (this.props.userData !== null) {
            this.setState({
                firstName: this.props.userData.first_name,
                lastName: this.props.userData.last_name,
                email: this.props.userData.email,
            })
        }


    }



    onPressNext =  () => {
        if (this.validateFields()) {
        let modal = Modal.createProgressModal("Please wait...",false);
            let formdata = new FormData();
            formdata.append("first_name",this.state.firstName);
            formdata.append("last_name",this.state.lastName);
            // formdata.append("website",this.state.website);
            formdata.append("address",this.state.address);
            formdata.append("driving_licence_no",this.state.dLicense);
            formdata.append("province_licensed",this.state.pLicense);
            formdata.append("sin_no",this.state.sinNo);
            // formdata.append("fax",this.state.fax);
            // formdata.append("email",this.state.email);
            formdata.append("phone",this.state.phone);
            
            formdata.append("user_id",""+this.props.userData.user_id);

            if(this.state.imageData !== null){
                formdata.append("copy_of_id_proof", {
                    uri: this.state.imageData.path,
                    type: this.state.imageData.mime,
                    name: 'image',
    
                })
            }

            console.log(formdata)

            SSOServices.stage1Api(formdata).then(res=>{
                Modal.hide(modal);
                this.props.onClickNext(1)
                console.log(res)
            }).catch(err=>{
                Modal.hide(modal);
                Modal.error(err.message)
                console.log(err);
            })
        }





    }

    validateFields = () => {
        switch (true) {
            case (this.state.firstName.trim() === ""): {
                Modal.error("Enter first name.");
                return false
            }
            case (this.state.lastName.trim() === ""): {
                Modal.error("Enter last name.");
                return false
            }

            case (this.state.email.trim() === ""): {
                Modal.error("Enter email address.");
                return false
            }

            case (!this.validateEmail(this.state.email.trim())): {
                Modal.error("Email is not valid");
                return false
            }

            case (this.state.phone.trim() === ""): {
                Modal.error("Enter phone number.");
                return false
            }

            case (this.state.phone.trim().length < 10): {
                Modal.error("Invalid phone number \n Phone Number must be 10 character long.");
                return false
            }

            case (this.state.address.trim() === ""): {
                Modal.error("Enter address.");
                return false
            }

            // case (this.state.dLicense.trim() === ""): {
            //     Modal.error("Enter driving licence number.");
            //     return false
            // }
            // case (this.state.dLicense.trim().length < 15): {
            //     Modal.error("Driving license Number must be 15 character long.");
            //     return false
            // }

            // case (this.state.sinNo.trim() === ""): {
            //     Modal.error("Enter SIN number.");
            //     return false
            // }
            // case (this.state.sinNo.trim().length < 9): {
            //     Modal.error("SIN number must be 9 digits long.");
            //     return false
            // }

            default :{
                return true;
            }



        }
    }


    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    onChangedPhone = (text) => {
        this.setState({
            phone: text.replace(/[^0-9]/g, ''),
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

            alert(JSON.stringify(e))

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


    render() {
        return (
            <SafeAreaView>
                <ScrollView>
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"First Name"}
                        maxLength={30}
                        value={this.state.firstName}
                        onChangeText={(text) => this.setState({ firstName: text })}
                        isShowDrawable={false}
                    />
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Last Name"}
                        maxLength={30}
                        value={this.state.lastName}
                        onChangeText={(text) => this.setState({ lastName: text })}
                        isShowDrawable={false}
                    />
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Email Address"}
                        value={this.state.email}
                        maxLength={50}
                        onChangeText={(text) => this.setState({ email: text })}
                        isShowDrawable={false}
                    />
                    {/* <TextInputComponent
                        isSecure={false}
                        placeholder={"Website"}
                        maxLength={30}
                        value={this.state.website}
                        onChangeText={(text) => this.setState({ website: text })}
                        isShowDrawable={false}
                    /> */}
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Phone"}
                        maxLength={10}
                        value={this.state.phone}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.onChangedPhone(text)}
                        isShowDrawable={false}
                    />
                    <TextInputComponent
                        isSecure={false}
                        value={this.state.address}
                        placeholder={"Address"}
                        maxLength={50}
                        onChangeText={(text) => this.setState({ address: text })}
                        isShowDrawable={false}
                    />
                    {/* <TextInputComponent
                        isSecure={false}
                        placeholder={"Province License"}
                        maxLength={20}
                        value={this.state.pLicense}
                        onChangeText={(text) => this.setState({ pLicense: text })}
                        isShowDrawable={false}
                    />
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Driving Licence No."}
                        maxLength={15}
                        value={this.state.dLicense}
                        onChangeText={(text) => this.setState({ dLicense: text })}
                        isShowDrawable={false}
                    />
                    <TextInputComponent
                        isSecure={false}
                        placeholder={"SIN No."}
                        value={this.state.sinNo}
                        maxLength={9}
                        onChangeText={(text) => this.setState({ sinNo: text })}
                        isShowDrawable={false}
                    /> */}
                    {/* <TextInputComponent
                        isSecure={false}
                        placeholder={"Fax"}
                        value={this.state.fax}
                        maxLength={20}
                        onChangeText={(text) => this.setState({ fax: text })}
                        isShowDrawable={false}
                    /> */}

                    {/* <UploadImage
                        onPress={() => this.RBSheet.open()}
                        image={this.state.uploadPhoto}
                        title={"Upload Copy Of Id Proof"} /> */}

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
                    <TouchableOpacity onPress={() => this.onPressNext()} activeOpacity={0.7} style={styles.nextButton}>
                        <Text style={styles.next}>Next</Text>
                    </TouchableOpacity>
                </ScrollView>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    gallery: {
        fontSize: 20,
        marginBottom: 20,
        padding: 5
    },
    container: {
        padding: 12,
        borderRadius: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 10,
    },
    nextButton: {
        marginBottom: 300,
        backgroundColor: '#3F6183',
        width: 150,
        marginTop: 20,
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
    }

})


const mapStateToProps = state => {
    return {
        userData: state.user.userData
    }
};

export default connect(mapStateToProps, null)(SignUpStageOne);