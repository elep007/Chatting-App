import React from "react";
import { View,Image,ImageBackground,Dimensions,TouchableHighlight,ScrollView,TouchableOpacity } from "react-native";

import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, ListItem, Thumbnail, List ,Spinner} from "native-base";
import { strings } from '../i18n';
import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'react-native-firebase'
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const GOOGLE_MAPS_APIKEY = "AIzaSyAvn6N_9AZXiYeZTAYgsRnGHPvYW5g9ar0"

export default class ShoppingPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        userId:'',
        serviceinfos:[],
        phoneAuth:false,
        address:''
    };
  }

componentDidMount = async()=>{
    let data = this.props.navigation.getParam("data")
    console.log(data)
    this.setState({serviceinfos:[data]})
    this.fetchAddress(data.lat, data.long) 
    
    
}
fetchAddress = async (lat, lon) => {
    await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_APIKEY}`
    )
      .then(res => res.json())
      .then(json => {                             
               console.log(json.results[0].formatted_address)
               this.setState({address:json.results[0].formatted_address})       
            })
            .catch(error=>{
         
            })
}



  render() {
   const { serviceinfos,phoneAuth } = this.state
     return (
        <Container>
            <ImageBackground
                resizeMode={'stretch'}
                style={{height:screenHeight}}
                source={require('../Resources/bg.jpg')}
            >
            <ScrollView> 
                <Content style={{ marginTop:160,marginBottom:20}}>
                    <View style={{alignItems:"flex-end"}}> 
                        <View style={{width:200,height:30,backgroundColor:"#7d5659",alignItems:'flex-end',justifyContent:"center",paddingRight:10,opacity:0.7}}>
                            <Text style={{color:"white",opacity:1,fontFamily:"dbfut_b0"}}>{strings('detail.title')}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:30}}>
                        <View>
                            <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:22}}>{strings('detail.Servicedetails')}</Text>
                        </View>
                        <Image
                            resizeMode={'contain'}
                            style={{width:screenWidth,height:13,marginTop:5}}
                            source={require('../Resources/particle.png')}
                        />
                        {serviceinfos.map((item)=>(
                            <View >
                                <View style={{width:screenWidth/1.4,marginTop:30,justifyContent:"center",backgroundColor:"#d7b3b3",borderColor:"#bd8080",borderWidth:12}}>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{strings('detail.Date')}: </Text>
                                        <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{item.date}</Text>
                                    </View>    
                                    <View>
                                        <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{strings('detail.Services')}: </Text>
                                        <Text style={{textAlign:"center",color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{item.services}</Text>
                                    </View> 
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{strings('detail.Value')}: </Text>
                                        <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{item.value}</Text>
                                    </View>    
                                    <View>
                                        <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{strings('detail.Direction')}: </Text>
                                        <Text style={{textAlign:"center",color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{this.state.address}</Text>
                                    </View>   
                                    {/* <View>
                                        <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{strings('detail.Specialist')}: </Text>
                                        <Text style={{textAlign:"center",color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{this.state.address}</Text>
                                    </View>                                */}
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{strings('detail.Assessment')}: </Text>
                                        <Text style={{textAlign:"center",color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{item.rate}</Text>
                                    </View>  
                                </View>
                            </View>
                         ))}
                        
                    </View>
                </Content>

               
               
            </ScrollView>   
            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center", position:'absolute', bottom:30, right:30}} >
                        <TouchableHighlight onPress={()=>{this.props.navigation.pop()}}>
                            <Image
                                resizeMode={'contain'}
                                style={{width:40,height:40, marginRight:screenWidth/1.7}}
                                source={require('../Resources/iconback.png')}
                                
                            />   
                        </TouchableHighlight>
                        <TouchableHighlight onPress={()=>{this.props.navigation.navigate('ServiceActive')}} >
                            <Image
                                resizeMode={'contain'}
                                style={{width:40,height:40, marginRight:20}}
                                source={require('../Resources/iconhome.png')}
                                
                            />
                        </TouchableHighlight>   
                         {/* <View 
                            style={{width:160,height:40,backgroundColor:"#808000",justifyContent:"center",alignItems:"center",opacity:0.7}}
                            onStartShouldSetResponder={()=>{this.props.navigation.push('Program')}}
                         >
                            <Text 
                                style={{color:"white",fontFamily:"dbfut_b0"}}
                                // onPress={()=>{this.props.navigation.push('Program')}}
                            >{strings('serviceDetail.Continue')}</Text>
                        </View> */}
                    </View> 
            </ImageBackground>
           
        </Container>
    );
  }
}

