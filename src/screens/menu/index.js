import React, { Component } from "react";
import { SafeAreaView, Text, StyleSheet, Image, TouchableOpacity, FlatList, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import { View } from "react-native-animatable";
import colors from "../../utils/colors";
import * as UserAction from '../../redux/actions/user'
import { bindActionCreators } from "redux";
import Modal from "../../utils/modal";



class MenuScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            mobile: '',
            data: [{
                image: require('../../assets/images/SlideMenuImages/home.png'),
                title: 'Home',
                target: '',
                navParams: 1
            }
                , {
                image: require('../../assets/images/SlideMenuImages/M-profile.png'),
                title: 'Profile',
                target: 'MyProfile',
                navParams: 1
            }, {
                image: require('../../assets/images/SlideMenuImages/G-Quote.png'),
                title: 'Generate Quote',
                target: 'GetQuote',
                navParams: 1
            }, {
                image: require('../../assets/images/SlideMenuImages/M-Quote.png'),
                title: 'My Quote',
                target: 'MyQuote',
                navParams: 1
            }, {
                image: require('../../assets/images/SlideMenuImages/M-Policy.png'),
                title: 'My Policy',
                target: 'MyPolicy',
                navParams: 1
            }
                , {
                image: require('../../assets/images/SlideMenuImages/t&c.png'),
                title: 'Terms and Conditions',
                target: 'CommonScreen',
                navParams: 1
            },
            {
                image: require('../../assets/images/SlideMenuImages/privacy.png'),
                title: 'Privacy Policy',
                target: 'CommonScreen',
                navParams: 2
            }
                , {
                image: require('../../assets/images/SlideMenuImages/aboutus.png'),
                title: 'About Us',
                target: 'CommonScreen',
                navParams: 3
            }, {
                image: require('../../assets/images/SlideMenuImages/logout.png'),
                title: 'Logout',
                target: 'Logout',
                navParams: 1
            }
            ]
        }
    }

    componentDidMount() {
    }


    getRole = (data)=>{

        if(data.role == "1"){
            return "MGA"
        }else if(data.role == "2"){
            return "AGA"
        }else{
            return "Advisor"
        }
    }

    renderTopContainer = () => {



        let {userData} = this.props;
       

        return (
            <View>
                <View style={styles.topContainer}>
                    <View style={styles.nameContainer}>
                     <Text style={styles.name}>{userData.first_name +` `+userData.last_name}</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.closeDrawer()}>
                            <Image source={require('../../assets/cancel.png')}
                                style={[styles.cancel]} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>{userData.email}</Text>
                    <Text style={styles.name}>{this.getRole(userData)}</Text>
                </View>
                <View style={styles.underline} />
            </View>
        )
    }

    onClickMenuItem = async (item, index) => {

        switch (index) {
            case 0:
                this.props.navigation.closeDrawer()

                break;
            case 8:
                this.props.navigation.closeDrawer();
                let modal = Modal.createModal({text : 'Logout'},{text : 'Are you sure do you want to logout?'},false,Modal.createPrimaryButton('Logout',()=>{
                    this.clearData()
                    Modal.hide(modal);
                }),Modal.createSecondaryButton('Cancel',()=>{
                    Modal.hide(modal);
                }))
                break;
            default:
                this.props.navigation.navigate(item.target, { data: item.navParams })
                break;
        }
    }

    clearData  = async () =>{
        await AsyncStorage.setItem("isLoggedIn","false");
        await AsyncStorage.setItem("token","");
        this.props.actions.clearData();
        this.props.navigation.navigate('SplashScreen')
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.onClickMenuItem(item, index)} style={styles.listContainer}>
                <Image resizeMode="contain" source={item.image}
                    style={[styles.image, { tintColor: "black" }]} />
                <Text style={styles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    render() {

        return (
            <SafeAreaView style={{ flex: 1 }}>
                {this.renderTopContainer()}


                <FlatList
                    renderItem={this.renderItem}
                    data={this.state.data} />

            </SafeAreaView>

        )
    }

}
const mapStateToProps = state => {
    return {
        userData: state.user.userData
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
       actions: bindActionCreators(UserAction, dispatch)
    }
 }

export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen);

const styles = StyleSheet.create({
    listContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 10,
        marginTop: 20
    },
    image: {
        height: 25,
        width: 25
    },
    menuTitle: {
        marginStart: 10,
        fontSize: 20,
    },
    topContainer: {
        marginTop: 20,
        marginStart: 10
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 5
    },
    cancel: {
        width: 20,
        height: 20,
        marginEnd: 20
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    underline: {
        backgroundColor: colors.primary,
        height: 2,
        width: '96%',
        marginStart: 10,
        marginTop: 10
    }
})