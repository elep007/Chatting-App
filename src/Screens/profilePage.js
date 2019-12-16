import React from "react";
import { View,Image,ImageBackground,Dimensions,TouchableHighlight,TextInput,ScrollView } from "react-native";


import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, ListItem, Thumbnail, List ,Spinner} from "native-base";
import { strings } from '../i18n';

import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase'

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

var self;

export default class ProfilePage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        loading:false,
        name:'',
        email:'',
        phone:''
     
    };
    self = this
  }

    componentDidMount = async()=>{

        this.setState({loading:true})
        var userId =await AsyncStorage.getItem('@uid')
        
        firebase.database().ref(`/staff/`+userId).once("value", snap=>{
                self.setState({name:snap.val().fullName}) 
                self.setState({email:snap.val().email}) 
                self.setState({phone:snap.val().phone}) 
                self.setState({loading:false})
        }) 
    }

  render() {
    const { name,email,phone,loading } = this.state
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
             <ScrollView>
                <Content style={{ marginTop:160,marginBottom:20}}>
                    <View style={{alignItems:"flex-end",}}> 
                        <View style={{width:200,height:30,backgroundColor:"#7d5659",alignItems:'flex-end',justifyContent:"center",paddingRight:10,opacity:0.7}}>
                            <Text style={{color:"white",opacity:1,fontFamily:"dbfut_b0"}}>{strings('profile.title')}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:30}}>
                        <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <Image
                                resizeMode={'contain'}
                                style={{width:60,height:60}}
                                source={require('../Resources/avatar.png')}
                                
                            /> 
                            <View style={{flexDirection:"column",justifyContent:"center",alignItems:'center'}}>
                                <Text 
                                     style={{color:"white",fontFamily:"dbfut_b0",fontSize:24}}
                                 >{strings('profile.Personalinformation')}</Text>
                                 <Image
                                    resizeMode={'contain'}
                                    style={{width:screenWidth/1.5,height:40,}}
                                    source={require('../Resources/particle2.png')}
                                />
                            </View>
                        </View>
                        <View style={{width:screenWidth/1.2}}>
                            <View style={styles.searchSection}>
                                <Text style={{color:"white"}}>
                                    {name}
                                </Text>
                            </View>
                            <View style={styles.searchSection}>
                                <Text style={{color:"white"}}>
                                    {email}
                                </Text>
                            </View>
                            <View style={styles.searchSection}>
                                <Text style={{color:"white"}}>
                                    {phone}
                                </Text>
                            </View>
                        </View>
                       
                    </View>
                        
                    
                </Content>
                
               </ScrollView>
               <View  style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center", position:'absolute', bottom:30, right:30}} >
                        <Text
                            style={{width:screenWidth/1.5,height:20}}
                        ></Text>
                        <TouchableHighlight onPress={()=>{this.props.navigation.navigate('ServiceActive')}}>
                            <Image
                                resizeMode={'contain'}
                                style={{width:40,height:40,}}
                                source={require('../Resources/iconhome.png')}
                                
                            />   
                        </TouchableHighlight>
                       
                       
                    </View> 
               
            </ImageBackground>
           
        </Container>
    );
  }
}

const styles={
    searchSection: {
        flex: 1,
        marginTop:15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7a7a79',
        height:35,
        width:screenWidth/1.2,
        
        
    },
    searchIcon: {
        paddingRight:10,
        paddingLeft:10,
        color:"#3a4145",
        
    },
    input: {
        flex: 1,
        paddingRight: 10,
        paddingLeft: 10,
        // backgroundColor: '#7a7a79',
        color: 'white',
    },
}