import React, {Component} from 'react'
import {RefreshControl, ScrollView} from 'react-native'
import moment from "moment";

const REFRESH_DIFF = 30; // Seconds

export default class InfinityScrollView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            lastPullRefresh: new Date()
        }
    }

    render() {

        const {
            onScrollReachedEnd,
            children
        } = this.props;

        return (
            <ScrollView
                ref={ref => this.scrollView = ref}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                onScroll={({nativeEvent}) => {
                    if (onScrollReachedEnd) {
                        if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y
                            >= nativeEvent.contentSize.height - 1) {
                            onScrollReachedEnd();
                        }
                    }
                }}
                {...this.props}
                contentContainerStyle={{flexGrow: 1}}>
                {children}
            </ScrollView>
        );
    }

  

}
