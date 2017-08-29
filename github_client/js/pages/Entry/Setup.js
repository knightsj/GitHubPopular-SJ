
import React,{Component} from 'react'

import Navigator from 'react-native-deprecated-custom-components';

import WelComePage from './WelcomePage'

export default class WelcomePage extends Component {

        constructor(props) {
            super(props);
            this.state = {
            };
        }

        _renderScene(route, navigator) {
            let Component = route.component;
            return (
                <Component {...route.params} navigator={navigator}/>
            );
        }

        render() {
            return (
                <Navigator.Navigator
                    initialRoute={{
                        name: 'WelcomePage',
                        component:WelComePage
                    }}
                    renderScene={(e, i)=>this._renderScene(e, i)}
                />
            );
        }
}

