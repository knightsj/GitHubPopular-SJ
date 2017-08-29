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
    Platform

} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view'
import ViewUtils from '../util/ViewUtils'
import FavoriteDao from '../dao/FavoriteDao'
import {FlAG_STORAGE} from '../dao/RepositoryDao'
import FavoriteUtils from '../util/FavoriteUtils'
import RepositoryCell from '../common/RespositoryCell'
import DetailPage from '../common/RepositoryDetailPage'
import RepositoryUtil from '../util/RepositoryUtils'
import ActionUtils from '../util/ActionUtils'

export var FLAG_ABOUT = {flag_about:'about',flag_about_me:'flag_about_me'}

export default class AboutComponent {

    constructor(props,flag_about,updateState,config) {
        this.props = props;
        this.updateState = updateState;
        this.flag_about = flag_about;
        this.config = config;
        this.repositories = [];
        this.favoriteKeys = null;
        this.favoriteDao = new FavoriteDao(FlAG_STORAGE.flag_popular);
        this.repositoryUtil = new RepositoryUtil(this);
    }

    componentDidMount() {
        
        if(this.flag_about === FLAG_ABOUT.flag_about){

            this.repositoryUtil.fetchRepository(this.config.info.currentRepoUrl);

        }else if (this.flag_about === FLAG_ABOUT.flag_about_me){

            var urls = [];
            var items = this.config.items;
            for (var i = 0, l = items.length; i <l;i++){
                urls.push(this.config.info.url + items[i]);
            }

            this.repositoryUtil.fetchRepositorys(urls);

        }else {

        }
    }

    onNotifyDataChanged(items){
        this.updateFavorite(items);
    }

    async updateFavorite(repositories){
        if(repositories)this.repositories = repositories;
        if(!this.repositories)return;
        if(!this.favoriteKeys){
            this.favoriteKeys = await this.favoriteDao.getFavoriteKeys();
        }
        let projectModels = [];
        for (var i=0,len=this.repositories.length;i<len;i++){
            var data = this.repositories[i];
            var item =  data.item ? data.item : data;
            projectModels.push({
                isFavorite: FavoriteUtils.checkFavorite(this.repositories[i],this.favoriteKeys?this.favoriteKeys:null),
                item:item,
            });
        }
        this.updateState({
            projectModels:projectModels
        })

    }

    //收藏按钮的回调函数
    onFavorite(item,isFavorite){
        //写进数据库，使用string
        if(isFavorite){
            this.favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item));
        }else {
            this.favoriteDao.removeFavoriteItem(item.id.toString());
        }

    }



    onSelectRepository(projectModel){
        this.props.navigator.push({
            title:projectModel.item.full_name,
            component:DetailPage,
            params:{
                projectModel:projectModel,
                flag:FlAG_STORAGE.flag_popular,
                ...this.props
            }
        })
    }

    //创建项目视图
    renderRepository(projectModels){
        if(!projectModels || projectModels.length===0){
            return null;
        }
        let views = [];
        for (let i=0,l=projectModels.length;i<l;i++){
            let projectModel = projectModels[i];
            views.push(
                <RepositoryCell
                    theme = {this.props.theme}
                    key = {projectModel.item.id}
                    projectModel={projectModel}
                    onSelect = {()=>this.onSelectRepository(projectModel)}
                    onFavorite={(item,isFavorite)=>ActionUtils.onFavorite( this.favoriteDao, item,isFavorite,FlAG_STORAGE.flag_popular)}/>
            )
        }
        return views;
    }

    createParallaxRenderConfig(params){
        let config = {};
        config.renderBackground= ()=>(
            <View key="background">
                <Image source={{uri: params.backgroundImage,
                    width: window.width,
                    height: PARALLAX_HEADER_HEIGHT}}/>
                <View style={{position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    height: PARALLAX_HEADER_HEIGHT}}/>
            </View>
        );

        config.renderForeground=() => (
            <View key="parallax-header" style={ styles.parallaxHeader }>
                <Image style={styles.avatar} source={{
                    uri: params.avatar,
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE
                }}/>
                <Text style={ styles.sectionSpeakerText }>
                    {params.name}
                </Text>
                <Text style={ styles.sectionTitleText }>
                    {params.description}
                </Text>
            </View>
        );

        config.renderStickyHeader=()=> (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        );

        config.renderFixedHeader=() => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtils.getLeftButton(()=>this.props.navigator.pop())}
            </View>
        );

        return config;
    }

    render(contentView,params) {
        let config = this.createParallaxRenderConfig(params);
        return (
            <ParallaxScrollView
                backgroundColor={this.props.theme.themeColor}
                headerBackgroundColor="#333"
                stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
                backgroundSpeed={10}
                {...config}
            >{contentView}
            </ParallaxScrollView>
        );
    }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },

    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems:'center',
        paddingTop:(Platform.OS === 'ios')?20:0,
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },

    fixedSection: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right:10,
        top:0,
        flexDirection:'row',
        alignItems:'center',
        paddingTop:(Platform.OS === 'ios')?20:0,
        justifyContent:'space-between'
    },

    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    rowText: {
        fontSize: 20
    }
});