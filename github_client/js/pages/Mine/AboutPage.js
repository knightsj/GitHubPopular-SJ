/**
 * AboutPage
 * 关于
 * @flow
 */
'use strict';


import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Linking,
    View,
    ListView,
    Dimensions,
    Text,
    Platform,
} from 'react-native';


import ViewUtils from '../../util/ViewUtils'
import {MORE_MENU} from '../../common/MoreMenu'
import AboutComponent,{FLAG_ABOUT} from '../../base/BaseAboutComponent'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import WebViewPage from '../../common/WebViewPage'
import config from '../../../res/data/Config.json'
import AboutMePage from './AboutMePage'


export default class AboutPage extends Component{
    constructor(props) {
        super(props);
        this.aboutComponent = new AboutComponent(props,FLAG_ABOUT.flag_about,(dic=>this.updateState(dic)),config)
        this.state={
            theme:this.props.theme,
            projectModels:[],
            project:config.project,
        }
    }

    componentDidMount() {
        this.aboutComponent.componentDidMount();
    }

    updateState(dic){
        this.setState(dic);
    }

    onClick(tab){
        let TargetComponent,params = {...this.props,menuType:tab}

        switch (tab){
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                break;

            case MORE_MENU.Website:
                TargetComponent = WebViewPage;
                params.url = 'http://coding.imooc.com/class/89.html';
                params.title = '慕课网实战：GitHub客户端';
                params.theme = this.state.theme;
                break;

            case MORE_MENU.Feedback:
                var url = 'mailto://ssjlife0111@163.com';
                Linking.canOpenURL(url).then(supported=>{
                    if(!supported){
                        console.log('Can not handle url:' + url);
                    }else {
                        return Linking.openURL(url);
                    }
                }).catch(err=>console.error('An error occurred',err));
                break;

        }

        if(TargetComponent){
            this.props.navigator.push({
                component:TargetComponent,
                params:params
            })
        }
    }

    render(){
        let contentView = <View>
            {this.aboutComponent.renderRepository(this.state.projectModels)}
            {ViewUtils.createSettingItem(()=>this.onClick(MORE_MENU.Website),require('../../../res/images/ic_computer.png'),MORE_MENU.Website,this.props.theme.styles.tabBarSelectedIcon)}
            <View style={GlobalStyles.cellBottomLineStyle}></View>

            {ViewUtils.createSettingItem(()=>this.onClick(MORE_MENU.About_Author),require('../../../res/images/ic_insert_emoticon.png'),MORE_MENU.About_Author,this.props.theme.styles.tabBarSelectedIcon)}
            <View style={GlobalStyles.cellBottomLineStyle}></View>

            {ViewUtils.createSettingItem(()=>this.onClick(MORE_MENU.Feedback),require('../../../res/images/ic_feedback.png'),MORE_MENU.Feedback,this.props.theme.styles.tabBarSelectedIcon)}
            <View style={GlobalStyles.cellBottomLineStyle}></View>
            <View style={GlobalStyles.cellBottomLineStyle}></View>
        </View>
        return this.aboutComponent.render(contentView,{
            'name':this.state.project.name,
            'description':this.state.project.description,
            'avatar':this.state.project.icon,
            'backgroundImage':this.state.project.backgroundImage,
        });
    }
}