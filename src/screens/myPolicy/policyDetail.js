
import React from 'react';
import { View, Image, Text, StatusBar, Animated, Easing, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'
import * as SSOServices from '../../services/SSOService'
import ModalAlert from '../../utils/modal'
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import ToolBarComponent from '../../components/toolbar'
import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import ScreenName from '../../navigation/screenNames'
import colors from '../../utils/colors';


class PolicyDetails extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         instText: "",
         policydata: {
            policyadmin: {
               first_name: '',
               last_name: '',
               phone: '',
               email: '',
               address: '',
               province_licensed: ''
            },
            poilcy_details: {

            },
            installment: []
         }
      };

   }

   async componentDidMount() {
      this.getData()
   }

   getData = () => {
      let modal = ModalAlert.createProgressModal('Fetching Data...', false)
      let formData = new FormData();

      let id = this.props.navigation.state.params.id

      formData.append("user_id", this.props.userData.user_id);
      formData.append("quotation_id", id);
      SSOServices.viewPolicy(formData).then(res => {
         ModalAlert.hide(modal);
         this.setState({
            policydata: res.data,
            instText: res.data.poilcy_details.installment_text
         })
      }).catch(err => {
         ModalAlert.hide(modal)
      })
   }


   renderInsurance = () => {
      return (
         <View style={styles.personalDetails}>
            <View style={[styles.insuranceContainer, { marginTop: 10 }]}>
               <Text style={styles.insuranceTitle}>Visitors to Canada:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.super_visa == 1 ? "Super Visa" : ''}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Policyholder Name:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.policy_holder_name}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Policyholder Address:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.policy_holder_address}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Transaction Type:</Text>
               <Text style={styles.insuranceDesc}>New Quote</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Policy Effective   Date:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.first_date_of_cover != "" ? this.state.policydata.poilcy_details.first_date_of_cover : ""}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Coverage Type:</Text>
               <Text style={styles.insuranceDesc}>{(this.state.policydata.poilcy_details.spouse_details != null && this.state.policydata.poilcy_details.spouse_details.length > 0) ? this.state.policydata.poilcy_details.spouse_details[0].plan_type : ""}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Arrival Date in Canada:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.arrival_date}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Deductible:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.deductibleAmount != null ? `CAD ` + this.state.policydata.poilcy_details.deductibleAmount.amount : ''}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Policy Number:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.policy_no}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Quote Number:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.quotaion_no}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Broker:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.policyadmin.first_name + ` ` + this.state.policydata.policyadmin.last_name}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Transaction Date:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.first_date_of_cover}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Policy Expiry Date:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.last_date_of_cover}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Coverage Limit:</Text>
               <Text style={styles.insuranceDesc}>{`CAD ` + this.state.policydata.poilcy_details.policy_limit}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Family Coverage:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.family_coverage == 0 ? "No" : "Yes"}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Total Premium:</Text>
               <Text style={styles.insuranceDesc}>{`CAD ` + this.state.policydata.poilcy_details.quote_amount}</Text>
            </View>

         </View>
      )
   }


   renderListTravellers = ({ item, index }) => {
      return (
         <View>

            <View style={styles.personalDetails}>
               <View style={styles.insuranceContainer}>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>Name:</Text>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>{item.name}</Text>
               </View>
               <View style={styles.insuranceContainer}>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>Date of Birth:</Text>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>{item.dob}</Text>
               </View>
               <View style={styles.insuranceContainer}>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>Plan Type:</Text>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>{item.plan_type}</Text>
               </View>
               <View style={styles.insuranceContainer}>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>Total Premium:</Text>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>CAD {item.amount}</Text>
               </View>
            </View>
         </View>
      )
   }

   showInstallmentInfo = () => {
      return (
         <View>
            <Text style={{ color: 'rgb(139, 0, 0)', marginStart: 15, marginTop: 10, marginEnd: 20 }}>{this.state.instText}</Text>
         </View>
      )
   }

   listOfInstallment = ({item,index}) => {
      return (
         <View>

            <View style={styles.personalDetails}>
               <View style={styles.insuranceContainer}>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>Installment Date:</Text>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>{item.installment_date}</Text>
               </View>
               <View style={styles.insuranceContainer}>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>Amount:</Text>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>${item.amount}</Text>
               </View>
               <View style={styles.insuranceContainer}>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>Status:</Text>
                  <Text style={[styles.insuranceTitle, { fontWeight: 'normal' }]}>{item.payment_status == 1 ? "Success" : "Pending"}</Text>
               </View>
               
            </View>
         </View>
      )
   }

   installmentsDetail = () => {
      return (
         <View>
            <Text>sasa</Text>
         </View>
      )
   }

   premiumReceipt = () => {
      return (
         <Text>asas</Text>
      )
   }
   premiumReceiptAmount = () => {
      return (
         <View>
      <Text style={[styles.insuranceTitle, { fontWeight: 'normal',width:'100%',fontSize:14,marginStart:15 ,marginTop:10}]}>Receipt <Text style={styles.insuranceTitle}>CAD {this.state.instText != '' ? `CAD `+this.state.policydata.poilcy_details.advance_amount : this.state.policydata.poilcy_details.quote_amount}</Text> for Policy of <Text style={styles.insuranceTitle}>Mr/ Mrs {this.state.policydata.poilcy_details.policy_holder_name}</Text> {` `}against the above Policy No. <Text style={styles.insuranceTitle}>{this.state.policydata.poilcy_details.policy_no}</Text></Text>
         <View style={{width:'95%',marginTop:20,alignSelf:'center',height:1,backgroundColor:colors.primary}}/>
         </View>
      )
   }
   contactDetails = () => {
      return (
         <View style={{marginStart:10,marginTop:20}}>
            <Text>If you notice any errors or need detailed information please contact the office</Text>
            <Text style={{marginTop:10,fontWeight:'600',fontSize:16}}>Ontario</Text>
            <Text style={{fontWeight:'600',fontSize:16,marginEnd:10}}>7895, Tranmere Drive, Mississauga, ON L5S1V9</Text>
            <Text style={{fontWeight:'600',fontSize:16}}>905-672-9172</Text>
            <Text style={{fontWeight:'600',fontSize:16}}>Fax- 905-673-1110</Text>
            <Text style={{fontWeight:'600',fontSize:16}}>email - info@travelmedicare.com</Text>
            <Text style={{fontWeight:'600',fontSize:16,marginTop:20}}>In the event of an emergency or if you require medical treatment you must contact the Assistance Company immediately at:</Text>
            <Text style={{fontSize:16,marginTop:10,textAlign:'center'}}>1-844-879-8379</Text>
            <Text style={{fontSize:16,textAlign:'center'}}>Toll-free from Canada and the USA</Text>
            <Text style={{fontSize:16,textAlign:'center'}}>+1-416-285-1722</Text>
            <Text style={{fontSize:16,textAlign:'center'}}>Collect where available</Text>
            <Text style={{fontSize:16,textAlign:'center'}}>Email: assist@ardentassistance.com</Text>
            <Text style={{marginTop:10,fontWeight:'600',fontSize:16}}>Waiting Period-If you purchase this coverage after your departure from your country of origin coverage for any injury that occurred is limited to 50% of eligible expenses, during:</Text>
            <Text style={{marginTop:10}}>a) the 48-hour period following the effective date of the policy if insurance is purchased within 30 days after your departure from your country of origin) the 8-day period following the effective date of the policy if insurance is purchased more than 30 days after your departure from your country of origin even if related expenses are incurred after the Waiting Period</Text>
            <Text style={{fontSize:18,fontWeight:'500',marginTop:10}}>Policy Conditions -</Text>
            <Text style={{fontSize:16}}>Travel insurance is designed to cover loss arising from sudden and unforeseeable circumstances.It is important that you read and understand your policy as your coverage may be subject to certain limitations or exclusions.{"\n\n"}Your policy may not cover medical conditions and/or symptoms that exist prior to your trip.Check to see how this applies in your policy and how it relates to your effective date. In the event of an accident,injury or sickness,your prior medical history will be reviewed when a claim is reported.{"\n\n"}Costs incurred in your country of origin are notcovered.{"\n\n"}Your policy provides travel assistance;you are required to notify the Assistance Company prior to medical treatment.Your policy may limit benefits should you not contact the Assistance Company before seeking medical treatment.{"\n\n"}Please take the time to read this policy to ensure that it meets your needs and contact your advisor if you have any questions. You may cancel this policy within 10 days of the purchase date for a full refund provided it is before the effective date. Other refunds available are described under Refunds in the General Provisions section of this policy.</Text>
            <Text style={{fontSize:16,marginTop:10}}>THIS POLICY CONTAINS A CLAUSE WHICH MAY LIMIT THE AMOUNT PAYABLE.</Text>
            <Text style={{fontSize:16,marginTop:10}}><Text style={{fontWeight:'600',fontSize:18}}>NOTE : </Text>Italicized words are defined terms whose definition appears in the definitions section of the policy.</Text>
         </View>
      )
   }

   emailPolicy = () =>{
      let id = this.props.navigation.state.params.id
      let modal = ModalAlert.createProgressModal('Sending Email...', false)
      let formData = new FormData();
      formData.append("user_id", this.props.userData.user_id);
      formData.append("quotation_id", id);
      SSOServices.emailPolicy(formData).then(res => {
          ModalAlert.hide(modal)
          ModalAlert.alert(res.message)
      }).catch(err => {
          ModalAlert.hide(modal)
          ModalAlert.error(err)
      })
   }


   render() {
      return (
         <SafeAreaView style={{ flex: 1 }}>

            <ToolBarComponent
               title={"Policy Summary"}
               navigation={this.props.navigation} />

            <ScrollView>

               <View style={styles.topContainer}>
                  <Text style={styles.topTitle}>This is the confirmation of {"\n"} insurance</Text>
               </View>

               <TouchableOpacity onPress={()=>this.emailPolicy()} style={styles.policyButton}>
                  <Text style={styles.email}>Email Policy</Text>
               </TouchableOpacity>


               <View style={styles.personalDetails}>
                  <Text style={styles.advisoryDetails}>Advisor Details:-</Text>
                  <Text style={styles.name}>{this.state.policydata.policyadmin.first_name + ' ' + this.state.policydata.policyadmin.last_name}</Text>
                  <Text style={styles.number}>{this.state.policydata.policyadmin.phone}</Text>
                  <Text style={styles.userEmail}>{this.state.policydata.policyadmin.email}</Text>
                  <Text style={styles.userAddress}>{this.state.policydata.policyadmin.address}</Text>
                  <Text style={styles.addressState}>{this.state.policydata.policyadmin.province_licensed}</Text>
               </View>

               {this.renderInsurance()}

               <Text style={styles.listTravellers}>List Of Travellers</Text>
               <FlatList
                  renderItem={this.renderListTravellers}
                  keyExtractor={(id) => this.key = id}
                  data={this.state.policydata.poilcy_details.spouse_details} />



               {this.state.instText !== "" && this.showInstallmentInfo()}
               {this.state.instText !== "" && <View>
                  <Text style={styles.listTravellers}>Installments</Text>
                  <FlatList
                     renderItem={this.listOfInstallment}
                     keyExtractor={(id) => this.key1 = id}
                     data={this.state.policydata.installment} />
               </View>}
               <Text style={styles.listTravellers}>Premium Receipt</Text>
               {this.premiumReceiptAmount()}
               {this.contactDetails()}
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
   listTravellers: {
      fontWeight: '600',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 20
   },
   insuranceTitle: {
      width: '50%',
      fontSize: 18,
      fontWeight: '600'
   },
   insuranceDesc: {
      width: '50%',
      fontSize: 18,
      fontWeight: '400'
   },
   insuranceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginStart: 5,
      marginEnd: 5,
      marginTop: 0,
      marginBottom: 20
   },
   advisoryDetails: {
      marginBottom: 10,
      fontSize: 20,
      fontWeight: '600'
   },
   name: {
      fontSize: 20,
   },
   number: {
      fontSize: 20,
      marginTop: 5
   },
   userEmail: {
      marginTop: 5,
      fontSize: 20,
   },
   userAddress: {
      marginTop: 5,
      fontSize: 20,
   },
   addressState: {
      marginTop: 5,
      fontSize: 20,
   },
   personalDetails: {
      shadowColor: "#000000",
      shadowOffset: {
         width: 0,
         height: 5
      },
      shadowRadius: 10,
      shadowOpacity: 0.15,
      padding: 10,
      paddingTop: 15,
      borderRadius: 5,
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: 'gray',
      width: '95%',
      marginTop: 15
   },
   email: {
      color: 'white',
      fontWeight: '600',
      fontSize: 20
   },
   policyButton: {
      height: 50,
      width: 150,
      marginStart: 10,
      marginTop: 10,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary
   },
   topTitle: {
      textAlign: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: 24,
      textTransform: 'uppercase'
   },
   topContainer: {
      height: 80,
      width: '100%',
      justifyContent: 'center',
      backgroundColor: colors.primary
   },
   container: {
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
   }
})



export default connect(mapStateToProps, null)(PolicyDetails);