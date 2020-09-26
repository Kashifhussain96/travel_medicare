import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Text} from "react-native";
import * as Animatable from 'react-native-animatable';

let $this;

class Toast extends Component {

    static show = (message, duration = 3000) => {

        if (!message) {
            return;
        }

        const comp = <Animatable.View animation={'fadeIn'}>
            <Text style={toast.container}>{message}</Text>
        </Animatable.View>;

        $this.toasts.push(comp);
        $this.forceUpdate();

        setTimeout(() => {
            Toast.hide(comp);
        }, duration);

        return comp;
    };

    static hide(comp) {
        if (comp) {
            let index = $this.toasts.indexOf(comp);
            if (index > -1) {
                $this.toasts.splice(index, 1);
                $this.forceUpdate();
            }
        } else {
            $this.toasts.pop();
            $this.forceUpdate();
        }
    }

    static hideAll() {
        $this.toasts = [];
        $this.forceUpdate();
    }

    constructor(props) {
        super(props);
        $this = this;

        this.toasts = [];
    }

    render() {
        if (!this.toasts.length) {
            return null;
        }
        return (
            <SafeAreaView style={styles.container} pointerEvents={'none'}>
                {/*Show only one toast at a time*/}
                {this.toasts[this.toasts.length - 1]}
                {/*{this.toasts.map((toast) => {*/}
                {/*    return toast;*/}
                {/*})}*/}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        // paddingBottom: '10%',
        marginBottom: '7%'
    }
});

const toast = StyleSheet.create({
    container: {
        maxWidth: "90%",
        padding: 10,
        backgroundColor: '#333',
        color: 'whitesmoke',
        borderRadius: 5,
        marginBottom: 1,
        overflow: 'hidden'
    }
});

export default Toast;
