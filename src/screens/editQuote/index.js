import React from "react";
import {
  View,
  Image,
  Text,
  StatusBar,
  TouchableOpacity,
  Easing,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  FlatList,
  Linking,
} from "react-native";
import Toast from '../../utils/toast'
// import SignInNavigator from '../../navigation/SignInNavigator'
import ToolBarComponent from "../../components/toolbar";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import colors from "../../utils/colors";
import * as SSOServices from "../../services/SSOService";
import ModalAlert from "../../utils/modal";
import { connect } from "react-redux";
import moment from "moment";
import CheckBoxComponent from "../../components/checkbox";
import TextInputComponent from "../../components/textInput";
import DatePicker from "../../components/datePicker";
import { createStackNavigator } from "react-navigation-stack";
import CalenderView from "../../components/textInput/calenderView";
import DropDownView from "../../components/textInput/dropDown";
var activeIndex = -1;
import { getDateStringFromDate } from "../../utils";
import Modal from "../../utils/modal";
import { min } from "react-native-reanimated";
import RadioButtonComponent from '../../components/radioButton'
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";

var radio_props = [
  { label: "Lumpsum", value: 1 },
  { label: "Monthly", value: 2 },
];

var formData = new FormData();

class EditQuote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableAll: false,
      quotedList: [],
      benefiaryData: [
        {
          name: "",
          dob: "",
          gender: "",
          bName: "",
          bRelation: "",
          bDob: "",
          age: "",
          finalQuestionary: [{ "suppose_no": "1", "querstionary": ["", "", "", "", "", "", "", "", "", "", ""], "is_questionary_yes": 0 }],
          isChecked: false
        },
      ],
      delInsuredIds: "",
      response: {
        data: [],
      },
      deductibleData: [],
      policyHolderName: [],
      premiumData: [
        {
          title: "Standard",
          isSelected: false,
        },
        {
          title: "Enhanced",
          isSelected: false,
        },
        {
          title: "Premium",
          isSelected: false,
        },
      ],
      policyData: [],
      fromDate: "",
      lastDate: "",
      departureFromCountry: "",
      clientCountry: "",
      province: "",
      superVisaItem: 1,
      paymentFrequency: 1,
      waitingPeriod: "NA",
      duration: "",
      durationInt: 0,
      departureDate: "",
      policyLimit: "",
      planType: "",
      deductible: "",
      policyName: "",
      policyDob: "",
      policyEmail: "",
      policyCity: "",
      policyPostalCode: "",
      policyNumber: "",
      policyAddress: "",
      policyBeneficiary: "",
      showPolicyDob: false,
      disableAll: false,
      policyBackUp: []
    };
  }

  async componentDidMount() {
    await this.getPlan();
    await this.getPolicyLimit();
    await this.getQuoteByID();
  }

  calculateTableData = (list, benefiaryData) => {
    let quoteList = [];

    for (let index = 0; index < list.length; index++) {
      let ele = list[index];

      try {
        if (benefiaryData.getquoteData.spouses_questionary[index].is_questionary_yes == "1") {
          let obj = {
            user_name: ele[0],
            plan_name: ele[1],
            pre: ele[2],
            no_pre: ele[3],
            isActive: !benefiaryData.getquoteData.spouses_questionary[index].querstionary.includes("1"),
            status: ele.selectedKey == 2 ? "pre" : "non_pre",
          };
          quoteList.push(obj);
        } else {
          let obj = {
            user_name: ele[0],
            plan_name: ele[1],
            pre: ele[2],
            isActive: true,
            no_pre: ele[3],
            status: ele.selectedKey == 2 ? "pre" : "non_pre",
          };
          quoteList.push(obj);
        }
      } catch (error) {

        let obj = {
          user_name: ele[0],
          plan_name: ele[1],
          pre: ele[2],
          isActive: true,
          no_pre: ele[3],
          status: ele.selectedKey == 2 ? "pre" : "non_pre",
        };
        quoteList.push(obj);
      }



    }



    this.setState(
      {
        quotedList: quoteList,
      },
      () => {
        this.calculateTotalAmount();
      }
    );
  };

  selectPlanId = (id) => {
    let list = [...this.state.plans];
    let active = -1;
    for (let index = 0; index < list.length; index++) {
      if (list[index].plan_id === id) {
        active = index;
      }
    }

    this.setState(
      {
        activeIndex: active,
        planType: id,
      },
      () => {
        this.getDeductible();
      }
    );
  };

  getQuoteByID = () => {
    if (this.props.navigation.state.params.id) {
      let modal = ModalAlert.createProgressModal("Fetching Data...", false);
      SSOServices.getQuoteById(this.props.navigation.state.params.id)
        .then((res) => {
          this.selectPlanId(res.data.getquoteData.plan_id);


          this.setState({
            familyCoverage: res.data.getquoteData.family_coverage == 1,
            superVisa: res.data.getquoteData.super_visa == 1,
            id: res.data.getquoteData.id,
            user_id: res.data.getquoteData.policy_holder_beneficiary,
            showPolicyHolderData: true,
            deductible: res.data.getquoteData.deductible_id,
            disableAll: false,
            fromDate: res.data.getquoteData.first_date_of_cover,
            lastDate: res.data.getquoteData.last_date_of_cover,
            planType: res.data.getquoteData.plan_id,
            duration: res.data.getquoteData.duration.toString(),
            departureDate: res.data.getquoteData.arrival_date,

            paymentFrequency: res.data.getquoteData.payment_frequency,
            policyLimit: res.data.getquoteData.policy_limit.toString(),
            policyName: res.data.getquoteData.policy_holder_name,
            policyDob: res.data.getquoteData.policy_holder_dob,
            policyEmail: res.data.getquoteData.policy_holder_email,
            policyCity: res.data.getquoteData.policy_holder_city,
            policyPostalCode: res.data.getquoteData.policy_holder_postal_code,
            policyAddress: res.data.getquoteData.policy_holder_address,
            policyNumber: res.data.getquoteData.policy_holder_phone,
            policyBeneficiary: res.data.getquoteData.policy_holder_beneficiary,
          }, () => {
            this.forceUpdate()
          });

          this.calculateTableData(res.data.getquoteData.tableData, res.data);


          this.calculateWaitingPeriod(res.data.getquoteData.arrival_date, false);

          this.calculateBeneficiaryData(res)

          ModalAlert.hide(modal);
        })
        .catch((err) => {
          ModalAlert.hide(modal);
          console.log(err)
        });
    }
  };

  calculateBeneficiaryData = (res) => {
    let list = [];
    let policyNameList = [];
    try {

      for (let index = 0; index < res.data.insured_data.length; index++) {
        let age = this.calculateAge(
          res.data.insured_data[index].insured_DOB
        );
        let questions = res.data.getquoteData.spouses_questionary[index]

        let obj = {
          isChecked: false,
          id: res.data.insured_data[index].id,
          name: res.data.insured_data[index].insured_name,
          gender: res.data.insured_data[index].insured_gender,
          dob: res.data.insured_data[index].insured_DOB,
          bName: res.data.insured_data[index].beneficiary_name ? res.data.insured_data[index].beneficiary_name : "",
          age: age,
          bRelation:
            res.data.insured_data[index].beneficiary_relation_to_insured ? res.data.insured_data[index].beneficiary_relation_to_insured : "",
          bDob: res.data.insured_data[index].beneficiary_DOB
            ? res.data.insured_data[index].beneficiary_DOB
            : "",
          // finalQuestionary: [{ suppose_no: (index + 1) + "", querstionary: ["", "", "", "", "", "", "", "", "", "", ""], is_questionary_yes: 0 }],

          finalQuestionary: questions.is_questionary_yes == "1" ?
            [{ suppose_no: questions.suppose_no, querstionary: [questions.querstionary[1], questions.querstionary[3], questions.querstionary[5], questions.querstionary[7], questions.querstionary[9], questions.querstionary[11], questions.querstionary[13], questions.querstionary[15], questions.querstionary[17], questions.querstionary[19], questions.querstionary[21]], is_questionary_yes: questions.is_questionary_yes }] :
            [{ suppose_no: rquestions.suppose_no, querstionary: ["", "", "", "", "", "", "", "", "", "", ""], is_questionary_yes: questions.is_questionary_yes }]


        };
        policyNameList.push({ label: res.data.insured_data[index].insured_name, value: res.data.insured_data[index].insured_name });

        list.push(obj);
      }
      this.setState({
        benefiaryData: list,
        policyHolderName: policyNameList
      }, () => {
        console.log("Benefiarcy Data", this.state.policyHolderName);

      });
    } catch (error) {

      for (let index = 0; index < res.data.insured_data.length; index++) {
        let age = this.calculateAge(
          res.data.insured_data[index].insured_DOB
        );
        policyNameList.push({ label: res.data.insured_data[index].insured_name, value: res.data.insured_data[index].insured_name });

        let questions = res.data.getquoteData.spouses_questionary[index]

        let obj = {
          isChecked: false,
          id: res.data.insured_data[index].id,
          name: res.data.insured_data[index].insured_name,
          gender: res.data.insured_data[index].insured_gender,
          dob: res.data.insured_data[index].insured_DOB,
          bName: res.data.insured_data[index].beneficiary_name ? res.data.insured_data[index].beneficiary_name : "",
          age: age,
          bRelation:
            res.data.insured_data[index].beneficiary_relation_to_insured ? res.data.insured_data[index].beneficiary_relation_to_insured : "",
          bDob: res.data.insured_data[index].beneficiary_DOB
            ? res.data.insured_data[index].beneficiary_DOB
            : "",
          // finalQuestionary: [{ suppose_no: (index + 1) + "", querstionary: ["", "", "", "", "", "", "", "", "", "", ""], is_questionary_yes: 0 }],

          finalQuestionary: [{ suppose_no: (index + 1) + "", querstionary: ["", "", "", "", "", "", "", "", "", "", ""], is_questionary_yes: 0 }]


        };

        list.push(obj);
      }
      this.setState({
        benefiaryData: list,
        policyHolderName: policyNameList
      }, () => {
        console.log("Benefiarcy Data", this.state.policyHolderName);

      });
    }
  }


  onPressEditQuote = () => {
    if (this.validatePolicyHolderDetails()) {
      let loader = ModalAlert.createProgressModal("Please wait...", false);
      let formData = new FormData()
      let list = [];
      for (let index = 0; index < this.state.benefiaryData.length; index++) {
        formData.append(
          "insured_gender[]",
          this.state.benefiaryData[index].gender.charAt(0).toUpperCase() + this.state.benefiaryData[index].gender.slice(1)
        );
        formData.append(
          "benificiary_name[]",
          this.state.benefiaryData[index].bName
        );
        formData.append(
          "benificiary_relation[]",
          this.state.benefiaryData[index].bRelation
        );
        formData.append(
          "benificiary_dob[]",
          this.state.benefiaryData[index].bDob
        );

        formData.append("supposes[" + index + "]", index + 1);
        formData.append(
          "user_name[]",
          this.state.benefiaryData[index].name
        );
        formData.append(
          "date_of_birth[]",
          this.state.benefiaryData[index].dob
        );
        if (this.state.benefiaryData[index].id) {
          formData.append("insured_id[]", this.state.benefiaryData[index].id);
        } else {
          formData.append("insured_id[]", '');
        }


        if (this.state.benefiaryData[index].finalQuestionary[0].is_questionary_yes == 1) {
          let question = this.state.benefiaryData[index].finalQuestionary[0].querstionary
          formData.append("finalQuestionary[" + index + "][dob]", this.state.benefiaryData[index].dob)
          formData.append("finalQuestionary[" + index + "][name]", this.state.benefiaryData[index].name)
          formData.append("finalQuestionary[" + index + "][suppose_no]", (index + 1) + "")
          formData.append("finalQuestionary[" + index + "][querstionary]", "[" + question[0] + "," + question[1] + "," + question[2] + "," + question[3] + "," + question[4] + "," + question[5] + "," + question[6] + "," + question[7] + "," + question[8] + "," + question[9] + "," + question[10] + "]")
          formData.append("finalQuestionary[" + index + "][is_questionary_yes]", 1)


        } else {
          formData.append("finalQuestionary[" + index + "][dob]", this.state.benefiaryData[index].dob)
          formData.append("finalQuestionary[" + index + "][name]", this.state.benefiaryData[index].name)
          formData.append("finalQuestionary[" + index + "][suppose_no]", (index + 1) + "")
          formData.append("finalQuestionary[" + index + "][querstionary]", "")
          formData.append("finalQuestionary[" + index + "][is_questionary_yes]", 0)
        }



      }



      formData.append("quote_id", this.state.id);
      formData.append("quote_amount", this.state.totalAmount);
      formData.append("first_date_of_cover", this.state.fromDate);
      formData.append("last_date_of_cover", this.state.lastDate);
      formData.append("policy_limit", this.state.policyLimit);
      formData.append("arrival_date", this.state.departureDate);
      formData.append("duration", this.state.duration);
      formData.append("plan_id", this.state.planType);
      formData.append("family_coverage", this.state.familyCoverage ? 1 : 0);
      formData.append("payment_frequency", this.state.paymentFrequency);
      formData.append("super_visa", this.state.superVisa ? 1 : 0);
      formData.append("province_id", 1);
      formData.append("deductible_id", this.state.deductible);
      formData.append("policy_holder_name", this.state.policyName);
      formData.append("policy_holder_dob", this.state.policyDob);
      formData.append("policy_holder_email", this.state.policyEmail);
      formData.append("policy_holder_city", this.state.policyCity);
      formData.append("policy_holder_postal_code", this.state.policyPostalCode);
      formData.append("policy_holder_phone", this.state.policyNumber);
      formData.append("policy_holder_address", this.state.policyAddress);
      formData.append("Waiting_period", this.state.waitingPeriod);


      let del = this.state.delInsuredIds.slice(0, this.state.delInsuredIds.length - 1)




      formData.append("del_insured_ids", del);
      formData.append(
        "policy_holder_benificiary",
        this.state.policyBeneficiary
      );
      formData.append("extend_policy_id", 0);
      formData.append("country_id", 1);
      formData.append("extend", 0);
      formData.append(
        "elegibility_question",
        "<p><strong>To be eligible for coverage, on the effective date, you must :</strong> <p>1. Be a visitor to Canada or a person in Canada under a valid work or student visa, a Canadian or an immigrant not eligible for benefits under a government health insurance plan; and <br> 2. be at least 15 days of age and less than 90 years of age (less than 70 year of age for Premium plan); and <br> 3. not be travelling against the advice of a physician and/or not have been diagnosed with a terminal illness; and <br> 4. not be experiencing new or undiagnosed signs or symptoms and/or know of any reason to seek medical attention; and <br> 5. not require assistance with the activities of daily living(dressing, bathing, eating, using the toilet or getting in or out of a bed or chair).<br><strong>I confirm that all travellers are eligible to purchase this policy</strong></p>"
      );
      formData.append("user_id", this.props.userData.user_id);

      for (let index = 0; index < this.state.quotedList.length; index++) {
        formData.append(
          "tableData[" + index + "][]",
          this.state.quotedList[index].user_name
        );
        formData.append(
          "tableData[" + index + "][]",
          this.state.quotedList[index].plan_name
        );
        formData.append(
          "tableData[" + index + "][]",
          this.state.quotedList[index].pre
        );
        formData.append(
          "tableData[" + index + "][]",
          this.state.quotedList[index].no_pre
        );

        if (
          this.state.quotedList[index].status === "pre") {
          formData.append("getChecked[]", this.state.quotedList[index].pre);
        }

        if (this.state.quotedList[index].status === "non_pre") {
          formData.append("getChecked[]", this.state.quotedList[index].no_pre);
        }
      }

      console.log(formData)

      SSOServices.editQuote(formData)
        .then((res) => {
          ModalAlert.hide(loader);

          let modalAl = Modal.createModal({ text: '' }, { text: res.message }, true, Modal.createSecondaryButton('Ok', () => {
            this.props.navigation.goBack();
            Modal.hide(modalAl)
          }))

        })
        .catch((err) => {
          ModalAlert.hide(loader);
          console.log(err)
          // if (err.message) {
          //   ModalAlert.error(err.message);
          // } else {
          //   ModalAlert.error("Something went wrong");
          // }
        });
    }
  };

  setMindate = () => {
    let d = new Date();
    d.setDate(d.getDate() - 14);

    this.setState({
      minDate: d,
    });
  };

  getPlan = () => {
    SSOServices.getPlan()
      .then((res) => {
        let arr = [];
        for (let index = 0; index < res.data.length; index++) {
          res.data[index].isSelected = false;
          arr.push(res.data[index]);
        }

        this.setState({
          plans: arr,
        });
      })
      .catch((err) => { });
  };

  getDeductible = () => {
    let formData = new FormData();
    let dob = [];
    for (let index = 0; index < this.state.benefiaryData.length; index++) {
      // dob.push(this.state.benefiaryData[index].dob)
      formData.append(
        "date_of_birth[" + index + "]",
        this.state.benefiaryData[index].dob[index]
      );
    }
    formData.append("plan_id", this.state.planType ? this.state.planType : 1);

    SSOServices.getDeductible(formData)
      .then((res) => {
        let data = [];
        for (let i = 0; i < res.data.length; i++) {
          data.push({
            label: "CAD " + res.data[i].amount,
            value: res.data[i].deductible_id,
          });
        }
        this.setState({
          deductibleData: data,
          deductible : res.data[0].deductible_id
        });
        if (this.props.navigation.state.params.id) {
          this.setState({
            deductible: this.state.deductible,
          });
        }
      })
      .catch((err) => { });
  };

  getPolicyLimit = () => {
    SSOServices.getPolicyLimit()
      .then((res) => {
        let data = [];
        for (let i = 0; i < res.data.length; i++) {
          data.push({ label: "CAD " + res.data[i], value: res.data[i] });
        }
        this.setState({
          policyData: data,
          policyBackUp : data
        });
      })
      .catch((err) => { });
  };


  calculateQuestionary = (list, benefiaryData) => {

    for (let index = 0; index < benefiaryData.length; index++) {
      const element = benefiaryData[index];

      console.log(element)
      if (element.finalQuestionary[0].is_questionary_yes == "1") {
        for (let i = 0; i < element.finalQuestionary[0].querstionary.length; i++) {
          const item = element.finalQuestionary[0].querstionary[i];
          console.log(item)
          if (item == "1") {
            list[index].isActive = false
            list[index].status = "non_pre";
            break;
          } else {
            list[index].isActive = true
            list[index].status = "pre";
          }
        }

      } else {
        list[index].status = "pre";
        list[index].isActive = true
      }

    }

    this.setState({
      quotedList: list,
      showPolicyHolderData: true,
    }, () => {
      this.calculateTotalAmount();

      console.log(this.state.quotedList)
    })


  }

  formPolicyHolderList = (list) => {
    let poliyList = []
    for (let index = 0; index < list.length; index++) {
      poliyList.push({ label: list[index].name, value: list[index].name });
    }

    this.setState({
      policyHolderName: poliyList
    })

  }

  onPressYes = () => {
    if (this.isValidate()) {
      formData = new FormData();

      let modal = ModalAlert.createProgressModal("Please wait...", false);
      this.setState({
        showPolicyHolderData: false
      })
      let dobs = [];
      let userNames = [];
      let questionaries = [];

      for (let index = 0; index < this.state.benefiaryData.length; index++) {
        formData.append(
          "user_name[" + index + "]",
          this.state.benefiaryData[index].name
        );
        formData.append(
          "date_of_birth[" + index + "]",
          this.state.benefiaryData[index].dob
        );

        dobs.push(this.state.benefiaryData[index].dob);
        userNames.push(this.state.benefiaryData[index].name);
        if (parseInt(this.state.benefiaryData[index].age) > 74 && parseInt(this.state.benefiaryData[index].age) > 85) {
          formData.append("questionary_status[" + index + "]", "1");
        } else {
          formData.append("questionary_status[" + index + "]", "0");
        }
      }

      formData.append("duration", parseInt(this.state.duration));
      formData.append("plan_id", this.state.planType);
      formData.append("coverage", this.state.policyLimit);
      formData.append("deductible_id", this.state.deductible);
      formData.append("family_coverage", this.state.familyCoverage ? 1 : 0);
      formData.append("super_visa", this.state.superVisa ? 1 : 0);
      formData.append("payment_frequency", this.state.paymentFrequency);
      formData.append("country_id", 1);
      formData.append("extend", 0);

      SSOServices.calculatePremium(formData)
        .then((res) => {
          ModalAlert.hide(modal);

          let list = res.data;


          if (res.status) {
            this.formPolicyHolderList(this.state.benefiaryData)
            this.calculateQuestionary(list, this.state.benefiaryData)

          } else {
            ModalAlert.error(res.status);
          }
        })
        .catch((err) => {
          ModalAlert.hide(modal);
          Modal.alert(err.msg)
        });
    }
  };

  calculateTotalAmount = () => {
    let total = 0;
    for (let index = 0; index < this.state.quotedList.length; index++) {
      if (this.state.quotedList[index].status === "pre") {
        total += parseInt(this.state.quotedList[index].pre);
      }

      if (this.state.quotedList[index].status === "non_pre") {
        total += parseInt(this.state.quotedList[index].no_pre);
      }
    }

    this.setState({
      totalAmount: total,
    });
  };

  isValidate = () => {
    ModalAlert.hideAll();
    if (this.state.fromDate == "") {
      ModalAlert.error("Select first date of cover");
      return false;
    }

    if (this.state.lastDate == "") {
      ModalAlert.error("Select last date of cover");
      return false;
    }

    if (
      parseInt(this.state.duration) == 0 ||
      parseInt(this.state.duration) > 366
    ) {
      ModalAlert.error("Not applicable for more than 366 days");
      return false;
    }

    if (this.state.departureDate == "") {
      ModalAlert.error("Departure from country of origin must be provided");
      return false;
    }

    if (this.state.benefiaryData[0].name == "") {
      ModalAlert.error("Enter insured person name");
      return false;
    }
    if (this.state.benefiaryData[0].dob == "") {
      ModalAlert.error("Select insured person dob");
      return false;
    }

    if (this.state.planType == "") {
      ModalAlert.error("Select plan type");
      return false;
    }

    if (this.state.policyLimit == "") {
      ModalAlert.error("Select policy limit");
      return false;
    }

    if (this.state.deductible == "") {
      ModalAlert.error("Select Deductible");
      return false;
    }

    for (let index = 0; index < this.state.benefiaryData.length; index++) {
      let item = this.state.benefiaryData[index];
      if (item.name == null || item.name == "") {
        ModalAlert.error("Please fill all insured detail");
        return false;
      }

      if (item.dob == null || item.dob == "") {
        ModalAlert.error("Please fill all insured detail");
        return false;
      }

      if (parseInt(item.age) > 89) {
        ModalAlert.error("Insured person Age should be lessar than 89");
        return false;
      }
      if (item.gender == null || item.gender == "") {
        ModalAlert.error("Please fill all insured detail");
        return false;
      }
    }

    return true;
  };

  getEligibleCoverage = () => {
    ModalAlert.createOptionModal(this.getEligibleComponent(), true);
  };

  getEligibleComponent = () => {
    return (
      <ScrollView style={{ backgroundColor: "#00A4A3" }}>
        <View style={{ backgroundColor: "#00A4A3", padding: 15 }}>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              padding: 5,
              marginTop: 10,
            }}
          >
            To be eligible for coverage, on the effective date, you must {"\n"}
            <Text>
              1. Be a visitor to Canada or a person in Canada under a valid work
              or student visa, a Canadian or an immigrant not eligible for
              benefits under a government health insurance plan; and {"\n"} 2.
              be at least 15 days of age and less than 90 years of age (less
              than 70 year of age for Premium plan); and {"\n"} 3. not be
              travelling against the advice of a physician and/or not have been
              diagnosed with a terminal illness; and {"\n"} 4. not be
              experiencing new or undiagnosed signs or symptoms and/or know of
              any reason to seek medical attention; and {"\n"} 5. not require
              assistance with the activities of daily living(dressing, bathing,
              eating, using the toilet or getting in or out of a bed or chair)I
              confirm that all travellers are eligible to purchase this policy
            </Text>
          </Text>
          <View
            style={{
              alignSelf: "flex-end",
              flexDirection: "row",
              marginTop: 10,
              marginBottom: 15,
              margin: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => this.onPressYes()}
              style={{
                backgroundColor: "white",
                paddingBottom: 10,
                paddingTop: 10,
                paddingStart: 25,
                paddingEnd: 15,
                borderRadius: 10,
                marginEnd: 20,
              }}
            >
              <Text style={{}}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => ModalAlert.hideAll()}
              style={{
                backgroundColor: "white",
                paddingBottom: 10,
                paddingTop: 10,
                paddingStart: 20,
                paddingEnd: 20,
                borderRadius: 10,
              }}
            >
              <Text style={{}}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  onPressCloseIcon = (item, index) => {
    let data = [...this.state.benefiaryData];

    data.splice(index, 1);

    let ids = this.state.delInsuredIds

    ids += item.id ? item.id + "," : ""

    console.log("this.state.delInsuredIds", this.state.delInsuredIds, item.id, ids)

    let del = ""
    if (ids.substring(ids.length - 1, ids.length) == ",") {
      del = ids.slice(0, ids.length - 1)
    } else {
      del = ids

    }
    this.setState({
      benefiaryData: data,
      showPolicyHolderData: false,
      delInsuredIds: ids
    }, () => {
      console.log("this.state.delInsuredIds", this.state.delInsuredIds)
    });
  };

  onPressPlusIcon = () => {
    let data = [...this.state.benefiaryData];

    if (this.state.benefiaryData[0].name == "") {
      ModalAlert.error("Please enter name");
      return;
    }
    if (this.state.benefiaryData[0].dob == "") {
      ModalAlert.error("Please select dob");
      return;
    }
    if (this.state.benefiaryData[0].gender == "") {
      ModalAlert.error("Please select gender");
      return;
    }

    data.push({
      name: "",
      dob: "",
      gender: "",
      bName: "",
      bRelation: "",
      bDob: "",
      age: "",
      finalQuestionary: [{ suppose_no: (this.state.benefiaryData.length + 1), querstionary: ["", "", "", "", "", "", "", "", "", "", ""], is_questionary_yes: 0 }],
    });

    this.setState({
      benefiaryData: data,
      showPolicyHolderData: false
    });
  };

  onChangeTextList = (text, index, status) => {
    let list = [...this.state.benefiaryData];
    switch (status) {
      case 1:
        list[index].name = text;
        this.setState({
          benefiaryData: list,
          showPolicyHolderData: false

        });
        break;
      case 2:
        list[index].bName = text;
        this.setState({
          benefiaryData: list,
          showPolicyHolderData: false
        });
        break;
      case 3:
        list[index].bRelation = text;
        this.setState({
          benefiaryData: list,
          showPolicyHolderData: false
        });
        break;
    }
  };

  selectYesNo = (index, questionIndex, value) => {
    let list = [...this.state.benefiaryData]



    list[index].finalQuestionary[0].querstionary[questionIndex] = value;

    this.setState({
      benefiaryData: list
    })
  }

  getAgePopup = (index, duration, date) => {

    console.log(index)
    let yesNo = [{ label: "Yes", value: "1" }, { label: "No", value: "0" }]

    let itemData = this.state.benefiaryData[index].finalQuestionary[0].querstionary


    let isCheckedItem = this.state.benefiaryData[index].isChecked

    return (

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={{ backgroundColor: 'white' }}>

          <Text style={{ fontWeight: "bold", marginTop: 20, fontSize: 24, color: '#24b6b7' }}>Health Information</Text>


          <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 20 }}>1. Was your most recent heart bypass, heart angioplasty (including stent placement) or heart valve surgery more than 10 years prior to your effective date?</Text>



          <RadioButtonComponent
            isChecked={itemData[0]}
            onClickItem={(item, indexValue) => {
              this.selectYesNo(index, 0, item.value)
            }}
            data={yesNo} />


          <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 20 }}>2. Do you have both diabetes (for which you are taking medication) and a heart condition?</Text>

          <RadioButtonComponent
            isChecked={itemData[1]}
            onClickItem={(item, indexValue) => {
              this.selectYesNo(index, 1, item.value)
            }}
            data={yesNo} />


          <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 20 }}>3. Have you ever had or are awaiting a bone marrow or organ transplant?</Text>

          <RadioButtonComponent
            isChecked={itemData[2]}
            onClickItem={(item, indexValue) => {
              this.selectYesNo(index, 2, item.value)
            }}
            data={yesNo} />



          <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 20 }}>4. In the 24 months prior to your effective date have you been diagnosed with or treated for :</Text>

          <Text style={{ fontWeight: '600', fontSize: 16, marginTop: 20 }}>a) Congestive heart failure?</Text>

          <RadioButtonComponent
            isChecked={itemData[3]}
            onClickItem={(item, indexValue) => {
              this.selectYesNo(index, 3, item.value)
            }}
            data={yesNo} />

          <Text style={{ fontWeight: '600', fontSize: 16, marginTop: 20 }}>b) A lung condition with prednisone (or other oral steriod medication) or home oxygen?</Text>

          <RadioButtonComponent
            isChecked={itemData[4]}
            onClickItem={(item, indexValue) => {
              this.selectYesNo(index, 4, item.value)
            }}
            data={yesNo} />

          <Text style={{ fontWeight: '600', fontSize: 16, marginTop: 20 }}>c) Kidney or liver failure?</Text>

          <RadioButtonComponent
            isChecked={itemData[5]}
            onClickItem={(item, indexValue) => {
              this.selectYesNo(index, 5, item.value)
            }}
            data={yesNo} />

          <Text style={{ fontWeight: '600', fontSize: 16, marginTop: 20 }}>d) Peripheral vascular disease?</Text>

          <RadioButtonComponent
            isChecked={itemData[6]}
            onClickItem={(item, indexValue) => {
              this.selectYesNo(index, 6, item.value)
            }}
            data={yesNo} />


          <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 20 }}>5. In the 12 months prior to your effective date have you been diagnosed with or been treated for:</Text>

          <Text style={{ fontWeight: '600', fontSize: 16, marginTop: 20 }}>a) A heart attack?</Text>

          <RadioButtonComponent
            isChecked={itemData[7]}
            onClickItem={(item, indexValue) => {
              this.selectYesNo(index, 7, item.value)
            }}
            data={yesNo} />

          <Text style={{ fontWeight: '600', fontSize: 16, marginTop: 20 }}>b) Stroke, transient ischemic attack (TIA) or mini-stroke?</Text>

          <RadioButtonComponent
            isChecked={itemData[8]}
            onClickItem={(item, indexValue) => {
              this.selectYesNo(index, 8, item.value)
            }}
            data={yesNo} />

          <Text style={{ fontWeight: '600', fontSize: 16, marginTop: 20 }}>c) cancer (excluding basal or squamous cell skin cancer or breast cancer treated only with hormone therapy)?</Text>

          <RadioButtonComponent
            isChecked={itemData[9]}
            onClickItem={(item, indexValue) => {
              this.selectYesNo(index, 9, item.value)
            }}
            data={yesNo} />

          <Text style={{ fontWeight: '600', fontSize: 16, marginTop: 20 }}>d) internal bleeding?</Text>

          <RadioButtonComponent
            isChecked={itemData[10]}
            onClickItem={(item, indexValue) => {
              this.selectYesNo(index, 10, item.value)
            }}
            data={yesNo} />



          <CheckBoxComponent
            onClickPress={(status) => {
              let list = [...this.state.benefiaryData]
              list[index].isChecked = status

              this.setState({
                benefiaryData: list
              })
            }}
            titleStyle={
              {
                fontSize: 16
              }
            }

            style={{ marginStart: 0, padding: 0 }}
            value={isCheckedItem}
            title={"If any question on the medical declaration is answered yes, there is no coverage for any sickness, injury or medical condition that existed prior to the effective date, whether or not stable. ( Please Confirm that you agree to this condition )."} />


          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end' }}>
            <TouchableOpacity
              onPress={() => this.onConfirmYesNo(index, duration, date)}
              activeOpacity={0.7}
              style={[styles.containerBtnSave, { backgroundColor: '#5cb85c', marginEnd: 10 }]}
            >
              <Text style={styles.title}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => ModalAlert.hideAll()}
              activeOpacity={0.7}
              style={[styles.containerBtnSave, { backgroundColor: '#24b6b7' }]}
            >
              <Text style={styles.title}>Close</Text>
            </TouchableOpacity>
          </View>



        </View>

      </ScrollView>

    )
  }


  onConfirmYesNo = (index, duration, date) => {

    if (!this.state.benefiaryData[index].isChecked) {
      Toast.show("Please accept agree condition")
      return
    }

    for (let i = 0; i < this.state.benefiaryData[index].finalQuestionary[0].querstionary.length; i++) {
      const element = this.state.benefiaryData[index].finalQuestionary[0].querstionary[i];
      // console.log(element)
      // console.log(this.state.benefiaryData[index].finalQuestionary[0])
      if (element === "") {
        Toast.show("Please answered for Question " + (i + 1))
        return
      }

    }


    let list = [...this.state.benefiaryData]

    list[index].finalQuestionary[0].is_questionary_yes = 1

    list[this.state.dobIndex].age = duration + ""
    list[this.state.dobIndex].dob = date

    this.setState({
      benefiaryData: list,
      showPolicyHolderData: false
    }, () => {
      ModalAlert.hideAll()
    });



  }

  onItemSelectedDateList = (value, index, status) => {

    let date = getDateStringFromDate(value);
    let list = [...this.state.benefiaryData];
    if (status == 1) {
      let date2 = moment(date);
      let date3 = moment(moment().format("YYYY-MM-DD"));
      let duration = date3.diff(date2, "years");


      if (duration > 74 && duration < 85) {
        if (list[index].finalQuestionary[0].is_questionary_yes == "1") {
          let modal = ModalAlert.createModal({ title: 'Alert' }, { title: "Do you want to reset the questionaries?" },
            ModalAlert.createPrimaryButton({ title: 'Yes' }, () => {
              list[this.state.dobIndex].finalQuestionary[0].querstionary = ["", "", "", "", "", "", "", "", "", "", ""]

              this.setState({
                showBDate: false,
                benefiaryData: list
              }, () => {
                ModalAlert.hide(modal)
                ModalAlert.createOptionModal(this.getAgePopup(this.state.dobIndex, duration, date), true, 'white')
              });
            }), ModalAlert.createSecondaryButton({ title: 'No' }, () => {
              list[this.state.dobIndex].dob = date;
              list[this.state.dobIndex].finalQuestionary[0].is_questionary_yes = 1
              list[this.state.dobIndex].finalQuestionary[0].querstionary = list[this.state.dobIndex].finalQuestionary[0].querstionary
              list[this.state.dobIndex].age = duration.toString();

              this.setState({
                benefiaryData: list,
                showBDate: false,
                showPolicyHolderData: false
              }, () => {
                ModalAlert.hide(modal)
              });
            }))
        } else {
          this.setState({
            showBDate: false,
          }, () => {

            ModalAlert.createOptionModal(this.getAgePopup(this.state.dobIndex, duration, date), true, 'white')
          });
          return
        }


      }


      list[this.state.dobIndex].dob = date;
      list[this.state.dobIndex].finalQuestionary[0].is_questionary_yes = 0
      list[this.state.dobIndex].age = duration.toString();

      this.setState({
        benefiaryData: list,
        showBDate: false,
        showPolicyHolderData: false
      });

    } else {
      list[this.state.dobIndex].bDob = date;
      this.setState({
        benefiaryData: list,
        showBDate: false,
        showPolicyHolderData: false
      });
    }
  };

  calculateAge = (date) => {
    let date2 = moment(date);
    let date3 = moment(moment().format("YYYY-MM-DD"));
    let duration = date3.diff(date2, "years");
    return duration.toString();
  };

  onItemSelectedGenderList = (value, index) => {
    let list = [...this.state.benefiaryData];
    list[index].gender = value;
    this.setState({
      benefiaryData: list,
    });
  };
  renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          width: "90%",
          alignSelf: "center",
          backgroundColor: "#E8E8E8",
          marginTop: 10,
          padding: 10,
          paddingStart: 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginStart: 5,
            alignSelf: "center",
            marginTop: 20,
          }}
        >
          <View style={{ flex: 1, marginEnd: 10 }}>
            <Text style={{ marginStart: 10, fontWeight: "bold" }}>Name</Text>

            <TextInputComponent
              isSecure={false}
              styles={{ marginStart: 10, marginTop: 8, height: 45 }}
              placeholder={""}
              maxLength={100}
              disable={this.state.disableAll}
              value={item.name}
              onChangeText={(text) => this.onChangeTextList(text, index, 1)}
              isShowDrawable={false}
            />
          </View>

          <DatePicker
            datePicked={(data) =>
              this.onItemSelectedDateList(data, index, this.state.listDobStatus)
            }
            dateCanceled={() => this.setState({ showBDate: false })}
            showDate={this.state.showBDate}
            minDate={this.state.minDate}
          />

          <View style={{ flex: 1 }}>
            <Text style={{ marginStart: 10, fontWeight: "bold" }}>DOB</Text>
            <CalenderView
              showCalender={item.dob == ""}
              onPress={() =>
                this.setState({
                  showBDate: true,
                  listDobStatus: 1,
                  dobIndex: index,
                })
              }
              disabled={this.state.disableAll}
              title={item.dob}
            />
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <DropDownView
            styles={{ alignSelf: "flex-start", marginStart: 10, marginTop: 10 }}
            childData={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
            value={item.gender.toLowerCase()}
            disabled={this.state.disableAll}
            onItemSelected={(value) =>
              this.onItemSelectedGenderList(value, index)
            }
            dropDownTitle={"Gender"}
          />

          {item.age != "" && (
            <View style={{ marginTop: 15, marginStart: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Age:</Text>
              <Text style={{ fontWeight: "bold", marginTop: 20 }}>
                {item.age}
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            marginStart: 5,
            alignSelf: "center",
            marginTop: 20,
          }}
        >
          <View style={{ flex: 1, marginEnd: 10 }}>
            <Text style={{ marginStart: 12, fontWeight: "bold" }}>
              Beneficiary Name
            </Text>

            <TextInputComponent
              isSecure={false}
              styles={{ marginStart: 10, marginTop: 8, height: 45 }}
              placeholder={""}
              disable={this.state.disableAll}
              maxLength={100}
              value={item.bName}
              onChangeText={(text) => this.onChangeTextList(text, index, 2)}
              isShowDrawable={false}
            />
          </View>

          <View style={{ flex: 1, marginEnd: 10 }}>
            <Text style={{ marginStart: 10, fontWeight: "bold" }}>
              Relation
            </Text>

            <TextInputComponent
              isSecure={false}
              styles={{ marginStart: 10, marginTop: 8, height: 45 }}
              placeholder={""}
              disable={this.state.disableAll}
              value={item.bRelation}
              maxLength={100}
              onChangeText={(text) => this.onChangeTextList(text, index, 3)}
              isShowDrawable={false}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <View style={{ width: "50%", marginStart: 10 }}>
            <Text style={{ marginStart: 10, fontWeight: "bold" }}>
              Beneficiary DOB
            </Text>
            <CalenderView
              showCalender={true}
              onPress={() =>
                this.setState({ showBDate: true, listDobStatus: 2, dobIndex: index, })
              }
              disabled={this.state.disableAll}
              title={item.bDob}
            />
          </View>

          {!this.state.disableAll && (
            <View>
              {index == 0 ? (
                <TouchableOpacity onPress={() => this.onPressPlusIcon(item, index)}>
                  <Image
                    style={{
                      height: 50,
                      width: 50,
                      marginEnd: 10,
                      marginTop: 20,
                    }}
                    source={require("../../assets/images/plus1.png")}
                  />
                </TouchableOpacity>
              ) : (
                  <TouchableOpacity onPress={() => this.onPressCloseIcon(item, index)}>
                    <Image
                      style={{
                        height: 80,
                        width: 80,
                        marginTop: 50,
                        marginEnd: -10,
                      }}
                      source={require("../../assets/images/cross.png")}
                    />
                  </TouchableOpacity>
                )}
            </View>
          )}
        </View>
      </View>
    );
  };

  onSelectPlan = (item, index) => {
    if (this.state.benefiaryData[0].dob == "") {
      ModalAlert.error("Please select insured Date of birth");
      return;
    }
    this.setState(
      {
        activeIndex: index,
        planType: item.plan_id,
        showPolicyHolderData: false
      },
      () => {
        this.getDeductible(item.plan_id);
      }
    );
  };

  renderItemPremium = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (!this.state.disableAll) {
            this.onSelectPlan(item, index);
          }
        }}
        style={[
          styles.premiumContainer,
          {
            backgroundColor:
              index == this.state.activeIndex ? "#00A4A3" : "white",
          },
        ]}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: index === this.state.activeIndex ? "white" : "black",
          }}
        >
          {item.plan_name}
        </Text>
      </TouchableOpacity>
    );
  };

  renderBeneficiary = () => {
    return this.state.benefiaryData.map((item, index) => {
      return this.renderItem(item, index);
    });
  };

  onPressBenefit = () => {
    Linking.openURL("https://www.travelmedicare.com/downloadSeeBenifit");
  };

  calculateDuration = (date) => {
    var d1 = Date.parse(this.state.fromDate);
    var d2 = Date.parse(date);

    if (d2 < d1) {
      ModalAlert.error(
        "Last Date Cover should be greater than First Date cover."
      );
    } else {
      let date2 = moment(this.state.fromDate);
      let date3 = moment(date);

      let duration = date3.diff(date2, "days") + 1;

      if (parseInt(duration) > 365) {
        ModalAlert.alert("Duration should be 365 days.")
      } else {
        this.setState({
          duration: duration.toString(),
          durationInt: duration,
          lastDate: date,
          showPicker: false,
          showPolicyHolderData: false

        });
      }


    }
  };

  calculateWaitingPeriod = (date, status) => {
    let date3 = moment(this.state.fromDate);
    let date2 = moment(date);
    let date4 = moment(moment().format("YYYY-MM-DD"));
    let duration = date2.diff(date3, "days");

    if (duration == 0) {
      this.setState({
        departureDate: date,
        showPicker: false,
      });
      return;
    }

    if (duration > 0) {
      ModalAlert.error(
        "First date of cover must be greater than departure date"
      );
      return;
    }

    let duration2 = date2.diff(date4, "days");

    // if(duration2 == 0){
    //     ModalAlert.error("Waiting Period not applicable for this package.")
    //     return
    // }

    // if(duration2 > 0){
    //     ModalAlert.error("First date of cover should be greater than arrival date.")
    //     return
    // }

    if (duration2 < 0 && duration2 > -30) {
      this.setState({
        waitingPeriod: "48 Hours",
        departureDate: date,
        showPicker: false,
      });
    } else {
      this.setState({
        waitingPeriod: "8 Days",
        departureDate: date,
        showPicker: false,
      });
    }


    if (status) {
      this.setState({
        showPolicyHolderData: false
      })
    }
  };

  handleDatePicked = (data) => {
    let date = getDateStringFromDate(data);

    switch (this.state.pickerStatus) {
      case 1:
        this.setState({
          fromDate: date,
          showPicker: false,
          showPolicyHolderData: false
        });
        break;
      case 2:
        this.calculateDuration(date);
        break;
      case 3:
        this.calculateWaitingPeriod(date, true);
        break;

      default:
        break;
    }

    this.setState({
      showPicker: false,
    });
  };

  onPressDatePicker = (status) => {
    switch (status) {
      case 2:
        if (this.state.fromDate == "") {
          ModalAlert.error("Please select From Date");
        } else {
          this.setState({
            pickerStatus: status,
            showPicker: true,
          });
        }
        break;

      case 3:
        if (this.state.fromDate == "") {
          ModalAlert.error("Please select From Date");
        } else if (this.state.lastDate == "") {
          ModalAlert.error("Please select last Date of cover");
        } else {
          this.setState({
            pickerStatus: status,
            showPicker: true,
          });
        }
        break;

      default:
        this.setState({
          pickerStatus: status,
          showPicker: true,
        });
        break;
    }
  };

  onPressFamilyCoverage = (status) => {
    let list = [...this.state.benefiaryData];
    if (parseInt(list[0].age) < 26 || parseInt(list[0].age) > 69) {
      ModalAlert.error(
        "Age of eldest member of family up to 69 and greater than 26"
      );
      return false;
    }
    if (list[1].age == "" || parseInt(list[1].age) < 0) {
      ModalAlert.error("Child's age must be 1 year.");
      return false;
    }
    if (list[2].age == "" || parseInt(list[2].age) < 0) {
      ModalAlert.error("Child's age must be 1 year.");
      return false;
    }

    this.setState({
      familyCoverage: status,
      showPolicyHolderData: false
    });
  };



  validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  onPressUpdateQuote = () => {
    //let obj = {
    //  firstName: this.state.policyName,
    //   email: this.state.policyEmail,
    //  postalCode: this.state.policyPostalCode,
    //  phoneNumber: this.state.policyNumber,
    //  address: this.state.policyAddress,
    //   finalAmount: this.state.totalAmount,
    //   firstDate: this.state.fromDate,
    //   paymentFrequency: this.state.paymentFrequency,
    //   id: this.state.id,
    // };
    //this.props.navigation.navigate("Payment", { data: obj });
  };

  onPressSuperVisa = (status) => {
    let date3 = moment().format("YYYY-MM-DD");
    if (this.state.fromDate != "") {
      let date = new Date(this.state.fromDate);
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var y = date.getFullYear() + 1;

      var someFormattedDate =
        y +
        "-" +
        (mm.toString().length == 1 ? "0" + mm : mm) +
        "-" +
        (dd.toString().length == 1 ? "0" + dd : dd);



        if(!this.state.superVisa){
          let data = [...this.state.policyData]
          data.splice(0,2)
          this.setState({
            policyData : data
          })
        }else{
          this.setState({
            policyData : this.state.policyBackUp
          })
        }

      this.setState({
        superVisa: !this.state.superVisa,
        lastDate: someFormattedDate,
        duration: "365",
        showPolicyHolderData: false
      });
    } else {
      this.setState({
        superVisa: false,
        showPolicyHolderData: false
      });
      ModalAlert.error("Please select First Date");
    }
  };

  validatePolicyHolderDetails = () => {
    if (this.state.policyName == "") {
      ModalAlert.error("Please enter Policy holder name");
      return false;
    }

    if (this.state.policyDob == "") {
      ModalAlert.error("Please enter Policy holder name");
      return false;
    }

    if (this.state.policyEmail == "") {
      ModalAlert.error("Please enter Policy holder email");
      return false;
    }

    if (!this.validateEmail(this.state.policyEmail)) {
      ModalAlert.error("Please enter valid Policy holder email");
      return false;
    }

    if (this.state.policyCity == "") {
      ModalAlert.error("Please enter Policy holder City");
      return false;
    }

    if (this.state.policyPostalCode == "") {
      ModalAlert.error("Please enter Policy holder City");
      return false;
    }

    if (this.state.policyPostalCode.length < 6) {
      ModalAlert.error("Please enter 6 digit Policy holder Pincode.");
      return false;
    }

    if (this.state.policyNumber == "") {
      ModalAlert.error("Please enter Policy holder Number");
      return false;
    }

    if (this.state.policyNumber.length < 6) {
      ModalAlert.error("Please enter valid Policy holder Number");
      return false;
    }

    if (this.state.policyAddress == "") {
      ModalAlert.error("Please enter Policy holder Address");
      return false;
    }

    // if (this.state.policyBeneficiary == "") {
    //   ModalAlert.error("Please enter Policy holder Beneficiary");
    //   return false;
    // }

    return true;
  };

  calculateFirstAndLastDate = () => {
    if (this.state.duration) {
      if (parseInt(this.state.duration) > 366) {
        ModalAlert.alert("Duration must be less than 365")
      } else {
        var someDate = new Date();
        var fromDate = moment().format("YYYY-MM-DD");
        var numberOfDaysToAdd = parseInt(this.state.duration);
        someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

        var dd = someDate.getDate();
        var mm = someDate.getMonth() + 1;
        var y = someDate.getFullYear();

        var someFormattedDate =
          y +
          "-" +
          (mm.toString().length == 1 ? "0" + mm : mm) +
          "-" +
          (dd.toString().length == 1 ? "0" + dd : dd);

        this.setState({
          fromDate,
          lastDate: someFormattedDate,
          showPolicyHolderData: false
        });
      }

    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ToolBarComponent
          title={"Edit Quote"}
          navigation={this.props.navigation}
        />

        <ScrollView>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                marginStart: 5,
                alignSelf: "center",
                marginTop: 20,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{ marginStart: 10, fontWeight: "bold", fontSize: 12 }}
                >
                  First Date of Cover
                </Text>
                <CalenderView
                  showCalender={this.state.fromDate == ""}
                  onPress={() => this.onPressDatePicker(1)}
                  disabled={this.state.disableAll}
                  title={this.state.fromDate}
                />
              </View>

              <DatePicker
                datePicked={(data) => this.handleDatePicked(data)}
                dateCanceled={() => this.setState({ showPicker: false })}
                showDate={this.state.showPicker}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={{ marginStart: 10, fontWeight: "bold", fontSize: 12 }}
                >
                  Last Date of Cover
                </Text>
                <CalenderView
                  showCalender={this.state.lastDate == ""}
                  disabled={this.state.disableAll}
                  onPress={() => this.onPressDatePicker(2)}
                  title={this.state.lastDate}
                />
              </View>

              <View style={{ flex: 0.8, marginEnd: 10 }}>
                <Text
                  style={{ marginStart: 10, fontWeight: "bold", fontSize: 12 }}
                >
                  Duration
                </Text>

                <TextInputComponent
                  isSecure={false}
                  styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                  placeholder={""}
                  maxLength={100}
                  onBlur={() => {
                    this.calculateFirstAndLastDate();
                  }}
                  keyboardType={"numeric"}
                  value={this.state.duration}
                  onChangeText={(text) => {
                    var reg = /^(\s*|\d+)$/;

                    if (text == "") {
                      this.setState({
                        duration: ""
                      })
                      return
                    }
                    if (reg.test(text)) {
                      if (parseInt(text) < 366) {
                        this.setState({
                          duration: text,
                        });
                      }
                    }
                  }}
                  isShowDrawable={false}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginStart: 5,
                alignSelf: "center",
                marginTop: 20,
              }}
            >
              <View style={{ flex: 1.4 }}>
                <Text
                  style={{ marginStart: 9, fontWeight: "bold", fontSize: 12 }}
                >
                  Departure from country of origin
                </Text>
                <CalenderView
                  showCalender={true}
                  onPress={() => this.onPressDatePicker(3)}
                  disabled={this.state.disableAll}
                  title={this.state.departureDate}
                />
              </View>

              <View style={{ flex: 0.8, marginEnd: 8 }}>
                <Text
                  style={{ marginStart: 12, fontWeight: "bold", fontSize: 12 }}
                >
                  Waiting Period
                </Text>

                <TextInputComponent
                  isSecure={false}
                  styles={{ marginStart: 10, marginTop: 5, height: 45 }}
                  placeholder={""}
                  maxLength={100}
                  disable
                  value={this.state.waitingPeriod}
                  onChangeText={(text) => this.setState({ refName3: text })}
                  isShowDrawable={false}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginStart: 5,
                alignSelf: "center",
                marginTop: 20,
              }}
            >
              <View style={{ flex: 1, marginEnd: 10 }}>
                <Text style={{ marginStart: 15, fontWeight: "bold" }}>
                  Client Country
                </Text>

                <TextInputComponent
                  isSecure={false}
                  styles={{ marginStart: 10, marginTop: 7, height: 45 }}
                  placeholder={""}
                  maxLength={100}
                  disable
                  value={"Canada"}
                  onChangeText={(text) => this.setState({ refName3: text })}
                  isShowDrawable={false}
                />
              </View>

              <View style={{ flex: 1, marginEnd: 8 }}>
                <Text style={{ marginStart: 15, fontWeight: "bold" }}>
                  Province
                </Text>

                <TextInputComponent
                  isSecure={false}
                  styles={{
                    marginStart: 10,
                    marginEnd: 0,
                    marginTop: 5,
                    height: 45,
                  }}
                  placeholder={""}
                  disable
                  value={"Ontario"}
                  maxLength={100}
                  onChangeText={(text) => this.setState({ refName3: text })}
                  isShowDrawable={false}
                />
              </View>
            </View>

            <View>
              <FlatList
                data={this.state.benefiaryData}
                style={{ marginTop: 20 }}
                nestedScrollEnabled={true}
                renderItem={this.renderItem}
              />
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >

              <View>
                <TouchableOpacity onPress={() => {
                  if (this.state.benefiaryData.length < 3) {
                    ModalAlert.error(
                      "For Family Coverage you should add atleast 3 people"
                    );
                  } else {
                    this.onPressFamilyCoverage(!this.state.familyCoverage);
                  }
                }} activeOpacity={0.7} style={{
                  padding: 12,
                  borderRadius: 60,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                  marginStart: 10
                }}>
                  <Image source={this.state.familyCoverage ? require('../../assets/checkbox.png') : require('../../assets/unCheck.png')}
                    style={{
                      width: 20,
                      height: 20
                    }} />
                  <Text style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    marginStart: 10
                  }}>Family Coverage</Text>
                </TouchableOpacity>
              </View>


              <View>
                <TouchableOpacity onPress={() => this.onPressSuperVisa(!this.state.superVisa)} activeOpacity={0.7} style={{
                  padding: 12,
                  borderRadius: 60,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                  marginStart: 10
                }}>
                  <Image source={this.state.superVisa ? require('../../assets/checkbox.png') : require('../../assets/unCheck.png')}
                    style={{
                      width: 20,
                      height: 20
                    }} />
                  <Text style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    marginStart: 10
                  }}>Super Visa</Text>
                </TouchableOpacity>
              </View>
            </View>

            {this.state.superVisa && (
              <View style={{ marginStart: 15, marginTop: 15 }}>
                <Text
                  style={{ marginStart: 10, fontWeight: "bold", fontSize: 18 }}
                >
                  Payment Frequency
                </Text>
                <RadioForm
                  formHorizontal={true}
                  style={{ marginTop: 20 }}
                  animation={true}
                >
                  {radio_props.map((obj, i) => (
                    <RadioButton labelHorizontal={true} key={i}>
                      <RadioButtonInput
                        obj={obj}
                        index={i}
                        isSelected={this.state.paymentFrequency === obj.value}
                        borderWidth={1}
                        onPress={() => {
                          this.setState({
                            paymentFrequency: obj.value,
                            showPolicyHolderData: false

                          });
                        }}
                        buttonInnerColor={"#2ecc71"}
                        buttonOuterColor={
                          this.state.paymentFrequency === obj.value
                            ? "#2ecc71"
                            : "gray"
                        }
                        buttonSize={15}
                        buttonOuterSize={20}
                        buttonStyle={{}}
                        buttonWrapStyle={{ marginLeft: 10 }}
                      />
                      <RadioButtonLabel
                        obj={obj}
                        onPress={() => {
                          this.setState({
                            paymentFrequency: obj.value,
                            showPolicyHolderData: false
                          });
                        }}
                        index={i}
                        labelHorizontal={true}
                        labelStyle={{ fontSize: 20 }}
                        labelWrapStyle={{}}
                      />
                    </RadioButton>
                  ))}
                </RadioForm>
              </View>
            )}
            <View style={{ width: "100%" }}>
              <Text
                style={{
                  marginStart: 20,
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: 20,
                }}
              >
                Select Plan Type
              </Text>

              <FlatList
                data={this.state.plans}
                style={{ width: "100%", marginStart: 10, alignSelf: "center" }}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={this.renderItemPremium}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <DropDownView
                styles={{
                  width: "45%",
                  alignSelf: "flex-start",
                  marginStart: 10,
                  marginTop: 10,
                }}
                childData={this.state.policyData}
                value={this.state.policyLimit}
                disabled={this.state.disableAll}
                onItemSelected={(value) =>
                  this.setState({ policyLimit: value, })
                }
                dropDownTitle={"Policy Limit"}
              />
              <DropDownView
                styles={{
                  width: "45%",
                  alignSelf: "flex-start",
                  marginStart: 10,
                  marginTop: 10,
                }}
                childData={this.state.deductibleData}
                value={this.state.deductible}
                disabled={this.state.disableAll}
                onItemSelected={(value) => this.setState({ deductible: value })}
                dropDownTitle={"Deductible"}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => this.onPressBenefit()}
                style={{
                  padding: 10,
                  marginStart: 10,
                  width: this.state.disableAll ? "90%" : "45%",
                  borderRadius: 10,
                  backgroundColor: "rgb(96,125,139)",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  See Benefit {"\n"} Comparison
                </Text>
              </TouchableOpacity>

              {!this.state.disableAll && (
                <TouchableOpacity
                  onPress={() => this.getEligibleCoverage()}
                  style={{
                    padding: 10,
                    marginStart: 10,
                    width: "45%",
                    borderRadius: 10,
                    backgroundColor: "rgb(96,125,139)",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Calculate {"\n"} Premium
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {this.state.showPolicyHolderData && (
            <View style={{ marginTop: 30 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  backgroundColor: "#00A4A3",
                  width: "95%",
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderTopStartRadius: 20,
                  borderTopEndRadius: 20,
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    flex:1,
                    color: "white",
                    fontSize: 14,
                  }}
                >
                  User{"\n"}Name
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    flex:1,
                    color: "white",
                    fontSize: 14,
                  }}
                >
                  Plan{"\n"}Name
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    flex:1,
                    color: "white",
                    fontSize: 14,
                  }}
                >
                  With{"\n"}Pre-Existing
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    flex:1,
                    color: "white",
                    fontSize: 14,
                  }}
                >
                  Without{"\n"}Pre-Existing
                </Text>
              </View>
              <FlatList
                renderItem={this.renderQuotedItem}
                data={this.state.quotedList}
              />

              <View style={styles.periodContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    alignItems: "center",
                    marginStart: 20,
                  }}
                >
                  <Text
                    style={{ fontWeight: "bold", fontSize: 16, width: "25%" }}
                  >
                    Period
                  </Text>
                  <Text style={{}}>
                    {this.state.fromDate} to {this.state.lastDate}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    alignItems: "center",
                    marginStart: 20,
                  }}
                >
                  <Text
                    style={{ fontWeight: "bold", fontSize: 16, width: "25%" }}
                  >
                    Total
                  </Text>
                  <Text style={{}}>CAD {this.state.totalAmount}</Text>
                </View>
              </View>
              <Text
                style={{
                  fontWeight: "bold",
                  marginTop: 20,
                  marginStart: 20,
                  fontSize: 20,
                }}
              >
                Policy Holder Details
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginStart: 5,
                  alignSelf: "center",
                  marginTop: 20,
                }}
              >

                {/* 
                  <TextInputComponent
                    isSecure={false}
                    styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                    placeholder={""}
                    disable={this.state.disableAll}
                    maxLength={100}
                    value={this.state.policyName}
                    onChangeText={(text) => this.setState({ policyName: text })}
                    isShowDrawable={false}
                  /> */}
                <DropDownView
                  styles={{
                    width: "45%",
                    alignSelf: "flex-start",
                    marginStart: 10,
                    marginTop: 10,
                  }}
                  childData={this.state.policyHolderName}
                  value={this.state.policyName}
                  disabled={this.state.disableAll}
                  onItemSelected={(value) => {
                    this.setState({ policyName: value })
                    console.log(value)

                    for (let index = 0; index < this.state.benefiaryData.length; index++) {
                      const element = this.state.benefiaryData[index];

                      if (element.name == value) {
                        this.setState({
                          policyDob: element.dob
                        })
                      }

                    }
                  }
                  }
                  dropDownTitle={"Policy Holder"}
                />

                <View style={{ flex: 1, marginTop: 16 }}>
                  <Text style={{ marginStart: 10, fontWeight: "bold" }}>
                    DOB
                  </Text>
                  <CalenderView
                    showCalender={true}
                    onPress={() => this.setState({ showPolicyDob: true })}
                    disabled={true}
                    title={this.state.policyDob}
                  />
                </View>

                <DatePicker
                  datePicked={(data) => {
                    let date = getDateStringFromDate(data);
                    this.setState({ policyDob: date, showPolicyDob: false });
                  }}
                  dateCanceled={() => this.setState({ showPolicyDob: false })}
                  showDate={this.state.showPolicyDob}
                />
              </View>

              <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                <Text
                  style={{
                    marginStart: 10,
                    fontWeight: "bold",
                    marginStart: 20,
                  }}
                >
                  Email
                </Text>

                <TextInputComponent
                  isSecure={false}
                  styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                  placeholder={""}
                  disable={this.state.disableAll}
                  maxLength={100}
                  value={this.state.policyEmail}
                  onChangeText={(text) => this.setState({ policyEmail: text })}
                  isShowDrawable={false}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginStart: 5,
                  alignSelf: "center",
                }}
              >
                <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                  <Text
                    style={{
                      marginStart: 10,
                      fontWeight: "bold",
                      marginStart: 20,
                    }}
                  >
                    City
                  </Text>

                  <TextInputComponent
                    isSecure={false}
                    styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                    placeholder={""}
                    maxLength={100}
                    disable={this.state.disableAll}
                    value={this.state.policyCity}
                    onChangeText={(text) => this.setState({ policyCity: text })}
                    isShowDrawable={false}
                  />
                </View>
                <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                  <Text
                    style={{
                      marginStart: 10,
                      fontWeight: "bold",
                      marginStart: 20,
                    }}
                  >
                    PostalCode
                  </Text>

                  <TextInputComponent
                    isSecure={false}
                    styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                    placeholder={""}
                    maxLength={100}
                    disable={this.state.disableAll}
                    value={this.state.policyPostalCode}
                    onChangeText={(text) =>
                      this.setState({ policyPostalCode: text })
                    }
                    isShowDrawable={false}
                  />
                </View>
              </View>
              <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                <Text
                  style={{
                    marginStart: 10,
                    fontWeight: "bold",
                    marginStart: 20,
                  }}
                >
                  Phone Number
                </Text>

                <TextInputComponent
                  isSecure={false}
                  styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                  placeholder={""}
                  disable={this.state.disableAll}
                  maxLength={100}
                  value={this.state.policyNumber}
                  onChangeText={(text) => this.setState({ policyNumber: text })}
                  isShowDrawable={false}
                />
              </View>
              <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                <Text
                  style={{
                    marginStart: 10,
                    fontWeight: "bold",
                    marginStart: 20,
                  }}
                >
                  Address
                </Text>

                <TextInputComponent
                  isSecure={false}
                  styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                  placeholder={""}
                  disable={this.state.disableAll}
                  maxLength={100}
                  value={this.state.policyAddress}
                  onChangeText={(text) =>
                    this.setState({ policyAddress: text })
                  }
                  isShowDrawable={false}
                />
              </View>
              {/* <View style={{ flex: 1, marginEnd: 10, marginTop: 20 }}>
                <Text
                  style={{
                    marginStart: 10,
                    fontWeight: "bold",
                    marginStart: 20,
                  }}
                >
                  Beneficiary
                </Text>

                <TextInputComponent
                  isSecure={false}
                  styles={{ marginStart: 10, marginTop: 8, height: 45 }}
                  placeholder={""}
                  maxLength={100}
                  disable={this.state.disableAll}
                  value={this.state.policyBeneficiary}
                  onChangeText={(text) =>
                    this.setState({ policyBeneficiary: text })
                  }
                  isShowDrawable={false}
                />
              </View> */}
              {!this.state.disableAll && (
                <TouchableOpacity
                  onPress={() => this.onPressEditQuote()}
                  activeOpacity={0.7}
                  style={styles.containerBtn}
                >
                  <Text style={styles.title}>Update</Text>
                </TouchableOpacity>
              )}

              {this.state.disableAll && (
                <TouchableOpacity
                  onPress={() => this.onPressConfirmAndPay()}
                  activeOpacity={0.7}
                  style={styles.containerBtn}
                >
                  <Text style={styles.title}>Update</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView >
    );
  }

  onPressValueRadio = (index, value) => {
    let list = [...this.state.quotedList];
    list[index].status = value;
    this.setState(
      {
        quotedList: list,
      },
      () => {
        this.calculateTotalAmount();
      }
    );
  };

  renderQuotedItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: "90%",
          marginTop: 10,
          paddingTop: 10,
          paddingBottom: 10,
          alignSelf: "center",
        }}
      >
        <Text style={{ textAlign: "center",
            justifyContent: "center",
            alignItems: "center",  flex:1, fontSize: 14 }}>
          {item.user_name}
        </Text>
        <Text style={{ textAlign: "center",
            justifyContent: "center",
            alignItems: "center", flex:1, fontSize: 14 }}>
          {item.plan_name}
          
        </Text>
        <TouchableOpacity
          disabled={this.state.disableAll || !item.isActive}
          onPress={() => this.onPressValueRadio(index, "pre")}
          style={{
            flex:1,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Image
            source={
              item.status === "pre"
                ? require("../../assets/on.png")
                : require("../../assets/off.png")
            }
            style={{ height: 20, width: 20 }}
          />
          <Text style={{ textAlign: "center", fontSize: 14, marginStart: 5 }}>
            {item.pre}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPressValueRadio(index, "non_pre")}
          style={{
            flex:1,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Image
            source={
              item.status === "non_pre"
                ? require("../../assets/on.png")
                : require("../../assets/off.png")
            }
            style={{ height: 20, width: 20 }}
          />
          <Text style={{ textAlign: "center", fontSize: 14, marginStart: 5 }}>
            {item.no_pre}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
}
const mapStateToProps = (state) => {
  return {
    userData: state.user.userData,
  };
};

const styles = StyleSheet.create({
  containerBtn: {
    backgroundColor: "rgb(96,125,139)",
    width: 150,
    alignSelf: "center",
    padding: 15,
    borderRadius: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#010000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 2.5,
    shadowOpacity: 1,
    elevation: 4,
    marginBottom: 20,
  },

  containerBtnSave: {
    backgroundColor: "rgb(96,125,139)",
    width: 100,
    alignSelf: "center",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#010000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 2.5,
    shadowOpacity: 1,
    elevation: 4,
    marginBottom: 20,
  },
  title: {
    alignSelf: "center",
    fontSize: 14,
    marginStart: 5,
    fontWeight: "bold",
    color: colors.white,
  },
  arrow: {
    width: 15,
    height: 15,
  },
  container: {},
  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "center",
    marginStart: 20,
    marginTop: 20,
  },
  flexDirection: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
  },
  icon: {
    height: 200,
    width: 200,
    position: "absolute",
    alignSelf: "center",
    top: 100,
  },
  paragraph: {
    textAlign: "center",
    marginTop: 0,
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
  },

  logo: {
    height: "100%",
    width: "100%",
  },
  nextButton: {
    backgroundColor: "#3F6183",
    width: 140,
    marginTop: 20,
    height: 45,
    marginStart: 10,
    marginEnd: 10,
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  next: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },

  tableView: {
    backgroundColor: colors.primary,
    marginStart: 20,
    marginEnd: 20,
    flexDirection: "row",
    marginTop: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  itemText: {
    color: colors.white,
    width: 160,
    padding: 20,
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 16,
  },
  itemView: {
    flexDirection: "row",
    borderWidth: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginStart: 20,
    marginEnd: 20,
  },
  listItemText: {
    width: 160,
    alignContent: "center",
    alignItems: "center",
    padding: 20,
    textAlign: "center",
    fontSize: 16,
  },
  premiumContainer: {
    backgroundColor: "white",
    shadowColor: "grey",
    height: 50,
    width: 105,
    marginEnd: 5,
    marginBottom: 10,
    marginStart: 15,
    marginTop: 10,
    shadowOffset: {
      width: 10,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  periodContainer: {
    backgroundColor: "white",
    shadowColor: "grey",
    width: "95%",
    alignSelf: "center",
    shadowOffset: {
      width: 10,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
});

export default connect(
  mapStateToProps,
  null
)(EditQuote);
