import  React,{ Component } from 'react'
import  {createAppContainer,createSwitchNavigator} from 'react-navigation'  
import { createStackNavigator } from 'react-navigation-stack';

import SplashPage from './Screens/splashPage'
import LoginPage from './Screens/registerPage'
import ServiceActivePage from "./Screens/ServiceActive";
import ServicePage from './Screens/ServicePage';
import InformationPage from './Screens/Information';
import ProgressPage from './Screens/Progress';
import ChatPage from './Screens/Chat';

const AppContain = createStackNavigator(
    {
        Splash: {screen: SplashPage, navigationOptions: {header: null,},},  
        Login: {screen: LoginPage, navigationOptions: {header: null,},},  
        ServiceActive: {screen: ServiceActivePage, navigationOptions: {header: null,},},  
        Service: {screen: ServicePage, navigationOptions: {header: null,},},  
        Information: {screen: InformationPage, navigationOptions: {header: null,},},  
        Progress: {screen: ProgressPage, navigationOptions: {header: null,},},  
        Chat: {screen: ChatPage, navigationOptions: {header: null,},},  
    },
    {
      initialRouteName: 'Splash',
      
    }
);

const AppContainer =  createAppContainer(AppContain);

export default AppContainer