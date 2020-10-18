
import React from 'react';
import { View, Image, Text, StatusBar, Animated, Easing, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, FlatList, Linking } from 'react-native';
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
         tab: "Summary",
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
            installment: [],
            transactionList: [],
            voidList: [],
            refundList: [],
            cancellationList: [],
            correctionList: []
         }
      };

   }

   async componentDidMount() {
      this.getData()
      this.getPolicyTransaction()
      this.getPolicyPamentTransaction()
   }

   getPolicyTransaction = () => {
      let id = this.props.navigation.state.params.policy_id
      SSOServices.getPolicyTransaction(id).then(res => {
         this.setState({
            voidList: res.data.policy_void_transactions,
            refundList: res.data.policy_refund_transactions,
            correctionList: res.data.policy_correction_transactions,
            cancellationList: res.data.policy_cancel_transactions
         })
      }).catch(err => {

      })
   }

   getPolicyPamentTransaction = () => {
      let formData = new FormData();

      let id = this.props.navigation.state.params.policy_id

      formData.append("user_id", this.props.userData.user_id + "");
      formData.append("policy_id", id + "");
      SSOServices.getPolicyPamentTransaction(formData).then(res => {
         this.setState({
            transactionList: res.data
         })
      }).catch(err => {

      })
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
               <Text style={styles.insuranceTitle}>Policy Type:</Text>
               <Text style={styles.insuranceDesc}>Visitors to Canada - {this.state.policydata.poilcy_details.super_visa == 1 ? "Super Visa" : ''}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Policyholder Name:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.policy_holder_name}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Policyholder Address:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.policy_holder_address+", "+this.state.policydata.poilcy_details.policy_holder_city+", Ontario, "+this.state.policydata.poilcy_details.policy_holder_postal_code}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Transaction Type:</Text>
               <Text style={styles.insuranceDesc}>New Policy</Text>
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
               <Text style={styles.insuranceTitle}>Departure Date from Country of Origin:</Text>
               <Text style={styles.insuranceDesc}></Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Deductible:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.deductibleAmount != null ? `$ ` + this.state.policydata.poilcy_details.deductibleAmount.amount+" Per Claim" : ''}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Policy Number:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.policy_no}</Text>
            </View>
            {/* <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Quote Number:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.quotaion_no}</Text>
            </View> */}
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
               <Text style={styles.insuranceDesc}>{`$ ` + this.state.policydata.poilcy_details.policy_limit+" Per insured"}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Family Coverage:</Text>
               <Text style={styles.insuranceDesc}>{this.state.policydata.poilcy_details.family_coverage == 0 ? "N/A" : "Yes"}</Text>
            </View>
            <View style={styles.insuranceContainer}>
               <Text style={styles.insuranceTitle}>Total Premium:</Text>
               <Text style={styles.insuranceDesc}>{`$ ` + this.state.policydata.poilcy_details.quote_amount}</Text>
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

   listOfInstallment = ({ item, index }) => {
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
            <Text style={[styles.insuranceTitle, { fontWeight: 'normal', width: '100%', fontSize: 14, marginStart: 15, marginTop: 10 }]}>Receipt <Text style={styles.insuranceTitle}>CAD {this.state.instText != '' ? `CAD ` + this.state.policydata.poilcy_details.advance_amount : this.state.policydata.poilcy_details.quote_amount}</Text> for Policy of <Text style={styles.insuranceTitle}>Mr/ Mrs {this.state.policydata.poilcy_details.policy_holder_name}</Text> {` `}against the above Policy No. <Text style={styles.insuranceTitle}>{this.state.policydata.poilcy_details.policy_no}</Text></Text>
            <View style={{ width: '95%', marginTop: 20, alignSelf: 'center', height: 1, backgroundColor: colors.primary }} />
         </View>
      )
   }
   contactDetails = () => {
      return (
         <View style={{ marginStart: 10, marginTop: 20 }}>
            <Text>If you notice any errors or need detailed information please contact the office</Text>
            <Text style={{ marginTop: 10, fontWeight: '600', fontSize: 16 }}>Ontario</Text>
            <Text style={{ fontWeight: '600', fontSize: 16, marginEnd: 10 }}>7895, Tranmere Drive, Mississauga, ON L5S1V9</Text>
            <Text style={{ fontWeight: '600', fontSize: 16 }}>905-672-9172</Text>
            <Text style={{ fontWeight: '600', fontSize: 16 }}>Fax- 905-673-1110</Text>
            <Text style={{ fontWeight: '600', fontSize: 16 }}>email - info@travelmedicare.com</Text>
            <Text style={{ fontWeight: '600', fontSize: 16, marginTop: 20 }}>In the event of an emergency or if you require medical treatment you must contact the Assistance Company immediately at:</Text>
            <Text style={{ fontSize: 16, marginTop: 10, textAlign: 'center' }}>1-844-879-8379</Text>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>Toll-free from Canada and the USA</Text>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>+1-416-285-1722</Text>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>Collect where available</Text>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>Email: assist@ardentassistance.com</Text>
            <Text style={{ marginTop: 10, fontWeight: '600', fontSize: 16 }}>Waiting Period-If you purchase this coverage after your departure from your country of origin coverage for any injury that occurred is limited to 50% of eligible expenses, during:</Text>
            <Text style={{ marginTop: 10 }}>a) the 48-hour period following the effective date of the policy if insurance is purchased within 30 days after your departure from your country of origin) the 8-day period following the effective date of the policy if insurance is purchased more than 30 days after your departure from your country of origin even if related expenses are incurred after the Waiting Period</Text>
            <Text style={{ fontSize: 18, fontWeight: '500', marginTop: 10 }}>Policy Conditions -</Text>
            <Text style={{ fontSize: 16 }}>Travel insurance is designed to cover loss arising from sudden and unforeseeable circumstances.It is important that you read and understand your policy as your coverage may be subject to certain limitations or exclusions.{"\n\n"}Your policy may not cover medical conditions and/or symptoms that exist prior to your trip.Check to see how this applies in your policy and how it relates to your effective date. In the event of an accident,injury or sickness,your prior medical history will be reviewed when a claim is reported.{"\n\n"}Costs incurred in your country of origin are notcovered.{"\n\n"}Your policy provides travel assistance;you are required to notify the Assistance Company prior to medical treatment.Your policy may limit benefits should you not contact the Assistance Company before seeking medical treatment.{"\n\n"}Please take the time to read this policy to ensure that it meets your needs and contact your advisor if you have any questions. You may cancel this policy within 10 days of the purchase date for a full refund provided it is before the effective date. Other refunds available are described under Refunds in the General Provisions section of this policy.</Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>THIS POLICY CONTAINS A CLAUSE WHICH MAY LIMIT THE AMOUNT PAYABLE.</Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}><Text style={{ fontWeight: '600', fontSize: 18 }}>NOTE : </Text>Italicized words are defined terms whose definition appears in the definitions section of the policy.</Text>
            <Text style={{ fontSize: 16, marginTop: 10, marginBottom: 20, lineHeight: 24 }}>If you wish to remain in Canada beyond the expiry date of this policy, you must contact your broker or sales agent and have no reason to seek medical attention during the new period of coverage. You may purchase a new policy subject to the policy terms, conditions and premium schedule in effect at the time the new policy is requested. The cost of insurance will be calculated using the age of the insured on the effective date of the new policy provided that:
            a) you remain eligible for insurance;
            b) you have not experienced any changes in your health since your effective date or arrival date;
            c) the required premium is paid. Each policy is considered a separate contract subject to all limitations and exclusions. The stability period will be applicable as of the effective date of the new policy.
d) The insured person may designate a beneficiary to receive the amount payable for his/her death. On the absence of such designation, the beneficiary shall be the estate of the insured person. Also add in the following note under all of the policy limitations - *Please refer to the policy wording for full details of all coverages, exclusions and limitation.</Text>
         </View>
      )
   }

   emailPolicy = () => {
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

   renderItem = ({ item, index }) => {
      return (
         <TouchableOpacity onPress={() => this.setState({ tab: item })}
            style={{ height: 40, paddingStart: 20, paddingEnd: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: this.state.tab == item ? colors.primary : "white", borderRadius: 5 }}>
            <Text style={{ color: this.state.tab == item ? "white" : "black" }}>{item}</Text>
         </TouchableOpacity>
      )
   }

   renderTabsItem = () => {
      switch (this.state.tab) {
         case "Summary": return <View style={{ height: '85%', marginBottom: 10 }}>{this.renderSummary()}</View>
         case "Transaction": return <View style={{ height: '85%', marginBottom: -10 }}>{this.renderTransaction()}</View>
         case "Payment Transaction": return <View style={{ height: '85%', marginBottom: 10 }}>{this.renderPaymentTransaction()}</View>

      }
   }


   renderSummary = () => {
      return (
         <ScrollView>
            <TouchableOpacity onPress={() => this.emailPolicy()} style={styles.policyButton}>
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
      )
   }


   renderItemVoid = ({ item, index }) => {
      return (
         <View style={{ backgroundColor: 'white', elevation: 5, marginTop: 20, borderRadius: 20, borderWidth: 1, width: '90%', alignSelf: 'center' }}>
         <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Insured Name:</Text>
            <Text style={{ width: '40%' }}>{item.insured_name}</Text>
         </View>
         <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Requested effective date of endorsement:</Text>
            <Text style={{ width: '40%' }}>{item.requested_date}</Text>
         </View>
         
         <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Refund Amount (CAD):</Text>
            <Text style={{ width: '40%', color: 'red' }}>-{item.refund_amount}</Text>
         </View>
         <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Transaction No:</Text>
            <Text style={{ width: '40%' }}>{item.transaction_no}</Text>

         </View>
        
         <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Remarks:</Text>
            <Text style={{ width: '40%' }}>{item.remarks}</Text>
         </View>
         <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Status:</Text>
            <Text style={{ width: '40%' }}>{item.transaction_status}</Text>
         </View>
         <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Attachments:</Text>
           {item.attachment ? <TouchableOpacity onPress={() => this.showCancelDocs(item, index)} style={{ width: '40%' }}>
               <Image source={require('../../assets/download.png')} style={{ width: 20, height: 20 }} />
            </TouchableOpacity> : <Text style={{ width: '40%' }}>-</Text>}
         </View>
         
         <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Action:</Text>
            <Text style={{ width: '40%' }}></Text>
         </View>
      </View>

      )
   }


   renderItemRefund = ({ item, index }) => {
      return (
         <View style={{ backgroundColor: 'white', elevation: 5, marginTop: 20, borderRadius: 20, borderWidth: 1, width: '90%', alignSelf: 'center' }}>
         <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Insured Name:</Text>
            <Text style={{ width: '40%' }}>{item.insured_name}</Text>
         </View>
         <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Requested effective date of endorsement:</Text>
            <Text style={{ width: '40%' }}>{item.requested_date}</Text>
         </View>
         <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Cancellation Date:</Text>
            <Text style={{ width: '40%' }}>{item.cancellation_date}</Text>
         </View>
         <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Refund Amount (CAD):</Text>
            <Text style={{ width: '40%', color: 'red' }}>-{item.refund_amount}</Text>
         </View>
         <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Transaction No:</Text>
            <Text style={{ width: '40%' }}>{item.transaction_no}</Text>

         </View>
         <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Type:</Text>
            <Text style={{ width: '40%' }}>{item.type}</Text>
         </View>
         <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Remarks:</Text>
            <Text style={{ width: '40%' }}>{item.remarks}</Text>
         </View>
         <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Attachments:</Text>
          <Text style={{ width: '40%' }}>-</Text>
         </View>
         <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Status:</Text>
            <Text style={{ width: '40%' }}>{item.transaction_status}</Text>
         </View>
         <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Action:</Text>
            <Text style={{ width: '40%' }}></Text>
         </View>
      </View>


      )
   }


   renderItemCancellation = ({ item, index }) => {
      return (
         <View style={{ backgroundColor: 'white', elevation: 5, marginTop: 20, borderRadius: 20, borderWidth: 1, width: '90%', alignSelf: 'center' }}>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Policy Holder Name:</Text>
               <Text style={{ width: '40%' }}>{this.state.policydata.poilcy_details.policy_holder_name}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Requested effective date of endorsement:</Text>
               <Text style={{ width: '40%' }}>{item.requested_date}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Cancellation Date:</Text>
               <Text style={{ width: '40%' }}>{item.cancellation_date}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Refund Amount (CAD):</Text>
               <Text style={{ width: '40%', color: 'red' }}>-{item.refund_amount}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Transaction No:</Text>
               <Text style={{ width: '40%' }}>{item.transaction_no}</Text>

            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Type:</Text>
               <Text style={{ width: '40%' }}>{item.type}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Remarks:</Text>
               <Text style={{ width: '40%' }}>{item.remarks}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Attachments:</Text>
              {item.attachment ? <TouchableOpacity onPress={() => this.showCancelDocs(item, index)} style={{ width: '40%' }}>
                  <Image source={require('../../assets/download.png')} style={{ width: 20, height: 20 }} />
               </TouchableOpacity> : <Text style={{ width: '40%' }}>-</Text>}
            </View>
            <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Status:</Text>
               <Text style={{ width: '40%' }}>{item.transaction_status}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Action:</Text>
               <Text style={{ width: '40%' }}></Text>
            </View>
         </View>

      )
   }

   showCancelDocs = (item, index) => {
      ModalAlert.createOptionModal(this.renderCancelDocs(item, index), false, { height: '75%' })
   }

   renderCancelDocs = (item, index) => {
      let data = JSON.parse(item.attachment)
      return (
         <View>
            <Text style={{ lineHeight: 20, marginTop: 20, fontWeight: 'bold' }}>Attachments For Transaction : </Text>

            <View style={{ backgroundColor: 'white', elevation: 5, marginTop: 20, borderRadius: 20, borderWidth: 1, width: '100%', alignSelf: 'center' }}>
               <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
                  <Text style={{ width: '40%' }}>Type:</Text>
                  <Text style={{ width: '40%' }}>{data[0].type}</Text>
               </View>
               <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
                  <Text style={{ width: '40%' }}>Attachment:</Text>
                  <Text style={{ width: '40%' }}>{data[0].attachment.slice(28, data[0].attachment.length)}</Text>
               </View>
               <View style={{ justifyContent: 'space-between', marginStart: 20,marginBottom: 20,  marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
                  <Text style={{ width: '40%' }}>Download:</Text>
                  <TouchableOpacity onPress={() => { Linking.openURL("https://www.travelmedicare.com/public/endorsementDocs/" + data[0].attachment) }} style={{ width: '40%' }}>
                     <Image source={require('../../assets/download.png')} style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
               </View>
            </View>

            <View style={{ backgroundColor: 'white', elevation: 5, marginTop: 20, borderRadius: 20, borderWidth: 1, width: '100%', alignSelf: 'center' }}>
               <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
                  <Text style={{ width: '40%' }}>Type:</Text>
                  <Text style={{ width: '40%' }}>{data[1].type}</Text>
               </View>
               <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
                  <Text style={{ width: '40%' }}>Attachment:</Text>
                  <Text style={{ width: '40%' }}>{data[1].attachment.slice(28, data[1].attachment.length)}</Text>
               </View>
               <View style={{ justifyContent: 'space-between', marginStart: 20,marginBottom: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
                  <Text style={{ width: '40%' }}>Download:</Text>
                  <TouchableOpacity onPress={() => { Linking.openURL("https://www.travelmedicare.com/public/endorsementDocs/" + data[1].attachment) }} style={{ width: '40%' }}>
                     <Image source={require('../../assets/download.png')} style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      )
   }

   showRequestedCorrections = (item, index) => {
      if (item.correction_requested_json.includes("field")) {
         ModalAlert.createOptionModal(this.renderCorrection(item), false, { height: '60%' })
      } else {
         ModalAlert.createOptionModal(this.renderArrivalCorrection(item), false, { height: '75%' })
      }
   }


   renderArrivalCorrection = (item) => {
      let data = JSON.parse(item.correction_requested_json)

      return (
         <View>
            <Text style={{ lineHeight: 20, marginTop: 20, fontWeight: 'bold' }}>Requested Data For Transaction :{item.transaction_no}</Text>

            <FlatList
               renderItem={({ item, index }) => {
                  return (
                     <View style={{ backgroundColor: 'white', elevation: 5, marginTop: 20, borderRadius: 20, borderWidth: 1, width: '90%', alignSelf: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginStart: 10, marginTop: 10 }}>Insured Name:</Text>
                        <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 10, flexDirection: 'row' }}>
                           <Text style={{ width: '40%' }}>Old Name:</Text>
                           <Text style={{ width: '40%' }}>{item.old_insuredname}</Text>
                        </View>
                        <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
                           <Text style={{ width: '40%' }}>New Name:</Text>
                           <Text style={{ width: '40%' }}>{item.new_insuredname}</Text>
                        </View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginStart: 10, marginTop: 10 }}>Date of Birth:</Text>
                        <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 10, marginBottom: 20, flexDirection: 'row' }}>
                           <Text style={{ width: '40%' }}>Old DOB:</Text>
                           <Text style={{ width: '40%' }}>{item.old_ins_dob}</Text>
                        </View>
                        <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
                           <Text style={{ width: '40%' }}>New DOB:</Text>
                           <Text style={{ width: '40%' }}>{item.new_ins_dob}</Text>
                        </View>
                        <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row', marginBottom: 20 }}>
                           <Text style={{ width: '40%' }}>Proof:</Text>
                           <TouchableOpacity onPress={() => { Linking.openURL("https://www.travelmedicare.com/public/endorsementDocs/" + item.document) }} style={{ width: '40%' }}>
                              <Image source={require('../../assets/download.png')} style={{ width: 20, height: 20 }} />
                           </TouchableOpacity>
                        </View>
                     </View>
                  )
               }}
               data={data} />
         </View>
      )
   }
   renderCorrection = (item) => {
      let data = JSON.parse(item.correction_requested_json)

      return (
         <View>
            <Text style={{ lineHeight: 20, marginTop: 20, fontWeight: 'bold' }}>Requested Data For Transaction :{item.transaction_no}</Text>

            <FlatList
               renderItem={({ item, index }) => {
                  return (
                     <View style={{ backgroundColor: 'white', elevation: 5, marginTop: 20, borderRadius: 20, borderWidth: 1, width: '90%', alignSelf: 'center' }}>
                        <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
                           <Text style={{ width: '40%' }}>Field:</Text>
                           <Text style={{ width: '40%' }}>{item.field}</Text>
                        </View>
                        <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
                           <Text style={{ width: '40%' }}>Old Value:</Text>
                           <Text style={{ width: '40%' }}>{item.old_value}</Text>
                        </View>
                        <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, marginBottom: 20, flexDirection: 'row' }}>
                           <Text style={{ width: '40%' }}>New Value:</Text>
                           <Text style={{ width: '40%' }}>{item.new_value}</Text>
                        </View>

                     </View>
                  )
               }}
               data={data} />
         </View>
      )
   }


   renderItemCorrection = ({ item, index }) => {
      return (
         <View style={{ backgroundColor: 'white', elevation: 5, marginTop: 20, borderRadius: 20, borderWidth: 1, width: '90%', alignSelf: 'center' }}>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Requested Date:</Text>
               <Text style={{ width: '40%' }}>{item.requested_date}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Transaction No.:</Text>
               <Text style={{ width: '40%' }}>{item.transaction_no}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Type of Correction:</Text>
               <Text style={{ width: '40%' }}>{item.type}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Correction needed in:</Text>
               <Text style={{ width: '40%' }}>{item.correction_fields}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Requested Corrections:</Text>
               <TouchableOpacity onPress={() => this.showRequestedCorrections(item, index)} style={{ width: '40%' }}>
                  <Image source={require('../../assets/eye.png')} style={{ width: 20, height: 20 }} />
               </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Amount(CAD):</Text>
               <Text style={{ width: '40%' }}>{item.refund_amount ? item.refund_amount : '-'}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>To/From Customer(CAD):</Text>
               <Text style={{ width: '40%' }}>-</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Remarks:</Text>
               <Text style={{ width: '40%' }}>{item.remarks}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Status:</Text>
               <Text style={{ width: '40%' }}>{item.transaction_status}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Action:</Text>
               <Text style={{ width: '40%' }}></Text>
            </View>
         </View>

      )
   }


   renderTransaction = () => {
      return (
         <ScrollView>


            <View>
               <Text style={{ lineHeight: 20, marginTop: 20, fontWeight: 'bold',marginTop:20,marginStart:20 }}>Policy Transactions for the Policy ({this.state.policydata.poilcy_details.quotaion_no})</Text>

               <View>
                  <Text style={{ lineHeight: 20, marginTop: 20, fontWeight: 'bold',marginTop:20,marginStart:20 }}>Void Policy Transactions</Text>
                  

                  {
                     this.state.voidList.length > 0 ?<FlatList data={this.state.voidList} renderItem={this.renderItemVoid} />
                        : <Text style={{ lineHeight: 20, marginTop: 20, fontWeight: 'bold',alignSelf:'center', marginTop:20,marginStart:20 }}>No Data</Text>
                  }
               </View>


               <View>
                  <Text style={{ lineHeight: 20, marginTop: 20, fontWeight: 'bold',marginTop:20,marginStart:20 }}>Refund Policy Transactions</Text>
                  

                  {
                     this.state.refundList.length > 0 ?<FlatList data={this.state.refundList} renderItem={this.renderItemRefund} />
                        : <Text style={{ lineHeight: 20, marginTop: 20, fontWeight: 'bold',alignSelf:'center', marginTop:20,marginStart:20 }}>No Data</Text>
                  }
               </View>


               <View>
                  <Text style={{ lineHeight: 20, marginTop: 20, fontWeight: 'bold',marginTop:20,marginStart:20 }}>Cancellation Transactions</Text>
                  
                  {
                     this.state.cancellationList.length > 0 ?<FlatList data={this.state.cancellationList} renderItem={this.renderItemCancellation} />
                        : <Text style={{ lineHeight: 20, marginTop: 20, fontWeight: 'bold',alignSelf:'center', marginTop:20,marginStart:20 }}>No Data</Text>
                  }
                  
               </View>


               <View>
                  <Text style={{ lineHeight: 20, marginTop: 20, fontWeight: 'bold',marginTop:20,marginStart:20 }}>Correction Transactions</Text>
                  {
                     this.state.correctionList.length > 0 ? <FlatList data={this.state.correctionList} renderItem={this.renderItemCorrection} />
                        : <Text style={{ lineHeight: 20, marginTop: 20,marginBottom:20, fontWeight: 'bold',alignSelf:'center', marginTop:20,marginStart:20 }}>No Data</Text>
                  }
                  
               </View>

            </View>
         </ScrollView>

      )
   }

   renderPaymentTrans = ({ item, index }) => {
      return (
         <View style={{ backgroundColor: 'white', elevation: 5, marginTop: 20, borderRadius: 20, borderWidth: 1, width: '90%', alignSelf: 'center' }}>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Card Holder Name:</Text>
               <Text style={{ width: '40%' }}>{item.card_holder_name}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Date:</Text>
               <Text style={{ width: '40%' }}>{item.payment_date}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Premium Type:</Text>
               <Text style={{ width: '40%' }}>{item.premium_type}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Type:</Text>
               <Text style={{ width: '40%' }}>{item.type}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Amount(CAD):</Text>
               <Text style={{ width: '40%' }}>{item.amount}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Transaction ID:</Text>
               <Text style={{ width: '40%' }}>{item.cardtransaction_json_details.transaction_id}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Transaction Description:</Text>
               <Text style={{ width: '40%' }}>{item.cardtransaction_json_details.transaction_desc}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', marginBottom: 10, marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>
               <Text style={{ width: '40%' }}>Action:</Text>
               <Text style={{ width: '40%' }}></Text>
            </View>
         </View>

      )
   }


   renderPaymentTransaction = () => {
      return (
         <View style={{ height: '100%' }}>
            <FlatList
               style={{ height: '100%' }}
               renderItem={this.renderPaymentTrans}
               data={this.state.transactionList} />
         </View>
      )
   }



   render() {
      return (
         <SafeAreaView style={{ flex: 1 }}>

            <ToolBarComponent
               title={"Policy Summary"}
               navigation={this.props.navigation} />


            <View style={styles.topContainer}>
               <Text style={styles.topTitle}>This is the confirmation of {"\n"} insurance</Text>
            </View>

            <View>

               <FlatList
                  horizontal
                  renderItem={this.renderItem}
                  showsHorizontalScrollIndicator={false}
                  style={{ marginStart: 20, marginTop: 20, marginEnd: 20 }}
                  data={["Summary", "Transaction", "Payment Transaction"]} />

            </View>


            <View style={{ backgroundColor: colors.underline, width: '90%', height: 2, alignSelf: 'center', marginTop: 20 }} />
            <View>
               {this.renderTabsItem()}
            </View>




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