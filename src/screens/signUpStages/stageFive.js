
import React from 'react';
import { View, Image, Text, StatusBar, Animated, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'

import { createAppContainer, createSwitchNavigator, SafeAreaView } from "react-navigation";

import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import ScreenName from '../../navigation/screenNames'
import ToolBarComponent from '../../components/toolbar'
import TextInputComponent from '../../components/textInput'
import CheckBoxComponent from '../../components/checkbox';
import colors from '../../utils/colors';
import UploadImage from '../../components/uploadContainer';





class SignUpStageFive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentDidMount() {

    }

    render() {
        return (
            <ScrollView>
                <View style={{ flex: 1 }}>

                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Name of Bank"}
                        maxLength={100}
                        onChangeText={(text) => this.setState({ confirmPassword: text })}
                        isShowDrawable={false}
                    />


                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Account Number"}
                        maxLength={100}
                        onChangeText={(text) => this.setState({ confirmPassword: text })}
                        isShowDrawable={false}
                    />

                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Institution Number"}
                        maxLength={100}
                        onChangeText={(text) => this.setState({ confirmPassword: text })}
                        isShowDrawable={false}
                    />


                    <TextInputComponent
                        isSecure={false}
                        placeholder={"Transit Number"}
                        maxLength={100}
                        onChangeText={(text) => this.setState({ confirmPassword: text })}
                        isShowDrawable={false}
                    />


                    <UploadImage
                        title={"Upload PAD Form/Void Cheque"} />
                    <TouchableOpacity onPress={() => this.props.onClickNext(5)} activeOpacity={0.7} style={styles.nextButton}>
                        <Text style={styles.next}>Next</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

        );
    }
}
const mapStateToProps = state => {
    return {
        userData: state.user
    }
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 10,
    },
    nextButton: {
        backgroundColor: '#3F6183',
        width: 150,
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



export default connect(mapStateToProps, null)(SignUpStageFive);