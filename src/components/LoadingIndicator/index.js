import {ActivityIndicator, Text, View} from "react-native";
import React from "react";

export const LoadingIndicator = (props) => (
    <View style={[
        {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
        },
        props.containerStyle
    ]}>
        <ActivityIndicator
            hidesWhenStopped={true}
            animating={props.loading}
            color='#FF8E27'
            size="small"
            style={{marginRight: 10}}
        />
        <Text style={{color: '#333'}}>{props.message}</Text>
    </View>
);
