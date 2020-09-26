import EventEmitter from "events";
import React, { Component } from "react";
import { Linking, Platform, StyleSheet, View, BackHandler } from "react-native";
import Config from "react-native-config";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Modal from "../utils/modal";
import Toast from "../utils/toast";
import { AppNav } from "./index";
import NavigationService from "../navigation/NavigationService";

class AppNavigatorWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userChecked: false,
    };
  }

  componentDidMount() {}

  isLoggedIn = () => {
    let { isLoggedIn } = this.props.userData;
    return isLoggedIn;
  };

  render() {
    // const AppNavigator = AppNav({
    //    initialRouteName: (this.isLoggedIn()) ? "Login" : "HomeInitial"
    // });

    const AppNavigator = AppNav({});

    return (
      <View style={styles.mainContainer}>
        <AppNavigator
          enableURLHandling={false}
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          {...this.props}
        />
        {/* <BottomSheet pointerEvents="box-none" /> */}
        <Modal
          pointerEvents="box-none"
          onLayout={() => {
            // TODO: Verify rooted device
          }}
        />
        <Toast pointerEvents="box-none" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

//dummy methods
const mapStateToProps = (state) => {
  return {};
};

const Actions = {};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigatorWrap);
