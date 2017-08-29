import React, {Component, PropTypes} from 'react';

import {
    AsyncStorage
} from 'react-native'


import keysData from '../../res/data/keys.json'
import langsData from '../../res/data/langs.json'

export var FLAG_LANGUAGE ={flag_language:'flag_language_language',flag_key:'flag_language_key'}

export default class LanguageDao{

    constructor(flag){
        this.flag=flag;
    }

    fetch(){
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem(this.flag,(error,result)=>{

                if (error){
                    reject(error);
                    return;

                }else {
                    if (result){
                        try {
                            resolve(JSON.parse(result));
                        }catch(e) {
                            reject(e);
                        }
                    }else {

                        var data = this.flag === FLAG_LANGUAGE.flag_language?langsData:keysData;
                        this.save(data);
                        resolve(data);
                    }
                }
            })
        })
    }

    save(objectData){
        var stringData=JSON.stringify(objectData);
        AsyncStorage.setItem(this.flag,stringData,(error,result)=>{

        });
    }
}