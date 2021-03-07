
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
import TextInputComponent from '../../components/textInput'
import RBSheet from "react-native-raw-bottom-sheet";
import ImagePicker from 'react-native-image-crop-picker';
import { StackActions, NavigationActions } from 'react-navigation';

import CalenderView from '../../components/textInput/calenderView';
import DropDownView from '../../components/textInput/dropDown'
import Modal from '../../utils/modal';
const MAX_IMAGE_HEIGHT = 1024
const MAX_IMAGE_WIDTH = 1024
const IMAGE_QUALITY = 1
import * as Listeners from "../../utils/listeners";

class EditEndoursement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            remarks: '',
            attachments: [],
            copyPassPort: 'Choose File',
            passportImage: null,
            visaImage: null,
            visa: 'Choose File',
            imageStatus: 0,
            documentTypes: [],
            oldFile : null,
            newFile: 'Choose file',
            type : 0,
            newFileImage:null
        };

    }


    async componentDidMount() {

        this.setState({
            data: this.props.navigation.state.params.data,
            remarks: this.props.navigation.state.params.data?.remarks,
        }, () => {

            this.setState({
                attachments: JSON.parse(this.state.data?.attachment),
            }, () => {
                this.getEndoursementData();

                if (this.state?.attachments?.constructor === Array) {
                    this.setState({
                        type: 1
                    })
                } else {
                    this.setState({
                        type: 0
                    })
                }
    
                this.setState({
                    oldFile : this.state.attachments?.attachment,
                })
            })

        })



       await this.getDocuments()



    }


    getDocuments = () => {
        SSOServices.getVoidDocument().then(res => {
            let data = []
            for (let i = 0; i < res.data.length; i++) {
                data.push({ label: res.data[i], value: res.data[i] })
            }
            this.setState({
                documentTypes: data,
            docType : this.props.navigation.state.params.data?.document_type,

            })
        }).catch(err => {

        })
    }


    _validateImage(image) {

        console.log(image)

        switch (this.state.imageStatus) {


            case 8: {
                let name = ''
                if (image.path) {
                    name = image.path.slice(image.path.length - 16, image.path.length)
                }

                this.setState({
                    copyPassPort: name,
                    passportImage: image
                });
                break;


            }


            case 9: {
                let name = ''
                if (image.path) {
                    name = image.path.slice(image.path.length - 16, image.path.length)
                }

                this.setState({
                    visa: name,
                    visaImage: image
                });
                break;

            }



            case 12: {
                let name = ''
                if (image.path) {
                    name = image.path.slice(image.path.length - 16, image.path.length)
                }

                this.setState({
                    newFile: name,
                    newFileImage: image
                });
                break;

            }

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



    setDocuments = (list) => {

        // for (let i = 0; i < list.length; i++) {
        //     if (list[i].type == "Passport") {
        //         this.setState({
        //             copyPassport: list[i].attachment ? list[i].attachment?.slice(list[i].attachment.length - 16, list[i].attachment.length) : "",
        //             passportImage: list[i].path ? list[i].path : "",
        //         })
        //     } else if (list[i].type == "Visa") {
        //         this.setState({
        //             visa: list[i].attachment ? list[i].attachment?.slice(list[i].attachment.length - 16, list[i].attachment.length) : "",
        //             visaImage: list[i].path ? list[i].path : "",
        //         })
        //     }
        // }
    }



    //     {             
    //         user_id:47
    // endorsement_type:void
    // transaction_no:2020PTM108409-01
    // visa_type:0
    // remark[]:Passport of son
    // endorsement_id[]:217
    // docs_types[]:letter
    // documents[]: 20_10_2020-2020PTM108409-01-letter.png
    // new_documents[]:

    // }


    onPressCameraVoid = (status) => {
        this.setState({
            imageStatus: status,
        })

        this.RBSheet.open();
    }


    getEndoursementData = () => {
        let formData = new FormData();



        formData.append("user_id", this.props.userData.user_id)
        formData.append("endorsement_type", this.state.data?.endorsement_type)
        formData.append("transaction_no", this.state.data?.transaction_no)

        SSOServices.getendorsementfields(formData).then(res => {
            this.setState({
                insuredId: res.data.length > 0 ? res.data[0].insured_id : '',
            }, () => {
                this.setDocuments(res.data.length > 0 ? res.data[0].attachment : [])
            })
        }).catch(err => {

        })
    }

    validateSTC = () =>{
        if (this.state.passportImage == null) {
            ModalAlert.error('Please upload the passport document')
            return false
        }



        if (this.state.visaImage == null) {
            ModalAlert.error('Please upload the visa document.')
            return false
        }


        if (this.state.remarks == '') {
            ModalAlert.error('Please enter Remarks')
            return false
        }

        return true
    }
    validateVTC = () =>{
        if (this.state.docType == '') {
            ModalAlert.error('Please select the document type')
            return false
        }



        if (this.state.newFileImage == null) {
            ModalAlert.error('Please uploa the document.')
            return false
        }


        if (this.state.remarks == '') {
            ModalAlert.error('Please enter Remarks')
            return false
        }

        return true
    }

    onPressCancel = () => {

        if(this.validateVTC()){
            let modal = ModalAlert.createProgressModal('Updating Please wait...')
            let formData = new FormData();
        
            formData.append("user_id", this.props.userData.user_id)
            formData.append("transaction_no", this.state.data?.transaction_no)
            formData.append("endorsement_type", this.state.data?.endorsement_type)
            formData.append("visa_type",0)
            formData.append("endorsement_id[]", this.state.data?.policy_endorsement_id)
            formData.append("insured_id[]", this.state.insuredId)
            formData.append("insured_name[]", this.state.data?.insured_name)
            formData.append("documents[]", {
                uri: this.state.newFileImage.path,
                type: this.state.newFileImage.mime,
                name: 'Image '+this.state.oldFile,
            })
            formData.append("new_documents[]", {
                uri: this.state.newFileImage.path,
                type: this.state.newFileImage.mime,
                name: 'Image '+this.state.newFile,
            })
            formData.append("docs_types[]", this.state.docType)
            formData.append("remark[]", this.state.remarks)
    
            SSOServices.updateEndorsements(formData).then(res => {
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
                ModalAlert.error(err.message)
            })
        }
       
    }
    onPressUpdateSV = () => {

        if(this.validateSTC()){
            let modal = ModalAlert.createProgressModal('Updating Please wait...')

            let formData = new FormData();

            formData.append("user_id", this.props.userData.user_id)
            formData.append("transaction_no", this.state.data?.transaction_no)
            formData.append("endorsement_type", this.state.data?.endorsement_type)
            formData.append("visa_type", 1)
            formData.append("endorsement_id[]", this.state.data?.policy_endorsement_id)
            formData.append("insured_id[]", this.state.insuredId)
            formData.append("insured_name[]", this.state.data?.insured_name)
            formData.append("copyofpassport[]", {
                uri: this.state.passportImage.path,
                type: "image/png",
                name: 'Image '+this.state.copyPassPort,
            })
            formData.append("new_copyofpassport[]", {
                uri: this.state.passportImage.path,
                type: "image/png",
                name: 'Image '+this.state.copyPassPort,
            })
            formData.append("visadocument[]", {
                uri: this.state.passportImage.path,
                type: "image/png",
                name: 'Image '+this.state.visa,
            })
            formData.append("new_visadocument[]", {
                uri: this.state.passportImage.path,
                type: "image/png",
                name: 'Image '+this.state.visa,
            })
            formData.append("remark[]", this.state.remarks)
    
           
            SSOServices.updateEndorsements(formData).then(res => {
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
                ModalAlert.error(err.message)
            })
        }
        
    }


    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>

                <ToolBarComponent
                    title={"Edit Endorsement"}
                    navigation={this.props.navigation} />
                <ScrollView>
                    <View>
                        <View style={[styles.singleitem, { justifyContent: 'flex-start' }]}>
                            <Text style={{ fontWeight: '700', marginStart: 20, width: '50%', marginStart: 25, fontSize: 15, color: 'black' }}>Name of Insured *: </Text>
                            <View style={{ width: '40%', marginTop: -30 }}>
                                <TextInputComponent
                                    isSecure={false}
                                    placeholder={""}
                                    keyboardType={"default"}
                                    icon={-1}
                                    value={this.state.data?.insured_name}
                                    disable={true}
                                    styles={{ width: '100%', alignSelf: 'flex-start', backgroundColor: 'lightgray', alignContent: 'flex-start', justifyContent: 'flex-start', marginStart: 0 }}
                                    onChangeText={(text) => {

                                    }}
                                    isShowDrawable={false}
                                />
                            </View>

                        </View>

                        {
                            this.state.type == 1 ?
                                <View>

                                    <View style={[styles.singleitem, { justifyContent: 'space-evenly' }]}>
                                        <Text style={{ fontWeight: '700', marginStart: 10, width: '50%', marginStart: 10, fontSize: 15, color: 'black' }} >Copy of Passport*: </Text>
                                        <TouchableOpacity onPress={() => this.onPressCameraVoid(8)} style={{ width: '35%', borderRadius: 5, borderWidth: 1, marginEnd: 20 }}>
                                            <Text style={{ paddingTop: 10, paddingStart: 10, paddingBottom: 10 }} >{this.state.copyPassPort}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[styles.singleitem, { justifyContent: 'space-evenly' }]}>
                                        <Text style={{ fontWeight: '700', marginStart: 10, width: '50%', fontSize: 15, color: 'black' }}>Visa Rejection Document*: </Text>
                                        <TouchableOpacity onPress={() => this.onPressCameraVoid(9)} style={{ width: '35%', borderRadius: 5, borderWidth: 1, marginEnd: 20 }}>
                                            <Text style={{ paddingTop: 10, paddingStart: 10, paddingBottom: 10 }} >{this.state.visa}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>


                                :
                                <View>

                                    <DropDownView
                                        styles={{ alignSelf: 'flex-start',width:'100%',  marginTop: 30 }}
                                        childData={this.state.documentTypes}
                                        value={this.state.docType}
                                        onItemSelected={(value) =>this.setState({docType: value})}
                                        dropDownTitle={"Document Type*:"} />

                                    <View style={[styles.singleitem, { justifyContent: 'space-evenly' }]}>
                                        <Text style={{ fontWeight: '700', marginStart: 10, width: '50%', fontSize: 15, color: 'black' }}>File *: </Text>
                                        <TouchableOpacity onPress={() => this.onPressCameraVoid(12)} style={{ width: '35%', borderRadius: 5, borderWidth: 1, marginEnd: 20 }}>
                                            <Text style={{ paddingTop: 10, paddingStart: 10, paddingBottom: 10 }} >{this.state.newFile}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                        }
                        <View style={[styles.singleitem, { justifyContent: 'flex-start' }]}>
                            <Text style={{ fontWeight: '700', marginStart: 20, width: '50%', marginStart: 25, fontSize: 15, color: 'black' }}>Remarks *: </Text>
                            <View style={{ width: '40%', marginTop: -30 }}>
                                <TextInputComponent
                                    isSecure={false}
                                    placeholder={""}
                                    keyboardType={"default"}
                                    icon={-1}
                                    value={this.state.remarks}
                                    disable={this.state.cancelled}
                                    styles={{ width: '100%', alignSelf: 'flex-start', alignContent: 'flex-start', justifyContent: 'flex-start', marginStart: 0 }}
                                    onChangeText={(text) => {
                                        this.setState({
                                            remarks: text
                                        })
                                    }}
                                    isShowDrawable={false}
                                />
                            </View>

                        </View>
                        <TouchableOpacity onPress={() => this.state.type == 1 ? this.onPressUpdateSV() : this.onPressCancel()} style={{ padding: 10, height: 50, marginBottom: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', marginStart: 10, marginTop: 20, marginRight: 12, width: '45%', borderRadius: 10, backgroundColor: 'rgb(62, 185, 186)' }}>
                            <Text style={{ textAlign: 'center', color: 'white', fontWeight: '800', fontSize: 16 }}>{this.state.options == "corrections" ? 'Submit' : 'Submit'}</Text>
                        </TouchableOpacity>
                    </View>

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
    singleitem: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        marginStart: 20,
        marginTop: 20
    }, gallery: {
        fontSize: 20,
        marginBottom: 20,
        padding: 5
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
        marginStart: 20,
        marginEnd: 20,
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        marginTop: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    itemText: {
        color: colors.white,
        width: 160,
        height: 50,
        alignItems: "center",
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
    },
    itemView: {
        flexDirection: "row",
        borderWidth: 1,
        borderTopWidth: 0,
        marginStart: 20,
        height: 70,
        marginEnd: 20,
    },
    listItemText: {
        width: 160,
        justifyContent: "center",
        alignSelf: "center",
        textAlign: "center",
        fontSize: 16,
    },
})



export default connect(mapStateToProps, null)(EditEndoursement);