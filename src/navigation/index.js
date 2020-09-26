import {
  createAppContainer,
  createSwitchNavigator,
  NavigationActions,
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import ScreenName from "./screenNames";
import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { Button } from "react-native-elements";

export const MainStack = createStackNavigator(
  {
    HomeInitial: {
      screen: ScreenName.HomeInitial,
      navigationOptions: {
        header: null,
      },
    },
    CommonScreen: {
      screen: ScreenName.CommonScreen,
      navigationOptions: {
        header: null,
      },
    },
    MyProfile: {
      screen: ScreenName.MyProfile,
      navigationOptions: {
        header: null,
      },
    },
    MyCommission: {
      screen: ScreenName.MyCommission,
      navigationOptions: {
        header: null,
      },
    },
    CommisssionDetail: {
      screen: ScreenName.CommisssionDetail,
      navigationOptions: {
        header: null,
      },
    },
    MyPolicy: {
      screen: ScreenName.MyPolicy,
      navigationOptions: {
        header: null,
      },
    },
    PolicyDetails: {
      screen: ScreenName.PolicyDetails,
      navigationOptions: {
        header: null,
      },
    },
    MyQuote: {
      screen: ScreenName.MyQuote,
      navigationOptions: {
        header: null,
      },
    },
    GetQuote: {
      screen: ScreenName.GetQuote,
      navigationOptions: {
        header: null,
      },
    },
    EditQuote: {
      screen: ScreenName.EditQuote,
      navigationOptions: {
        header: null,
      },
    },
    Payment: {
      screen: ScreenName.Payment,
      navigationOptions: {
        header: null,
      },
    },
    CancelPolicy: {
      screen: ScreenName.CancelPolicy,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: "HomeInitial",
    headerMode: "none",
    transitionConfig: () => ({
      screenInterpolator: (sceneProps) => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;
        const translateX = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [layout.initWidth, 0, 0],
        });
        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index, index + 0.99, index + 1],
          outputRange: [0, 1, 1, 0.3, 0],
        });
        return { opacity, transform: [{ translateX }] };
      },
    }),
  }
);

export const LoginStack = createStackNavigator(
  {
    SplashScreen: {
      screen: ScreenName.SplashScreen,
      navigationOptions: {
        header: null,
      },
    },
    Landing: {
      screen: ScreenName.Landing,
      navigationOptions: {
        header: null,
      },
    },
    Login: {
      screen: ScreenName.Login,
      navigationOptions: {
        header: null,
      },
    },
    Otp: {
      screen: ScreenName.Otp,
      navigationOptions: {
        header: null,
      },
    },
    ForgotPassword: {
      screen: ScreenName.ForgotPassword,
      navigationOptions: {
        header: null,
      },
    },
    Register: {
      screen: ScreenName.Register,
      navigationOptions: {
        header: null,
      },
    },
    SignUpStage: {
      screen: ScreenName.SignUpStage,
      navigationOptions: {
        header: null,
      },
    },
    Loading: {
      screen: ScreenName.Loading,
      navigationOptions: {
        header: null,
      },
    },
    CommonScreen: {
      screen: ScreenName.CommonScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerBackTitle: null,
      headerTitleStyle: {
        color: "white",
        fontWeight: "400",
        marginLeft: 0,
        flex: 1,
        textAlign: "left",
      },
    },

    initialRouteName: "SplashScreen",
    cardStyle: {
      backgroundColor: "white",
    },
    uriPrefix: "https://m.u.my/",
  }
);

export const AppNav = (props) => {
  return createAppContainer(
    createSwitchNavigator(
      {
        Login: LoginStack,
        HomeInitial: MainStack,
      },
      {
        initialRouteName: props.initialRouteName,
      }
    )
  );
};
