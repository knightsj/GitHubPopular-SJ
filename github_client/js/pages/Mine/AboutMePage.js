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
    Clipboard
} from 'react-native';


const FLAG = {
    REPOSITORY: '开源项目',
    BLOG: {
        name: '技术博客',
        items: {
            PERSONAL_BLOG: {
                title: '个人博客',
                url: 'http://jiapenghui.com',
            },
            CSDN: {
                title: 'CSDN',
                url: 'http://blog.csdn.net/fengyuzhengfan',
            },
            JIANSHU: {
                title: '简书',
                url: 'http://www.jianshu.com/users/ca3943a4172a/latest_articles',
            },
            GITHUB: {
                title: 'GitHub',
                url: 'https://github.com/crazycodeboy',
            },
        }
    },
    CONTACT: {
        name: '联系方式',
        items: {
            QQ: {
                title: 'QQ',
                account: '1586866509',
            },
            Email: {
                title: 'Email',
                account: 'crazycodeboy@gmail.com',
            },
        }
    },
    QQ: {
        name: '技术交流群',
        items: {
            MD: {
                title: '移动开发者技术分享群',
                account: '335939197',
            },
            RN: {
                title: 'React Native学习交流群',
                account: '165774887',
            }
        },
    },

};

import ViewUtils from '../../util/ViewUtils'
import AboutComponent,{FLAG_ABOUT} from '../../base/BaseAboutComponent'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import WebViewPage from '../../common/WebViewPage'
import Config from '../../../res/data/Config.json'
import Toast from 'react-native-easy-toast'

export default class AboutPage extends Component{
    constructor(props) {
        super(props);
        this.aboutComponent = new AboutComponent(props,FLAG_ABOUT.flag_about_me,(dic=>this.updateState(dic)),Config)
        this.state={
            projectModels:[],
            author:Config.author,
            showRepository:false,
            showBlog:false,
            showQQ:false,
            showContact:false,

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

            case FLAG.BLOG:
                this.updateState({showBlog:!this.state.showBlog})
                break;

            case FLAG.REPOSITORY:
                this.updateState({showRepository:!this.state.showRepository})
                break;

            case FLAG.QQ:
                this.updateState({showQQ:!this.state.showQQ})
                break;

            case FLAG.CONTACT:

                this.updateState({showContact:!this.state.showContact})
                break;

            case FLAG.CONTACT.items.QQ:
                Clipboard.setString(tab.account);
                this.toast.show('QQ:' + tab.account + '已复制到剪贴板');
                break;

            case FLAG.CONTACT.items.Email:

                var url = 'mailto:'+tab.account;
                Linking.canOpenURL(url).then(supported=>{
                    if (!supported){
                        console.log('Can not handle url:' + url);
                        alert('Can not handle url:' + url);
                    }else {
                        return Linking.openURL(url);
                    }
                })
                break;

            case FLAG.QQ.items.MD:
            case FLAG.QQ.items.RN:
                Clipboard.setString(tab.account);
                this.toast.show('群号:' + tab.account + '已复制到剪切板。');
                break;

            case FLAG.BLOG.items.GITHUB:
            case FLAG.BLOG.items.JIANSHU:
            case FLAG.BLOG.items.PERSONAL_BLOG:
            case FLAG.BLOG.items.JUEJIN:
                TargetComponent = WebViewPage;
                params.url = tab.url;
                params.title = tab.title;
                break;

        }

        if(TargetComponent){
            this.props.navigator.push({
                component:TargetComponent,
                params:params
            })
        }
    }

    //获取item右侧图标
    getClickIcon(isShow){
        return isShow?require('../../../res/images/ic_tiaozhuan_up.png'):require('../../../res/images/ic_tiaozhuan_down.png');
    }
    
    //显示列表数据
    renderItems(dict,isShowAccount){
        if (!dict)return null;
        let views = [];
        for(let i in dict){
            let title = isShowAccount? dict[i].title + ' : ' + dict[i].account:dict[i].title;
            views.push(
                <View key = {i}>
                    {ViewUtils.createSettingItem(()=>this.onClick(dict[i]),'',title,this.props.theme.styles.tabBarSelectedIcon)}
                    <View style={GlobalStyles.cellBottomLineStyle}></View>
                </View>
            )
        }
        return views;
    }

    render(){
        let contentView = <View>
            {ViewUtils.createSettingItem(()=>this.onClick(FLAG.BLOG),require('../../../res/images/ic_computer.png'),FLAG.BLOG.name,this.props.theme.styles.tabBarSelectedIcon,this.getClickIcon(this.state.showBlog))}
            <View style={GlobalStyles.cellBottomLineStyle}></View>
            {this.state.showBlog?this.renderItems(FLAG.BLOG.items,false):null}

            {ViewUtils.createSettingItem(()=>this.onClick(FLAG.REPOSITORY),require('../../../res/images/ic_code.png'),FLAG.REPOSITORY,this.props.theme.styles.tabBarSelectedIcon,this.getClickIcon(this.state.showRepository))}
            <View style={GlobalStyles.cellBottomLineStyle}></View>
            {this.state.showRepository?this.aboutComponent.renderRepository(this.state.projectModels):null}

            {ViewUtils.createSettingItem(()=>this.onClick(FLAG.QQ),require('../../../res/images/ic_computer.png'),FLAG.QQ.name,this.props.theme.styles.tabBarSelectedIcon,this.getClickIcon(this.state.showQQ))}
            <View style={GlobalStyles.cellBottomLineStyle}></View>
            {this.state.showQQ?this.renderItems(FLAG.QQ.items,true):null}

            <View style={GlobalStyles.cellBottomLineStyle}></View>
            {ViewUtils.createSettingItem(()=>this.onClick(FLAG.CONTACT),require('../../../res/images/ic_contacts.png'),FLAG.CONTACT.name,this.props.theme.styles.tabBarSelectedIcon,this.getClickIcon(this.state.showContact))}
            <View style={GlobalStyles.cellBottomLineStyle}></View>
            {this.state.showContact?this.renderItems(FLAG.CONTACT.items,true):null}
        </View>

        return (
            <View style={styles.container}>
                {this.aboutComponent.render(contentView, this.state.author)}
                <Toast ref={e=>this.toast = e}/>
            </View>);
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})
