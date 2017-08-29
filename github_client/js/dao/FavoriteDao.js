/**
 * FavoriteDao
 * @flow
 */
'use strict';


import {
    AsyncStorage,
} from 'react-native';

const FAVORITE_KEY_PREFIX='favorite_'

export default class FavoriteDao{
    constructor(flag) {
        this.flag = flag;
        this.favoriteKey=FAVORITE_KEY_PREFIX+flag;
    }

    //收藏项目，保存收藏的项目
    //key:项目id或名称
    //value:收藏的项目
    saveFavoriteItem(key,vaule,callback) {
        AsyncStorage.setItem(key,vaule,(error)=>{
            if (!error) {//更新Favorite的key
                this.updateFavoriteKeys(key,true);
            }
        });
    }


    //移除已经收藏的项目
    removeFavoriteItem(key) {
        AsyncStorage.removeItem(key,(error)=>{
            if (!error) {
                this.updateFavoriteKeys(key,false);
            }
        });
    }

    /**
     * 更新Favorite key集合
     * @param isAdd true 添加,false 删除
     * **/
    updateFavoriteKeys(key,isAdd){
        //用户收藏的所有项目拿出来
        AsyncStorage.getItem(this.favoriteKey,(error,result)=>{
            if (!error) {
                var favoriteKeys=[];
                if (result) {
                    favoriteKeys=JSON.parse(result);
                }
                //当前这个key在数组中的index
                var index=favoriteKeys.indexOf(key);
                if(isAdd){
                    //添加操作，并且当前key不在数组中
                    if (index===-1)favoriteKeys.push(key);
                }else {
                    //删除操作，并且当前key存在于数组中
                    if (index!==-1)favoriteKeys.splice(index, 1);
                }
                AsyncStorage.setItem(this.favoriteKey,JSON.stringify(favoriteKeys));
            }
        });
    }

    //获取所有收藏的项目的key的数组
    getFavoriteKeys(){

        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem(this.favoriteKey,(error,result)=>{
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                }else {
                    reject(error);
                }
            });
        });
    }



    getAllItems() {
        return new Promise((resolve,reject)=> {
            this.getFavoriteKeys().then((keys)=> {
                var items = [];
                if (keys) {
                    AsyncStorage.multiGet(keys, (err, stores) => {
                        try {
                            stores.map((result, i, store) => {
                                // get at each store's key/value so you can work with it
                                let key = store[i][0];
                                let value = store[i][1];
                                if (value)items.push(JSON.parse(value));
                            });

                            resolve(items);

                        } catch (e) {
                            reject(e);
                        }
                    });
                } else {
                    resolve(items);
                }
            }).catch((e)=> {
                reject(e);
            })
        })
    }
}

