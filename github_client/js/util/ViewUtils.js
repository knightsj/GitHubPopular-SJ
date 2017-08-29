
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';


export default class ViewUtils{
    static getLeftButton(callBack){
        return <TouchableOpacity
            style={{padding:8}}
            onPress={callBack}>
            <Image
                style={{width:26,height:26,tintColor:'white'}}
                source={require('../../res/images/ic_arrow_back_white_36pt.png')}
            />

        </TouchableOpacity>
    }

    static createSettingItem(callBack,icon,text,tintColor,expandableIcon){

        //警告
        let image = null;
        if (icon){
            image = <Image
                source={icon}
                resizeMode='stretch'
                style={[{width:18,height:18,marginRight:10},tintColor]}
            />
        }
        return (
            <View style={{backgroundColor:'white'}}>
                <TouchableHighlight
                    onPress={callBack}
                    underlayColor= 'transparent'
                >
                    <View style={styles.settingItemContainerStyle}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            {image}
                            <Text>{text}</Text>
                        </View>
                        <Image source={expandableIcon?expandableIcon:require('../../res/images/ic_tiaozhuan.png')}
                               style={[{marginRight:0,height:22,width:22},tintColor]}//要用括号
                        />
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    static createMoreButton(callback){
       return <TouchableHighlight
            underlayColor='transparent'
            ref = 'moreMenuButton'
            onPress={callback}
        >
            <View style={{paddingRight:8}}>
                <Image
                    source={require('../../res/images/ic_more_vert_white_48pt.png')}
                    style={{width:24,height:24}}
                />
            </View>
        </TouchableHighlight>
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    settingItemContainerStyle:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:10,
        height:44,
    }
});