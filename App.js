import React, {Component} from 'react';


// import {createStackNavigator,createAppContainer,createBottomTabNavigator} from 'react-navigation';
import Index from './src/Root';
import { Header, Container, Left, Body, Right, Button, Icon, Title, Text,List,ListItem,Thumbnail,Toast, Root   } from 'native-base';



// const AppContainer =  createAppContainer(AppContain);

  class App extends Component{
    render(){
      return (<Root><Index /></Root>)
    }
  }

export default App;