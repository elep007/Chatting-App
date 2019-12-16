import React from "react";
import { View,Image,ImageBackground,Dimensions,TouchableHighlight,ScrollView,TouchableOpacity } from "react-native";

import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, ListItem, Thumbnail, List ,Spinner} from "native-base";
import { strings } from '../i18n';
import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'react-native-firebase'
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class ShoppingPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        userId:'',
        serviceinfos:[],
        phoneAuth:false
    };
  }

componentDidMount = async()=>{

    let uid = await AsyncStorage.getItem("@uid")
    this.getServices(uid, value=>{
        this.setState({serviceinfos:value})
        console.log(value)
    })
    
}

getServices = (uid, callback) => {
    let temp = []
    firebase.database().ref(`/order/`).once("value", snap=>{
        Object.keys(snap.val()).map(data=>{
            if(snap.val()[data].staff.id===uid){
                let servicesName = ''
                Object.keys(snap.val()[data].service).map(index=>{
                    // console.log(snap.val()[data].service[index])
                    servicesName = servicesName + snap.val()[data].service[index].name + ', '
                })
                console.log(servicesName)
                temp.push({
                    id:snap.val()[data].user.userId,
                    services: servicesName,
                    value:snap.val()[data].TotalPrice,
                    date:snap.val()[data].date,
                    lat:snap.val()[data].user.lat,
                    long:snap.val()[data].user.long,
                    rate:snap.val()[data].feedback.rating
                })
            }
        })
        callback(temp)
    })
}

showServices = (id) => {
    
    this.getDetail(id, value=>{
        this.setState({serviceinfos:value})
        console.log("===================",this.state.serviceinfos)
    })
}

getDetail = (id, callback) => {

    let serviceinfos = []
    firebase.database().ref('/order/'+id+"/service/").once("value", snap=>{
        Object.keys(snap.val()).map(index=>{
            console.log(snap.val()[index])
            serviceinfos.push({
                name:snap.val()[index].name,
                price:snap.val()[index].price,
    
            })
            
        })
        callback(serviceinfos)
    })
}
    goDetail = (data) => {
        console.log(data)
        this.props.navigation.navigate("OrderDetail", {
            data:data
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
                            <Text style={{color:"white",opacity:1,fontFamily:"dbfut_b0"}}>{strings('history.title')}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:30}}>
                        <View>
                            <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:22}}>{strings('history.Servicehistory')}</Text>
                        </View>
                        <Image
                            resizeMode={'contain'}
                            style={{width:screenWidth,height:13,marginTop:5}}
                            source={require('../Resources/particle.png')}
                        />
                        {serviceinfos.map((item)=>(
                            <TouchableOpacity onPress = {()=>this.goDetail(item)}>
                                <View style={{width:screenWidth/1.4,marginTop:30,justifyContent:"center",backgroundColor:"#d7b3b3",borderColor:"#bd8080",borderWidth:12, padding:10}}>
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
                                </View>
                            </TouchableOpacity>
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

