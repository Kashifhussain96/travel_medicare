import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from "react-native-animatable";
import React from "react";
import Modal from "./index";
import {Button} from "react-native-elements";

class AlertComponent {

    constructor(message, type = "alert", header = "") {
        this.message = message;
        this.type = type;
        this.header = header ? header : this.getHeader();
    }

    getHeader = () => {
        let {type} = this;
        switch (type) {
            case "alert":
                return "Alert";
            case "info":
                return "Information";
            case "warning":
                return "Warning";
            // case "error":
            //     return "Error";
            case "success":
                return "Successful";
        }
    };

    createHeader = () => {
        let {header} = this;
        if (!header) {
            return null;
        }
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    {header}
                </Text>
            </View>
        );
    };

    createBody = () => {
        let {message} = this;
        return (
            <View style={styles.body}>
                {/* <HTMLView style = {styles.bodyText} html={message}/> */}
                <Text style={styles.bodyText}>{message}</Text>
            </View>
        );
    };

    createFooter = () => {
        return (
            <Button
                title={'OK'}
                type={'clear'}
                TouchableComponent={TouchableOpacity}
                activeOpacity={0.5}
                buttonStyle={styles.footerButton}
                titleStyle={styles.footerButtonText}
                onPress={() => {
                    Modal.hide();
                }}
            />
        );
    };

    getComponent = () => {
        return (
            <Animatable.View animation={'bounceIn'} duration={300}>
                <View style={styles.container}>
                    {this.createHeader()}
                    {this.createBody()}
                    {this.createFooter()}
                </View>
            </Animatable.View>
        );
    };

   

}

const styles = StyleSheet.create({
    container: {
        minWidth: "75%",
        maxWidth: "85%",
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: 'grey',
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 2,
        shadowRadius: 5,
        elevation: 2
    },
    header: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 0,
    },
    headerText: {
        fontWeight: '500',
        textAlign: 'center'
    },
    body: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 20,
    },
    bodyText: {
        textAlign: 'center',
    },
    footerButton: {
        padding: 12,
        borderTopWidth: 0.5,
        borderTopColor: '#ddd',
        overflow: 'hidden'
    },
    footerButtonText: {
        textAlign: 'center',
        fontWeight: '500',
        color: "#FF6953"
    }
});

export default AlertComponent;
