
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

import HTMLView from 'react-native-htmlview'

export default class TrendingCell extends Component{

    constructor(props){
        super(props);
        this.state={
            isFavorite:this.props.projectModel.isFavorite,
            favoriteIcon:this.props.projectModel.isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_unstar_transparent.png')
        }
    }

    setFavoriteState(isFavorite){
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite:isFavorite,
            favoriteIcon:isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_unstar_transparent.png')
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setFavoriteState(nextProps.projectModel.isFavorite);
    }

    onPressFavorite(){
        this.setFavoriteState(!this.state.isFavorite);
        //回传给页面，记录状态
        this.props.onFavorite(this.props.projectModel.item,!this.state.isFavorite)
    }

    render(){

        let item = this.props.projectModel.item?this.props.projectModel.item:this.props.projectModel;
        let description = '<p>' + item.description + '</p>'
        let favoriteButton = <TouchableOpacity
            onPress={()=>this.onPressFavorite()}
        >
            <Image
                style={[{width:18,height:18},this.props.theme.styles.tabBarSelectedIcon]}
                source={this.state.favoriteIcon}
            />
        </TouchableOpacity>

        return<TouchableOpacity
            onPress={this.props.onSelect}
            style={styles.container}
        >
            <View style={styles.cell_container}>

                <Text style={styles.title}>{item.fullName}</Text>
                <HTMLView
                    value={description}
                    onLinkPress = {(url)=>{}}
                    stylesheet={{
                        p:styles.description,
                        a:styles.description
                    }}
                />
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={styles.author}>Build by:</Text>
                        {item.contributors.map((result,i,arr)=>{
                            return <Image
                                key = {i}
                                style={styles.avatarImageStyle}
                                source={{uri:arr[i]}}
                        />
                    })}
                    </View>
                    {favoriteButton}
                </View>
            </View>
        </TouchableOpacity>

    }
}

const styles =StyleSheet.create({
    container:{
        flex:1
    },

    title:{
        fontSize:15,
        marginBottom:2,
        color:'#212121',

    },

    bottomTextStyle:{
        fontSize:11,
    },

    description:{
        fontSize:12,
        marginBottom:2,
        color:'#757575'
    },

    cell_container:{

        backgroundColor:'white',
        padding:10,
        marginTop:4,
        marginLeft:6,
        marginRight:6,
        marginVertical:2,
        borderWidth:0.3,
        borderColor:'#dddddd',
        borderRadius:1,
        shadowColor:'#b5b5b5',
        shadowOffset:{width:3,height:2},
        shadowOpacity:0.4,
        shadowRadius:1,
        elevation:2
    },

    avatarImageStyle:{
        // borderRadius:8,
        width:16,
        height:16,
        marginRight:6

    },

    starImageStyle:{

        width:16,
        height:16

    },

    author:{
        fontSize:12,
        marginBottom:2,
        color:'gray'
    }

})