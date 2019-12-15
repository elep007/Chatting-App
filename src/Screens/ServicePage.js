import React from "react";
import { View,Image,ImageBackground,Dimensions,TouchableOpacity,ScrollView,TouchableHighlight } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import { Container, Content,Text,Spinner} from "native-base";
import { strings } from '../i18n';
import CalendarPicker from 'react-native-calendar-picker';
import { toastr } from '../component/toastComponent'
import SwitchToggle from "react-native-switch-toggle";
import firebase from "react-native-firebase";
// import { GoogleSignin } from 'react-native-google-signin';
// import firebase from 'react-native-firebase'

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
let that;
export default class ServicePage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        position:'',
       date:'',
       weekday:'',
       orders:[] 
    };
    that = this
  }

    async componentDidMount(){
        let uid = await AsyncStorage.getItem("@uid")
        let date =this.props.navigation.getParam("date");
        let position =this.props.navigation.getParam("position");
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var weekday = days[ new Date(date).getDay() ];
        let day=new Date(date).getDate() + "-"+ parseInt(new Date(date).getMonth()+1) +"-"+new Date(date).getFullYear();
        let searchday=new Date(date).getFullYear()+"-"+ parseInt(new Date(date).getMonth()+1) +"-"+new Date(date).getDate();
        console.log(position)
        console.log(weekday)
        this.setState({date:day, weekday:weekday, position:position})       
        this.getOrders(uid,searchday, value=>{
            this.setState({orders:value})
        }) 
    }

    getOrders = (uid,day, callback) => {
        console.log(day)
        let temp = []
        firebase.database().ref(`/order/`).once("value", snap=>{
            if(snap.exists()){
                Object.keys(snap.val()).map(data=>{
                    if(snap.val()[data].staff.id===uid && snap.val()[data].Payment==="true" && snap.val()[data].date === day){
                        console.log(snap.val()[data])
                        temp.push(snap.val()[data])
                    }
                })
                callback(temp)
            }
            
        })
    }

    onDateChange(date, type) {
        if (type === 'END_DATE') {
            that.setState({
            selectedEndDate: date,
            });
        } else {
            console.log(date)
            that.setState({selectedStartDate: date})            
        }
    }

    goInfo = (data) => {
        this.props.navigation.navigate("Information",{
            "position":this.state.position,
            "data":data
        })
        // console.log(data)
    }

  render() {
   
   const{loading} = this.state
   const weekday = "time."+this.state.weekday
    return (
        <Container>
             {/* <ScrollView> */}
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
                <Content style={{marginTop:100,}}>
                    <View style={{alignItems:"flex-end"}}> 
                        <View style={{width:200,height:30,backgroundColor:"#7d5659",alignItems:'flex-end',justifyContent:"center",paddingRight:15,opacity:0.9,marginBottom:30}}>
                            <Text style={{color:"white",opacity:1,fontFamily:"dbfut_b0"}}>{strings('users.title')}</Text>
                        </View>
                    </View>
                    <View style={{justifyContent:"center",alignItems:"center", marginTop:15}}>
                        <View style={{height:screenHeight/1.5, width:screenWidth/1.2,  backgroundColor:'white', paddingHorizontal:20}}>
                            <View style={{height:screenHeight/10}}>
                                <View style={{flex:1.3, justifyContent:'center'}}>
                                    <Text style={{color:"black",opacity:1,fontFamily:"dbfut_b0"}}>{this.state.date}</Text>
                                </View>
                                <View style={{flex:1, borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                    <Text style={{color:"black",opacity:1,fontFamily:"dbfut_r0", fontSize:12}}>{strings(weekday)}</Text>
                                </View>
                                
                            </View>
                            <View style={{height:screenHeight/2}}>
                                <ScrollView>
                                    <View style={{height:screenHeight/20, borderBottomWidth:5, borderBottomColor:"#d9d9d9", justifyContent:'center'}}>
                                        <Text style={{color:'#d9d9d9'}}>{strings('time.morning')}</Text>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>1 a.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="1"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>2 a.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="2"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>3 a.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="3"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>4 a.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="4"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>5 a.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="5"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>6 a.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="6"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>7 a.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="7"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>8 a.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="8"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>9 a.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="9"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>10 a.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="10"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>11 a.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="11"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20, borderBottomWidth:5, borderBottomColor:"#d9d9d9", justifyContent:'center'}}>
                                        <Text style={{color:'#d9d9d9'}}>{strings('time.afternoon')}</Text>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>12 p.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="12"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>13 p.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="13"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>14 p.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="14"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>15 p.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="15"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>16 p.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="16"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>17 p.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="17"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>18 p.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="18"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>19 p.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            console.log(data.time.split(":")[0])
                                            
                                            if (data.time.split(":")[0]==="19"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>20 p.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            
                                            if (data.time.split(":")[0]==="20"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>21 p.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            
                                            if (data.time.split(":")[0]==="21"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>22 p.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            
                                            if (data.time.split(":")[0]==="22"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    <View style={{height:screenHeight/20,flexDirection:'row'}}>
                                        <View style={{flex:1}}>
                                            <Text style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>23 p.m.</Text>
                                        </View>
                                        <View style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9"}}>
                                        {this.state.orders.map((data, index)=>{
                                            
                                            if (data.time.split(":")[0]==="23"){
                                                return(                                             
                                                <TouchableOpacity style={{flex:8,  borderBottomWidth:0.5, borderBottomColor:"#d9d9d9", justifyContent:'center' }} key={index} onPress = {()=>this.goInfo(data)}>
                                                        
                                                    <Text  style={{fontSize:12, color:'#d9d9d9', position:'absolute', bottom:0}}>{data.user.username}/{strings("detail.Services")}</Text>
                                                        
                                                </TouchableOpacity>                                                    
                                                )
                                            }
                                        })}
                                        </View>
                                    </View>
                                    
                                </ScrollView>
                            </View>
                        </View>
                        
                    </View>        
                </Content>
                
                {/* <Image
                        resizeMode={'stretch'}
                        style={{position:"absolute",bottom:40,marginLeft:20,height:40,width:40}}
                        source={require('../Resources/iconhome.png')}
                    />    */}
                    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center", position:'absolute', bottom:30, left:30}} >
                             
                             <TouchableHighlight 
                             onPress={()=>{this.props.navigation.goBack()}}
                             >
                                 <Image
                                     resizeMode={'contain'}
                                     style={{width:40,height:40, marginRight:100}}
                                     source={require('../Resources/iconback.png')}
                                     
                                 /> 
                             </TouchableHighlight>
                             <TouchableHighlight 
                            //  onPress={this.handleProfile}
                             >
                                 <Image
                                     resizeMode={'contain'}
                                     style={{width:40,height:40}}
                                     source={require('../Resources/iconhome.png')}
                                     
                                 />   
                             </TouchableHighlight>  
                         </View>  
            </ImageBackground>
            {/* </ScrollView> */}
           
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
        color:"white"
        
    },
    input: {
        flex: 1,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#7a7a79',
        color: 'white',
        fontFamily:"dbfut_r0"
        
    },
}