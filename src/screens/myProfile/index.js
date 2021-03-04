import React from "react";
import {
  View,
  Image,
  Text,
  StatusBar,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
// import SignInNavigator from '../../navigation/SignInNavigator'

import { createAppContainer, createSwitchNavigator } from "react-navigation";

import { connect } from "react-redux";
import { createStackNavigator } from "react-navigation-stack";
import ScreenName from "../../navigation/screenNames";
import colors from "../../utils/colors";
import TextInputComponent from "../../components/textInput";
import * as SSOServices from "../../services/SSOService";
import Modal from "../../utils/modal";
import DropDownView from "../../components/textInput/dropDown";
class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isApp: false,
      userData: {
        userData: {},
        licenceData: {},
        corporationData: {},
        refrenceData: {}
      },
      role :"1"
    };
    this.springValue = new Animated.Value(1);
    this.fadeInOpacity = new Animated.Value(0);
  }

  async componentDidMount() {
    Modal.createProgressModal("Fetching data...", false);
    await this.getProfileDetails();
    await this.getLicenceDetails();
    await this.getCorporation();
    await this.getReferenceData();
  }

  getProfileDetails = () => {
    let userId = this.props.userData.user_id;
    SSOServices.getProfileData(userId + "/1")
      .then((res) => {
        let obj = this.state.userData
        obj.userData = res.data
        this.setState({
          userData: obj
        });
      })
      .catch((res) => {
      });
  };

  getLicenceDetails = () => {
    let userId = this.props.userData.user_id;
    SSOServices.getProfileData(userId + "/2")
      .then((res) => {
        let obj = this.state.userData
        obj.licenceData = res.data
        this.setState({
          userData: obj
        });
      })
      .catch((res) => {
      });
  };
  getCorporation = () => {
    let userId = this.props.userData.user_id;
    SSOServices.getProfileData(userId + "/3")
      .then((res) => {
        let obj = this.state.userData
        obj.corporationData = res.data
        this.setState({
          userData: obj
        });
      })
      .catch((res) => {
      });
  };
  getReferenceData = () => {
    let userId = this.props.userData.user_id;
    SSOServices.getProfileData(userId + "/4")
      .then((res) => {
        let obj = this.state.userData
        obj.refrenceData = res.data
        this.setState({
          userData: obj
        }, () => {
          console.log(this.state.userData)
        });
        Modal.hideAll()

      })
      .catch((res) => {
        Modal.hideAll()

      });
  };
  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image
              source={require("../../assets/images/arrow.png")}
              style={[styles.logo]}
            />
          </TouchableOpacity>
          <Text style={styles.home}>Personal Details</Text>
        </View>

        <ScrollView>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>First Name*</Text>
          <TextInputComponent
            isSecure={false}
            placeholder={"First Name"}
            styles={{ marginTop: 5 }}
            maxLength={100}
            value={this.state.userData.userData.first_name}
            disable={true}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>Last Name*</Text>
          <TextInputComponent
            isSecure={false}
            placeholder={"Last Name"}
            maxLength={100}
            styles={{ marginTop: 5 }}
            value={this.state.userData.userData.last_name}
            disable={true}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>Email Address*</Text>

          <TextInputComponent
            isSecure={false}
            placeholder={"Email Address"}
            value={this.state.userData.userData.email}
            maxLength={100}
            styles={{ marginTop: 5 }}
            disable={true}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>Website</Text>

          <TextInputComponent
            isSecure={false}
            placeholder={"Website"}
            value={this.state.userData.userData.website}
            maxLength={100}
            styles={{ marginTop: 5 }}
            disable={true}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>Phone*</Text>

          <TextInputComponent
            isSecure={false}
            placeholder={"Phone"}
            value={this.state.userData.userData.phone}
            disable={true}
            styles={{ marginTop: 5 }}
            maxLength={100}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>Address*</Text>

          <TextInputComponent
            isSecure={false}
            placeholder={"Address"}
            value={this.state.userData.userData.address}
            maxLength={100}
            styles={{ marginTop: 5 }}
            disable={true}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          {/* <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>First Name*</Text>

          <TextInputComponent
            isSecure={false}
            placeholder={"Province License"}
            styles={{ marginTop: 5 }}
            maxLength={100}
            value={this.state.userData.userData.province_licensed}
            disable={true}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          /> */}
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>Fax</Text>

          <TextInputComponent
            isSecure={false}
            placeholder={"Fax"}
            styles={{ marginTop: 5 }}
            disable={true}
            value={this.state.userData.userData.fax}
            maxLength={100}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />

          <View style={{ width: '100%', backgroundColor: 'gray', height: 1, alignSelf: 'center', marginTop: 20 }} />
          <Text style={[styles.home, { marginTop: 10 }]}>Liecense Details</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>License No. *</Text>

          <TextInputComponent
            isSecure={false}
            value={this.state.userData.licenceData.licence_no}
            placeholder={"Licence No."}
            maxLength={100}
            styles={{ marginTop: 5 }}
            disable={true}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>License Expiry Date *</Text>

          <TextInputComponent
            isSecure={false}
            placeholder={"Licence Expiry Date"}
            maxLength={100}
            styles={{ marginTop: 5 }}
            disable={true}
            value={this.state.userData.licenceData.licence_expiry_date}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>{"E&O Policy No. *"}</Text>


          <TextInputComponent
            isSecure={false}
            placeholder={"E&O Policy No."}
            maxLength={100}
            disable={true}
            styles={{ marginTop: 5 }}
            value={this.state.userData.licenceData.e_o_policy_no}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>{"E&O Policy Expiry Date *"}</Text>

          <TextInputComponent
            isSecure={false}
            placeholder={"E&O Policy Expiry Date "}
            maxLength={100}
            styles={{ marginTop: 5 }}
            disable={true}
            value={this.state.userData.licenceData.e_o_policy_expiry_date}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />

          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>Provider</Text>

            <TouchableOpacity onPress={() => Linking.openURL(this.state.userData.licenceData.provider)}>
              <Image style={{ width: 30, height: 30, marginStart: 50, marginTop: 20 }} source={require('../../assets/download.png')} />

            </TouchableOpacity>

          </View>



          <View style={{ width: '100%', backgroundColor: 'gray', height: 1, alignSelf: 'center', marginTop: 20 }} />
          <Text style={styles.home}>Corporation Details</Text>

          <Text style={styles.forms_styles}>Firm/Corporation/Prop</Text>
          <View style={styles.forms_spinner}>
            <DropDownView
              childData={[
                { label: "No", value: "0" },
                { label: "Yes", value: "1" },
              ]}
              value={this.state.role}
              onItemSelected={(value) => this.setState({ role: value })}
              dropDownTitle={""}
            />
          </View>

          {
            this.state.role == 1 ?
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ marginStart: 20, marginTop: 20, color: 'black', fontSize: 20 }}>Upload Copy Of{"\n"}Corporation Paper</Text>

                  <TouchableOpacity onPress={() => Linking.openURL(this.state.userData.corporationData.corporation_licence_doc)}>
                    <Image style={{ width: 30, height: 30, marginStart: 50, marginTop: 20 }} source={require('../../assets/download.png')} />

                  </TouchableOpacity>

                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ marginStart: 20, marginTop: 20, color: 'black', fontSize: 20 }}>Upload Copy Of{"\n"}Corporation License</Text>

                  <TouchableOpacity onPress={() => Linking.openURL(this.state.userData.corporationData.corporation_paper_doc)}>
                    <Image style={{ width: 30, height: 30, marginStart: 50, marginTop: 20 }} source={require('../../assets/download.png')} />

                  </TouchableOpacity>

                </View>

                <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>{"Corporation Name *"}</Text>

                <TextInputComponent
                  isSecure={false}
                  placeholder={"Corporation Name"}
                  maxLength={100}
                  style={{ marginTop: 5 }}
                  disable={true}
                  value={this.state.userData.corporationData.corporation_name}
                  onChangeText={(text) => this.setState({ confirmPassword: text })}
                  isShowDrawable={false}
                />
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>{"BIN No of the Corporation *"}</Text>


                <TextInputComponent
                  isSecure={false}
                  placeholder={"BIN No of the Corporation"}
                  maxLength={100}
                  disable={true}
                  style={{ marginTop: 5 }}
                  value={this.state.userData.corporationData.bin_no_of_corporation}
                  onChangeText={(text) => this.setState({ confirmPassword: text })}
                  isShowDrawable={false}
                />

                <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>{"Date Of Expiry *"}</Text>

                <TextInputComponent
                  isSecure={false}
                  placeholder={"Date Of Expiry"}
                  maxLength={100}
                  disable={true}
                  style={{ marginTop: 5 }}
                  value={this.state.userData.corporationData.corporation_e_o_policy_expiry_date}
                  onChangeText={(text) => this.setState({ confirmPassword: text })}
                  isShowDrawable={false}
                />


                <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>{"E&O updated with Corporation name *"}</Text>

                <TextInputComponent
                  isSecure={false}
                  placeholder={"E&O updated with Corporation name"}
                  maxLength={100}
                  style={{ marginTop: 5 }}
                  disable={true}
                  value={this.state.userData.corporationData.e_o_corporation_name}
                  onChangeText={(text) => this.setState({ confirmPassword: text })}
                  isShowDrawable={false}
                />

                <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 20, marginTop: 10 }}>{"Corporation E&O Expiry Date *"}</Text>

                <TextInputComponent
                  isSecure={false}
                  placeholder={"Corporation E&O Expiry Date "}
                  maxLength={100}
                  style={{ marginTop: 5 }}
                  disable={true}
                  value={this.state.userData.corporationData.corporation_licence_expiry_date}
                  onChangeText={(text) => this.setState({ confirmPassword: text })}
                  isShowDrawable={false}
                />



              </View>

              : null
          }




          <View style={{ width: '100%', backgroundColor: 'gray', height: 1, alignSelf: 'center', marginTop: 20 }} />
          <Text style={styles.home}>Reference Details</Text>

          <Text style={styles.forms_styles}>Reference Name 1</Text>
          <TextInputComponent
            isSecure={false}
            maxLength={100}
            styles={{ marginTop: 0 }}
            disable={true}
            value={this.state.userData.refrenceData.refrence_name_1}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={styles.forms_styles}>Reference Email 1</Text>
          <TextInputComponent
            isSecure={false}
            maxLength={100}
            styles={{ marginTop: 0 }}
            disable={true}
            value={this.state.userData.refrenceData.refrence_email_1}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={styles.forms_styles}>Reference Contact No 1</Text>
          <TextInputComponent
            isSecure={false}
            maxLength={100}
            disable={true}
            styles={{ marginTop: 0 }}
            value={this.state.userData.refrenceData.refrence_contact_no_1}
            isShowDrawable={false}
          />
          <Text style={styles.forms_styles}>Reference Address No 1</Text>
          <TextInputComponent
            isSecure={false}
            maxLength={100}
            disable={true}
            styles={{ marginTop: 0 }}
            value={this.state.userData.refrenceData.refrence_address_1}
            isShowDrawable={false}
          />
          <Text style={styles.forms_styles}>Reference Name 2</Text>
          <TextInputComponent
            isSecure={false}
            maxLength={100}
            disable={true}
            styles={{ marginTop: 0 }}
            value={this.state.userData.refrenceData.refrence_name_2}
            isShowDrawable={false}
          />
          <Text style={styles.forms_styles}>Reference Email 2</Text>
          <TextInputComponent
            isSecure={false}
            maxLength={100}
            disable={true}
            styles={{ marginTop: 0 }}
            value={this.state.userData.refrenceData.refrence_email_2}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={styles.forms_styles}>Reference Contact No 2</Text>
          <TextInputComponent
            isSecure={false}
            maxLength={100}
            styles={{ marginTop: 0 }}
            disable={true}
            value={this.state.userData.refrenceData.refrence_contact_no_2}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={styles.forms_styles}>Reference Address 2</Text>
          <TextInputComponent
            isSecure={false}
            maxLength={100}
            styles={{ marginTop: 0 }}
            disable={true}
            value={this.state.userData.refrenceData.refrence_address_2}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={styles.forms_styles}>Reference Name 3</Text>
          <TextInputComponent
            isSecure={false}
            maxLength={100}
            disable={true}
            styles={{ marginTop: 0 }}
            value={this.state.userData.refrenceData.refrence_name_3}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={styles.forms_styles}>Reference Email 3</Text>
          <TextInputComponent
            isSecure={false}
            maxLength={100}
            styles={{ marginTop: 0 }}
            disable={true}
            value={this.state.userData.refrenceData.refrence_email_3}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={styles.forms_styles}>Reference Contact No 3</Text>
          <TextInputComponent
            isSecure={false}
            maxLength={100}
            styles={{ marginTop: 0 }}
            disable={true}
            value={this.state.userData.refrenceData.refrence_contact_no_3}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
          <Text style={styles.forms_styles}>Reference Address 3</Text>
          <TextInputComponent
            isSecure={false}
            maxLength={100}
            styles={{ marginBottom: 30, marginTop: 0 }}
            disable={true}
            value={this.state.userData.refrenceData.refrence_address_3}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            isShowDrawable={false}
          />
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userData: state.user.userData,
  };
};

const styles = StyleSheet.create({
  profileDesc: {
    marginStart: 20,
    fontSize: 16,
    marginTop: 20,
  },
  logo: {
    height: 20,
    width: 20,
    marginStart: 20,
    marginTop: 10
  },
  home: {
    marginStart: 20,
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "600",
    marginTop: 20,
  },
  forms_styles: {
    marginStart: 20,
    fontSize: 17,
    marginTop: 10,

    fontWeight: "bold",
    width: "100%",
  },
  forms_spinner: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 5,
    marginTop: 1,
    marginLeft: 40,
    marginRight: 10,
    padding: 0,
    alignSelf: "center",
  },
  image: {
    height: 100,
    width: 100,
  },
  flexDirection1: {
    flexDirection: "row",
    width: "50%",
    height: "30%",
    margin: 5,
    marginBottom: 5,
    alignSelf: "center",
  },
  listItemText: {
    width: " 50%",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 16,
  },
  toolbar: {
    backgroundColor: colors.white,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});

export default connect(
  mapStateToProps,
  null
)(MyProfile);
