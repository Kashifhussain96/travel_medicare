
import React from 'react';
import { View, Image, Text, StatusBar, Animated, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from 'react-native';
// import SignInNavigator from '../../navigation/SignInNavigator'

import { createAppContainer, createSwitchNavigator, SafeAreaView, ThemeColors } from "react-navigation";

import { connect } from "react-redux";
import { createStackNavigator } from 'react-navigation-stack';
import ScreenName from '../../navigation/screenNames'
import ToolBarComponent from '../../components/toolbar'
import TextInputComponent from '../../components/textInput'
import CheckBoxComponent from '../../components/checkbox';
import colors from '../../utils/colors';
import SignUpStageOne from './stageOne'
import SignUpStageTwo from './stageTwo'
import SignUpStageThree from './stageThree'
import SignUpStageFour from './stageFour'
import SignUpStageFive from './stageFive'
const processImage = [
    require('../../assets/images/process_1.png'),
    require('../../assets/images/process_2.png'),
    require('../../assets/images/process_3.png'),
    require('../../assets/images/process_4.png'),
]


class SignUpStage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Personal Details',
            stage: props.navigation.state.params.data.stage,
            fromLogin: props.navigation.state.params.data.fromLogin,
            data:props.navigation.state.params.data.userData,

        };

    }

    componentDidMount() {
        
    }


    onPressBack = () => {
        if(!this.state.fromLogin){
            switch (this.state.stage) {
                case 0:
                    this.props.navigation.goBack()
                    break;
                default:
                    this.setState({
                        stage: this.state.stage - 1
                    }, () => {
                        this.changeTitle();
    
                    })
                    break;
            }
        }else{
            this.props.navigation.goBack()
        }
        

    }

    changeTitle = () => {
        switch (this.state.stage) {
            case 0:
                this.setState({
                    title: "Personal Details"
                })
                break;
            case 1:
                this.setState({
                    title: "Licence Details"
                })
                break;
            case 2:
                this.setState({
                    title: "Corporation Details"
                })
                break;
            case 3:
                this.setState({
                    title: "Reference Details"
                })
                break;
            // case 4:
            //     this.setState({
            //         title: "Banking Details"
            //     })
            //     break;
            default:
                break;
        }
    }

    onClickNext = () => {
        if (this.state.stage <= 2) {
            this.setState({
                stage: this.state.stage + 1,

            }, () => {
                this.changeTitle()
            })
        }

    }


    renderStage1=()=>{
        return(
            <SignUpStageOne
                data={this.state.data}
                onClickNext={(status)=> this.onClickNext()}/>
        )
    }

    renderStage2=()=>{
        return(
            <SignUpStageTwo onClickNext={(status)=> this.onClickNext()}/>
        )
    }

    renderStage3=()=>{
        return(
            <SignUpStageThree onClickNext={(status)=> this.onClickNext()}/>
        )
    }

    renderStage4=()=>{
        return(

            <SignUpStageFour onClickNext={(status)=> this.props.navigation.navigate('Loading')}/>
        )
    }

    // renderStage5=()=>{
    //     return(
    //         <SignUpStageFive onClickNext={(status)=> this.props.navigation.navigate('Loading')}/>
    //     )
    // }

    renderStages=()=>{
        switch (this.state.stage) {
            case 0:
               return this.renderStage1()
            case 1:
                return this.renderStage2()
            case 2:
                return this.renderStage3()
            case 3:
                return this.renderStage4()
            // case 4:
            //     return this.renderStage5()
            
        }
    }


    render() {
        return (
            <SafeAreaView>
                  <View style={{marginTop:30}}/>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => this.onPressBack()}>
                        <Image source={require('../../assets/images/arrow.png')}
                            style={[styles.arrow]} />
                    </TouchableOpacity>
                    <Text style={styles.title}>{this.state.title}</Text>


                </View>
                <Image resizeMode="contain" source={processImage[this.state.stage]}
                    style={[styles.process]} />


                {this.renderStages()}

                
            </SafeAreaView>
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
    title: {
        alignSelf: 'center',
        fontSize: 24,
        marginStart: 15,
        fontWeight: '600'
    },
    process: {
        width: "100%",
        height: 55
    },
    arrow: {
        width: 20,
        height: 20
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



export default connect(mapStateToProps, null)(SignUpStage);