
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { connect } from "react-redux";
import TopBanner from '../../components/topBanner'
import Modal from '../../utils/modal';
import * as UserAction from '../../redux/actions/user'
import { bindActionCreators } from "redux";
import StatusBar from '../../components/statusbar';
import VisitContainer from '../../components/visitorsContainer';
import GreenButton from '../../components/button/greenButton';
import colors from '../../utils/colors';
import Underline from '../../components/underline';
import ImageTextContainer from '../../components/imageTextContainer';
import GetQuote from '../../components/button/getQuote';
import ContactContainer from '../../components/contactContainer';


class LandingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageList:[
                {  title:'The Trip Duration', image:require('../../assets/images/time.png') },
                {  title:'The Plan Type', image:require('../../assets/images/ThePlanType.png') },
                {  title:'The Coverage Type', image:require('../../assets/images/TheCoverageType.png') },
                {  title:'The Sum Insured Limit', image:require('../../assets/images/TheSumInsuredLimit.png') },
                {  title:'Deductible Credits', image:require('../../assets/images/DeductibleCredits.png') },
                {  title:'The Client’s Age', image:require('../../assets/images/TheClientsAge.png') },
            ]
        };



    }


    componentDidMount() {


    }


    



    render() {

        return (
            <View style={styles.container}>
                <StatusBar />
                <TopBanner />

                <ScrollView vertical style={styles.scrollContainer}>
                    <Image source={require('../../assets/images/insurancehome.png')}
                        style={[styles.logo]} />

                    <VisitContainer 
                        onPress={()=> this.props.navigation.navigate('Login')}/>

                    <Text style={styles.title}>Welcome to Travel Medicare</Text>

                    <Text style={[styles.description,{lineHeight:25}]}>There are plenty of things that could go wrong while 
                        you are on a Trip despite how meticulously it has been planned. International Travel Insurance secures you against the risk of incurring 
                            unforeseen medical expenses and other travel related emergencies, when you are bound to feel especially vulnerable
                                 due to the fact that you are in unfamiliar territory, far away from home. When unexpected illnesses or accidents 
                                 occur while you are travelling overseas or you face other severe emergencies, having an international travel
                                  insurance gives you access to financial comfort, making the whole experience a lot less traumatic.</Text>

                    <GreenButton
                        title={"Insurance Plan"} />

                    <Image source={require('../../assets/images/standard.png')}
                        style={[styles.standardImage]} />

                    <Text style={styles.standard}>Standard</Text>
                    
                    <Text style={styles.standardDesc}>Standard plan will have different coverages with two options 
                        with pre-existing and without pre-existing.</Text>

                    <Text style={styles.coverage}>Coverages :- $25,000 | $50,000 | $100,000</Text>

                    <Image source={require('../../assets/images/Enhanced.png')}
                        style={[styles.standardImage]} />

                    <Text style={styles.standard}>Enhanced</Text>

                    <Text style={styles.standardDesc}>Enhanced plan will have different coverages with two options with
                         pre-existing and without pre-existing.</Text>

                    <Text style={styles.coverage}>Coverages :- $25,000 | $50,000 | $100,000 | $150,000</Text> 

                     <Image source={require('../../assets/images/Premium.png')}
                        style={[styles.standardImage]} />

                    <Text style={styles.standard}>Premium</Text>

                    <Text style={styles.standardDesc}>Premium plan will have different coverages with two options with 
                        pre-existing and without pre-existing.</Text>

                    <Text style={styles.coverage}>Coverages :-  $25,000 | $50,000 | $100,000 | $150,000 | $300,000</Text>

                    <Text style={styles.visitors}>Visitors to Canada</Text>

                    <Text style={[styles.standardDesc,{lineHeight:30}]}>Travelling abroad can be a wonderful experience, 
                        but this can quickly change in case of unforeseen circumstances such as loss of belongings, delays
                         or even medical emergencies that can burn a hole in your pocket due to high medical expenses abroad.
                         Travel insurance aims to be your safety jacket to shield you from these adversities.</Text>

                    <Text style={styles.rates}>Rates for all the policies are based on:</Text>
                    <Underline />
                
                    <FlatList
                        numColumns={2}
                        style={styles.imageList}
                        scrollEnabled={false}
                        vertical
                        keyExtractor={(key)=> this.keyExtractor = key}
                        renderItem={({item, index, separators}) => (
                                    <ImageTextContainer
                                        title={item.title}
                                        image={item.image} />
                                    
                            )}
                        data={this.state.imageList} />

                    <GetQuote
                        onPress={()=> this.props.navigation.navigate('Login')}/>

                    <ContactContainer/>

                </ScrollView>

            </View>

        );
    }
}
const mapStateToProps = state => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(UserAction, dispatch)
    }
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    imageList:{
        alignSelf:'center',
        marginTop:10,
        marginBottom:10
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20
    },
    visitors: {
        alignSelf: 'center',
        marginTop: 20,
        color: colors.primary,
        fontWeight: '600',
        fontSize: 22
    },
    standard: {
        alignSelf: 'center',
        marginTop: 10,
        fontSize: 16
    },
    rates: {
        alignSelf: 'center',
        marginTop: 20,
        color: colors.primary,
        fontWeight: '600',
        fontSize: 18
    },
    coverage: {
        alignSelf: 'center',
        marginTop: 16,
        fontSize: 16,
        color: colors.gray,
        marginStart:20,
        marginEnd:20,
        lineHeight:24
    },

    standardDesc: {
        alignSelf: 'center',
        marginTop: 10,
        marginStart: 20,
        color: '#869294',
        textAlign:"justify",
        marginEnd: 20,
        fontSize: 16
    },
    standardImage: {
        height: 100,
        width: 100,
        alignSelf: 'center',
        marginTop: 20
    },
    mobileNumber: {
        marginStart: 20,
        marginTop: 30,
        fontSize: 16
    },
    logo: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 3.2
    },
    title: {
        alignSelf: 'center',
        fontWeight: '600',
        marginTop: 15,
        fontSize: 20
    },
    description: {
        alignSelf: 'center',
        marginStart: 20,
        letterSpacing:1,
        color:"#869294",
        textAlign:"justify",
        width:'90%',
        alignContent:"flex-end",
        lineHeight:20,
        marginEnd: 20,
        marginTop: 15,
        fontSize: 16,
    },
    scrollContainer:{
        marginBottom:20
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(LandingScreen);