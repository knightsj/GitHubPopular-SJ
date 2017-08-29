
import  React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    ScrollView,
    TouchableHighlight,
    Platform,
    DeviceEventEmitter
} from 'react-native';

import GlobalStyles from '../../../res/styles/GlobalStyles'
import ThemeFactory,{ThemeFlags} from  '../../../res/styles/ThemeFactory'
import ThemeDao from '../../dao/ThemeDao'
import {ACTION_HOME} from '../Entry/HomePage'

export default class CustomThemePage extends Component {



    constructor(props){
        super(props);
        this.themeDao = new ThemeDao();
        this.state={
        }
    }

    onSelectTheme(themeKey) {

        this.themeDao.save(ThemeFlags[themeKey]);
        this.props.onClose();
        DeviceEventEmitter.emit('ACTION_BASE',ACTION_HOME.A_THEME,ThemeFactory.createTheme(
            ThemeFlags[themeKey]
        ))
    }


    getThemeItem(themeKey) {
        return (
            <TouchableHighlight
                style={{flex: 1}}
                underlayColor='white'
                onPress={()=>this.onSelectTheme(themeKey)}>
                <View style={[{backgroundColor: ThemeFlags[themeKey]}, styles.themeItem]}>
                    <Text style={styles.themeItemTextStyle}>{themeKey}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    renderThemeItems() {
        var views = [];
        for (let i = 0, keys = Object.keys(ThemeFlags), l = keys.length; i < l; i += 3) {
           var key1 = keys[i], key2 = keys[i + 1], key3 = keys[i + 2];
            views.push(<View key={i} style={{flexDirection: 'row'}}>
                {this.getThemeItem(key1)}
                {this.getThemeItem(key2)}
                {this.getThemeItem(key3)}
            </View>)
        }
        return views;
    }

    renderCustomThemeView() {
        return (<Modal
            animationType={"slide"}
            transparent={true}
            visible={this.props.visible}
            onRequestClose={() => {
                this.props.onClose();
            }}
        >
            <ScrollView style={styles.modalContainerStyle}>
                {this.renderThemeItems()}
            </ScrollView>
        </Modal>)
    }

    render() {
        let view = this.props.visible ? <View style={GlobalStyles.listView_container}>
            {this.renderCustomThemeView()}
        </View> : null;
        return view
    }
}


const styles = StyleSheet.create({

    modalContainerStyle:{
        flex:1,
        margin:10,
        marginTop:Platform.OS === 'ios'?20:10,
        backgroundColor:'white',
        borderRadius:4,
        shadowColor:'gray',
        shadowOffset:{width:2,height:2},
        shadowOpacity:0.5,
        shadowRadius:2,
        padding:3
    },

    themeItem:{
        flex:1,
        height:120,
        margin:3,
        padding:3,
        borderRadius:3,
        padding:10,
        alignItems:'center',
        justifyContent:'center',
    },

    themeItemTextStyle:{
      color:'white',
        fontWeight:'500',
        fontSize:16
    }
});