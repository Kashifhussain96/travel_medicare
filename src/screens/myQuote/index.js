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
import DatePicker from "../../components/datePicker";
import { getDateStringFromDate } from "../../utils";

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
      pageNo: 1,
      product: "",
      roles: [],
      users: [],
      user: '',
      userRole :  props.userData.role,
      role : ''
    };
  }

  async componentDidMount() {
    await this.getData(this.state.pageNo, "", this.props.userData.role, this.state.fromDate, this.state.toDate);

    await this.getRole();
  }

  getData = (pageNo, product, user, fromDate, toDate) => {
    let modal = ModalAlert.createProgressModal("Fetching Data...", false);
    let formData = new FormData();

    formData.append("page_no", pageNo);

    if (product != "") {
      formData.append("product", product);
    }


    if (user != "") {
      formData.append("role", user);
    }else{
      formData.append("role", this.state.userRole);
    }


    if (fromDate != "") {
      formData.append("from_date", fromDate);
    }


    if (toDate != "") {
      formData.append("to_date", toDate);
    }

    formData.append("user_id", this.props.userData.user_id);

    SSOServices.getMyQuote(formData)
      .then((res) => {
        ModalAlert.hide(modal);
        let list = [...this.state.data, ...res.data]
        this.setState({
          data: list
        });
      })
      .catch((err) => {
        ModalAlert.hide(modal);
      });
  };


  getAllUsersRoleWise = (role) => {
    let modal = ModalAlert.createProgressModal("Fetching Data...", false);
    let formData = new FormData();
    formData.append("role", role);
    formData.append("user_id", this.props.userData.user_id);
    formData.append("login_role", this.props.userData.role);
    SSOServices.getAllUsersRoleWise(formData)
      .then((res) => {
        ModalAlert.hide(modal);
        let data = []
        for (let i = 0; i < res.data.length; i++) {
          data.push({ value: res.data[i].role, label: res.data[i].user_name })

        }

        this.setState({
          users: data
        })
      })
      .catch((err) => {
        ModalAlert.hide(modal);
      });
  }


  getRole = () => {
    let modal = ModalAlert.createProgressModal("Fetching Data...", false);
    SSOServices.getRole(this.props.userData.role)
      .then((res) => {
        ModalAlert.hide(modal);
        let data = []
        for (let i = 0; i < res.data.length; i++) {
          data.push({ value: res.data[i].role, label: res.data[i].role_name })

        }

        this.setState({
          roles: data
        })
      })
      .catch((err) => {
        ModalAlert.hide(modal);
      });
  }

  renderButtons = () => {
    return (
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              data : []
            })
            this.getData(1, this.state.product, this.state.role, this.state.fromDate, this.state.toDate)
           }}
          activeOpacity={0.7}
          style={styles.nextButton}
        >
          <Text style={styles.next}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { 
            this.setState({
              fromDate : '',
              toDate : '',
              user : '',
              role :'',
              product : -1,
              pageNo :1
            },()=>{
              this.getData(this.state.pageNo,this.state.product,this.state.role, this.state.fromDate,this.state.toDate )
            })
          }}
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
        this.props.navigation.navigate("GetQuote", { id: item.quotation_id, isCopy: false, isEdit: false });
        break;
      case 2:
        this.props.navigation.navigate("GetQuote", { id: item.quotation_id, isCopy: true, isEdit: false });
        break;
      case 3:
        this.props.navigation.navigate("GetQuote", { id: item.quotation_id, isCopy: false, isEdit: true });
        break;
    }
  };

  renderItem = ({ item, index }) => {
    console.log(item.quote_payment_status)
    return (
      <View style={[styles.itemView]}>
        <Text style={styles.listItemText}>{item.user_name}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>{item.role_name}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>{item.product == "VTC" || item.product == "" ? `Visitors to Canada` : `Students to Canada`}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>{item.quotaion_no}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>{item.date_of_issue}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>{item.trip_type}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>{item.policy_holder_name}</Text>
        <View style={{ height: 100, backgroundColor: "black", width: 1 }} />
        <Text style={styles.listItemText}>CAD {item.quote_amount} <Text style={{color:'red'}}>{item.quote_payment_status != null && `(Paid Partially)`}</Text></Text>
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
          this.setState({
            data: []
          })
          this.getData(1, this.state.product, this.state.user, this.state.fromDate, this.state.toDate);
        })
        .catch((err) => {
          ModalAlert.hide(modal);
          ModalAlert.alert(err.message);
        });
    }
  };

  onItemSelectedDateList = (value) => {

    let date = getDateStringFromDate(value);

    if(this.state.dateStatus == 1){
      this.setState({
        fromDate : date,
        showDate : false
      })
    }else{
      this.setState({
        toDate : date,
        showDate : false
      })
    }
  }

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
                <FlatList
                  data={this.state.data}
                  initialNumToRender={8}
                  maxToRenderPerBatch={2}
                  onEndReachedThreshold={0.1}
                  onMomentumScrollBegin={() => { this.onEndReached = false; }}
                  onEndReached={() => {
                    if (!this.onEndReached) {
                      this.setState({
                        pageNo: this.state.pageNo + 1
                      }, () => {
                        this.getData(this.state.pageNo, this.state.product, this.state.user, this.state.fromDate, this.state.toDate)
                      })
                      this.onEndReached = true;
                    }
                  }
                  }
                  renderItem={this.renderItem} />
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

        <DropDownView
          childData={[
            { label: "VTC Product", value: "VTC" },
            { label: "STC Product", value: "STC" },
          ]}
          styles={{ width: '100%' }}
          value={this.state.product}
          onItemSelected={(value) => {
            this.setState({
              product: value
            })
          }}
          dropDownTitle={"Select Product:"}
        />

        <View style={styles.flexDirection}>
          <DropDownView
            childData={this.state.roles}
            value={this.state.role}
            onItemSelected={(value) => {
              this.setState({ role: value }, () => {
                this.getAllUsersRoleWise(value)
              })

            }}
            dropDownTitle={"Select Role:"}
          />
          <DropDownView
            childData={this.state.users}
            value={this.state.user}
            onItemSelected={(value) => {
              this.setState({ user: value })
            }}
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
              onPress={() => {
                this.setState({
                  showDate : true,
                  dateStatus : 1
                })
               }}
              title={this.state.fromDate}
            />
          </View>
          <View style={{ width: "50%" }}>
            <Text>To Date</Text>
            <CalenderView
              style={{ width: "95%", marginEnd: 10 }}
              showCalender={true}
              onPress={() => {
                this.setState({
                  showDate : true,
                  dateStatus : 2
                })
               }}
               title={this.state.toDate}
            />
          </View>
        </View>

        <DatePicker
              datePicked={(data) =>
                this.onItemSelectedDateList(data)
              }
              dateCanceled={() => this.setState({ showDate: false })}
              showDate={this.state.showDate}
            />



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
    marginTop: 10,
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
