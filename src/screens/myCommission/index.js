
import React from 'react';
import { View, Image, Text, StatusBar, Animated, Easing, SafeAreaView, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import { connect } from "react-redux";
import ToolBarComponent from '../../components/toolbar'
import colors from '../../utils/colors';
import * as SSOServices from '../../services/SSOService'
import ModalAlert from '../../utils/modal'

class MyCommission extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{ title: 'Total Commision', value: '-', key: 'totalCommission' },
            { title: 'Pending Commision', value: '-', key: 'pendingCommission' },
            { title: 'Settled Commision', value: '-', key: 'settledCommission' },
            { title: 'ASA Commision', value: '-', key: 'agaCount' },
            { title: 'Advisors Commision', value: '-', key: 'advisorCount' },],
            userId: this.props.userData.user_id,
            role: this.props.userData.role
        };

    }

    async componentDidMount() {
        this.getData();
    }

    getData = () => {
        let modal = ModalAlert.createProgressModal('Fetching Data...', false)
        let formData = new FormData();

        console.log(this.props.userData)
        formData.append("user_id", this.state.userId);
        formData.append("role", this.state.role);

        SSOServices.getCommissionCount(formData).then(res => {

            let obj = res.data;

            let array = [...this.state.data]
            let i = 0;
            if (obj != null) {
                for (var key in obj) {
                    if (array[i].key == key) {
                        array[i].value = obj[key];
                        i++;
                    }
                }
                this.setState({
                    data: array
                })
            }

            ModalAlert.hide(modal)
        }).catch(err => {
            ModalAlert.hide(modal)
        })
    }


    onPressItem = (item) => {

       
        let formData = new FormData();

        formData.append("user_id", this.state.userId);
        formData.append("role", this.state.role)
  
        formData.append("page_no", "1");


        let data = {
            user_id:this.state.userId,
            // role:this.state.role,
        }

        console.log(item.title)
        
        switch (item.title) {
            case 'Total Commision': {
                // formData.append("commission_status", "2")
                data["commission_status"] = "2"
                break;

            }

            case 'Pending Commision': {
                data["commission_status"] = "0"
                // formData.append("commission_status", "0")
                break;

            }

            case 'Settled Commision': {
                data["commission_status"] = "1"
                // formData.append("commission_status", "1")
                break;

            }

            case 'ASA Commision': {
                data["commission_status"] = "4"
                // formData.append("commission_status", "4")
                break;

            }

            case 'Advisors Commision': {
                data["commission_status"] = "5"
                // formData.append("commission_status", "5")
                break;

            }

        }



        this.props.navigation.navigate('CommisssionDetail', { data: item, requestData: data })
    }


    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.onPressItem(item)} style={styles.listItem}>
                <View style={styles.countContainer}>
                    <Text style={styles.count}>CAD{"\n"}{item.value}</Text>
                </View>
                <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
        )
    }



    render() {
        return (
            <ImageBackground source={require('../../assets/images/bg.png')}
                style={[styles.logo]}>
                <SafeAreaView style={{ flex: 1 }}>
                    <ToolBarComponent
                        title={"My Commission"}
                        navigation={this.props.navigation} />
                    <FlatList
                        style={styles.list}
                        renderItem={this.renderItem}
                        data={this.state.data} />



                </SafeAreaView>



            </ImageBackground>

        );
    }
}
const mapStateToProps = state => {
    return {
        userData: state.user.userData
    }
};

const styles = StyleSheet.create({
    countContainer: {
        backgroundColor: colors.primary,
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        paddingTop: 15,
        paddingBottom: 15
    },
    list: {
        alignSelf: 'center',
        width: '80%',
        marginTop: 80
    },
    listItem: {
        backgroundColor: colors.darkBlue,
        marginTop: 20,
        paddingStart: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50
    },
    title: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 20,
        textAlign: "center",
        marginStart: 10,
        marginEnd: 10
    },
    count: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 16,
        textAlign: "center"
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



export default connect(mapStateToProps, null)(MyCommission);