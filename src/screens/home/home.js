
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { connect } from "react-redux";
import { View } from 'react-native-animatable';
import colors from '../../utils/colors';
var topBannerWidth = Dimensions.get('window').width
import Modal from "../../utils/modal";

class HomeScreen extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         data: [{
            image: require('../../assets/images/HomeImages/Generate-Quote.png'),
            title: 'Generate Quote'
         }
            , {
            image: require('../../assets/images/HomeImages/My-Quote.png'),
            title: 'My Quote'
         }, {
            image: require('../../assets/images/HomeImages/My-Policy.png'),
            title: 'My Policy'
         }, {
            image: require('../../assets/images/HomeImages/Profile.png'),
            title: 'Profile'
         }, {
            image: require('../../assets/images/HomeImages/MyCommission.png'),
            title: 'My Commission'
         }]
      };



   }


   static navigationOptions = ({ navigation }) => {
      return {
         header: (
            null
         ),
      };
   };

   componentDidMount() {
   }

   onClickItem = (index) => {
      switch (index) {
         case 0:
            this.props.navigation.navigate('GetQuote')
            break;
         case 1:
            this.props.navigation.navigate('MyQuote')
            break;
         case 2:
            this.props.navigation.navigate('MyPolicy')
            break;
         case 3:
            this.props.navigation.navigate('MyProfile')
            break;
         case 4:
            this.props.navigation.navigate('MyCommission')
            break;

      }

   }

   renderItem = ({ item, index }) => {
      return (
         <TouchableOpacity activeOpacity={0.8} onPress={() => this.onClickItem(index)} style={styles.listContainer}>
            <Image resizeMode="contain" source={item.image}
               style={[styles.image]} />
            <Text style={styles.title}>{item.title}</Text>
         </TouchableOpacity>
      )
   }

   render() {

      return (
         <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff'}}>

            <View style={styles.toolbar}>
               <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                  <Image source={require('../../assets/menu.png')}
                     style={[styles.logo]} />
               </TouchableOpacity>
               <Text style={styles.home}>Home</Text>
            </View>

            <FlatList
               data={this.state.data}
               numColumns={2}
               contentContainerStyle={{ paddingBottom: 20}}
               style={styles.list}
               renderItem={this.renderItem} />

         </SafeAreaView>

      );
   }
}
const mapStateToProps = state => {
   return { 
      
   }
};

const styles = StyleSheet.create({
   listContainer: {
      backgroundColor: colors.white,
      alignItems: 'center',
      marginTop: 40,
      justifyContent: 'center',
      marginStart: 30,
      width: '40%',
      paddingTop: 25,
      paddingBottom: 25,
      shadowColor: "#010000",
      shadowOffset: {
         width: 0,
         height: 0
      },
      shadowRadius: 1,
      shadowOpacity: 1,
      elevation: 5
   },
   list: {
      alignSelf: 'center',
      width: '100%',
   },
   title: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 10
   },
   logo: {
      height: 20,
      width: 20,
      marginStart: 20
   },
   home: {
      marginStart: 20,
      fontSize: 18,
      fontWeight: '600'
   },
   image: {
      height: 80,
      width: 100,
      marginBottom:'10%',
   },
   toolbar: {
      backgroundColor: colors.white,
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      shadowColor: "#010000",
      shadowOffset: {
         width: 0,
         height: 0
      },
      shadowRadius: 2.5,
      shadowOpacity: 1,
      elevation: 2
   }
})


export default connect(mapStateToProps, null)(HomeScreen);