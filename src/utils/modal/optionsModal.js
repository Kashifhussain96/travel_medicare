import React from "react";
import { StyleSheet, Text,Image, View, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import Modal from './index'



class OptionsComponent {

   constructor(component,backgroundColor,styless) {
      this.component = component
      this.backgroundColor = backgroundColor
      this.styless = styless
   }

   getHeader = () => {
      return this.header
   };

   

   createBody = () => {
      return (
         <View style={styles.body}>
            {this.component}
         </View>
      )
   };

  

   getComponent = () => {
      return (
         <Animatable.View animation={'bounceIn'} duration={300}>
            <View style={[styles.container,{backgroundColor: this.backgroundColor ? '#00A4A3' : 'white'},this.styless]}>
              
               {this.createBody()}
            </View>
         </Animatable.View>
      );
   };

   

}

const styles = StyleSheet.create({
   container: {
      minWidth: "75%",
      maxWidth: "85%",
      borderRadius: 20,
      //backgroundColor: '#00A4A3',
      shadowColor: 'grey',
      shadowOffset: {
         width: 5,
         height: 5
      },
      height:'92%',
      shadowOpacity: 2,
      shadowRadius: 5,
      elevation: 2
   },
   radio: {
      margin: 0,
      padding: 0,
      marginTop: 15,
      marginBottom: 10,
      //flexDirection: 'column-reverse'
   },
   header: {
      paddingLeft: 15,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 0,
   },
   headerText: {
      fontSize: 18,
      fontWeight: '500',
      fontFamily:'DINRoundPro-Bold',
      lineHeight:30,
      marginLeft: 10,
      marginTop:15,
      //textAlign: 'left'
   },
   body: {
      // justifyContent:'center',
      // alignItems:'center',
      // alignContent:'center',
      padding:20,
      paddingTop:10
   },
   bodyText: {
      textAlign: 'center',
      fontSize: 14
   },
   footerButton: {
      padding: 12,
      borderTopWidth: 0.5,
      borderTopColor: '#ddd',
      overflow: 'hidden'
   },
   footerButtonText: {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '500',
   }
});

export default OptionsComponent;
