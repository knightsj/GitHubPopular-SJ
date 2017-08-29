
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ListView,
    RefreshControl,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';


import ProjectModel from '../../model/ProjectModel'
import {FlAG_STORAGE} from '../../dao/RepositoryDao'
import NavigationBar from '../../common/NavigationBar'
import DetailPage from '../../common/RepositoryDetailPage'
import ScrollableTableView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RespositoryCell from '../../common/RespositoryCell'
import TrendingCell from '../../common/TrendingCell'
import FavoriteDao from '../../dao/FavoriteDao'
import ArrayUtils from '../../util/ArrayUtls'
import ActionUtils from '../../util/ActionUtils'
import ViewUtils from '../../util/ViewUtils'
import MoreMenu,{MORE_MENU} from '../../common/MoreMenu'
import {FLAG_TAB} from '../Entry/HomePage'
import BaseComponent from '../../base/BaseCommon'
import CustomThemePage from '../Mine/CustomThemePage'

export default class FavoritePage extends BaseComponent {

    constructor(props){
        super(props);
        this.state ={
            theme:this.props.theme,
            customThemeVisible:false,
        }
    }

    renderNavRightButton(){
        return <View style={{flexDirection:'row'}}>
            {ViewUtils.createMoreButton(()=>this.refs.moreMenu.open())}
        </View>
    }

    renderMoreView(){
        let params = {...this.props,fromPage:FLAG_TAB.flag_popularTab}
        return <MoreMenu
            ref = "moreMenu"
            {...params}
            menus={[MORE_MENU.Custom_Theme,MORE_MENU.About_Author,MORE_MENU.About]}
            anchorView={this.refs.moreMenuButton}
            onMoreMenuSelect={e=>{
                if (e=== MORE_MENU.Custom_Theme){
                    this.setState({
                        customThemeVisible:true,
                    })
                }
            }}
        />
    }

    renderCustomTheme(){
        return (
            <CustomThemePage
                visible={this.state.customThemeVisible}
                {...this.props}
                onClose = {()=>this.setState({customThemeVisible:false})}
            />

        )
    }

    render() {

           let content = <ScrollableTableView
               tabBarBackgroundColor={this.state.theme.themeColor}
                tabBarInactiveTextColor="mintcream"
                tabBarActiveTextColor="white"
                tabBarUnderlineStyle={{backgroundColor:'#e7e7e7',height:2}}
                renderTabBar={()=><ScrollableTabBar/>}
            >

                <FavoriteTabPage  {...this.props} tabLabel='最热' flag={FlAG_STORAGE.flag_popular}/>
                <FavoriteTabPage  {...this.props} tabLabel='趋势' flag={FlAG_STORAGE.flag_trending}/>

            </ScrollableTableView>;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'收藏'}
                    style={this.state.theme.styles.navBar}
                    statusBar={{backgroundColor:this.state.theme.themeColor}}
                    rightButton={this.renderNavRightButton()}
                />
                {content}
                {this.renderMoreView()}
                {this.renderCustomTheme()}

            </View>
        );
    }
}


class FavoriteTabPage extends Component{

    constructor(props){

        super(props);
        this.favoriteDao1 = new FavoriteDao(this.props.flag);
        this.unFavoriteItems = [];
        this.state={
            dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2}),
            isLoading:false,
        }
    }

    componentDidMount() {

        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(false);
    }

    onSelectRepository(projectModel){
        this.props.navigator.push({
            title:projectModel.item.full_name,
            component:DetailPage,
            params:{
                projectModel:projectModel,
                ...this.props
            }
        })
    }

    loadData(shouldShowLoading){

        if(shouldShowLoading){
            this.setState({
                isLoading:true
            });
        }

        this.favoriteDao1.getAllItems()
            .then((items)=> {

            var resultData = [];
            for (var i = 0, len = items.length; i < len; i++) {
                resultData.push(new ProjectModel(items[i], true));
            }
            this.setState({
                isLoading: false,
                dataSource: this.getDataSource(resultData),
            });
        }).catch((error)=> {
            this.setState({
                isLoading: false,
                // isLodingFail: true,
            });
        });

    }


    renderRow(projectModel){
        // alert(this.props.flag);
        let CellComponent=this.props.flag===FlAG_STORAGE.flag_popular? RespositoryCell:TrendingCell;
        return <CellComponent
            onSelect = {()=>this.onSelectRepository(projectModel)}
            theme={this.props.theme}
            key = {this.props.flag === FlAG_STORAGE.flag_popular?projectModel.item.id :projectModel.item.fullName}
            projectModel={projectModel}
            onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}/>
    }

    onFavorite(item,isFavorite){

        ActionUtils.onFavorite(this.favoriteDao1,item,isFavorite,this.props.flag);
        ArrayUtils.updateArray(this.unFavoriteItems,item);

        // this.loadData();
        if(this.unFavoriteItems.length>0){

            if(this.props.flag === FlAG_STORAGE.flag_popular){
                DeviceEventEmitter.emit('favoriteChanged_popular');
            }else if (this.props.flag === FlAG_STORAGE.trending){
                DeviceEventEmitter.emit('favoriteChanged_trending');
            }else {

            }
        }

    }


    render(){
        return <View style={{flex:1}}>
            <ListView
                renderRow={(data)=>this.renderRow(data)}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.loadData()}
                        colors={[this.props.theme.themeColor]}
                        tintColor={[this.props.theme.themeColor]}
                        titleColor={[this.props.theme.themeColor]}
                        title={'Loading'}
                    />}
            />
        </View>
    }


    getDataSource(projectModels) {
        return this.state.dataSource.cloneWithRows(projectModels);
    }

}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    tips:{
        color:'black'
    }
});