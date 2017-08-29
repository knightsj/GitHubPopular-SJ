/**
 * 更多菜单
 * @flow
 */
'use strict';
import React, {Component,PropTypes} from 'react'
import {
    ListView,
    StyleSheet,
    RefreshControl,
    TouchableHighlight,
    Text,
    Image,
    Linking,
    View,
} from 'react-native'

import Popover from "../common/Popover";
import CustomKeyPage from "../pages/Mine/CustomKeyPage"
import SortKeyPagePage from "../pages/Mine/SortKeyPage"
import AboutPage from "../pages/Mine/AboutPage"
import AboutMePage from "../pages/Mine/AboutMePage"
import FavoritePage from "../pages/Favorite/FavoritePage"
import {FLAG_LANGUAGE}  from '../dao/LanguageDao'


export const MORE_MENU = {

    Custom_Language:'自定义语言',
    Sort_Language:'语言排序',
    Custom_Theme:'自定义主题',
    Custom_Key:'自定义标签',
    Sort_Key:'标签排序',
    Remove_Key:'标签移除',
    About_Author:'关于作者',
    About:'关于项目',
    Website:'Website',
    Feedback:'反馈',
    Share:'分享',
}

export default class MoreMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            buttonRect: {},
        }
    }
    //参数的类型
    static propTypes = {
        contentStyle: View.propTypes.style,
        menus:PropTypes.array.isRequired,//必须传入的
        anchorView:PropTypes.object,
    }

    open() {
        this.showPopover();
    }

    showPopover() {
        if (!this.props.anchorView)return;
        let anchorView=this.props.anchorView;
        if(anchorView instanceof FavoritePage){
            anchorView=anchorView.refs.moreMenuButton;
        }
        anchorView.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    closePopover() {
        this.setState({
            isVisible: false,
        });
        if (typeof(this.props.onClose) == 'function')this.props.onClose();
    }

    //tab：哪一列
    onMoreMenuSelect(tab) {
        //
        this.closePopover();
        if (typeof(this.props.onMoreMenuSelect) == 'function')this.props.onMoreMenuSelect(tab);
        let TargetComponent, params={...this.props,menuType:tab};
        switch (tab) {
            case MORE_MENU.Custom_Key:
                TargetComponent = CustomKeyPage;
                params.flag=FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Sort_Key:
                TargetComponent = SortKeyPagePage;
                params.flag=FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Remove_Key:
                TargetComponent = CustomKeyPage;
                params.flag=FLAG_LANGUAGE.flag_key;
                params.isRemoveKeyPage = true;

                break;
            case MORE_MENU.Custom_Language:
                TargetComponent = CustomKeyPage;
                params.flag=FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Sort_Language:
                TargetComponent = SortKeyPagePage;
                params.flag=FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.About:
                TargetComponent = AboutPage;
                params.flag=FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                params.flag=FLAG_LANGUAGE.flag_language;
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

            case MORE_MENU.Share:
                break;

        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params,
            });
        }
    }

    renderMoreView() {
        let view = <Popover
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonRect}
            placement="bottom"
            onClose={()=>this.closePopover()}
            contentStyle={{opacity:0.82,backgroundColor:'#343434'}}
            contentMarginRight={18}
        >
            <View style={{alignItems: 'center',}}>
                {this.props.menus.map((result, i, arr) => {
                    return <TouchableHighlight key={i} onPress={()=>this.onMoreMenuSelect(arr[i])}
                                               underlayColor='transparent'>
                        <Text
                            style={{fontSize: 16,color:'white', padding: 8, fontWeight: '400'}}>
                            {arr[i]}
                        </Text>
                    </TouchableHighlight>
                })
                }

            </View>
        </Popover>;
        return view;
    }

    render() {
        return (this.renderMoreView());
    }

}