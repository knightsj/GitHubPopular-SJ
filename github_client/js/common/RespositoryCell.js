
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

export default class RespositoryCell extends Component{

    constructor(props){
        super(props);
        this.state={
            //是否被选中收藏：是由popular页面传递过来的
            isFavorite:this.props.projectModel.isFavorite,
            //收藏的图标
            favoriteIcon:this.props.projectModel.isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_unstar_transparent.png')
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setFavoriteState(nextProps.projectModel.isFavorite);
    }

    render(){

        let item = this.props.projectModel.item?this.props.projectModel.item:this.props.projectModel;

        let favoriteButton = <TouchableOpacity
            onPress={()=>this.onPressFavorite()}
        >
            <Image
                style={[styles.favoriteImageStyle,this.props.theme.styles.tabBarSelectedIcon]}
                source={this.state.favoriteIcon}
            />
        </TouchableOpacity>

        return(
            <TouchableOpacity
                 onPress={this.props.onSelect}
                 style={styles.container}
            >
                <View style={styles.cellContainerViewStyle}>
                    <Text style={styles.title}>{item.full_name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.bottomContainerViewStyle}>
                        <View style={styles.authorContainerViewStyle}>
                            <Text style={styles.bottomTextStyle}>Author:</Text>
                            <Image
                                style={styles.authorAvatarImageStyle}
                                source={{uri:item.owner.avatar_url}}
                             />
                        </View>

                        <View style={styles.starContainerViewStyle}>
                            <Text style={styles.bottomTextStyle}>Starts:</Text>
                            <Text style={styles.bottomTextStyle}>{item.stargazers_count}</Text>
                        </View>


                        {favoriteButton}
                     </View>
                 </View>
            </TouchableOpacity>)

    }

    onPressFavorite(){
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item,!this.state.isFavorite)
    }


    setFavoriteState(isFavorite){
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite:isFavorite,
            favoriteIcon:isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_unstar_transparent.png')
        })
    }
}

const styles =StyleSheet.create({

    title:{
        fontSize:15,
        marginBottom:2,
        color:'#212121',
    },

    bottomContainerViewStyle:{
        flexDirection:'row',
        justifyContent:'space-between'
    },

    authorContainerViewStyle:{
        flexDirection:'row',
        alignItems:'center'
    },

    starContainerViewStyle: {
        flexDirection:'row',
        alignItems:'center'
    },

    bottomTextStyle:{
       fontSize:11,
    },

    description:{
        fontSize:12,
        marginBottom:2,
        color:'#757575'
    },

    cellContainerViewStyle:{

        backgroundColor:'white',
        padding:10,
        marginTop:4,
        marginLeft:6,
        marginRight:6,
        marginVertical:2,
        borderWidth:0.3,
        borderColor:'#dddddd',
        borderRadius:1,
        //iOS的阴影
        shadowColor:'#b5b5b5',
        shadowOffset:{width:3,height:2},
        shadowOpacity:0.4,
        shadowRadius:1,
        //Android的阴影
        elevation:2
    },

    authorAvatarImageStyle:{
        width:16,
        height:16
    },
    favoriteImageStyle:{
        width:18,
        height:18
    }

})