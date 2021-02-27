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
} from "react-native";
// import SignInNavigator from '../../navigation/SignInNavigator'
import ToolBarComponent from "../../components/toolbar";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import colors from "../../utils/colors";
import * as SSOServices from "../../services/SSOService";
import ModalAlert from "../../utils/modal";
import { connect } from "react-redux";
import moment from "moment";

import { createStackNavigator } from "react-navigation-stack";
import CalenderView from "../../components/textInput/calenderView";
import DropDownView from "../../components/textInput/dropDown";

class MyQuote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      toDate: "",
      fromDate: "",
    };
  }

  async componentDidMount() {
    this.getData();
  }

  getData = () => {
    let modal = ModalAlert.createProgressModal("Fetching Data...", false);
    let formData = new FormData();
    formData.append("user_id", this.props.userData.user_id);
    formData.append("role", this.props.userData.role);
    SSOServices.getMyQuote(formData)
      .then((res) => {
        ModalAlert.hide(modal);
        this.setState({
          data: res.data,
        });
      })
      .catch((err) => {
        ModalAlert.hide(modal);
      });
  };

  renderButtons = () => {
    return (
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
        <TouchableOpacity
          onPress={() => { }}
          activeOpacity={0.7}
          style={styles.nextButton}
        >
          <Text style={styles.next}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { }}
          activeOpacity={0.7}
          style={styles.nextButton}
        >
          <Text style={styles.next}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  };

  onPressAction = (item, status) => {
    switch (status) {
      case 0:
        break;
      case 1:
        this.props.navigation.navigate("GetQuote", { id: item.quotation_id, isCopy: false,isEdit: false });
        break;
      case 2:
        this.props.navigation.navigate("GetQuote", { id: item.quotation_id, isCopy: true ,isEdit: false});
        break;
      case 3:
        this.props.navigation.navigate("GetQuote", { id: item.quotation_id, isCopy: false,isEdit: true });
        break;
    }
  };

  renderItem = ({ item, index }) => {

    console.log(item.trip_type)
    return (
      <View style={[styles.itemView]}>
        <Text style={styles.listItemText}>{item.user_name}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>{item.role_name}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>{item.product == "VTC" ? `Visitors to Canada` : `Students to Canada`}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>{item.quotaion_no}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>{item.date_of_issue}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>{item.trip_type}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>{item.policy_holder_name}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>CAD {item.quote_amount}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            height: 25,
            marginStart: 0,
            marginEnd: 18,
            marginTop: 8,
            alignItems: "center",
          }}
        >
          <View style={styles.flexDirection1}>
            <DropDownView
              childData={[
                { label: "Send Quote", value: "1" },
                { label: "View Quote", value: "2" },
                { label: "Edit Quote", value: "3" },
                { label: "Copy Quote", value: "4" },
                { label: "Cancel Quote", value: "5" },
              ]}
              onItemSelected={(value) => this.quoteoption(value, item, index)}
              value={''}
            />
          </View>
        </View>
      </View>
    );
  };
  quoteoption = (value, item) => {
    // let list = [...this.state.]
    // this.setState({

    // })
    if (value == "1") {
      let modal = ModalAlert.createProgressModal("Please wait...", false);
      let formData = new FormData();
      formData.append("user_id", this.props.userData.user_id);
      formData.append("quotation_id", item.quotation_id);
      SSOServices.getMyQuoteMail(formData)
        .then((res) => {
          ModalAlert.hide(modal);
          ModalAlert.alert("Quote has been sent successfully");
        })
        .catch((err) => {
          ModalAlert.hide(modal);
          ModalAlert.alert(err.message);
        });
    } else if (value == "2") {
      this.onPressAction(item, 1);
    } else if (value == "3") {
      this.onPressAction(item, 3);
    } else if (value == "4") {
      this.onPressAction(item, 2);
    } else if (value == "5") {
      let modal = ModalAlert.createProgressModal("Please wait...", false);
      let formData = new FormData();
      formData.append("user_id", this.props.userData.user_id);
      formData.append("quote_id", item.quotation_id);
      SSOServices.cancelQuote(formData)
        .then((res) => {
          ModalAlert.hide(modal);
          ModalAlert.alert(res.message);
          this.getData();
        })
        .catch((err) => {
          ModalAlert.hide(modal);
          ModalAlert.alert(err.message);
        });
    }
  };

  renderTableView = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            <View style={[styles.tableView]}>
              <Text style={styles.itemText}>Employee Name</Text>
              <Text style={styles.itemText}>Designation</Text>
              <Text style={styles.itemText}>Product</Text>
              <Text style={styles.itemText}>Quotation No</Text>
              <Text style={styles.itemText}>Date of Quotation</Text>
              <Text style={styles.itemText}>Trip Type</Text>
              <Text style={styles.itemText}>Customer Name</Text>
              <Text style={styles.itemText}>Quotation Amount</Text>
              <Text style={[styles.itemText, { marginStart: 30 }]}>Action</Text>
            </View>

            <View style={{ flex: 1 }}>
              {this.state.data.length > 0 ? (
                <FlatList data={this.state.data} renderItem={this.renderItem} />
              ) : (
                  <Text
                    style={{
                      flex: 1,
                      marginStart: 50,
                      fontSize: 30,
                      fontWeight: "600",
                      marginTop: 100,
                    }}
                  >
                    No Data
                  </Text>
                )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ToolBarComponent
          title={"My Quote"}
          navigation={this.props.navigation}
        />

        <View style={styles.flexDirection}>
          <DropDownView
            childData={[
              { label: "MGA", value: "MGA" },
              { label: "AGA", value: "AGA" },
              { label: "Advisor", value: "Advisor" },
            ]}
            onItemSelected={(value) => this.setState({ role: value })}
            dropDownTitle={"Select Role:"}
          />
          <DropDownView
            childData={[]}
            onItemSelected={(value) => this.setState({ user: value })}
            dropDownTitle={"Select User:"}
          />
        </View>

        <View style={styles.datesContainer}>
          <View style={{ width: "50%" }}>
            <Text>From Date</Text>
            <CalenderView
              style={{ width: "95%", marginEnd: 20 }}
              onPress={() => { }}
              showCalender={true}
              title={""}
            />
          </View>
          <View style={{ width: "50%" }}>
            <Text>To Date</Text>
            <CalenderView
              style={{ width: "95%", marginEnd: 10 }}
              showCalender={true}
              onPress={() => { }}
              title={""}
            />
          </View>
        </View>

        {this.renderButtons()}

        {this.renderTableView()}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userData: state.user.userData,
  };
};

const styles = StyleSheet.create({
  container: {},
  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "center",
    marginStart: 20,
    justifyContent: "center",
    marginTop: 20,
  },
  flexDirection: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
  },
  flexDirection1: {
    flexDirection: "row",
    width: "48%",
    height: "50%",
    marginBottom: 30,
    marginTop: 30,
    marginLeft: 5,
    marginRight: 15,
    padding: 0,
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
    fontWeight: "600",
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
    fontWeight: "600",
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
});

export default connect(
  mapStateToProps,
  null
)(MyQuote);
