
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

import PopularPage from '../Popular/PopularPage'
import TrendingPage from '../Trending/TrendingPage'
import FavoritePage from '../Favorite/FavoritePage'
import MinePage from '../Mine/MinePage'

import BaseComponent from '../../base/BaseCommon'
import {DURATION} from 'react-native-easy-toast'

//需要导出的常量
export const ACTION_HOME = {A_SHOW_TOAST:'showToast',A_RESTART:'restart',A_THEME:'theme'};
export const FLAG_TAB = {
    flag_popularTab: 'flag_popularTab',
    flag_trendingTab: 'flag_trendingTab',
    flag_favoriteTab: 'flag_favoriteTab',
    flag_myTab: 'flag_myTab'
}

export default class HomePage extends BaseComponent {

    constructor(props){
        super(props);
        let selectedTab = this.props.selectedTab?this.props.selectedTab:FLAG_TAB.flag_popularTab

        this.state = {
            selectedTab:selectedTab,
            theme:this.props.theme
        }
    }

    componentDidMount() {

        super.componentDidMount();
        this.listener = DeviceEventEmitter.addListener('ACTION_HOME',(action,params)=>this.onAction(action,params));

    }

    onAction(action,params){
        if (action === ACTION_HOME.A_RESTART ){
            this.onRestart(params);
        }else if (action === ACTION_HOME.A_SHOW_TOAST ){
            this.toast.show(params.text,DURATION.LENGTH_LONG);
        }else{

        }
    }

    onRestart(jumpToTap){
        this.props.navigator.resetTo({
            component:HomePage,
            params:{
                ...this.props,
                theme:this.state.theme,
                selectedTab:jumpToTap
            }
        })
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if(this.listener){
            this.listener.remove();
        }
    }

    onSelected(selectedTab) {
        this.setState({
            selectedTab: selectedTab,
        })
    }


    _renderTab(Component, selectedTab, title, renderIcon) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
                renderIcon={() => <Image style={styles.tabItemImageStyle}
                                         source={renderIcon}/>}
                renderSelectedIcon={() => <Image
                    style={[styles.tabItemImageStyle,this.state.theme.styles.tabBarSelectedIcon]}
                    source={renderIcon}/>}
                    onPress={() => this.onSelected(selectedTab)}>
                <Component {...this.props} theme={this.state.theme} homeComponent={this}/>
            </TabNavigator.Item>
        )
    }


    render() {
        return (
            <View style={styles.container}>
                <TabNavigator
                    tabBarStyle={{opacity: 0.9,}}
                    sceneStyle={{paddingBottom: 0}}
                >
                    {this._renderTab(PopularPage, FLAG_TAB.flag_popularTab, '最热', require('../../../res/images/ic_polular.png'))}
                    {this._renderTab(TrendingPage, FLAG_TAB.flag_trendingTab, '趋势', require('../../../res/images/ic_trending.png'))}
                    {this._renderTab(FavoritePage, FLAG_TAB.flag_favoriteTab, '收藏', require('../../../res/images/ic_favorite.png'))}
                    {this._renderTab(MinePage, FLAG_TAB.flag_myTab, '我的', require('../../../res/images/ic_my.png'))}
                </TabNavigator>
            </View>
        )
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    tabItemImageStyle:{
        width:24,
        height:24
    }
});