
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    WebView,
    TextInput,
    DeviceEventEmitter,
    TouchableOpacity,
} from 'react-native';

import NavigationBar from './NavigationBar'
import ViewUtils from '../util/ViewUtils'
import FavoriteDao from '../dao/FavoriteDao'
import {FlAG_STORAGE} from '../dao/RepositoryDao'
const TRENDING_URL = 'https://github.com/'

export default class RepositoryDetailPage extends Component {

    constructor(props){

        super(props);
        this.url = this.props.projectModel.item.html_url?this.props.projectModel.item.html_url:TRENDING_URL+this.props.projectModel.item.fullName;
        var title = this.props.projectModel.item.full_name?this.props.projectModel.item.full_name:this.props.projectModel.item.fullName;
        this.favoriteDao1 = new FavoriteDao(this.props.flag);
        this.state={
            theme:this.props.theme,
            url:this.url,
            title:title,
            canGoBack:false,
            isFavorite:this.props.projectModel.isFavorite,
            favoriteIcon:this.props.projectModel.isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_star_navbar.png')
        }
    }

    goBack(){
        if(this.state.canGoBack){
            this.webView.goBack();
        }else {
            this.props.navigator.pop();
        }

    }

    go(){
        this.setState({
            url:this.text
        })
    }

    onNavigationStateChange(e){
        this.setState({
            canGoBack:e.canGoBack,
        })

    }

    onRightButtonClick(){

        var projectModel = this.props.projectModel;
        this.setFavoriteState(projectModel.isFavorite =!projectModel.isFavorite);
        var key = projectModel.item.fullName?projectModel.item.fullName:projectModel.item.id.toString();
        if(projectModel.isFavorite){
            this.favoriteDao1.saveFavoriteItem(key,JSON.stringify(projectModel.item));
        }else {
            this.favoriteDao1.removeFavoriteItem(key);
        }

        if (this.props.flag === FlAG_STORAGE.flag_popular){
            DeviceEventEmitter.emit('favoriteChanged_popular');
        }else if (this.props.flag === FlAG_STORAGE.flag_trending){
            DeviceEventEmitter.emit('favoriteChanged_trending');
        }else {
            //没有符合的页面，不发送通知
        }

    }

    setFavoriteState(isFavorite){
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite:isFavorite,
            favoriteIcon:isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_star_navbar.png')
        })
    }

    renderRightButton(){
        return <TouchableOpacity
            onPress={()=>this.onRightButtonClick()}
        >
            <Image
                style={{width:20,height:20,marginRight :12}}
                source = {this.state.favoriteIcon}
            />
        </TouchableOpacity>
    }


    render(){
        return <View style={styles.container}>
            <NavigationBar
                title={this.state.title}
                popEnabled={false}
                style={this.state.theme.styles.navBar}
                leftButton={ViewUtils.getLeftButton(()=>this.goBack())}
                rightButton={this.renderRightButton()}
            />
            <WebView
                ref = {webView=>this.webView=webView}
                source={{uri:this.state.url}}
                onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                startInLoadingState={true}
            />
        </View>
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    tips:{
        fontSize:20
    },

    row:{
        flexDirection:'row',
        alignItems:'center',
        margin:10
    },

    input:{
        height:40,
        flex:1,
        borderWidth:1,
        margin:2
    }
});