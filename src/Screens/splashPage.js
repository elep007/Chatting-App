import React from "react";
import { View,Image,ImageBackground,Dimensions,TouchableHighlight ,ScrollView} from "react-native";

import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, ListItem, Thumbnail, List ,Spinner} from "native-base";

import { strings } from '../i18n';
import AsyncStorage from '@react-native-community/async-storage';
import { toastr } from '../component/toastComponent'

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

// var RNFS = require('react-native-fs');

import en from '../translations/test.json';

export default class SplashPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
     loading : false,
    };
    
  }

    componentDidMount(){
      var that = this;
      setTimeout(function() {       
        that.props.navigation.replace('Login')          
      }, 1500); 
        // // this.setState({loading:true})
        // var path = RNFS.DocumentDirectoryPath + '/test.txt';
        // // var path = '../translations/test.json'
      
        // RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
        // .then((success) => {
        //   console.log(RNFS.DocumentDirectoryPath)
        // console.log(path);
        //  console.log("en")
        // })
        // .catch((err) => {
        // console.log(err.message);
        // });
        // console.log(en.login)
   }


  render() {
    const { loading } = this.state

    return (
        <Container>
            <ImageBackground
                resizeMode={'stretch'}
                style={{height:screenHeight}}
                source={require('../Resources/bg.jpg')}
            > 
            {loading && (
                <Spinner
                style={{position:"absolute",top:150,zIndex:200,left:screenWidth/2-20}}
                color='#f26727' />
            )}
            </ImageBackground>
           
        </Container>
    );
  }
}

